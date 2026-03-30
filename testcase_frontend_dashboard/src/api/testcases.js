import { apiRequest } from "./client";

// PUBLIC_INTERFACE
export async function listTestCases({ projectId, moduleId, tag, q } = {}) {
  /** List test cases with optional filters. */
  const params = new URLSearchParams();
  if (projectId) params.set("projectId", projectId);
  if (moduleId) params.set("moduleId", moduleId);
  if (tag) params.set("tag", tag);
  if (q) params.set("q", q);
  const suffix = params.toString() ? `?${params.toString()}` : "";
  return apiRequest(`/testcases${suffix}`, { method: "GET" });
}

// PUBLIC_INTERFACE
export async function createTestCase(payload) {
  /** Create a test case. */
  return apiRequest("/testcases", { method: "POST", body: payload });
}

// PUBLIC_INTERFACE
export async function updateTestCase(id, payload) {
  /** Update a test case. */
  return apiRequest(`/testcases/${encodeURIComponent(id)}`, { method: "PUT", body: payload });
}

// PUBLIC_INTERFACE
export async function deleteTestCase(id) {
  /** Delete a test case. */
  return apiRequest(`/testcases/${encodeURIComponent(id)}`, { method: "DELETE" });
}
