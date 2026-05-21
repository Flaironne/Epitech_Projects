from __future__ import annotations

from typing import Dict, List
from sklearn.metrics import classification_report


# ---------------------------
# Classification report
# ---------------------------

def eval_is_valid(y_true, y_pred) -> str:
    return classification_report(y_true, y_pred, digits=4)


# ---------------------------
# NER helpers
# ---------------------------

def tags_to_entities(tokens: List[str], tags: List[str], label: str) -> List[str]:
    """
    Reconstruit toutes les entités d'un label (DEP/ARR) à partir des tags BIO.
    """
    entities: List[str] = []
    current: List[str] = []
    in_ent = False

    for t, tag in zip(tokens, tags):
        if tag == f"B-{label}":
            if current:
                entities.append(" ".join(current))
            current = [t]
            in_ent = True
        elif tag == f"I-{label}" and in_ent:
            current.append(t)
        else:
            if current:
                entities.append(" ".join(current))
            current = []
            in_ent = False

    if current:
        entities.append(" ".join(current))

    return entities


def pick_best_entity(entities: List[str]) -> str:
    """
    Heuristique simple : prend l'entité la plus longue.
    (utile pour gares composées)
    """
    if not entities:
        return ""
    return sorted(entities, key=lambda s: len(s), reverse=True)[0]


# ---------------------------
# NER evaluation
# ---------------------------

def eval_exact_match_crf(rows, crf, tokenize_fn, features_fn, normalize_fn) -> Dict[str, float]:
    """
    rows: DataFrame (text, departure_city, arrival_city)
    """
    total = 0
    ok_both = 0
    ok_dep = 0
    ok_arr = 0

    for _, r in rows.iterrows():
        tokens = tokenize_fn(r["text"])
        X = [features_fn(tokens)]
        pred_tags = crf.predict(X)[0]

        dep_pred = pick_best_entity(tags_to_entities(tokens, pred_tags, "DEP"))
        arr_pred = pick_best_entity(tags_to_entities(tokens, pred_tags, "ARR"))

        dep_ok = normalize_fn(dep_pred) == normalize_fn(r["departure_city"])
        arr_ok = normalize_fn(arr_pred) == normalize_fn(r["arrival_city"])

        ok_dep += int(dep_ok)
        ok_arr += int(arr_ok)
        ok_both += int(dep_ok and arr_ok)
        total += 1

    return {
        "dep_accuracy": ok_dep / total if total else 0.0,
        "arr_accuracy": ok_arr / total if total else 0.0,
        "exact_match_both": ok_both / total if total else 0.0,
        "n_samples": total
    }
