from __future__ import annotations

import torch
import joblib
from pathlib import Path
import torch.nn.functional as F
from codecarbon import EmissionsTracker
from transformers import CamembertTokenizerFast, CamembertForTokenClassification

from app.services.metrics_service import collect_metrics


LABELS = [
    "O",
    "B-DEPARTURE",
    "I-DEPARTURE",
    "B-ARRIVAL",
    "I-ARRIVAL",
]

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "models/camembert-ner"


def extract_entities(text, offsets, labels, probs):
    entities = {
        "DEPARTURE": {"tokens": [], "confs": []},
        "ARRIVAL": {"tokens": [], "confs": []},
    }

    for i, label in enumerate(labels):
        if label == "O":
            continue

        tag, ent_type = label.split("-")
        start, end = offsets[i].tolist()
        token_text = text[start:end]
        token_conf = probs[i].max().item()

        bucket = entities[ent_type]

        if tag == "B":
            bucket["tokens"] = [token_text]
            bucket["confs"] = [token_conf]
        elif tag == "I" and bucket["tokens"]:
            bucket["tokens"].append(token_text)
            bucket["confs"].append(token_conf)

    result = {}
    for k, v in entities.items():
        if not v["tokens"]:
            result[k] = ("", 0.0)
        else:
            text_val = "".join(v["tokens"]).strip()
            conf_val = min(v["confs"])  # conservateur
            result[k] = (text_val, conf_val)

    return result


def load_camembert_model():
    tokenizer = CamembertTokenizerFast.from_pretrained("camembert-base")
    model = CamembertForTokenClassification.from_pretrained(MODEL_PATH)
    return tokenizer, model


class Predictor:
    def __init__(self):
        self.tokenizer, self.model = load_camembert_model()
        self.model.eval()

    def predict(self, text: str, measure_emissions: bool = False) -> dict:
        tracker = None
        if measure_emissions:
            tracker = EmissionsTracker(
                measure_power_secs=0.01,
                save_to_file=False,
                log_level="ERROR"
            )
            tracker.start()

        text = (text or "").strip()

        result = {
            "text": text,
            "is_valid": False,
            "departure": "",
            "arrival": "",
            "confidence": 0.0,
            "confidence_details": {
                "dep_conf": 0.0,
                "arr_conf": 0.0,
            }
        }

        if not text:
            return result

        tokens = self.tokenizer(
            text,
            return_offsets_mapping=True,
            return_tensors="pt",
            truncation=True
        )

        offsets = tokens.pop("offset_mapping")[0]

        with torch.no_grad():
            outputs = self.model(**tokens)

        logits = outputs.logits[0]
        probs = F.softmax(logits, dim=-1)
        pred_ids = probs.argmax(dim=-1).tolist()
        labels = [LABELS[i] for i in pred_ids]

        entities = extract_entities(text, offsets, labels, probs)

        dep, dep_conf = entities["DEPARTURE"]
        arr, arr_conf = entities["ARRIVAL"]

        result["departure"] = dep
        result["arrival"] = arr
        result["confidence_details"]["dep_conf"] = round(dep_conf, 3)
        result["confidence_details"]["arr_conf"] = round(arr_conf, 3)

        if dep and arr:
            result["is_valid"] = True
            result["confidence"] = round((dep_conf + arr_conf) / 2.0, 3)

        metrics = {}
        if measure_emissions and tracker is not None:
            tracker.stop()
            metrics = collect_metrics(tracker)

        return {**result, "metrics": metrics}
