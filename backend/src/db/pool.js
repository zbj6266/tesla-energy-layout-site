import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

/**
 * Determine SSL config:
 *  - DB_SSL=disable  -> never use SSL (local Postgres, Docker)
 *  - DB_SSL=require  -> always use SSL (Supabase, Railway, Neon)
 *  - not set         -> auto-detect based on URL
 */
function getSSL() {
  const url = process.env.DATABASE_URL;
  const isLocal =
      url.includes("localhost") ||
      url.includes("127.0.0.1") ||
      url.includes("@postgres:") || // docker-compose service name
      url.includes("@db:");

  return isLocal ? false : { rejectUnauthorized: false };
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: getSSL(),
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL pool error:", err);
});

export default pool;
