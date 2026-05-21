from transformers import CamembertTokenizerFast
from datasets import Dataset
import pandas as pd
from pathlib import Path

# Labels fixés à l'étape 2
LABELS = [
    "O",
    "B-DEPARTURE",
    "I-DEPARTURE",
    "B-ARRIVAL",
    "I-ARRIVAL",
]
label2id = {label: i for i, label in enumerate(LABELS)}

# Chemin relatif dataset
DATA_DIR = Path("../data/splits")

tokenizer = CamembertTokenizerFast.from_pretrained("camembert-base")

def tokenize_and_align(row):
    text = row["text"]
    
    # Tokenization avec offsets
    tokens = tokenizer(
        text,
        return_offsets_mapping=True,
        truncation=True
    )

    # Initialisation labels
    labels = ["O"] * len(tokens["input_ids"])

    dep_start, dep_end = row["departure_span_start"], row["departure_span_end"]
    arr_start, arr_end = row["arrival_span_start"], row["arrival_span_end"]

    for i, (start, end) in enumerate(tokens["offset_mapping"]):
        if start == end == 0:
            # token spécial ([CLS], [SEP])
            continue
        # DEPARTURE
        if start >= dep_start and end <= dep_end:
            labels[i] = "B-DEPARTURE" if start == dep_start else "I-DEPARTURE"
        # ARRIVAL
        elif start >= arr_start and end <= arr_end:
            labels[i] = "B-ARRIVAL" if start == arr_start else "I-ARRIVAL"

    # On ne garde pas offset_mapping
    tokens.pop("offset_mapping")
    tokens["labels"] = [label2id[l] for l in labels]
    return tokens

# TEST rapide sur train.csv
if __name__ == "__main__":
    df = pd.read_csv(DATA_DIR / "train.csv").head(2)
    ds = Dataset.from_pandas(df)
    ds = ds.map(tokenize_and_align, remove_columns=list(df.columns))


    # Vérification visuelle
    for ex in ds:
        tokens = tokenizer.convert_ids_to_tokens(ex["input_ids"])
        labels = [LABELS[i] for i in ex["labels"]]
        print("\nTexte original:", df.iloc[1]["text"])
        for t, l in zip(tokens, labels):
            print(f"{t:15} -> {l}")
