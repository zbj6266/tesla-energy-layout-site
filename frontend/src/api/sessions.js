// Base URL — in dev Vite proxies /api to localhost:3001
// In production set VITE_API_URL=https://your-backend.railway.app
const BASE = import.meta.env.VITE_API_URL ?? "";

async function request(path, options = {}) {
    const res = await fetch(`${BASE}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
    return data;
}

/**
 * Create a new session in the database.
 * Returns { id, name, qty, created_at, updated_at }
 */
export function createSession(name, qty) {
    return request("/api/sessions", {
        method: "POST",
        body: JSON.stringify({ name, qty }),
    });
}

/**
 * Fetch a session by id.
 * Returns { id, name, qty, created_at, updated_at }
 */
export function fetchSession(id) {
    return request(`/api/sessions/${id}`);
}

/**
 * Update an existing session.
 * Returns the updated session row.
 */
export function updateSession(id, name, qty) {
    return request(`/api/sessions/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ name, qty }),
    });
}
