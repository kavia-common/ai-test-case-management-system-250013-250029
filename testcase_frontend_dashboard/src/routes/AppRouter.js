import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppShell from "../components/AppShell";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import DashboardPage from "../pages/DashboardPage";
import ProjectsPage from "../pages/ProjectsPage";
import TestCasesPage from "../pages/TestCasesPage";
import ExecutionsPage from "../pages/ExecutionsPage";
import BugsPage from "../pages/BugsPage";
import ReportsPage from "../pages/ReportsPage";
import AiGenerationPage from "../pages/AiGenerationPage";
import SettingsPage from "../pages/SettingsPage";
import { RequireAuth, RequireRole } from "./Guards";

/**
 * Role map:
 * - Admin: everything
 * - QA: projects, testcases, executions, bugs, ai, reports
 * - Developer: executions, bugs, reports (and dashboard)
 */

// PUBLIC_INTERFACE
export default function AppRouter() {
  /** Application routes with auth + role guards. */
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route element={<RequireAuth />}>
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<DashboardPage />} />

            <Route element={<RequireRole allowed={["Admin", "QA"]} />}>
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/testcases" element={<TestCasesPage />} />
              <Route path="/ai" element={<AiGenerationPage />} />
            </Route>

            <Route element={<RequireRole allowed={["Admin", "QA", "Developer"]} />}>
              <Route path="/executions" element={<ExecutionsPage />} />
              <Route path="/bugs" element={<BugsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
