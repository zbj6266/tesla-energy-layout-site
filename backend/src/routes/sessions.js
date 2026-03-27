import { Router } from "express";
import {
  createSession,
  getSession,
  updateSession,
  validateQty,
} from "../models/session.js";

const router = Router();

/**
 * POST /api/sessions
 * Body: { name?: string, qty: { megapack_xl, megapack2, megapack, powerpack } }
 * Creates a new session and returns { id, name, qty, created_at, updated_at }
 */
router.post("/", async (req, res) => {
  try {
    const { name = "", qty } = req.body;

    if (!validateQty(qty)) {
      return res.status(400).json({
        error:
          "Invalid qty. Must be an object with integer counts for: megapack_xl, megapack2, megapack, powerpack",
      });
    }

    const session = await createSession({ name, qty });
    return res.status(201).json(session);
  } catch (err) {
    console.error("POST /api/sessions error:", err);
    return res.status(500).json({ error: "Failed to create session" });
  }
});

/**
 * GET /api/sessions/:id
 * Returns { id, name, qty, created_at, updated_at } or 404
 */
router.get("/:id", async (req, res) => {
  try {
    const session = await getSession(req.params.id);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    return res.json(session);
  } catch (err) {
    console.error("GET /api/sessions/:id error:", err);
    return res.status(500).json({ error: "Failed to fetch session" });
  }
});

/**
 * PATCH /api/sessions/:id
 * Body: { name?: string, qty }
 * Updates an existing session and returns the updated row or 404
 */
router.patch("/:id", async (req, res) => {
  try {
    const { name, qty } = req.body;

    if (!validateQty(qty)) {
      return res.status(400).json({
        error:
          "Invalid qty. Must be an object with integer counts for: megapack_xl, megapack2, megapack, powerpack",
      });
    }

    const session = await updateSession(req.params.id, { name, qty });
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    return res.json(session);
  } catch (err) {
    console.error("PATCH /api/sessions/:id error:", err);
    return res.status(500).json({ error: "Failed to update session" });
  }
});

export default router;
