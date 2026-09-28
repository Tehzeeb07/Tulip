import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import { useTheme } from "../context/ThemeContext";
import RollingTextButton from "./RollingTextButton";
import FloralQuizModal from "./FloralQuizModal";
import "./Navbar.css";

export default function Navbar() {
  const { signOut } = useAuthActions();
  const navigate = useNavigate();
  const remoteUser = useQuery(api.users.getCurrentUser);
  const localAdmin = (() => {
    try {
      return JSON.parse(localStorage.getItem("tulip_admin_session"));
    } catch {
      return null;
    }
  })();
  const user = remoteUser || localAdmin;
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [showQuizModal, setShowQuizModal] = useState(false);

  const currentPath = encodeURIComponent(location.pathname);

  const handleSignOut = async () => {
    localStorage.removeItem("tulip_admin_session");
    localStorage.removeItem("tulip_avatar");
    try {
      await signOut();
    } catch {
      // ignore
    }
    navigate("/login");
  };

  return (
    <>
      <header className="tulip-navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            <img src="/images/logo.png" alt="Tulip" style={{ height: "36px", width: "auto" }} />
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
            {user?.isAdmin && (
              <RollingTextButton
                to="/admin"
                className={`navbar-link navbar-admin-link ${location.pathname === "/admin" ? "active" : ""}`}
              >
                👑 Admin
              </RollingTextButton>
            )}
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
              <div className="navbar-user-section">
                <Link to="/profile" className="navbar-profile-btn">
                  <span className={`navbar-avatar-dot ${user.isAdmin ? "admin-dot" : ""}`}></span>
                  <span>{user.username || user.name || "My Account"}</span>
                  {user.isAdmin && <span className="navbar-admin-pill">Admin</span>}
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="navbar-logout-btn"
                  title="Sign Out of your account"
                >
                  Sign Out
                </button>
              </div>
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
