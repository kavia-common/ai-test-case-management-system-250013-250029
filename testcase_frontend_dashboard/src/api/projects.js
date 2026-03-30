import { apiRequest } from "./client";

// PUBLIC_INTERFACE
export async function listProjects() {
  /** List projects. */
  return apiRequest("/projects", { method: "GET" });
}

// PUBLIC_INTERFACE
export async function createProject(payload) {
  /** Create a project. */
  return apiRequest("/projects", { method: "POST", body: payload });
}
