import pandas as pd
from datasets import Dataset
from pathlib import Path
from tokenize_align import tokenize_and_align

DATA_DIR = Path(__file__).resolve().parent.parent / "dataset"

def build(split):
    df = pd.read_csv(DATA_DIR / f"{split}.csv")
    ds = Dataset.from_pandas(df)
    return ds.map(tokenize_and_align, remove_columns=df.columns)

train_ds = build("train")
val_ds = build("val")
test_ds = build("test")
