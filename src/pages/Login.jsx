import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

export default function Login() {
  const { signIn } = useAuthActions();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signIn("password", { email, password, flow: "signIn" });
      navigate("/home");
    } catch {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h1>Welcome back</h1>
        <p className="auth-sub">Log in to save favorites and hear about new collections first.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className="err">{error}</div>}
          <button type="submit">Log in</button>
        </form>
        <p className="auth-switch">
          New to Tulip? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
