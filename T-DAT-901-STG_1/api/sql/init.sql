CREATE EXTENSION IF NOT EXISTS timescaledb;

CREATE TABLE IF NOT EXISTS crypto (
    ts_snapshot_utc TIMESTAMPTZ NOT NULL,
    rank INT,
    asset_type TEXT,
    name TEXT,
    symbol TEXT,
    thumb_url TEXT,
    price_usd DOUBLE PRECISION,
    market_cap_usd DOUBLE PRECISION,
    volume_24h_usd DOUBLE PRECISION,
    top_tier_volume_usd DOUBLE PRECISION,
    pct_change_24h DOUBLE PRECISION
);

SELECT create_hypertable('crypto', 'ts_snapshot_utc', if_not_exists => TRUE);

CREATE TABLE IF NOT EXISTS logs (
    message TEXT,
    type TEXT,
    failed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

SELECT create_hypertable('logs', 'created_at', if_not_exists => TRUE);
