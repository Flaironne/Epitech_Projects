# cleaner/cleaning.py
"""
Logique Pandas pure : conversion payload -> DataFrame, normalisation des colonnes.
Aucune dépendance Kafka pour permettre des tests unitaires simples.
"""
from __future__ import annotations

import re
from datetime import datetime, timezone
from typing import Any, Tuple, Dict, List

import numpy as np
import pandas as pd

# ---------- Regex / Constantes ----------
PAT_MONEY = r"""
    ^\s*
    (?P<sign>-?)\s*\$?\s*
    (?P<num>(?:\d{1,3}(?:,\d{3})*|\d+)(?:\.\d+)?)
    (?:\s*(?P<unit>[KMBkmb]))?
    \s*$
"""
_re_money = re.compile(PAT_MONEY, re.VERBOSE)
_UNIT_MULT = {"K": 1e3, "M": 1e6, "B": 1e9}


def _parse_timestamp_scalar(ts: Any) -> pd.Timestamp:
    """Parse un timestamp arbitraire en UTC (pd.Timestamp)."""
    if isinstance(ts, datetime):
        dt = ts
    else:
        try:
            dt = datetime.fromisoformat(str(ts))
        except Exception:
            dt = datetime.utcnow()
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return pd.Timestamp(dt).tz_convert("UTC")


def parse_money_series(s: pd.Series) -> pd.Series:
    """'$ 25.3 B' -> 25300000000.0 ; gère aussi valeurs simples '1234.5'."""
    if s is None:
        return pd.Series([], dtype="float64")
    ss = s.astype(str)

    ext = ss.str.extract(_re_money, expand=True)
    matched = ~ext["num"].isna()

    num = pd.to_numeric(ext["num"].str.replace(",", "", regex=False), errors="coerce")
    sign = np.where(ext["sign"] == "-", -1.0, 1.0)
    unit = ext["unit"].str.upper().map(_UNIT_MULT).fillna(1.0)
    value = sign * num * unit

    # fallback simple si non-match : strip $, , et parse float
    fallback = pd.to_numeric(
        ss.str.replace("$", "", regex=False)
          .str.replace(",", "", regex=False)
          .str.strip(),
        errors="coerce"
    )

    out = pd.Series(np.nan, index=ss.index, dtype="float64")
    out[matched] = value[matched]
    out[~matched] = fallback[~matched]
    return out.fillna(0.0)


def parse_percent_series(s: pd.Series) -> pd.Series:
    """'1.51%' -> 1.51 ; '-0.02%' -> -0.02"""
    if s is None:
        return pd.Series([], dtype="float64")
    ss = s.astype(str).str.replace("%", "", regex=False).str.strip()
    return pd.to_numeric(ss, errors="coerce").fillna(0.0)


def split_name_symbol_series(s: pd.Series) -> Tuple[pd.Series, pd.Series]:
    """
    'Bitcoin\\nBTC' -> ('Bitcoin','BTC')
    'Ethereum ETH'  -> ('Ethereum','ETH')
    sinon -> (texte, '')
    """
    if s is None:
        return pd.Series([], dtype="string"), pd.Series([], dtype="string")

    ss = s.astype(str)

    has_nl = ss.str.contains("\n")
    name_nl = ss.where(~has_nl, ss.str.split("\n").str[0]).str.strip()
    symb_nl = ss.where(~has_nl, ss.str.split("\n").str[1]).str.strip().str.upper()

    rx_tail = re.compile(r"^(?P<name>.*\S)\s+(?P<symb>[A-Za-z]{2,10})\s*$")
    fb_ext = ss[~has_nl].str.extract(rx_tail)
    fb_name = fb_ext["name"].fillna(ss[~has_nl]).astype(str).str.strip()
    fb_symb = fb_ext["symb"].fillna("").astype(str).str.upper()

    name = name_nl.copy()
    symbol = symb_nl.copy()
    name.loc[~has_nl] = fb_name
    symbol.loc[~has_nl] = fb_symb

    return name.fillna(""), symbol.fillna("")


def parse_timestamp_series(s: pd.Series) -> pd.Series:
    """to_datetime(utc=True) + fallback now(UTC) pour NaT."""
    ts = pd.to_datetime(s, utc=True, errors="coerce")
    now_utc = pd.Timestamp.now(tz="UTC")
    return ts.fillna(now_utc)


