import React, { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function NavIcon({ text }) {
  return <span className="navIcon" aria-hidden="true">{text}</span>;
}

// PUBLIC_INTERFACE
export default function AppShell() {
  /** App chrome: retro side navigation, top bar, and main content outlet. */
  const [collapsed, setCollapsed] = useState(false);
  const { user, role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const pageTitle = useMemo(() => {
    const map = [
      ["/dashboard", "Dashboard"],
      ["/projects", "Projects"],
      ["/testcases", "Test Cases"],
      ["/executions", "Executions"],
      ["/bugs", "Bugs"],
      ["/reports", "Reports"],
      ["/ai", "AI Generation"],
      ["/settings", "Settings"]
    ];
    const found = map.find(([path]) => location.pathname.startsWith(path));
    return found ? found[1] : "Test Case Management";
  }, [location.pathname]);

  return (
    <div className="appRoot">
      <div className={`shell ${collapsed ? "shellCollapsed" : ""}`}>
        <aside className="sidebar">
          <div className="brand">
            <div className="brandMark" aria-hidden="true" />
            <div className="brandText">
              <div className="brandTitle">Retro TCM</div>
              <div className="brandSub">AI TestOps Console</div>
            </div>
          </div>

          <button
            className="pill"
            type="button"
            onClick={() => setCollapsed(v => !v)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            style={{ width: "100%", justifyContent: "center" }}
          >
            <span className="pillMono">{collapsed ? "»" : "«"} Menu</span>
          </button>

          <div className="sidebarSectionTitle">Main</div>
          <ul className="navList">
            <li className="navItem">
              <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "navItemActive" : undefined)}>
                <NavIcon text="D" />
                <span className="navLabel">Dashboard</span>
              </NavLink>
            </li>
            <li className="navItem">
              <NavLink to="/projects">
                <NavIcon text="P" />
                <span className="navLabel">Projects</span>
              </NavLink>
            </li>
            <li className="navItem">
              <NavLink to="/testcases">
                <NavIcon text="T" />
                <span className="navLabel">Test Cases</span>
              </NavLink>
            </li>
            <li className="navItem">
              <NavLink to="/executions">
                <NavIcon text="E" />
                <span className="navLabel">Executions</span>
              </NavLink>
            </li>
            <li className="navItem">
              <NavLink to="/bugs">
                <NavIcon text="B" />
                <span className="navLabel">Bugs</span>
              </NavLink>
            </li>
            <li className="navItem">
              <NavLink to="/reports">
                <NavIcon text="R" />
                <span className="navLabel">Reports</span>
              </NavLink>
            </li>
            <li className="navItem">
              <NavLink to="/ai">
                <NavIcon text="AI" />
                <span className="navLabel">AI Generation</span>
              </NavLink>
            </li>
          </ul>

          <div className="sidebarSectionTitle">Account</div>
          <ul className="navList">
            <li className="navItem">
              <NavLink to="/settings">
                <NavIcon text="S" />
                <span className="navLabel">Settings</span>
              </NavLink>
            </li>
            <li className="navItem">
              <button
                className="btn btnDanger"
                type="button"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                style={{ width: "100%" }}
              >
                Logout
              </button>
            </li>
          </ul>
        </aside>

        <div className="main">
          <div className="topbar">
            <div className="topbarInner">
              <div className="topbarLeft">
                <div>
                  <div className="topbarTitle">{pageTitle}</div>
                  <div className="pillMono">{role ? `ROLE: ${role}` : "ROLE: unknown"}</div>
                </div>
              </div>

              <div className="search" role="search">
                <span className="searchHint" aria-hidden="true">⌘K</span>
                <input
                  placeholder="Search (client-side filter placeholders for now)…"
                  aria-label="Search"
                />
              </div>

              <div className="topbarRight">
                <button className="pill" type="button" aria-label="Notifications">
                  <span className="pillMono">NOTIFS</span>
                  <span className="badge badgeYellow">3</span>
                </button>
                <button className="pill" type="button" aria-label="User menu">
                  <span className="pillMono">{user?.email || "user"}</span>
                </button>
              </div>
            </div>
          </div>

          <main className="content">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
