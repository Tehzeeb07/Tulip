import { useState, useEffect } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import "./Auth.css";

export default function Login() {
  const { signIn } = useAuthActions();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [statusNotice, setStatusNotice] = useState("");

  const user = useQuery(api.users.getCurrentUser);
  const [awaitingRoleCheck, setAwaitingRoleCheck] = useState(false);

  useEffect(() => {
    if (awaitingRoleCheck && user) {
      if (redirectParam) {
        navigate(redirectParam);
      } else if (user.isAdmin || user.role === "admin") {
        setStatusNotice("👑 Admin identity verified. Opening Studio Backoffice...");
        setTimeout(() => navigate("/admin"), 400);
      } else {
        setStatusNotice("🌸 Customer account verified. Welcome back!");
        setTimeout(() => navigate("/bouquets"), 400);
      }
    }
  }, [awaitingRoleCheck, user, redirectParam, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoggingIn(true);
    setStatusNotice("Authenticating...");

    try {
      await signIn("password", { email, password, flow: "signIn" });
      const emailLower = email.toLowerCase().trim();
      const isKnownAdminEmail = emailLower.includes("admin");

      if (redirectParam) {
        navigate(redirectParam);
      } else if (isKnownAdminEmail) {
        setStatusNotice("👑 Welcome, Administrator! Redirecting to /admin...");
        setTimeout(() => navigate("/admin"), 300);
      } else {
        setAwaitingRoleCheck(true);
      }
    } catch {
      setError("Invalid email or password.");
      setIsLoggingIn(false);
      setStatusNotice("");
    }
  };

  const signupLink = redirectParam
    ? `/signup?redirect=${encodeURIComponent(redirectParam)}`
    : "/signup";

  return (
    <div className="auth-page">
      <div className="auth-layout">
        <div className="auth-illustration">
          <img
            src="/images/auth-illustration.png"
            alt="Secure account illustration"
          />
        </div>

        <div className="auth-box">
          <div className="auth-header">
            <Link to="/" className="auth-brand" style={{ fontFamily: "Georgia, serif" }}>
              Tulip<sup className="text-[0.5em] align-super">®</sup>
            </Link>
          </div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-sub">
            Log in to manage florist inventory, place custom orders, and view studio updates.
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="name@company.com or admin@tulip.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={isLoggingIn}
              required
            />

            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={isLoggingIn}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {error && <div className="err">{error}</div>}

            {statusNotice && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  backgroundColor: statusNotice.includes("Admin")
                    ? "rgba(253, 93, 168, 0.15)"
                    : "rgba(16, 185, 129, 0.15)",
                  color: statusNotice.includes("Admin") ? "#d8317e" : "#059669",
                  marginBottom: "12px",
                  textAlign: "center",
                }}
              >
                {statusNotice}
              </div>
            )}

            <button type="submit" disabled={isLoggingIn}>
              {isLoggingIn ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="auth-switch">
            New to Tulip? <Link to={signupLink}>Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
