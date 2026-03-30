import React, { useEffect, useState } from "react";
import { createManualExecution, getExecutionLogs, listExecutions, triggerAutomationRun } from "../api/executions";
import { listProjects } from "../api/projects";

// PUBLIC_INTERFACE
export default function ExecutionsPage() {
  /** Execution management (manual + automation triggers) with log viewer. */
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: null });
  const [projectId, setProjectId] = useState("");

  const [testCaseId, setTestCaseId] = useState("");
  const [result, setResult] = useState("passed");
  const [notes, setNotes] = useState("");
  const [creating, setCreating] = useState(false);

  const [autoCaseId, setAutoCaseId] = useState("");
  const [autoRunning, setAutoRunning] = useState(false);

  const [selectedExecutionId, setSelectedExecutionId] = useState("");
  const [logs, setLogs] = useState(null);
  const [logsStatus, setLogsStatus] = useState({ loading: false, error: null });

  async function load() {
    setStatus({ loading: true, error: null });
    try {
      let pid = projectId;
      if (!pid) {
        const pr = await listProjects();
        const first = (pr?.projects || pr || [])[0];
        pid = first?.id || first?._id || "";
        setProjectId(pid);
      }
      if (!pid) throw new Error("No projects available. Create a project first.");

      const res = await listExecutions({ projectId: pid });
      setItems(res?.executions || res || []);
      setStatus({ loading: false, error: null });
    } catch (e) {
      setStatus({ loading: false, error: e?.message || "Failed to load executions." });
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreateManual(e) {
    e.preventDefault();
    if (!testCaseId.trim()) return;

    setCreating(true);
    try {
      await createManualExecution({
        projectId,
        testCaseId: testCaseId.trim(),
        result,
        notes: notes.trim() || null
      });
      setTestCaseId("");
      setNotes("");
      await load();
    } catch (e2) {
      setStatus({ loading: false, error: e2?.message || "Failed to create manual execution." });
    } finally {
      setCreating(false);
    }
  }

  async function onTriggerAutomation() {
    if (!autoCaseId.trim()) return;

    setAutoRunning(true);
    try {
      await triggerAutomationRun({ projectId, testcaseId: autoCaseId.trim(), runType: "playwright" });
      await load();
    } catch (e) {
      setStatus({ loading: false, error: e?.message || "Failed to trigger automation run." });
    } finally {
      setAutoRunning(false);
    }
  }

  async function onViewLogs(executionId) {
    setSelectedExecutionId(executionId);
    setLogs(null);
    setLogsStatus({ loading: true, error: null });
    try {
      const res = await getExecutionLogs(executionId);
      setLogs(res?.logs || res || []);
      setLogsStatus({ loading: false, error: null });
    } catch (e) {
      setLogsStatus({ loading: false, error: e?.message || "Failed to load logs." });
    }
  }

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Executions</h1>
          <p className="pageSubtitle">Manual runs + trigger Playwright automation from the UI.</p>
        </div>
      </div>

      {status.error ? <div className="notice noticeError">{status.error}</div> : null}

      <div className="grid">
        <div className="card" style={{ gridColumn: "span 6" }}>
          <div className="cardHeader">
            <h2 className="cardTitle">Manual Execution</h2>
            <span className="cardMeta">QA</span>
          </div>

          <form onSubmit={onCreateManual}>
            <div className="formRow">
              <div className="field">
                <label htmlFor="tcid">Test Case ID</label>
                <input id="tcid" value={testCaseId} onChange={(e) => setTestCaseId(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="result">Result</label>
                <select id="result" value={result} onChange={(e) => setResult(e.target.value)}>
                  <option value="passed">Passed</option>
                  <option value="failed">Failed</option>
                  <option value="blocked">Blocked</option>
                  <option value="skipped">Skipped</option>
                </select>
              </div>
            </div>

            <div className="field" style={{ marginTop: 14 }}>
              <label htmlFor="notes">Notes</label>
              <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>

            <div className="actions">
              <button className="btn btnPrimary" type="submit" disabled={creating}>
                {creating ? "Saving…" : "Save execution"}
              </button>
              <button className="btn" type="button" onClick={load}>Refresh</button>
            </div>
          </form>
        </div>

        <div className="card" style={{ gridColumn: "span 6" }}>
          <div className="cardHeader">
            <h2 className="cardTitle">Automation (Playwright)</h2>
            <span className="cardMeta">Developer / QA</span>
          </div>

          <div className="field">
            <label htmlFor="autoCaseId">Test Case ID</label>
            <input id="autoCaseId" value={autoCaseId} onChange={(e) => setAutoCaseId(e.target.value)} />
          </div>

          <div className="actions">
            <button className="btn btnPrimary" type="button" onClick={onTriggerAutomation} disabled={autoRunning}>
              {autoRunning ? "Triggering…" : "Trigger automation run"}
            </button>
          </div>

          <div className="notice" style={{ marginTop: 14 }}>
            Backend should enqueue / run Playwright and later expose logs/screenshots/errors via <code>/logs</code>.
          </div>
        </div>

        <div className="card" style={{ gridColumn: "span 7" }}>
          <div className="cardHeader">
            <h2 className="cardTitle">Execution History</h2>
            <span className="cardMeta">{status.loading ? "Loading…" : `${items.length} items`}</span>
          </div>

          <table className="table" aria-label="Executions table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Test Case</th>
                <th>Result</th>
                <th>When</th>
                <th>Logs</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan="5" className="pillMono">No executions yet.</td></tr>
              ) : (
                items.map((ex) => (
                  <tr key={ex.id || ex._id}>
                    <td className="pillMono">{ex.id || ex._id}</td>
                    <td className="pillMono">{ex.testCaseId || ex.test_case_id || "—"}</td>
                    <td>
                      <span className={`badge ${ex.result === "failed" ? "badgePink" : "badgeCyan"}`}>
                        {ex.result || "unknown"}
                      </span>
                    </td>
                    <td className="pillMono">{ex.createdAt || ex.created_at || "—"}</td>
                    <td>
                      <button className="btn" type="button" onClick={() => onViewLogs(ex.id || ex._id)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="card" style={{ gridColumn: "span 5" }}>
          <div className="cardHeader">
            <h2 className="cardTitle">Logs</h2>
            <span className="cardMeta">{selectedExecutionId ? `execution=${selectedExecutionId}` : "select a run"}</span>
          </div>

          {logsStatus.error ? <div className="notice noticeError">{logsStatus.error}</div> : null}
          {logsStatus.loading ? <div className="notice">Loading logs…</div> : null}

          {!selectedExecutionId ? (
            <div className="pillMono">Pick an execution to view its logs.</div>
          ) : (
            <div className="pillMono" style={{ whiteSpace: "pre-wrap" }}>
              {Array.isArray(logs)
                ? logs.map((l) => `${l.timestamp || ""} ${l.level || ""} ${l.message || JSON.stringify(l)}`).join("\n")
                : JSON.stringify(logs, null, 2)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
