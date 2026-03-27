import React, { useMemo } from "react";
import { DEVICES, TRANSFORMER, MAX_SITE_WIDTH_FT } from "../data/devices";
import { buildRows } from "../hooks/useSession";

const SCALE = 9; // pixels per foot

function DeviceBlock({ unit }) {
  const width = unit.widthFt * SCALE;
  const height = unit.heightFt * SCALE;

  return (
    <div
      className="site-block"
      title={`${unit.name} — ${unit.widthFt}ft × ${unit.heightFt}ft`}
      style={{
        width,
        height,
        background: unit.color,
        flexShrink: 0,
      }}
    >
      <span className="site-block-label">{unit.shortName}</span>
    </div>
  );
}

function Legend({ layoutUnits }) {
  const counts = {};
  for (const u of layoutUnits) {
    counts[u.id] = (counts[u.id] ?? 0) + 1;
  }

  const allTypes = [...DEVICES, TRANSFORMER].filter((d) => counts[d.id] > 0);

  return (
    <div className="site-legend">
      {allTypes.map((d) => (
        <div key={d.id} className="legend-item">
          <div className="legend-swatch" style={{ background: d.color }} />
          <span>
            {d.name} <span className="legend-count">×{counts[d.id]}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

export default function SiteLayout({ layoutUnits }) {
  const rows = useMemo(() => buildRows(layoutUnits), [layoutUnits]);

  const totalHeight = rows.length * 10; // each unit is 10ft deep

  return (
    <div className="site-layout-panel">
      <div className="panel-header">
        <h2 className="panel-title">Site Layout Preview</h2>
        <p className="panel-subtitle">
          Max width: {MAX_SITE_WIDTH_FT}ft &nbsp;·&nbsp; Approx height: {totalHeight}ft
          &nbsp;·&nbsp; {layoutUnits.length} units placed
        </p>
      </div>

      <div>
        <div className="site-canvas" style={{ width: MAX_SITE_WIDTH_FT * 9.5 }}>
          {rows.map((row, ri) => (
            <div key={ri} className="site-row">
              {row.map((unit) => (
                <DeviceBlock key={unit.key} unit={unit} />
              ))}
            </div>
          ))}
        </div>
        <div className="site-ruler">
          <span>0ft</span>
          <span>{MAX_SITE_WIDTH_FT / 2}ft</span>
          <span>{MAX_SITE_WIDTH_FT}ft</span>
        </div>
      </div>

      <Legend layoutUnits={layoutUnits} />
    </div>
  );
}
