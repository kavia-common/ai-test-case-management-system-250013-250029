import { apiRequest } from "./client";

// PUBLIC_INTERFACE
export async function getDashboard(projectId) {
  /** Fetch dashboard summary data. */
  if (!projectId) throw new Error("projectId is required to fetch dashboard");
  return apiRequest(`/projects/${encodeURIComponent(projectId)}/dashboard/summary`, { method: "GET" });
}
