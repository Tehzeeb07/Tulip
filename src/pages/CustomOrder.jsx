import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Navbar from "../components/Navbar";
import AuthRequiredModal from "../components/AuthRequiredModal";
import "./CustomOrder.css";

export default function CustomOrder() {
  const user = useQuery(api.users.getCurrentUser);
  const sendRequest = useAction(api.customOrders.sendCustomOrderRequest);
  const [form, setForm] = useState({ name: "", email: "", occasion: "Wedding", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || user.name || user.username || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mandatory authentication check
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setStatus("sending");
    try {
      await sendRequest(form);
      setStatus("sent");
      setForm({
        name: user?.name || user?.username || "",
        email: user?.email || "",
        occasion: "Wedding",
        message: "",
      });
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <>
      <Navbar />
      <div className="custom-order-page">
        <div className="custom-order-wrap">
          <h1>Custom Orders & Consultations</h1>
          <p className="subtitle">For weddings and events — bring us a mood, we'll bring the flowers.</p>

          {!user && (
            <div className="custom-order-guest-notice">
              <div className="notice-content">
                <strong>Browsing as Guest:</strong> You are welcome to prepare your consultation details. To submit your order request, you will need to log in or create an account.
              </div>
              <div className="notice-links">
                <Link to="/login?redirect=/custom-order" className="notice-btn primary">
                  Log In
                </Link>
                <Link to="/signup?redirect=/custom-order" className="notice-btn secondary">
                  Create Account
                </Link>
              </div>
            </div>
          )}

          {status === "sent" ? (
            <div className="success-box">
              Thank you — your request has been sent. We'll be in touch shortly.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <select name="occasion" value={form.occasion} onChange={handleChange}>
                <option>Wedding</option>
                <option>Event</option>
                <option>Other</option>
              </select>
              <textarea
                name="message"
                placeholder="Tell us about your event, date, and the mood you're going for."
                value={form.message}
                onChange={handleChange}
                rows={6}
                required
              />
              {status === "error" && (
                <p className="error-text">Something went wrong — please try again.</p>
              )}
              <button type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Sending..." : "Send Request"}
              </button>
            </form>
          )}
        </div>
      </div>

      <AuthRequiredModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        actionName="submit a custom order request"
      />
    </>
  );
}