import { useState, useCallback, useEffect } from "react";
import { DEVICES, TRANSFORMER, MAX_SITE_WIDTH_FT } from "../data/devices";
import { createSession, fetchSession, updateSession } from "../api/sessions";

const STORAGE_KEY = "tesla_energy_layout_session";

const defaultQty = () =>
    Object.fromEntries(DEVICES.map((d) => [d.id, 0]));

/** Read ?session=<id> from the current URL, return null if absent */
function getSessionIdFromUrl() {
  return new URLSearchParams(window.location.search).get("session");
}

/** Push the ?session=<id> param into the URL without a page reload */
function setSessionIdInUrl(id) {
  const url = new URL(window.location.href);
  if (id) url.searchParams.set("session", id);
  else url.searchParams.delete("session");
  window.history.replaceState({}, "", url.toString());
}

export function buildRows(layoutUnits) {
  const rows = [];
  let currentRow = [];
  let currentWidth = 0;

  for (const unit of layoutUnits) {
    if (currentWidth + unit.widthFt > MAX_SITE_WIDTH_FT && currentRow.length > 0) {
      rows.push(currentRow);
      currentRow = [];
      currentWidth = 0;
    }
    currentRow.push({ ...unit, key: `${unit.id}_${currentRow.length}_${rows.length}` });
    currentWidth += unit.widthFt;
  }
  if (currentRow.length > 0) rows.push(currentRow);
  return rows;
}

export function useSession() {
  const [qty, setQty] = useState(defaultQty());
  const [sessionName, setSessionName] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [status, setStatus] = useState(null);    // 'saving'|'saved'|'loading'|'loaded'|'error'
  const [statusMsg, setStatusMsg] = useState("");
  const [loadInput, setLoadInput] = useState(""); // manual "load by ID" text field

  // Auto-load from ?session= URL param
  useEffect(() => {
    const id = getSessionIdFromUrl();
    if (!id) return;
    flash("loading", "Restoring session…");
    fetchSession(id)
        .then((session) => {
          setQty(session.qty);
          setSessionName(session.name ?? "");
          setSessionId(session.id);
          flash("loaded", `Session "${session.name || session.id}" restored`);
        })
        .catch(() => {
          flash("error", "Could not load session — link may be invalid");
          setSessionIdInUrl(null);
        });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function flash(type, msg) {
    setStatus(type);
    setStatusMsg(msg);
    setTimeout(() => { setStatus(null); setStatusMsg(""); }, 4000);
  }

  // Quantity controls
  const updateQty = useCallback((deviceId, delta) => {
    setQty((prev) => ({
      ...prev,
      [deviceId]: Math.max(0, (prev[deviceId] ?? 0) + delta),
    }));
  }, []);

  const setQtyDirect = useCallback((deviceId, value) => {
    if (value === '' || value === undefined) {
      setQty((prev) => ({ ...prev, [deviceId]: 0 }));
      return;
    }
    const n = parseInt(value, 10);
    if (!isNaN(n) && n >= 0) setQty((prev) => ({ ...prev, [deviceId]: n }));
  }, []);

  // We will save the session by generating a unique session id and user can retrieve their layout
  // by enter their session id
  const saveSession = useCallback(async () => {
    flash("saving", "Saving...");
    try {
      let session;
      if (sessionId) {
        session = await updateSession(sessionId, sessionName, qty);
        flash("saved", "Session updated");
      } else {
        session = await createSession(sessionName, qty);
        setSessionId(session.id);
        setSessionIdInUrl(session.id);
        flash("saved", "Saved!");
      }
    } catch (err) {
      flash("error", `Save failed: ${err.message}`);
    }
  }, [sessionId, sessionName, qty]);

  // Load by ID (manual input)
  const loadSessionById = useCallback(async () => {
    const id = loadInput.trim();
    if (!id) return flash("error", "Enter a session ID");
    try {
      const session = await fetchSession(id);
      setQty(session.qty);
      setSessionName(session.name ?? "");
      setSessionId(session.id);
      setSessionIdInUrl(session.id);
      setLoadInput("");
      flash("loaded", `Session "${session.name || session.id}" loaded`);
    } catch (err) {
      flash("error", err.message.includes("not found") ? "Session not found" : `Load failed: ${err.message}`);
    }
  }, [loadInput]);

  // Reset
  const reset = useCallback(() => {
    setQty(defaultQty());
    setSessionName("");
    setSessionId(null);
    setSessionIdInUrl(null);
    setLoadInput("");
    setStatus(null);
    setStatusMsg("");
  }, []);

  // ── Derived calculations ──────────────────────────────────────────────────
  const totalBatteries = DEVICES.reduce((sum, d) => sum + (qty[d.id] ?? 0), 0);
  const autoTransformers = Math.floor(totalBatteries / 2);

  const totalCost =
      DEVICES.reduce((sum, d) => sum + (qty[d.id] ?? 0) * d.cost, 0) +
      autoTransformers * TRANSFORMER.cost;

  const totalEnergy =
      DEVICES.reduce((sum, d) => sum + (qty[d.id] ?? 0) * d.energyMWh, 0) +
      autoTransformers * TRANSFORMER.energyMWh;

  // Build layout units list in order: batteries first, then transformers
  const layoutUnits = [];
  DEVICES.forEach((d) => {
    for (let i = 0; i < (qty[d.id] ?? 0); i++) layoutUnits.push(d);
  });
  for (let i = 0; i < autoTransformers; i++) layoutUnits.push(TRANSFORMER);
  let rows = buildRows(layoutUnits);

  const totalAreaSqFt = rows.length * MAX_SITE_WIDTH_FT;


  return {
    qty,
    sessionName,
    sessionId,
    loadInput,
    setSessionName,
    setLoadInput,
    updateQty,
    setQtyDirect,
    saveSession,
    loadSessionById,
    reset,
    status,
    statusMsg,
    totalBatteries,
    autoTransformers,
    totalCost,
    totalEnergy,
    totalAreaSqFt,
    layoutUnits,
  };
}
