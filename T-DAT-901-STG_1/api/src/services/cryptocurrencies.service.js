import { pool } from "../config/db.js";

export async function insertIntoDB(data) {
  const query = `
    INSERT INTO crypto (
      ts_snapshot_utc,
      rank,
      asset_type,
      name,
      symbol,
      thumb_url,
      price_usd,
      market_cap_usd,
      volume_24h_usd,
      top_tier_volume_usd,
      pct_change_24h
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
  `;

  console.log("Inserting data into DB:", data);

  const params = [
    data.ts_snapshot_utc,
    data.rank,
    data.asset_type,
    data.name,
    data.symbol,
    data.thumb_url,
    data.price_usd,
    data.market_cap_usd,
    data.volume_24h_usd,
    data.top_tier_volume_usd,
    data.pct_change_24h,
  ];

  return pool.query(query, params);
}

export async function getLatestNftSnapshots() {
  const result = await pool.query(`
      WITH last_snapshot AS (
          SELECT MAX(ts_snapshot_utc) AS ts
          FROM crypto
          WHERE asset_type = 'nft'
      )
      SELECT c.*
      FROM crypto c
      JOIN last_snapshot l
        ON date_trunc('second', c.ts_snapshot_utc) = date_trunc('second', l.ts)
      WHERE c.asset_type = 'nft';
    `);

  if (result.rows.length === 0) return [];

  return result.rows;
}
