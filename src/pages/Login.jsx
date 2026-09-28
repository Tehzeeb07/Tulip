import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import "./Auth.css";

export default function Login() {
  const { signIn } = useAuthActions();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/bouquets";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signIn("password", { email, password, flow: "signIn" });
      navigate(redirect);
    } catch {
      setError("Invalid email or password.");
    }
  };

  const signupLink = searchParams.get("redirect")
    ? `/signup?redirect=${encodeURIComponent(searchParams.get("redirect"))}`
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
        <p className="auth-sub">Log in to place orders, save favorites, and receive order updates.</p>
        <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
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
          <button type="submit">Log in</button>
        </form>
        <p className="auth-switch">
          New to Tulip? <Link to={signupLink}>Create an account</Link>
        </p>
      </div>
    </div>
  </div>
  );
}
