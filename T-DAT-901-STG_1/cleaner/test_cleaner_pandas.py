# cleaner/test_cleaner_pandas.py
import pandas as pd

from cleaning import payload_to_dataframe, normalize_dataframe

# ---- Payload d'exemple (snapshot multi-lignes) ----
sample_payload = {
    "timestamp": "2025-09-11 10:58:27.652094",
    "data": [
        {
            "place": "1",
            "name": "Bitcoin\nBTC",
            "price": "$ 114,087.10",
            "market_cap": "$ 2.27254 B",
            "volume": "$ 25.30 B",
            "top_tier_volume": "$ 13.66 B",
            "percentage_change": "1.51%"
        },
        {
            "place": "2",
            "name": "Ethereum ETH",
            "price": "$ 3,245.11",
            "market_cap": "$ 754.04 M",
            "volume": "$ 12.2 M",
            "top_tier_volume": "$ 7.1 M",
            "percentage_change": "-0.02%"
        }
    ]
}

# ---- Payload d'exemple (ligne unique) ----
single_row_payload = {
    "timestamp": "2025-09-11 10:59:27.652094",
    "place": "3",
    "name": "Tether\nUSDT",
    "price": "$0.9999",
    "market_cap": "104.1 B",
    "volume": "$ 48.3 B",
    "top_tier_volume": "$ 30.1 B",
    "percentage_change": "0.01%"
}


def test_payload_to_dataframe_snapshot():
    df = payload_to_dataframe(sample_payload)
    assert not df.empty
    assert df.shape[0] == 2
    assert "name" in df.columns
    assert df.loc[0, "name"] == "Bitcoin\nBTC"
    # timestamp recopié sur chaque ligne
    assert df.loc[0, "timestamp"].startswith("2025-09-11")


def test_payload_to_dataframe_single_row():
    df = payload_to_dataframe(single_row_payload)
    assert not df.empty
    assert df.shape[0] == 1
    assert df.loc[0, "name"] == "Tether\nUSDT"
    assert df.loc[0, "timestamp"].startswith("2025-09-11")


def test_normalize_dataframe_core_fields():
    df = payload_to_dataframe(sample_payload)
    clean = normalize_dataframe(df)

    expected = {
        "ts_snapshot_utc", "rank", "name", "symbol",
        "price_usd", "market_cap_usd", "volume_24h_usd",
        "top_tier_volume_usd", "pct_change_24h"
    }
    assert expected.issubset(set(clean.columns))

    # BTC
    btc = clean.loc[clean["symbol"] == "BTC"].iloc[0]
    assert btc["name"] == "Bitcoin"
    assert btc["rank"] == 1
    assert round(float(btc["price_usd"]), 2) == 114087.10
    # 2.27254 B => 2_272_540_000.00
    assert round(float(btc["market_cap_usd"]), 2) == 2272540000.00
    assert round(float(btc["pct_change_24h"]), 2) == 1.51

    # ETH
    eth = clean.loc[clean["symbol"] == "ETH"].iloc[0]
    assert eth["name"] == "Ethereum"
    assert eth["rank"] == 2
    assert round(float(eth["price_usd"]), 2) == 3245.11
    # 754.04 M => 754_040_000.00
    assert round(float(eth["market_cap_usd"]), 2) == 754040000.00
    assert round(float(eth["pct_change_24h"]), 2) == -0.02


def test_timestamp_is_utc_dtype():
    df = payload_to_dataframe(sample_payload)
    clean = normalize_dataframe(df)
    # dtype datetime64[ns, UTC]
    assert pd.api.types.is_datetime64_any_dtype(clean["ts_snapshot_utc"])
    assert str(clean["ts_snapshot_utc"].dt.tz) == "UTC"
