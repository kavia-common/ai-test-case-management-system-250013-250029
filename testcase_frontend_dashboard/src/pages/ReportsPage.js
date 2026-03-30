import React from "react";

// PUBLIC_INTERFACE
export default function ReportsPage() {
  /** Reporting page placeholder (charts/exports to be expanded as backend finalizes endpoints). */
  return (
    <div className="card">
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Reports</h1>
          <p className="pageSubtitle">Trend lines, coverage, and execution analytics.</p>
        </div>
      </div>

      <div className="notice">
        Reports UI is scaffolded. Connect to backend <code>/reports</code> when available.
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card" style={{ gridColumn: "span 6" }}>
          <div className="cardHeader">
            <h2 className="cardTitle">Coverage (placeholder)</h2>
            <span className="cardMeta">tags / modules</span>
          </div>
          <div className="pillMono">
            Add coverage breakdown by module, priority, and tags once backend exposes aggregated endpoints.
          </div>
        </div>

        <div className="card" style={{ gridColumn: "span 6" }}>
          <div className="cardHeader">
            <h2 className="cardTitle">Flakiness (placeholder)</h2>
            <span className="cardMeta">automation runs</span>
          </div>
          <div className="pillMono">
            Add flakiness index derived from repeated failures + reruns.
          </div>
        </div>
      </div>
    </div>
  );
}
