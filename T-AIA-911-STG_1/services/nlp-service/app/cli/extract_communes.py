from __future__ import annotations

from pathlib import Path
import pandas as pd
import unicodedata
import re

BASE_DIR = Path(__file__).resolve().parent.parent
INPUT_PATH = BASE_DIR / "data" / "liste-des-gares.csv"
OUTPUT_CSV = BASE_DIR / "data" / "communes_unique.csv"
OUTPUT_TXT = BASE_DIR / "data" / "communes_unique.txt"

COMMUNE_COL = "COMMUNE"

def normalize(s: str) -> str:
    s = str(s).strip()
    s = s.lower()
    # enlève accents
    s = "".join(
        c for c in unicodedata.normalize("NFD", s)
        if unicodedata.category(c) != "Mn"
    )
    # unifie tirets/apostrophes et espaces
    s = s.replace("’", "'")
    s = re.sub(r"[-_/]+", " ", s)     # tirets -> espace
    s = re.sub(r"\s+", " ", s).strip()
    return s

def title_fr(s: str) -> str:
    """
    Petite mise en forme lisible (facultatif) :
    garde les traits d'union existants si tu veux, ici on fait simple.
    """
    s = str(s).strip()
    if not s:
        return s
    return " ".join(w[:1].upper() + w[1:].lower() for w in s.split())

def main():
    # auto-détection séparateur (virgule/tab) + tolérance formats
    df = pd.read_csv(INPUT_PATH, sep=None, engine="python")

    if COMMUNE_COL not in df.columns:
        raise ValueError(f"Colonne '{COMMUNE_COL}' introuvable. Colonnes: {list(df.columns)}")

    communes = (
        df[COMMUNE_COL]
        .dropna()
        .astype(str)
        .map(lambda x: x.strip())
    )
    communes = communes[communes != ""]

    # Normalisation pour dédoublonner proprement
    tmp = pd.DataFrame({"commune_raw": communes})
    tmp["commune_norm"] = tmp["commune_raw"].map(normalize)

    # On garde une forme représentative par commune_norm
    # (ici: la plus fréquente, sinon la première)
    counts = tmp.groupby(["commune_norm", "commune_raw"]).size().reset_index(name="count")
    best = counts.sort_values(["commune_norm", "count"], ascending=[True, False]) \
                 .drop_duplicates("commune_norm", keep="first")

    out = best[["commune_raw", "commune_norm"]].copy()
    out = out.rename(columns={"commune_raw": "commune_label"})

    # optionnel : une version “title case” lisible (sans garantie parfaite)
    out["commune_label_title"] = out["commune_label"].map(title_fr)

    out = out.sort_values("commune_norm").reset_index(drop=True)

    OUTPUT_CSV.parent.mkdir(parents=True, exist_ok=True)
    out.to_csv(OUTPUT_CSV, index=False, encoding="utf-8")

    # liste simple (title si tu veux)
    out["commune_label_title"].to_csv(OUTPUT_TXT, index=False, header=False, encoding="utf-8")

    print(f"✅ Communes uniques : {len(out)}")
    print(f"➡️ CSV : {OUTPUT_CSV}")
    print(f"➡️ TXT : {OUTPUT_TXT}")

if __name__ == "__main__":
    main()
