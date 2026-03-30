import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createTestCase, deleteTestCase, listTestCases } from "../api/testcases";
import { listProjects } from "../api/projects";

function parseTags(input) {
  return input
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

// PUBLIC_INTERFACE
export default function TestCasesPage() {
  /** Test case CRUD page with tags and filtering (project-scoped). */
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: null });
  const [projectId, setProjectId] = useState("");

  const [filterTag, setFilterTag] = useState("");
  const [filterQ, setFilterQ] = useState("");

  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState("");
  const [expected, setExpected] = useState("");
  const [tags, setTags] = useState("");
  const [creating, setCreating] = useState(false);

  const ensureProject = useCallback(async () => {
    if (projectId) return projectId;

    const pr = await listProjects();
    const first = (pr?.projects || pr || [])[0];
    const pid = first?.id || first?._id || "";
    setProjectId(pid);
    return pid;
  }, [projectId]);

  const load = useCallback(async () => {
    setStatus({ loading: true, error: null });
    try {
      const pid = await ensureProject();
      if (!pid) throw new Error("No projects available. Create a project first.");

      const res = await listTestCases({
        projectId: pid,
        tag: filterTag || undefined,
        q: filterQ || undefined
      });
      setItems(res?.testcases || res || []);
      setStatus({ loading: false, error: null });
    } catch (e) {
      setStatus({ loading: false, error: e?.message || "Failed to load test cases." });
    }
  }, [ensureProject, filterQ, filterTag]);

  useEffect(() => {
    load();
  }, [load]);

  async function onCreate(e) {
    e.preventDefault();
    if (!title.trim()) return;

    setCreating(true);
    try {
      const pid = await ensureProject();
      if (!pid) throw new Error("No projects available. Create a project first.");

      await createTestCase({
        projectId: pid,
        title: title.trim(),
        steps: steps.trim(),
        expectedResult: expected.trim(),
        tags: parseTags(tags)
      });

      setTitle("");
      setSteps("");
      setExpected("");
      setTags("");
      await load();
    } catch (e2) {
      setStatus({ loading: false, error: e2?.message || "Failed to create test case." });
    } finally {
      setCreating(false);
    }
  }

  async function onDelete(id) {
    try {
      await deleteTestCase(id);
      await load();
    } catch (e) {
      setStatus({ loading: false, error: e?.message || "Failed to delete test case." });
    }
  }

  const filtered = useMemo(() => {
    // If backend doesn't implement filters, do minimal client-side filters too.
    return items.filter((it) => {
      const tagsArr = it.tags || [];
      const matchesTag = filterTag ? tagsArr.includes(filterTag) : true;
      const q = filterQ.trim().toLowerCase();
      const matchesQ = q
        ? String(it.title || "").toLowerCase().includes(q) || String(it.steps || "").toLowerCase().includes(q)
        : true;
      return matchesTag && matchesQ;
    });
  }, [items, filterQ, filterTag]);

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Test Cases</h1>
          <p className="pageSubtitle">CRUD, tags, and filters.</p>
        </div>
      </div>

      {status.error ? <div className="notice noticeError">{status.error}</div> : null}

      <div className="grid">
        <div className="card" style={{ gridColumn: "span 5" }}>
          <div className="cardHeader">
            <h2 className="cardTitle">Create Test Case</h2>
            <span className="cardMeta">QA / Admin</span>
          </div>

          <form onSubmit={onCreate}>
            <div className="field">
              <label htmlFor="tctitle">Title</label>
              <input id="tctitle" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="field" style={{ marginTop: 14 }}>
              <label htmlFor="tcsteps">Steps</label>
              <textarea id="tcsteps" value={steps} onChange={(e) => setSteps(e.target.value)} />
            </div>

            <div className="field" style={{ marginTop: 14 }}>
              <label htmlFor="tcexpected">Expected Result</label>
              <textarea id="tcexpected" value={expected} onChange={(e) => setExpected(e.target.value)} />
            </div>

            <div className="field" style={{ marginTop: 14 }}>
              <label htmlFor="tctags">Tags (comma-separated)</label>
              <input id="tctags" value={tags} onChange={(e) => setTags(e.target.value)} />
            </div>

            <div className="actions">
              <button className="btn btnPrimary" type="submit" disabled={creating}>
                {creating ? "Creating…" : "Create"}
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setTitle("");
                  setSteps("");
                  setExpected("");
                  setTags("");
                }}
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        <div className="card" style={{ gridColumn: "span 7" }}>
          <div className="cardHeader">
            <h2 className="cardTitle">Library</h2>
            <span className="cardMeta">{status.loading ? "Loading…" : `${filtered.length} items`}</span>
          </div>

          <div className="formRow">
            <div className="field">
              <label htmlFor="filterTag">Filter by tag</label>
              <input
                id="filterTag"
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                placeholder="e.g. smoke"
              />
            </div>
            <div className="field">
              <label htmlFor="filterQ">Search</label>
              <input
                id="filterQ"
                value={filterQ}
                onChange={(e) => setFilterQ(e.target.value)}
                placeholder="title/steps…"
              />
            </div>
          </div>

          <div className="actions">
            <button className="btn" type="button" onClick={load}>
              Refresh
            </button>
          </div>

          <table className="table" aria-label="Test cases table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Tags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="3" className="pillMono">
                    No test cases found.
                  </td>
                </tr>
              ) : (
                filtered.map((tc) => (
                  <tr key={tc.id || tc._id || tc.title}>
                    <td>
                      <strong>{tc.title}</strong>
                      <div className="pillMono" style={{ marginTop: 6 }}>
                        {String(tc.steps || "").slice(0, 110) || "—"}
                      </div>
                    </td>
                    <td>
                      {(tc.tags || []).length ? (
                        <div className="actions">
                          {tc.tags.map((t) => (
                            <button
                              key={t}
                              type="button"
                              className="badge badgeCyan"
                              onClick={() => setFilterTag(t)}
                              title="Click to filter by tag"
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span className="pillMono">—</span>
                      )}
                    </td>
                    <td>
                      <div className="actions">
                        <button className="btn btnDanger" type="button" onClick={() => onDelete(tc.id || tc._id)}>
                          Delete
                        </button>
                      </div>
                      <div className="pillMono">Edit UI wired once backend supports update shape consistently.</div>
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
