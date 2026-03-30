import React, { useState } from "react";
import { generateTestsFromStory } from "../api/ai";
import { createTestCase } from "../api/testcases";

// PUBLIC_INTERFACE
export default function AiGenerationPage() {
  /** AI-powered test generation from story text. */
  const [story, setStory] = useState("");
  const [status, setStatus] = useState({ loading: false, error: null, success: null });
  const [generated, setGenerated] = useState(null);
  const [importing, setImporting] = useState(false);

  async function onGenerate(e) {
    e.preventDefault();
    if (!story.trim()) return;

    setStatus({ loading: true, error: null, success: null });
    setGenerated(null);
    try {
      const res = await generateTestsFromStory({ story: story.trim() });
      setGenerated(res?.testcases || res?.cases || res);
      setStatus({ loading: false, error: null, success: "Generated." });
    } catch (err) {
      setStatus({ loading: false, error: err?.message || "Generation failed.", success: null });
    }
  }

  async function onImportAll() {
    if (!Array.isArray(generated) || generated.length === 0) return;

    setImporting(true);
    setStatus({ loading: false, error: null, success: null });
    try {
      for (const tc of generated) {
        await createTestCase({
          title: tc.title || tc.name || "AI Generated Test",
          steps: tc.steps || tc.procedure || "",
          expectedResult: tc.expectedResult || tc.expected || "",
          tags: tc.tags || ["ai"]
        });
      }
      setStatus({ loading: false, error: null, success: "Imported generated tests into library." });
    } catch (e) {
      setStatus({ loading: false, error: e?.message || "Import failed.", success: null });
    } finally {
      setImporting(false);
    }
  }

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">AI Generation</h1>
          <p className="pageSubtitle">Generate test cases from a user story.</p>
        </div>
      </div>

      {status.error ? <div className="notice noticeError">{status.error}</div> : null}
      {status.success ? <div className="notice noticeSuccess">{status.success}</div> : null}

      <div className="grid">
        <div className="card" style={{ gridColumn: "span 6" }}>
          <div className="cardHeader">
            <h2 className="cardTitle">Story Input</h2>
            <span className="cardMeta">prompt</span>
          </div>

          <form onSubmit={onGenerate}>
            <div className="field">
              <label htmlFor="story">User Story</label>
              <textarea
                id="story"
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="As a user, I want… so that…"
              />
            </div>
            <div className="actions">
              <button className="btn btnPrimary" type="submit" disabled={status.loading}>
                {status.loading ? "Generating…" : "Generate test cases"}
              </button>
              <button className="btn" type="button" onClick={() => { setStory(""); setGenerated(null); setStatus({ loading: false, error: null, success: null }); }}>
                Clear
              </button>
            </div>
          </form>
        </div>

        <div className="card" style={{ gridColumn: "span 6" }}>
          <div className="cardHeader">
            <h2 className="cardTitle">Generated Output</h2>
            <span className="cardMeta">review</span>
          </div>

          {!generated ? (
            <div className="pillMono">Generate to see results.</div>
          ) : (
            <>
              <div className="actions">
                <button className="btn btnPrimary" type="button" onClick={onImportAll} disabled={importing}>
                  {importing ? "Importing…" : "Import all to library"}
                </button>
              </div>

              <div className="pillMono" style={{ whiteSpace: "pre-wrap" }}>
                {typeof generated === "string" ? generated : JSON.stringify(generated, null, 2)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
