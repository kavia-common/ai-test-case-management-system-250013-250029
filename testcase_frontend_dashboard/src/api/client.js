import { getToken, clearAuthStorage } from "../utils/storage";

/**
 * API base URL is configured via env var.
 * Ask orchestrator/user to set REACT_APP_API_BASE_URL in .env for this container.
 */
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || process.env.API_BASE || "";

/**
 * Normalized API error shape.
 */
export class ApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function safeJson(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

// PUBLIC_INTERFACE
export async function apiRequest(path, { method = "GET", body, headers = {} } = {}) {
  /** Core API request function with JWT header. */
  const url = API_BASE_URL ? `${API_BASE_URL}${path}` : path;

  const token = getToken();
  const finalHeaders = {
    "Content-Type": "application/json",
    ...headers
  };
  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await safeJson(response);

  if (response.status === 401) {
    // Token invalid/expired: clear storage so app redirects to login.
    clearAuthStorage();
  }

  if (!response.ok) {
    const msg =
      (data && (data.message || data.error)) ||
      `Request failed: ${response.status} ${response.statusText}`;
    throw new ApiError(msg, { status: response.status, data });
  }

  return data;
}
