from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import pandas as pd
from sklearn.model_selection import train_test_split

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_PATH = BASE_DIR / "data/dataset_10000_no_ignored_with_spans.csv"
SPLITS_DIR = BASE_DIR / "data/splits"
RANDOM_STATE = 42


@dataclass
class Splits:
    train: pd.DataFrame
    val: pd.DataFrame
    test: pd.DataFrame


def load_dataset(path: Path = DATA_PATH) -> pd.DataFrame:
    df = pd.read_csv(path)

    # Colonnes minimales communes
    required_common = ["text", "is_valid"]
    for col in required_common:
        if col not in df.columns:
            raise ValueError(f"Colonne manquante: {col}")

    # Ancien format ?
    old_ok = ("departure_city" in df.columns) and ("arrival_city" in df.columns)

    # Nouveau format ?
    new_ok = (
        ("departure_canonical" in df.columns) and ("arrival_canonical" in df.columns)
        and ("departure_surface" in df.columns) and ("arrival_surface" in df.columns)
        and ("departure_span_start" in df.columns) and ("departure_span_end" in df.columns)
        and ("arrival_span_start" in df.columns) and ("arrival_span_end" in df.columns)
    )

    if not (old_ok or new_ok):
        raise ValueError(
            "Format dataset non reconnu. "
            "Attendu soit (departure_city, arrival_city) soit "
            "(departure_canonical/arrival_canonical + surface + spans)."
        )

    # Normalisation types
    df["text"] = df["text"].astype(str)
    df["is_valid"] = df["is_valid"].astype(int)

    # Harmoniser vers un schéma interne unique :
    # on crée departure_city / arrival_city qui seront utilisés partout ailleurs
    if new_ok:
        df["departure_city"] = df["departure_canonical"].fillna("").astype(str)
        df["arrival_city"] = df["arrival_canonical"].fillna("").astype(str)
    else:
        df["departure_city"] = df["departure_city"].fillna("").astype(str)
        df["arrival_city"] = df["arrival_city"].fillna("").astype(str)

    return df


def make_splits(df: pd.DataFrame) -> Splits:
    train_df, temp_df = train_test_split(
        df, test_size=0.30, stratify=df["is_valid"], random_state=RANDOM_STATE
    )
    val_df, test_df = train_test_split(
        temp_df, test_size=0.50, stratify=temp_df["is_valid"], random_state=RANDOM_STATE
    )

    return Splits(
        train=train_df.reset_index(drop=True),
        val=val_df.reset_index(drop=True),
        test=test_df.reset_index(drop=True),
    )


def save_splits(splits: Splits, out_dir: Path = SPLITS_DIR) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    splits.train.to_csv(out_dir / "train.csv", index=False)
    splits.val.to_csv(out_dir / "val.csv", index=False)
    splits.test.to_csv(out_dir / "test.csv", index=False)


def load_splits(in_dir: Path = SPLITS_DIR) -> Splits:
    train = pd.read_csv(in_dir / "train.csv")
    val = pd.read_csv(in_dir / "val.csv")
    test = pd.read_csv(in_dir / "test.csv")
    return Splits(train=train, val=val, test=test)


if __name__ == "__main__":
    df = load_dataset()
    splits = make_splits(df)
    save_splits(splits)
    print("Splits générés dans data/splits/")
    print("train/val/test:", len(splits.train), len(splits.val), len(splits.test))
