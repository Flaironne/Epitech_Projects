import express from "express";
import { pool } from "../config/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const data = await pool.query("SELECT * FROM crypto WHERE asset_type = 'crypto' ORDER BY ts_snapshot_utc DESC");
  res.json(data.rows);
});

router.get("/range/:start/:end", async (req, res) => {
  const { start, end } = req.params;

  const params = [start.replace("_", " "), end.replace("_", " ")];

  const query = `
    SELECT * FROM crypto
    WHERE ts_snapshot_utc BETWEEN $1::timestamptz AND $2::timestamptz
    ORDER BY ts_snapshot_utc ASC
  `;

  const data = await pool.query(query, params);
  res.json(data.rows);
});

export const cryptocurrenciesRouter = router;
