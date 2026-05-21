# cleaner/app.py
"""
Boucle Kafka : consomme depuis TOPIC_RAW, nettoie via cleaning.py, republie sur TOPIC_CLEAN.
"""
from __future__ import annotations

import json
import os
import sys
from typing import Any

import pandas as pd

from cleaning import payload_to_dataframe, normalize_dataframe

BOOTSTRAP   = os.getenv("KAFKA_BROKER", "kafka:9092")
TOPIC_RAW   = os.getenv("TOPIC_RAW", "crypto.raw")
TOPIC_CLEAN = os.getenv("TOPIC_CLEAN", "crypto.clean")
GROUP_ID    = os.getenv("KAFKA_GROUP_ID", "cleaner")


def main():
    # Importer Kafka ici évite de casser les TU qui importent ce module sans Kafka installé
    from confluent_kafka import Consumer, Producer, KafkaError

    c = Consumer({
        "bootstrap.servers": BOOTSTRAP,
        "group.id": GROUP_ID,
        "auto.offset.reset": "earliest",
        "enable.auto.commit": True,
    })
    p = Producer({
        "bootstrap.servers": BOOTSTRAP,
        "client.id": "cleaner",
    })

    print(f"[cleaner] 🧠 Bootstrapped")
    print(f"[cleaner] 📥 Input topic  : {TOPIC_RAW}")
    print(f"[cleaner] 📤 Output topic : {TOPIC_CLEAN}", flush=True)
    c.subscribe([TOPIC_RAW])

    try:
        while True:
            msg = c.poll(1.0)
            if msg is None:
                continue
            if msg.error():
                if msg.error().code() != KafkaError._PARTITION_EOF:
                    print(f"[cleaner] ⚠️ Kafka error: {msg.error()}", file=sys.stderr, flush=True)
                continue

            try:
                payload: Any = json.loads(msg.value().decode("utf-8"))
            except Exception as e:
                print(f"[cleaner] 🚫 Dropped message (JSON error): {e}", file=sys.stderr, flush=True)
                continue

            # --- Nettoyage via module Pandas ---
            raw_df = payload_to_dataframe(payload)
            if raw_df.empty:
                continue
            print(f"[cleaner] 🔸 Received {len(raw_df)} raw rows from '{TOPIC_RAW}'")

            clean_df = normalize_dataframe(raw_df)

            # --- Production vers le topic clean ---
            count = 0
            for rec in clean_df.to_dict(orient="records"):
                ts = rec.get("ts_snapshot_utc")
                if isinstance(ts, pd.Timestamp):
                    rec["ts_snapshot_utc"] = ts.isoformat()
                else:
                    ts_parsed = pd.to_datetime(ts, utc=True, errors="coerce")
                    if pd.isna(ts_parsed):
                        ts_parsed = pd.Timestamp.now(tz="UTC")
                    rec["ts_snapshot_utc"] = ts_parsed.isoformat()

                key = (rec.get("symbol") or "").encode("utf-8")
                p.produce(TOPIC_CLEAN, key=key, value=json.dumps(rec).encode("utf-8"))
                count += 1

            if count:
                p.poll(0)
                print(f"[cleaner] ✅ Produced {count} cleaned records to '{TOPIC_CLEAN}'", flush=True)

    except KeyboardInterrupt:
        pass
    finally:
        print("[cleaner] 🧹 Flushing pending messages...", flush=True)
        p.flush()
        c.close()


if __name__ == "__main__":
    main()
