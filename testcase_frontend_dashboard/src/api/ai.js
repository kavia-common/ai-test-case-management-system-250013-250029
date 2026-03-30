import { apiRequest } from "./client";

// PUBLIC_INTERFACE
export async function generateTestsFromStory(payload) {
  /** Generate test cases from a user story. */
  return apiRequest("/ai/generate", { method: "POST", body: payload });
}
