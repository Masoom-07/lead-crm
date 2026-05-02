const { Pool } = require("pg");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: isProduction
    ? { rejectUnauthorized: false }
    : false
});

const createTableQuery = `
  CREATE EXTENSION IF NOT EXISTS "pgcrypto";

  CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    source VARCHAR(20) NOT NULL CHECK (source IN ('call', 'whatsapp', 'field')),
    status VARCHAR(30) NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Interested', 'Not Interested', 'Converted')),
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE OR REPLACE FUNCTION update_updated_at()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  DROP TRIGGER IF EXISTS set_updated_at ON leads;

  CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
`;

async function initDB() {
  try {
    await pool.query(createTableQuery);
    console.log("Database connected and table ready.");
  } catch (err) {
    console.error("Database init failed:", err);
    process.exit(1);
  }
}

module.exports = { pool, initDB };