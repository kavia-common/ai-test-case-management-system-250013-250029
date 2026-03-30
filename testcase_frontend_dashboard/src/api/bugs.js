import { apiRequest } from "./client";

// PUBLIC_INTERFACE
export async function listBugs({ projectId, status } = {}) {
  /** List bugs with optional filters. */
  const params = new URLSearchParams();
  if (projectId) params.set("projectId", projectId);
  if (status) params.set("status", status);
  const suffix = params.toString() ? `?${params.toString()}` : "";
  return apiRequest(`/bugs${suffix}`, { method: "GET" });
}

// PUBLIC_INTERFACE
export async function createBug(payload) {
  /** Create a bug report linked to failed test case/execution. */
  return apiRequest("/bugs", { method: "POST", body: payload });
}
