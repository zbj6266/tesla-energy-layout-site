import React from "react";
import { DEVICES } from "../data/devices";

function DeviceCard({ device, qty, onDecrement, onIncrement, onInputChange }) {
  return (
      <div className="device-card">
        <div className="device-badge" style={{ background: device.bgColor }}>
        <span className="device-badge-text" style={{ color: device.color }}>
          {device.shortName}
        </span>
        </div>
        <div className="device-info">
          <div className="device-name">{device.name}</div>
          <div className="device-meta">
            {device.widthFt}ft × {device.depthFt}ft &nbsp;·&nbsp; {device.energyMWh} MWh
            &nbsp;·&nbsp; ${device.cost.toLocaleString()}
          </div>
          <div className="device-meta muted">Released {device.releaseYear}</div>
        </div>
        <div className="qty-control">
          <button
              className="qty-btn"
              onClick={() => onDecrement(device.id)}
              disabled={qty === 0}
              aria-label={`Decrease ${device.name}`}
          >
            −
          </button>
          <input
              type="number"
              className="qty-input"
              value={qty}
              min={0}
              onChange={(e) => onInputChange(device.id, e.target.value)}
              aria-label={`${device.name} quantity`}
          />
          <button
              className="qty-btn"
              onClick={() => onIncrement(device.id)}
              aria-label={`Increase ${device.name}`}
          >
            +
          </button>
        </div>
      </div>
  );
}

export default function DevicePanel({
                                      qty,
                                      updateQty,
                                      setQtyDirect,
                                      autoTransformers,
                                      sessionName,
                                      sessionId,
                                      loadInput,
                                      setSessionName,
                                      setLoadInput,
                                      saveSession,
                                      loadSessionById,
                                      reset,
                                      status,
                                      statusMsg,
                                    }) {
  const isBusy = status === "saving" || status === "loading";

  return (
      <aside className="device-panel">
        <div className="panel-header">
          <h2 className="panel-title">Device Configuration</h2>
        </div>

        <div className="device-list">
          {DEVICES.map((device) => (
              <DeviceCard
                  key={device.id}
                  device={device}
                  qty={qty[device.id] ?? 0}
                  onDecrement={(id) => updateQty(id, -1)}
                  onIncrement={(id) => updateQty(id, 1)}
                  onInputChange={setQtyDirect}
              />
          ))}
        </div>

        {autoTransformers > 0 && (
            <div className="transformer-note">
              <span>
                <strong>{autoTransformers}</strong> transformer
                    {autoTransformers !== 1 ? "s" : ""} auto-added (1 per 2 batteries)
              </span>
            </div>
        )}

        {/*Save section*/}
        <div className="session-section">
          <div className="panel-label">Session name</div>
          <input
              type="text"
              className="session-name-input"
              placeholder="Please enter a session name"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
          />

          <div className="session-actions">
            <button className="btn btn-primary" onClick={saveSession} disabled={isBusy}>
              {status === "saving" ? "Saving…" : sessionId ? "Update session" : "Save session"}
            </button>
            <button className="btn btn-reset" onClick={reset}>
              Reset
            </button>
          </div>

          {sessionId && (
              <div className="session-id-display">
                Session ID: <code>{sessionId}</code>
              </div>
          )}

          {/*Load by ID*/}
          <div className="panel-label" style={{ marginTop: 12 }}>
            Load a saved session
          </div>
          <div className="load-row">
            <input
                type="text"
                className="session-name-input"
                placeholder="Please enter a saved session id"
                value={loadInput}
                onChange={(e) => setLoadInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && loadSessionById()}
            />
            <button
                className="btn btn-secondary"
                onClick={loadSessionById}
                disabled={isBusy || !loadInput.trim()}
            >
              {status === "loading" ? "Loading…" : "Load"}
            </button>
          </div>

          {statusMsg && (
              <div className="save-status">
                {statusMsg}
              </div>
          )}
        </div>
      </aside>
  );
}
