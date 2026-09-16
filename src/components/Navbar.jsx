import { Link, useLocation } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import "./Navbar.css";

export default function Navbar() {
  const user = useQuery(api.users.getCurrentUser);
  const location = useLocation();

  const currentPath = encodeURIComponent(location.pathname);

  return (
    <header className="tulip-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" style={{ fontFamily: "Georgia, serif" }}>
          Tulip<sup className="text-[0.5em] align-super">®</sup>
        </Link>

        <nav className="navbar-links">
          <Link
            to="/"
            className={`navbar-link ${location.pathname === "/" ? "active" : ""}`}
          >
            Home
          </Link>
          <Link
            to="/bouquets"
            className={`navbar-link ${location.pathname === "/bouquets" ? "active" : ""}`}
          >
            Bouquets
          </Link>
          <Link
            to="/accessories"
            className={`navbar-link ${location.pathname === "/accessories" ? "active" : ""}`}
          >
            Accessories
          </Link>
          <Link
            to="/occasions"
            className={`navbar-link ${location.pathname.startsWith("/occasions") ? "active" : ""}`}
          >
            Occasions
          </Link>
          <Link
            to="/custom-order"
            className={`navbar-link ${location.pathname === "/custom-order" ? "active" : ""}`}
          >
            Custom Order
          </Link>
          <Link
            to="/reviews"
            className={`navbar-link ${location.pathname === "/reviews" ? "active" : ""}`}
          >
            Reviews
          </Link>
          <Link
            to="/blog"
            className={`navbar-link ${location.pathname.startsWith("/blog") ? "active" : ""}`}
          >
            Journal
          </Link>
        </nav>

        <div className="navbar-auth">
          {user ? (
            <Link to="/profile" className="navbar-profile-btn">
              <span className="navbar-avatar-dot"></span>
              {user.username || user.name || "My Account"}
            </Link>
          ) : (
            <div className="navbar-auth-buttons">
              <Link
                to={`/login?redirect=${currentPath}`}
                className="navbar-login-link"
              >
                Log In
              </Link>
              <Link
                to={`/signup?redirect=${currentPath}`}
                className="navbar-signup-btn"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
