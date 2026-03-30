import React, { useEffect, useState } from "react";
import { createBug, listBugs } from "../api/bugs";

// PUBLIC_INTERFACE
export default function BugsPage() {
  /** Bug tracking linked to failed cases/executions. */
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: null });

  const [title, setTitle] = useState("");
  const [severity, setSeverity] = useState("medium");
  const [testCaseId, setTestCaseId] = useState("");
  const [executionId, setExecutionId] = useState("");
  const [creating, setCreating] = useState(false);

  async function load() {
    setStatus({ loading: true, error: null });
    try {
      const res = await listBugs();
      setItems(res?.bugs || res || []);
      setStatus({ loading: false, error: null });
    } catch (e) {
      setStatus({ loading: false, error: e?.message || "Failed to load bugs." });
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e) {
    e.preventDefault();
    if (!title.trim()) return;

    setCreating(true);
    try {
      await createBug({
        title: title.trim(),
        severity,
        testCaseId: testCaseId.trim() || null,
        executionId: executionId.trim() || null
      });
      setTitle("");
      setTestCaseId("");
      setExecutionId("");
      await load();
    } catch (e2) {
      setStatus({ loading: false, error: e2?.message || "Failed to create bug." });
    } finally {
      setCreating(false);
    }
  }

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Bugs</h1>
          <p className="pageSubtitle">Track defects linked to failed executions.</p>
        </div>
      </div>

      {status.error ? <div className="notice noticeError">{status.error}</div> : null}

      <div className="grid">
        <div className="card" style={{ gridColumn: "span 5" }}>
          <div className="cardHeader">
            <h2 className="cardTitle">Create Bug</h2>
            <span className="cardMeta">QA / Developer</span>
          </div>

          <form onSubmit={onCreate}>
            <div className="field">
              <label htmlFor="btitle">Title</label>
              <input id="btitle" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="formRow" style={{ marginTop: 14 }}>
              <div className="field">
                <label htmlFor="severity">Severity</label>
                <select id="severity" value={severity} onChange={(e) => setSeverity(e.target.value)}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="tcid2">Test Case ID</label>
                <input id="tcid2" value={testCaseId} onChange={(e) => setTestCaseId(e.target.value)} />
              </div>
            </div>

            <div className="field" style={{ marginTop: 14 }}>
              <label htmlFor="exid">Execution ID (optional)</label>
              <input id="exid" value={executionId} onChange={(e) => setExecutionId(e.target.value)} />
            </div>

            <div className="actions">
              <button className="btn btnPrimary" type="submit" disabled={creating}>
                {creating ? "Creating…" : "Create bug"}
              </button>
              <button className="btn" type="button" onClick={load}>Refresh</button>
            </div>
          </form>
        </div>

        <div className="card" style={{ gridColumn: "span 7" }}>
          <div className="cardHeader">
            <h2 className="cardTitle">Bug List</h2>
            <span className="cardMeta">{status.loading ? "Loading…" : `${items.length} items`}</span>
          </div>

          <table className="table" aria-label="Bugs table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Linked</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan="4" className="pillMono">No bugs yet.</td></tr>
              ) : (
                items.map((b) => (
                  <tr key={b.id || b._id || b.title}>
                    <td><strong>{b.title}</strong></td>
                    <td className="pillMono">{b.severity || "—"}</td>
                    <td className="pillMono">{b.status || "open"}</td>
                    <td className="pillMono">
                      tc={b.testCaseId || b.test_case_id || "—"} / ex={b.executionId || b.execution_id || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
