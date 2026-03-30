import { apiRequest } from "./client";

// PUBLIC_INTERFACE
export async function listBugs({ projectId, status } = {}) {
  /** List bugs with optional filters. */
  if (!projectId) throw new Error("projectId is required to list bugs");
  // Backend currently doesn't define query filters for bugs list; keep signature for future.
  void status;
  return apiRequest(`/projects/${encodeURIComponent(projectId)}/bugs`, { method: "GET" });
}

// PUBLIC_INTERFACE
export async function createBug(payload) {
  /** Create a bug report linked to failed test case/execution. */
  const { projectId, ...body } = payload || {};
  if (!projectId) throw new Error("projectId is required to create a bug");
  return apiRequest(`/projects/${encodeURIComponent(projectId)}/bugs`, { method: "POST", body });
}
