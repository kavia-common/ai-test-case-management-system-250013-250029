import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboard } from "../api/dashboard";
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, BarChart, Bar, XAxis, YAxis } from "recharts";

const COLORS = ["#2de2e6", "#ff2a6d", "#f9c80e", "#00f5d4"];

// PUBLIC_INTERFACE
export default function DashboardPage() {
  /** Landing dashboard with KPIs + charts. */
  const [data, setData] = useState(null);
  const [status, setStatus] = useState({ loading: true, error: null });

  useEffect(() => {
    let alive = true;

    async function load() {
      setStatus({ loading: true, error: null });
      try {
        const res = await getDashboard();
        if (!alive) return;
        setData(res);
        setStatus({ loading: false, error: null });
      } catch (e) {
        if (!alive) return;
        // Fallback: allow UI to still render even if backend doesn't implement dashboard yet.
        setData(null);
        setStatus({ loading: false, error: e?.message || "Failed to load dashboard." });
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  const kpis = useMemo(() => {
    const src = data?.kpis || data;
    return {
      projects: src?.projects ?? 3,
      testcases: src?.testcases ?? 42,
      executions: src?.executions ?? 18,
      bugsOpen: src?.bugsOpen ?? 5
    };
  }, [data]);

  const pieData = useMemo(() => {
    const src = data?.executionStatus || null;
    if (Array.isArray(src)) return src;
    return [
      { name: "Passed", value: data?.passed ?? 11 },
      { name: "Failed", value: data?.failed ?? 4 },
      { name: "Blocked", value: data?.blocked ?? 2 },
      { name: "Skipped", value: data?.skipped ?? 1 }
    ];
  }, [data]);

  const barData = useMemo(() => {
    const src = data?.testsByProject || null;
    if (Array.isArray(src)) return src;
    return [
      { project: "Web", count: 18 },
      { project: "API", count: 14 },
      { project: "Mobile", count: 10 }
    ];
  }, [data]);

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Dashboard</h1>
          <p className="pageSubtitle">KPIs, execution health, and quick links.</p>
        </div>
        <div className="actions" aria-label="Quick actions">
          <Link className="btn btnPrimary" to="/ai">Generate tests</Link>
          <Link className="btn" to="/testcases">Browse test cases</Link>
          <Link className="btn" to="/executions">Run automation</Link>
        </div>
      </div>

      {status.error ? <div className="notice noticeError">{status.error}</div> : null}
      {status.loading ? <div className="notice">Loading dashboard…</div> : null}

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card" style={{ gridColumn: "span 3" }}>
          <div className="cardHeader">
            <h2 className="cardTitle">Projects</h2>
            <span className="badge badgeCyan">LIVE</span>
          </div>
          <div className="kpiValue">{kpis.projects}</div>
          <div className="kpiLabel">Active projects</div>
        </div>

        <div className="card" style={{ gridColumn: "span 3" }}>
          <div className="cardHeader">
            <h2 className="cardTitle">Test Cases</h2>
            <span className="badge badgePink">CRUD</span>
          </div>
          <div className="kpiValue">{kpis.testcases}</div>
          <div className="kpiLabel">Total cases</div>
        </div>

        <div className="card" style={{ gridColumn: "span 3" }}>
          <div className="cardHeader">
            <h2 className="cardTitle">Executions</h2>
            <span className="badge badgeYellow">RUNS</span>
          </div>
          <div className="kpiValue">{kpis.executions}</div>
          <div className="kpiLabel">Recent runs</div>
        </div>

        <div className="card" style={{ gridColumn: "span 3" }}>
          <div className="cardHeader">
            <h2 className="cardTitle">Open Bugs</h2>
            <span className="badge badgePink">ALERT</span>
          </div>
          <div className="kpiValue">{kpis.bugsOpen}</div>
          <div className="kpiLabel">Needs triage</div>
        </div>

        <div className="card" style={{ gridColumn: "span 6" }}>
          <div className="cardHeader">
            <h2 className="cardTitle">Execution Status</h2>
            <div className="cardMeta">last 7 days</div>
          </div>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={56} outerRadius={92}>
                  {pieData.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ gridColumn: "span 6" }}>
          <div className="cardHeader">
            <h2 className="cardTitle">Tests by Project</h2>
            <div className="cardMeta">inventory</div>
          </div>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={barData}>
                <XAxis dataKey="project" stroke="rgba(255,255,255,0.65)" />
                <YAxis stroke="rgba(255,255,255,0.65)" />
                <Tooltip />
                <Bar dataKey="count" fill="rgba(45,226,230,0.75)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
