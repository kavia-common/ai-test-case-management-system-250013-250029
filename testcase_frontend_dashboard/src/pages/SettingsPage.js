import React from "react";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
export default function SettingsPage() {
  /** Basic settings/profile page. */
  const { user, role } = useAuth();

  return (
    <div className="card">
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Settings</h1>
          <p className="pageSubtitle">Profile, role, and environment configuration.</p>
        </div>
      </div>

      <div className="grid">
        <div className="card" style={{ gridColumn: "span 6" }}>
          <div className="cardHeader">
            <h2 className="cardTitle">Profile</h2>
            <span className="cardMeta">read-only</span>
          </div>

          <table className="table" aria-label="Profile table">
            <tbody>
              <tr>
                <th>Email</th>
                <td className="pillMono">{user?.email || "—"}</td>
              </tr>
              <tr>
                <th>Role</th>
                <td className="pillMono">{role || "—"}</td>
              </tr>
              <tr>
                <th>User ID</th>
                <td className="pillMono">{user?.id || user?._id || "—"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="card" style={{ gridColumn: "span 6" }}>
          <div className="cardHeader">
            <h2 className="cardTitle">Environment</h2>
            <span className="cardMeta">frontend</span>
          </div>

          <div className="notice">
            Backend base URL: <code>{process.env.REACT_APP_API_BASE_URL || "(not set)"}</code>
          </div>

          <div className="pillMono" style={{ marginTop: 14 }}>
            Set <code>REACT_APP_API_BASE_URL</code> in the container <code>.env</code> (see <code>.env.example</code>).
          </div>
        </div>
      </div>
    </div>
  );
}
