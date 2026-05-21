import pandas as pd
from pathlib import Path

DATA_DIR = Path("../data/splits")

REQUIRED_COLUMNS = [
    "text",
    "departure_span_start",
    "departure_span_end",
    "arrival_span_start",
    "arrival_span_end",
]

def check_split(name: str):
    path = DATA_DIR / f"{name}.csv"
    print(f"\n===== {name.upper()} =====")

    if not path.exists():
        print(f"❌ Fichier manquant : {path}")
        return

    df = pd.read_csv(path)
    print("Shape:", df.shape)

    # Colonnes
    missing = [c for c in REQUIRED_COLUMNS if c not in df.columns]
    if missing:
        print("❌ Colonnes manquantes:", missing)
    else:
        print("✅ Colonnes obligatoires OK")

    # NaN
    print("\nValeurs manquantes :")
    print(df[REQUIRED_COLUMNS].isnull().sum())

    # Exemple
    print("\nExemple de ligne :")
    print(df.iloc[0][REQUIRED_COLUMNS])
    print("\nTexte :")
    print(df.iloc[0]["text"])

def main():
    for split in ["train", "val", "test"]:
        check_split(split)

if __name__ == "__main__":
    main()
