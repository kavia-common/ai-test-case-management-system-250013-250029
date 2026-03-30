import { apiRequest } from "./client";

// PUBLIC_INTERFACE
export async function listExecutions({ projectId, testCaseId } = {}) {
  /** List executions with optional filters. */
  if (!projectId) throw new Error("projectId is required to list executions");
  const params = new URLSearchParams();
  if (testCaseId) params.set("testcaseId", testCaseId);
  const suffix = params.toString() ? `?${params.toString()}` : "";
  return apiRequest(`/projects/${encodeURIComponent(projectId)}/executions${suffix}`, { method: "GET" });
}

// PUBLIC_INTERFACE
export async function createManualExecution(payload) {
  /** Create a manual execution record. */
  const { projectId, ...body } = payload || {};
  if (!projectId) throw new Error("projectId is required to create a manual execution");
  return apiRequest(`/projects/${encodeURIComponent(projectId)}/executions`, { method: "POST", body });
}

// PUBLIC_INTERFACE
export async function triggerAutomationRun(payload) {
  /** Trigger automation run (Playwright) from UI. */
  const { projectId, ...body } = payload || {};
  if (!projectId) throw new Error("projectId is required to trigger an automation run");
  return apiRequest(`/projects/${encodeURIComponent(projectId)}/automation/runs`, { method: "POST", body });
}

// PUBLIC_INTERFACE
export async function getExecutionLogs(executionId) {
  /** Get logs for an execution. */
  return apiRequest(`/executions/${encodeURIComponent(executionId)}/logs`, { method: "GET" });
}
