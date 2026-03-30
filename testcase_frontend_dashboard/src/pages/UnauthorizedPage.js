import React from "react";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
export default function UnauthorizedPage() {
  /** Shown when user lacks role permissions. */
  return (
    <div className="card">
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Unauthorized</h1>
          <p className="pageSubtitle">Your role does not have permission to view this page.</p>
        </div>
        <Link className="btn btnPrimary" to="/dashboard">Go to Dashboard</Link>
      </div>
      <div className="notice noticeError">
        If you believe this is incorrect, contact an Admin to adjust your role.
      </div>
    </div>
  );
}
