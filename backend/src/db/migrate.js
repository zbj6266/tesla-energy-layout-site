import pool from "./pool.js";

const SQL = `
  CREATE TABLE IF NOT EXISTS sessions (
    id          VARCHAR(12)  PRIMARY KEY,
    name        TEXT         NOT NULL DEFAULT '',
    qty         JSONB        NOT NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
  );

  -- Index for quick lookups by id (already covered by PK, but explicit)
  CREATE INDEX IF NOT EXISTS sessions_id_idx ON sessions (id);

  -- Auto-update updated_at on row change
  CREATE OR REPLACE FUNCTION set_updated_at()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  DROP TRIGGER IF EXISTS sessions_updated_at ON sessions;
  CREATE TRIGGER sessions_updated_at
    BEFORE UPDATE ON sessions
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
`;

async function migrate() {
  const client = await pool.connect();
  try {
    console.log("Running migrations...");
    await client.query(SQL);
    console.log("Sessions table ready");
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
