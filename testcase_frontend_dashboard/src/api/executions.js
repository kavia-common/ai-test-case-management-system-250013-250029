import { apiRequest } from "./client";

// PUBLIC_INTERFACE
export async function listExecutions({ projectId, testCaseId } = {}) {
  /** List executions with optional filters. */
  const params = new URLSearchParams();
  if (projectId) params.set("projectId", projectId);
  if (testCaseId) params.set("testCaseId", testCaseId);
  const suffix = params.toString() ? `?${params.toString()}` : "";
  return apiRequest(`/executions${suffix}`, { method: "GET" });
}

// PUBLIC_INTERFACE
export async function createManualExecution(payload) {
  /** Create a manual execution record. */
  return apiRequest("/executions", { method: "POST", body: payload });
}

// PUBLIC_INTERFACE
export async function triggerAutomationRun(payload) {
  /** Trigger automation run (Playwright) from UI. */
  return apiRequest("/executions/automation", { method: "POST", body: payload });
}

// PUBLIC_INTERFACE
export async function getExecutionLogs(executionId) {
  /** Get logs for an execution. */
  return apiRequest(`/logs?executionId=${encodeURIComponent(executionId)}`, { method: "GET" });
}
