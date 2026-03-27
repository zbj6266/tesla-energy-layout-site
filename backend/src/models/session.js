import pool from "../db/pool.js";
import { nanoid } from "nanoid";

const VALID_DEVICE_IDS = ["megapack_xl", "megapack2", "megapack", "powerpack"];

export function validateQty(qty) {
  if (!qty || typeof qty !== "object" || Array.isArray(qty)) return false;
  return VALID_DEVICE_IDS.every(
    (id) => typeof qty[id] === "number" && Number.isInteger(qty[id]) && qty[id] >= 0
  );
}

/**
 * Create a new session. Returns the full session row.
 */
export async function createSession({ name, qty }) {
  const id = nanoid(10); // e.g. "V1StGXR8_Z"
  const { rows } = await pool.query(
    `INSERT INTO sessions (id, name, qty)
     VALUES ($1, $2, $3)
     RETURNING id, name, qty, created_at, updated_at`,
    [id, name ?? "", qty]
  );
  return rows[0];
}

/**
 * Fetch a session by id. Returns null if not found.
 */
export async function getSession(id) {
  const { rows } = await pool.query(
    `SELECT id, name, qty, created_at, updated_at
     FROM sessions WHERE id = $1`,
    [id]
  );
  return rows[0] ?? null;
}

/**
 * Update an existing session's qty and name. Returns updated row or null.
 */
export async function updateSession(id, { name, qty }) {
  const { rows } = await pool.query(
    `UPDATE sessions
     SET name = $2, qty = $3
     WHERE id = $1
     RETURNING id, name, qty, created_at, updated_at`,
    [id, name ?? "", qty]
  );
  return rows[0] ?? null;
}
