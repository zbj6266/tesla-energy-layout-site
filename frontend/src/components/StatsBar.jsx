import React from "react";
import { DEVICES, TRANSFORMER } from "../data/devices";

function StatCard({ label, value, sub, accent }) {
  return (
    <div className="stat-card" style={accent ? { borderTop: `3px solid ${accent}` } : {}}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

function estimateDimensions(totalAreaSqFt) {
  if (totalAreaSqFt === 0) return null;
  // Approximate a rectangle: width capped at 100ft, height derived
  const width = Math.min(100, totalAreaSqFt);
  const height = Math.ceil(totalAreaSqFt / 100);
  return `~100ft × ${height}ft`;
}

export default function StatsBar({
  totalCost,
  totalEnergy,
  totalAreaSqFt,
  qty,
  autoTransformers,
}) {
  const hasDevices = totalAreaSqFt > 0;

  return (
    <div className="stats-section">
      <div className="stats-grid">
        <StatCard
          label="Total Budget"
          value={hasDevices ? `$${totalCost.toLocaleString()}` : "—"}
          sub={hasDevices ? "USD" : "Add devices to calculate"}
          accent="#185FA5"
        />
        <StatCard
          label="Land Required"
          value={hasDevices ? estimateDimensions(totalAreaSqFt) : "—"}
          sub={hasDevices ? `${totalAreaSqFt.toLocaleString()} sq ft total` : "Add devices to calculate"}
          accent="#0F6E56"
        />
        <StatCard
          label="Net Energy Output"
          value={hasDevices ? `${totalEnergy.toFixed(1)} MWh` : "—"}
          sub={hasDevices ? "after transformer draw" : "Add devices to calculate"}
          accent="#854F0B"
        />
      </div>
    </div>
  );
}
