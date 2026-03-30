import React, { useEffect, useState } from "react";
import { createProject, listProjects } from "../api/projects";

// PUBLIC_INTERFACE
export default function ProjectsPage() {
  /** Project management page (Admin/QA). */
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: null });

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [creating, setCreating] = useState(false);

  async function load() {
    setStatus({ loading: true, error: null });
    try {
      const res = await listProjects();
      setProjects(res?.projects || res || []);
      setStatus({ loading: false, error: null });
    } catch (e) {
      setStatus({ loading: false, error: e?.message || "Failed to load projects." });
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e) {
    e.preventDefault();
    if (!name.trim()) return;

    setCreating(true);
    try {
      await createProject({ name: name.trim(), description: desc.trim() || null });
      setName("");
      setDesc("");
      await load();
    } catch (e2) {
      setStatus({ loading: false, error: e2?.message || "Failed to create project." });
    } finally {
      setCreating(false);
    }
  }

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Projects</h1>
          <p className="pageSubtitle">Organize modules, test cases, executions, and bugs.</p>
        </div>
      </div>

      {status.error ? <div className="notice noticeError">{status.error}</div> : null}

      <div className="grid">
        <div className="card" style={{ gridColumn: "span 5" }}>
          <div className="cardHeader">
            <h2 className="cardTitle">Create Project</h2>
            <span className="cardMeta">Admin / QA</span>
          </div>
          <form onSubmit={onCreate}>
            <div className="field">
              <label htmlFor="pname">Name</label>
              <input id="pname" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="field" style={{ marginTop: 14 }}>
              <label htmlFor="pdesc">Description</label>
              <textarea id="pdesc" value={desc} onChange={(e) => setDesc(e.target.value)} />
            </div>
            <div className="actions">
              <button className="btn btnPrimary" type="submit" disabled={creating}>
                {creating ? "Creating…" : "Create"}
              </button>
              <button className="btn" type="button" onClick={() => { setName(""); setDesc(""); }}>
                Reset
              </button>
            </div>
          </form>
        </div>

        <div className="card" style={{ gridColumn: "span 7" }}>
          <div className="cardHeader">
            <h2 className="cardTitle">Project List</h2>
            <span className="cardMeta">{status.loading ? "Loading…" : `${projects.length} items`}</span>
          </div>

          <table className="table" aria-label="Projects table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan="3" className="pillMono">No projects yet.</td>
                </tr>
              ) : (
                projects.map((p) => (
                  <tr key={p.id || p._id || p.name}>
                    <td><strong>{p.name}</strong></td>
                    <td className="pillMono">{p.description || "—"}</td>
                    <td className="pillMono">{p.updatedAt || p.updated_at || "—"}</td>
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
