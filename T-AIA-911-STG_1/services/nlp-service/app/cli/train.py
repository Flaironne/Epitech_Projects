# train.py
from pathlib import Path
import joblib
import pandas as pd
import sklearn_crfsuite

from app.cli.split_chargeur import load_splits
from app.services.classifieur import build_is_valid_classifier
from app.services.label_generator import (
    bio_tags_from_spans,
    sent_features,
    tokenize_with_spans,
    normalize
)
from app.services.evaluateur import eval_is_valid, eval_exact_match_crf

BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR / "models"
DATA_DIR = BASE_DIR / "data"
SPLITS_DIR = DATA_DIR / "splits"

def train_is_valid(train_df: pd.DataFrame, test_df: pd.DataFrame):
    model = build_is_valid_classifier()
    model.fit(train_df["text"], train_df["is_valid"])

    pred = model.predict(test_df["text"])
    print("=== Classification is_valid (test) ===")
    print(eval_is_valid(test_df["is_valid"], pred))
    return model


def train_crf_ner(train_df: pd.DataFrame, test_df: pd.DataFrame):
    # On entraîne le NER uniquement sur valides (spans présents)
    train_valid = train_df[train_df["is_valid"] == 1].reset_index(drop=True)
    test_valid = test_df[test_df["is_valid"] == 1].reset_index(drop=True)

    X_train, y_train = [], []

    for _, r in train_valid.iterrows():
        tokens, tags = bio_tags_from_spans(
            text=r["text"],
            is_valid=r["is_valid"],
            dep_start=int(r["departure_span_start"]),
            dep_end=int(r["departure_span_end"]),
            arr_start=int(r["arrival_span_start"]),
            arr_end=int(r["arrival_span_end"]),
        )
        X_train.append(sent_features(tokens))
        y_train.append(tags)

    print(f"NER train: {len(X_train)} phrases utilisées, 0 ignorée (spans garantis).")

    crf = sklearn_crfsuite.CRF(
        algorithm="lbfgs",
        c1=0.1,
        c2=0.1,
        max_iterations=120,
        all_possible_transitions=True
    )
    crf.fit(X_train, y_train)

    print("=== Extraction DEP/ARR (test valid) ===")
    scores = eval_exact_match_crf(
        rows=test_valid,
        crf=crf,
        tokenize_fn=lambda t: tokenize_with_spans(t)[0],
        features_fn=lambda toks: sent_features(toks),
        normalize_fn=normalize
    )
    print(scores)

    return crf


def main():
    MODELS_DIR.mkdir(parents=True, exist_ok=True)

    splits = load_splits(SPLITS_DIR)
    train_df, test_df = splits.train, splits.test

    # 1) classifier
    is_valid_model = train_is_valid(train_df, test_df)
    joblib.dump(is_valid_model, MODELS_DIR / "is_valid_clf.joblib")

    # 2) CRF NER avec spans
    crf_model = train_crf_ner(train_df, test_df)
    joblib.dump(crf_model, MODELS_DIR / "ner_crf.joblib")

    print("✅ Modèles sauvegardés dans ./models/")


if __name__ == "__main__":
    main()
