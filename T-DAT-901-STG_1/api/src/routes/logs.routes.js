import express from "express";
import { pool } from "../config/db.js";
import { insertLogs } from "../services/logs.service.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const data = await pool.query("SELECT * FROM logs");
  res.json(data.rows);
});

router.post("/", express.json(), async (req, res) => {
  await insertLogs(req.body);
  res.sendStatus(201);
});

export const logsRouter = router;
