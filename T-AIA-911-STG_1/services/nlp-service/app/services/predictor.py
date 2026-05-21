from __future__ import annotations

from pathlib import Path
import joblib
from codecarbon import EmissionsTracker

from app.services.label_generator import tokenize_with_spans, sent_features, normalize
from app.services.communes_index import CommunesIndex
from app.services.metrics_service import collect_metrics

BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR / "models"
DATA_DIR = BASE_DIR / "data"

COMMUNES_CSV = DATA_DIR / "communes_unique.csv"

IS_VALID_MODEL_PATH = MODELS_DIR / "is_valid_clf.joblib"
NER_MODEL_PATH = MODELS_DIR / "ner_crf.joblib"

TRAIN_KEYWORDS = {
    "train", "tgv", "ter", "sncf", "billet", "trajet", "gare", "correspondance",
    "depart", "départ", "partir", "aller", "rejoindre", "vers", "depuis", "de", "pour"
}


def load_models():
    clf = joblib.load(IS_VALID_MODEL_PATH)
    crf = joblib.load(NER_MODEL_PATH)
    return clf, crf


def has_intent(text: str) -> bool:
    t = normalize(text)
    return any(k in t.split() for k in TRAIN_KEYWORDS) or any(k in t for k in ["de ", "depuis ", " vers ", " à ", " a "])


def entity_confidence(tokens, tags, marginals, label: str):
    """
    Reconstruit l’entité la plus longue pour DEP/ARR (BIO) et calcule une confiance
    moyenne sur les proba marginals des tags choisis.
    """
    entities = []
    cur_tokens = []
    cur_idxs = []
    in_ent = False

    for i, (tok, tag) in enumerate(zip(tokens, tags)):
        if tag == f"B-{label}":
            if cur_tokens:
                entities.append((cur_tokens, cur_idxs))
            cur_tokens = [tok]
            cur_idxs = [i]
            in_ent = True
        elif tag == f"I-{label}" and in_ent:
            cur_tokens.append(tok)
            cur_idxs.append(i)
        else:
            if cur_tokens:
                entities.append((cur_tokens, cur_idxs))
            cur_tokens = []
            cur_idxs = []
            in_ent = False

    if cur_tokens:
        entities.append((cur_tokens, cur_idxs))

    if not entities:
        return "", 0.0

    best_tokens, best_idxs = sorted(entities, key=lambda x: len(x[0]), reverse=True)[0]
    text_entity = " ".join(best_tokens)

    probs = []
    for idx in best_idxs:
        chosen_tag = tags[idx]
        probs.append(marginals[idx].get(chosen_tag, 0.0))

    conf = sum(probs) / len(probs) if probs else 0.0
    return text_entity, float(conf)


class Predictor:
    """
    Charge les modèles + index de communes une seule fois au démarrage.
    """

    def __init__(self):
        self.clf, self.crf = load_models()
        self.communes_index = CommunesIndex(COMMUNES_CSV)

    def predict(self, text: str, measure_emissions: bool = False) -> dict:
        tracker = None
        if measure_emissions:
            tracker = EmissionsTracker(
                measure_power_secs=0.01,
                save_to_file=False,
                log_level="ERROR"
            )
            tracker.start()

        text = text or ""
        text = text.strip()

        # --- 1) proba de validité (classifieur)
        proba_valid = float(self.clf.predict_proba([text])[0][1])
        clf_valid = proba_valid >= 0.5

        # --- 2) détection communes (fallback + garde-fou)
        communes = self.communes_index.find_in_text(text)
        has_two_places = len(communes) >= 2
        intent = has_intent(text)

        # On valide si :
        # - le classifieur dit OK
        # - OU on a 2 communes ET une intention de trajet
        is_valid = clf_valid or (has_two_places and intent)

        result = {
            "text": text,
            "is_valid": is_valid,
            "departure": "",
            "arrival": "",
            "confidence": 0.0,
            "confidence_details": {
                "valid_proba": round(proba_valid, 3),
                "dep_conf": 0.0,
                "arr_conf": 0.0,
                "used_fallback": False,
                "used_communes": has_two_places,
                "intent_detected": intent,
            }
        }

        if not is_valid:
            result["confidence"] = round(proba_valid, 3)
            return result

        # --- 3) CRF NER
        tokens, _ = tokenize_with_spans(text)
        X = [sent_features(tokens)]
        tags = self.crf.predict(X)[0]
        marginals = self.crf.predict_marginals_single(X[0])

        dep, dep_conf = entity_confidence(tokens, tags, marginals, "DEP")
        arr, arr_conf = entity_confidence(tokens, tags, marginals, "ARR")

        used_fallback = False

        # --- 4) fallback communes si CRF rate
        if dep == "" or arr == "":
            if has_two_places and intent:
                if dep == "":
                    dep = communes[0].label
                    dep_conf = max(dep_conf, 0.65)
                if arr == "":
                    arr = communes[1].label
                    arr_conf = max(arr_conf, 0.65)
                used_fallback = True

        result["departure"] = dep
        result["arrival"] = arr
        result["confidence_details"]["dep_conf"] = round(dep_conf, 3)
        result["confidence_details"]["arr_conf"] = round(arr_conf, 3)
        result["confidence_details"]["used_fallback"] = used_fallback

        # --- 5) si on n’a pas les 2 => invalide
        if dep == "" or arr == "":
            result["is_valid"] = False
            result["confidence"] = round(min(proba_valid, 0.4), 3)
            return result

        # --- 6) confiance globale (pondération simple)
        ner_conf = (dep_conf + arr_conf) / 2.0
        result["confidence"] = round(float(0.5 * proba_valid + 0.5 * ner_conf), 3)

        metrics = {}
        if measure_emissions and tracker is not None:
            tracker.stop()
            metrics = collect_metrics(tracker)

        return {**result, "metrics": metrics}
