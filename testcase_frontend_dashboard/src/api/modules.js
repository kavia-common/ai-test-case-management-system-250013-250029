import { apiRequest } from "./client";

// PUBLIC_INTERFACE
export async function listModules(projectId) {
  /** List modules for a project. */
  if (!projectId) throw new Error("projectId is required to list modules");
  return apiRequest(`/projects/${encodeURIComponent(projectId)}/modules`, { method: "GET" });
}

// PUBLIC_INTERFACE
export async function createModule(payload) {
  /** Create a module. */
  const { projectId, ...body } = payload || {};
  if (!projectId) throw new Error("projectId is required to create a module");
  return apiRequest(`/projects/${encodeURIComponent(projectId)}/modules`, { method: "POST", body });
}
