import { apiRequest } from "./client";

// PUBLIC_INTERFACE
export async function listModules(projectId) {
  /** List modules for a project. */
  return apiRequest(`/modules?projectId=${encodeURIComponent(projectId)}`, { method: "GET" });
}

// PUBLIC_INTERFACE
export async function createModule(payload) {
  /** Create a module. */
  return apiRequest("/modules", { method: "POST", body: payload });
}
