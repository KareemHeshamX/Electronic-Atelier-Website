import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import { useAtelierUi } from "../hooks/useAtelierUi";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  useAtelierUi("Register | THE DIGITAL ATELIER");

  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setSubmitting(true);
    try {
      await register({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
      });
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed");
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
              <span className="eyebrow">New operator protocol</span>
            </div>
            <h1 className="headline auth-card__title">
              Create <span style={{ color: "var(--primary-container)" }}>Identity</span>
            </h1>
            <p className="muted" style={{ margin: 0 }}>
              Register to access the Digital Atelier ecosystem
            </p>
          </div>

          <form className="auth-card__form" onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div className="field">
                <label className="label" htmlFor="firstName">First Name</label>
                <input
                  className="input"
                  id="firstName"
                  type="text"
                  placeholder="MARCUS"
                  value={form.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label className="label" htmlFor="lastName">Last Name</label>
                <input
                  className="input"
                  id="lastName"
                  type="text"
                  placeholder="VANE"
                  value={form.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="label" htmlFor="regEmail">Email Address</label>
              <input
                className="input"
                id="regEmail"
                type="email"
                placeholder="operator@atelier.com"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="regPassword">Access Key</label>
              <input
                className="input"
                id="regPassword"
                type="password"
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="confirmPassword">Confirm Access Key</label>
              <input
                className="input"
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your key"
                value={form.confirmPassword}
                onChange={(e) => updateField("confirmPassword", e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <button
              className="btn btn--primary btn--block"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Initializing…" : "Initialize Account"}
            </button>
          </form>

          <div className="auth-card__footer">
            <span className="muted">Already registered?</span>{" "}
            <Link to="/login" style={{ color: "var(--primary-container)" }}>
              Authenticate →
            </Link>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}
