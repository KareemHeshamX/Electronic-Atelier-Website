import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import { useAtelierUi } from "../hooks/useAtelierUi";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  useAtelierUi("Login | THE DIGITAL ATELIER");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from || "/";

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const user = await login(email, password);
      // Redirect admin to dashboard, others to where they came from
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <MainLayout>
      <main className="container anim-in anim-delay-1" style={{ paddingBlock: "60px 100px" }}>
        <div className="auth-card">
          <div className="auth-card__header">
            <div className="kicker" style={{ justifyContent: "center", marginBottom: 16 }}>
              <span className="status-pulse"></span>
              <span className="eyebrow">Identity verification</span>
            </div>
            <h1 className="headline auth-card__title">
              System <span style={{ color: "var(--primary-container)" }}>Access</span>
            </h1>
            <p className="muted" style={{ margin: 0 }}>
              Enter your credentials to authenticate
            </p>
          </div>

          <form className="auth-card__form" onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}

            <div className="field">
              <label className="label" htmlFor="email">Email Address</label>
              <input
                className="input"
                id="email"
                type="email"
                placeholder="operator@atelier.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="password">Access Key</label>
              <input
                className="input"
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              className="btn btn--primary btn--block"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Authenticating…" : "Authorize"}
            </button>
          </form>

          <div className="auth-card__footer">
            <span className="muted">No credentials?</span>{" "}
            <Link to="/register" style={{ color: "var(--primary-container)" }}>
              Request access →
            </Link>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}
