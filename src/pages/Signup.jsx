// src/pages/Signup.jsx
import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const { signIn } = useAuthActions();
  const navigate = useNavigate();
  const [name, setName] = useState("");
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
      await signIn("password", { email, password, name, flow: "signUp" });
      navigate("/home");
    } catch (err) {
      setError("Something went wrong. Try a different email.");
    }
  };

  return (
    <div className="signup-page">
      <form onSubmit={handleSubmit}>
        <h1>Create an account</h1>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}