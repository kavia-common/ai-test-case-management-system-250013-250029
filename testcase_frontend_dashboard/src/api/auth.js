import { apiRequest } from "./client";

// PUBLIC_INTERFACE
export async function login({ email, password }) {
  /** Login user and return {token, user}. */
  return apiRequest("/auth/login", { method: "POST", body: { email, password } });
}

// PUBLIC_INTERFACE
export async function register({ email, password, role }) {
  /** Register user and return {token, user}. */
  return apiRequest("/auth/register", { method: "POST", body: { email, password, role } });
}

// PUBLIC_INTERFACE
export async function me() {
  /** Fetch current user profile. */
  return apiRequest("/auth/me", { method: "GET" });
}
