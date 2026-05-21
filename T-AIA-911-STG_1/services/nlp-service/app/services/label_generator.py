from __future__ import annotations

import re
import unicodedata
from typing import List, Tuple, Dict

TOKEN_RE = re.compile(r"\w+|[^\w\s]", re.UNICODE)


def strip_accents(s: str) -> str:
    return "".join(
        c for c in unicodedata.normalize("NFD", s)
        if unicodedata.category(c) != "Mn"
    )


def normalize(s: str) -> str:
    s = s.lower()
    s = strip_accents(s)
    s = " ".join(s.split())
    return s


def tokenize_with_spans(text: str) -> Tuple[List[str], List[Tuple[int, int]]]:
    """
    Tokenise et retourne (tokens, spans_char) où spans_char[i] = (start,end) du token dans le texte.
    """
    tokens = []
    spans = []
    for m in TOKEN_RE.finditer(str(text)):
        tokens.append(m.group(0))
        spans.append((m.start(), m.end()))
    return tokens, spans


def bio_tags_from_spans(
    text: str,
    is_valid: int,
    dep_start: int,
    dep_end: int,
    arr_start: int,
    arr_end: int,
) -> Tuple[List[str], List[str]]:
    """
    Crée des tags BIO en utilisant les spans caractère.
    """
    tokens, token_spans = tokenize_with_spans(text)
    tags = ["O"] * len(tokens)

    if int(is_valid) != 1:
        return tokens, tags

    # si spans invalides => on laisse O (mais normalement dans ce dataset c'est garanti)
    if dep_start < 0 or dep_end < 0 or arr_start < 0 or arr_end < 0:
        return tokens, tags

    def mark_entity(start, end, B, I):
        first = True
        for i, (ts, te) in enumerate(token_spans):
            # overlap token-span with entity span
            if te <= start or ts >= end:
                continue
            if first:
                tags[i] = B
                first = False
            else:
                tags[i] = I

    mark_entity(dep_start, dep_end, "B-DEP", "I-DEP")
    mark_entity(arr_start, arr_end, "B-ARR", "I-ARR")

    return tokens, tags


def token_features(tokens: List[str], i: int) -> Dict[str, object]:
    w = tokens[i]
    wn = normalize(w)

    feats: Dict[str, object] = {
        "bias": 1.0,
        "w": w,
        "w.norm": wn,
        "is_upper": w.isupper(),
        "is_title": w.istitle(),
        "is_digit": w.isdigit(),
        "has_hyphen": "-" in w,
        "prefix2": wn[:2],
        "prefix3": wn[:3],
        "suffix2": wn[-2:],
        "suffix3": wn[-3:],
    }

    if i == 0:
        feats["BOS"] = True
    else:
        prev = tokens[i - 1]
        feats.update({
            "-1:w.norm": normalize(prev),
            "-1:is_digit": prev.isdigit(),
        })

    if i == len(tokens) - 1:
        feats["EOS"] = True
    else:
        nxt = tokens[i + 1]
        feats.update({
            "+1:w.norm": normalize(nxt),
            "+1:is_digit": nxt.isdigit(),
        })

    return feats


def sent_features(tokens: List[str]) -> List[Dict[str, object]]:
    return [token_features(tokens, i) for i in range(len(tokens))]
