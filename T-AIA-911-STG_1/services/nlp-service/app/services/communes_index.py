from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import pandas as pd

from app.services.label_generator import normalize, tokenize_with_spans


@dataclass(frozen=True)
class Commune:
    label: str          # forme propre (affichage)
    norm: str           # forme normalisée (clé)


class CommunesIndex:
    def __init__(self, csv_path: Path):
        self.csv_path = csv_path
        self.by_norm: dict[str, Commune] = {}
        self._load()

    def _load(self):
        df = pd.read_csv(self.csv_path)

        # On accepte plusieurs formats possibles
        # Ton script génère souvent: commune_label, commune_norm, commune_label_title
        if "commune_label_title" in df.columns:
            label_col = "commune_label_title"
        elif "commune_label" in df.columns:
            label_col = "commune_label"
        else:
            # fallback: première colonne
            label_col = df.columns[0]

        if "commune_norm" in df.columns:
            norm_col = "commune_norm"
        else:
            norm_col = None

        for _, row in df.iterrows():
            label = str(row[label_col]).strip()
            if not label:
                continue
            norm = str(row[norm_col]).strip() if norm_col else normalize(label)
            if not norm:
                continue
            self.by_norm.setdefault(norm, Commune(label=label, norm=norm))

    def find_in_text(self, text: str, max_ngram: int = 6) -> list[Commune]:
        """
        Recherche par fenêtres de tokens (1..max_ngram) sur texte normalisé.
        Retourne les communes dans l’ordre d’apparition, dédoublonnées.
        """
        tokens, _ = tokenize_with_spans(text)
        nt = [normalize(t) for t in tokens]

        found: list[tuple[int, int, Commune]] = []
        for L in range(max_ngram, 0, -1):
            for i in range(0, len(nt) - L + 1):
                window = " ".join(nt[i:i + L]).strip()
                commune = self.by_norm.get(window)
                if commune:
                    found.append((i, L, commune))

        found.sort(key=lambda x: x[0])

        uniq = []
        seen = set()
        for _, _, c in found:
            if c.norm in seen:
                continue
            seen.add(c.norm)
            uniq.append(c)
        return uniq
