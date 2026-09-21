import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useTheme } from "../context/ThemeContext";
import RollingTextButton from "./RollingTextButton";
import FloralQuizModal from "./FloralQuizModal";
import "./Navbar.css";

export default function Navbar() {
  const user = useQuery(api.users.getCurrentUser);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [showQuizModal, setShowQuizModal] = useState(false);

  const currentPath = encodeURIComponent(location.pathname);

  return (
    <>
      <header className="tulip-navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo" style={{ fontFamily: "Georgia, serif" }}>
            Tulip<sup className="text-[0.5em] align-super">®</sup>
          </Link>

          <nav className="navbar-links">
            <RollingTextButton
              to="/"
              className={`navbar-link ${location.pathname === "/" ? "active" : ""}`}
            >
              Home
            </RollingTextButton>
            <RollingTextButton
              to="/bouquets"
              className={`navbar-link ${location.pathname === "/bouquets" ? "active" : ""}`}
            >
              Bouquets
            </RollingTextButton>
            <RollingTextButton
              to="/accessories"
              className={`navbar-link ${location.pathname === "/accessories" ? "active" : ""}`}
            >
              Accessories
            </RollingTextButton>
            <RollingTextButton
              to="/occasions"
              className={`navbar-link ${location.pathname.startsWith("/occasions") ? "active" : ""}`}
            >
              Occasions
            </RollingTextButton>
            <RollingTextButton
              to="/custom-order"
              className={`navbar-link ${location.pathname === "/custom-order" ? "active" : ""}`}
            >
              Custom Order
            </RollingTextButton>
            <RollingTextButton
              to="/reviews"
              className={`navbar-link ${location.pathname === "/reviews" ? "active" : ""}`}
            >
              Reviews
            </RollingTextButton>
            <RollingTextButton
              to="/blog"
              className={`navbar-link ${location.pathname.startsWith("/blog") ? "active" : ""}`}
            >
              Journal
            </RollingTextButton>
          </nav>

          <div className="navbar-auth">
            <button
              type="button"
              className="navbar-quiz-btn"
              onClick={() => setShowQuizModal(true)}
              title="Find Your Arrangement (3-Question Quiz)"
            >
              <span>✨</span>
              <span>Find Match</span>
            </button>

            <button
              type="button"
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to Day Mode" : "Switch to Evening Bloom (Dark Mode)"}
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            {user ? (
              <Link to="/profile" className="navbar-profile-btn">
                <span className="navbar-avatar-dot"></span>
                {user.username || user.name || "My Account"}
              </Link>
            ) : (
              <div className="navbar-auth-buttons">
                <RollingTextButton
                  to={`/login?redirect=${currentPath}`}
                  className="navbar-login-link"
                >
                  Log In
                </RollingTextButton>
                <RollingTextButton
                  to={`/signup?redirect=${currentPath}`}
                  className="navbar-signup-btn"
                >
                  Create Account
                </RollingTextButton>
              </div>
            )}
          </div>
        </div>
      </header>

      <FloralQuizModal
        isOpen={showQuizModal}
        onClose={() => setShowQuizModal(false)}
      />
    </>
  );
}
