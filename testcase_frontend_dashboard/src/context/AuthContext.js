import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { clearAuthStorage, getStoredUser, getToken, setStoredUser, setToken } from "../utils/storage";
import * as authApi from "../api/auth";

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides auth state (user/token) and actions (login/logout). */
  const [token, setTokenState] = useState(() => getToken());
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function bootstrap() {
      // If we have a token but no user, try /auth/me
      if (token && !user) {
        try {
          const me = await authApi.me();
          if (!alive) return;
          setUser(me?.user || me);
          setStoredUser(me?.user || me);
        } catch {
          if (!alive) return;
          clearAuthStorage();
          setTokenState(null);
          setUser(null);
        }
      }
      if (alive) setLoading(false);
    }

    bootstrap();
    return () => {
      alive = false;
    };
  }, [token, user]);

  const value = useMemo(() => {
    // PUBLIC_INTERFACE
    const login = async ({ email, password }) => {
      /** Log in and persist auth state. */
      const res = await authApi.login({ email, password });
      const nextToken = res?.token;
      const nextUser = res?.user || res?.data?.user || res?.data || null;
      setToken(nextToken);
      setStoredUser(nextUser);
      setTokenState(nextToken);
      setUser(nextUser);
      return res;
    };

    // PUBLIC_INTERFACE
    const register = async ({ email, password, role }) => {
      /** Register and persist auth state. */
      const res = await authApi.register({ email, password, role });
      const nextToken = res?.token;
      const nextUser = res?.user || res?.data?.user || res?.data || null;
      setToken(nextToken);
      setStoredUser(nextUser);
      setTokenState(nextToken);
      setUser(nextUser);
      return res;
    };

    // PUBLIC_INTERFACE
    const logout = () => {
      /** Log out and clear storage. */
      clearAuthStorage();
      setTokenState(null);
      setUser(null);
    };

    const role = user?.role || user?.roles?.[0] || null;

    return { token, user, role, loading, login, register, logout, isAuthenticated: Boolean(token) };
  }, [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access auth context. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
