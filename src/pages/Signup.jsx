import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

export default function Signup() {
  const { signIn } = useAuthActions();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    try {
      await signIn("password", {
        email,
        password,
        username,
        flow: "signUp",
      });
      navigate("/home");
    } catch (err) {
      setError("Something went wrong. Try a different email.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h1>Create an account</h1>
        <p className="auth-sub">Free to join — no purchases happen here, just save what you love.</p>
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
          <input
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className="err">{error}</div>}
          <button type="submit">Create account</button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}