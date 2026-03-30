/**
 * Tiny localStorage wrapper with JSON safety.
 * Keep this logic centralized to make future migration (cookies, sessionStorage) easy.
 */

const TOKEN_KEY = "tcm_token";
const USER_KEY = "tcm_user";

// PUBLIC_INTERFACE
export function getToken() {
  /** Returns the stored JWT token string or null. */
  return window.localStorage.getItem(TOKEN_KEY);
}

// PUBLIC_INTERFACE
export function setToken(token) {
  /** Persist JWT token (or remove if falsy). */
  if (!token) {
    window.localStorage.removeItem(TOKEN_KEY);
    return;
  }
  window.localStorage.setItem(TOKEN_KEY, token);
}

// PUBLIC_INTERFACE
export function getStoredUser() {
  /** Returns stored user object or null. */
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    window.localStorage.removeItem(USER_KEY);
    return null;
  }
}

// PUBLIC_INTERFACE
export function setStoredUser(user) {
  /** Persist user object (or remove if falsy). */
  if (!user) {
    window.localStorage.removeItem(USER_KEY);
    return;
  }
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// PUBLIC_INTERFACE
export function clearAuthStorage() {
  /** Clears all auth-related storage keys. */
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}