def normalize_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """
    Transforme un DataFrame brut en DataFrame propre (colonnes typées).
    Colonnes en sortie :
      ts_snapshot_utc (datetime UTC), rank (int), asset_type (crypto/nft),
      name, symbol, price_usd, market_cap_usd,
      volume_24h_usd, top_tier_volume_usd, pct_change_24h
    """

    # s'assurer que les colonnes existent
    for col in ["place", "name", "price", "market_cap",
                "volume", "top_tier_volume", "percentage_change", "timestamp", "kind", "thumb"]:
        if col not in df.columns:
            if col == "kind":
                df[col] = "crypto"
            else:
                df[col] = None

    # split name/symbol
    name, symbol = split_name_symbol_series(df["name"])

    out = pd.DataFrame({
        "ts_snapshot_utc": parse_timestamp_series(df["timestamp"]),
        "rank": pd.to_numeric(df["place"], errors="coerce").fillna(0).astype(int),
        "asset_type": df["kind"].fillna("crypto").astype(str),
        "name": name,
        "symbol": symbol,
        "thumb_url": df["thumb"].astype("string"),  # 👈 nouveau champ
        "price_usd": parse_money_series(df["price"]),
        "market_cap_usd": parse_money_series(df["market_cap"]),
        "volume_24h_usd": parse_money_series(df["volume"]),
        "top_tier_volume_usd": parse_money_series(df["top_tier_volume"]),
        "pct_change_24h": parse_percent_series(df["percentage_change"]),
    })

    # --- filtrer les lignes "placeholder" (name = "-" + prix & market cap vides/0) ---
    mask_placeholder = (
        out["name"].fillna("").str.strip().eq("-")
        & (out["price_usd"] == 0.0)
        & (out["market_cap_usd"] == 0.0)
    )
    out = out[~mask_placeholder]

    return out.sort_values(by=["asset_type", "rank", "symbol"]).reset_index(drop=True)



def payload_to_dataframe(payload: Any) -> pd.DataFrame:
    """
    Transforme un message brut en DataFrame.
    Supporte :
      - ancien format : {"timestamp": "...", "data": [ {...}, ... ]}
      - nouveau format : {"timestamp": "...", "crypto": [...], "nft": [...]}
      - éventuel message ligne unique (fallback)
    """

    if not isinstance(payload, dict):
        return pd.DataFrame()

    ts = payload.get("timestamp")

    # --- Cas 1 : ancien format 'data' (tests existants) ---
    if "data" in payload and isinstance(payload["data"], list):
        rows: List[Dict[str, Any]] = []
        for row in payload["data"]:
            if isinstance(row, dict):
                r = dict(row)
                r["timestamp"] = ts
                r["kind"] = "crypto"  # par défaut
                rows.append(r)
        return pd.DataFrame(rows)

    rows: List[Dict[str, Any]] = []

    # --- Cas 2 : nouveau format avec crypto / nft ---
    has_crypto = isinstance(payload.get("crypto"), list)
    has_nft = isinstance(payload.get("nft"), list)

    if has_crypto or has_nft:
        # crypto "classiques"
        for row in payload.get("crypto", []):
            if not isinstance(row, dict):
                continue
            r = dict(row)
            r["timestamp"] = ts
            r["kind"] = "crypto"
            rows.append(r)

        # NFT / tokens liés à des collections
        for row in payload.get("nft", []):
            if not isinstance(row, dict):
                continue
            r = dict(row)
            r["timestamp"] = ts
            r["kind"] = "nft"

            # normalisation des clés pour la suite du pipeline
            if "full-volume" in r and "volume" not in r:
                r["volume"] = r.get("full-volume")
            if "change" in r and "percentage_change" not in r:
                r["percentage_change"] = r.get("change")
            if "top_tier_volume" not in r:
                r["top_tier_volume"] = None

            rows.append(r)

        return pd.DataFrame(rows)

    # --- Cas 3 : fallback "ligne unique" (compat) ---
    if "timestamp" in payload and any(k in payload for k in ("place", "name", "price")):
        r = dict(payload)
        if "kind" not in r:
            r["kind"] = "crypto"
        return pd.DataFrame([r])

    return pd.DataFrame()
