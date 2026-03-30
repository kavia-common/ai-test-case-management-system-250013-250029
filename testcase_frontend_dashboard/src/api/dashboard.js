import { apiRequest } from "./client";

// PUBLIC_INTERFACE
export async function getDashboard() {
  /** Fetch dashboard summary data. */
  return apiRequest("/dashboard", { method: "GET" });
}
