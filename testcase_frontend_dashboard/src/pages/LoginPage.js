import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function validate(email, password) {
  const errs = {};
  if (!email || !email.includes("@")) errs.email = "Please enter a valid email.";
  if (!password || password.length < 6) errs.password = "Password must be at least 6 characters.";
  return errs;
}

// PUBLIC_INTERFACE
export default function LoginPage() {
  /** Login form page. */
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [errs, setErrs] = useState({});

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);

    const nextErrs = validate(email, password);
    setErrs(nextErrs);
    if (Object.keys(nextErrs).length > 0) return;

    setSubmitting(true);
    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err?.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="authShell">
      <div className="card authCard">
        <h1 className="authTitle">Welcome back</h1>
        <p className="authSub">Sign in to your Retro TestOps console.</p>

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
              autoComplete="current-password"
            />
            {errs.password ? (
              <div className="pillMono" style={{ color: "rgba(255,42,109,0.9)" }}>{errs.password}</div>
            ) : null}
          </div>

          <div className="actions">
            <button className="btn btnPrimary" type="submit" disabled={submitting}>
              {submitting ? "Signing in…" : "Sign in"}
            </button>
            <Link className="btn" to="/register">Create account</Link>
          </div>
        </form>

        <div className="hr" />
        <div className="pillMono">
          Tip: backend API base URL is controlled by <code>REACT_APP_API_BASE_URL</code>.
        </div>
      </div>
    </div>
  );
}
