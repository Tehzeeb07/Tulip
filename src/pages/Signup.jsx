import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import "./Auth.css";

export default function Signup() {
  const { signIn } = useAuthActions();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/bouquets";

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const passwordIsStrong =
  password.length >= 8 &&
  /[a-z]/.test(password) &&
  /[A-Z]/.test(password) &&
  /\d/.test(password);

    if (!passwordIsStrong) {
      setError(
        "Password must be at least 8 characters and include an uppercase letter, lowercase letter, and number."
      );
      return;
    }
    try {
      await signIn("password", {
        email,
        password,
        username,
        flow: "signUp",
      });
      navigate(redirect);
    } catch {
      setError("Something went wrong. Try a different email.");
    }
  };

  const loginLink = searchParams.get("redirect")
    ? `/login?redirect=${encodeURIComponent(searchParams.get("redirect"))}`
    : "/login";

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
        <h1>Create an account</h1>
        <p className="auth-sub">Create your Tulip account to place orders, save favorites, and receive updates.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
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

            <p className="password-hint">
              Use at least 8 characters with uppercase, lowercase, and a number.
            </p>
          {error && <div className="err">{error}</div>}
          <button type="submit">Create account</button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to={loginLink}>Log in</Link>
        </p>
      </div>
    </div>
  </div>
  );
}
