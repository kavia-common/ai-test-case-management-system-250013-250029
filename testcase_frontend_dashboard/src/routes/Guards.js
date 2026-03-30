import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
export function RequireAuth() {
  /** Guard: requires a logged-in user. */
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="content"><div className="notice">Loading session…</div></div>;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

// PUBLIC_INTERFACE
export function RequireRole({ allowed }) {
  /** Guard: requires user role to be in `allowed` list. */
  const { role, loading } = useAuth();
  if (loading) return <div className="content"><div className="notice">Loading role…</div></div>;
  if (!allowed || allowed.length === 0) return <Outlet />;
  return allowed.includes(role) ? <Outlet /> : <Navigate to="/unauthorized" replace />;
}
