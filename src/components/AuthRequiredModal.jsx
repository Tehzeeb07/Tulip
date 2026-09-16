import { Link, useLocation } from "react-router-dom";
import "./AuthRequiredModal.css";

export default function AuthRequiredModal({
  isOpen,
  onClose,
  title = "Account Required to Order",
  actionName = "place an order",
}) {
  const location = useLocation();
  if (!isOpen) return null;

  const currentPath = encodeURIComponent(location.pathname);

  return (
    <div className="auth-modal-backdrop" onClick={onClose}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close-btn" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="auth-modal-pill">Sign In Required</div>
        <h2 className="auth-modal-heading">{title}</h2>
        <p className="auth-modal-description">
          You are welcome to browse all arrangements as a guest. However, to {actionName}, an account is required so we can prepare your order and provide updates.
        </p>

        <div className="auth-modal-buttons">
          <Link
            to={`/login?redirect=${currentPath}`}
            className="auth-modal-btn auth-modal-btn-primary"
          >
            Log In
          </Link>
          <Link
            to={`/signup?redirect=${currentPath}`}
            className="auth-modal-btn auth-modal-btn-secondary"
          >
            Create an Account
          </Link>
        </div>

        <button className="auth-modal-dismiss-link" onClick={onClose}>
          Continue browsing the website
        </button>
      </div>
    </div>
  );
}
