import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  host: process.env.DB_HOST || "db",
  user: process.env.DB_USER || "admin",
  password: process.env.DB_PASS || "pass",
  database: process.env.DB_NAME || "cryptoviz",
  port: 5432,
});
