import { pool } from "../config/db.js";

export async function insertLogs(data) {
  const query = `
    INSERT INTO logs (
      message,
      type,
      failed_at,
      created_at
    )
    VALUES ($1,$2,$3,$4)
  `;

  const params = [data.message, data.type, data.timestamp, new Date()];

  return pool.query(query, params);
}
