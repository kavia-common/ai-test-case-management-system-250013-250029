import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function validate(email, password, role) {
  const errs = {};
  if (!email || !email.includes("@")) errs.email = "Please enter a valid email.";
  if (!password || password.length < 6) errs.password = "Password must be at least 6 characters.";
  if (!role) errs.role = "Please select a role.";
  return errs;
}

// PUBLIC_INTERFACE
export default function RegisterPage() {
  /** Registration form page with role selection (Admin/QA/Developer). */
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("QA");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [errs, setErrs] = useState({});

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);

    const nextErrs = validate(email, password, role);
    setErrs(nextErrs);
    if (Object.keys(nextErrs).length > 0) return;

    setSubmitting(true);
    try {
      await register({ email, password, role });
      navigate("/dashboard");
    } catch (err) {
      setError(err?.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="authShell">
      <div className="card authCard">
        <h1 className="authTitle">Create account</h1>
        <p className="authSub">Spin up a new identity for your TestOps universe.</p>

        <div className="hr" />

        {error ? <div className="notice noticeError" role="alert">{error}</div> : null}

        <form onSubmit={onSubmit}>
          <div className="field" style={{ marginTop: 14 }}>
            <label htmlFor="email">Email</label>
            <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            {errs.email ? <div className="pillMono" style={{ color: "rgba(255,42,109,0.9)" }}>{errs.email}</div> : null}
          </div>

          <div className="field" style={{ marginTop: 14 }}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="new-password"
            />
            {errs.password ? (
              <div className="pillMono" style={{ color: "rgba(255,42,109,0.9)" }}>{errs.password}</div>
            ) : null}
          </div>

          <div className="field" style={{ marginTop: 14 }}>
            <label htmlFor="role">Role</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Admin">Admin</option>
              <option value="QA">QA</option>
              <option value="Developer">Developer</option>
            </select>
            {errs.role ? <div className="pillMono" style={{ color: "rgba(255,42,109,0.9)" }}>{errs.role}</div> : null}
          </div>

          <div className="actions">
            <button className="btn btnPrimary" type="submit" disabled={submitting}>
              {submitting ? "Creating…" : "Create account"}
            </button>
            <Link className="btn" to="/login">Back to login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
