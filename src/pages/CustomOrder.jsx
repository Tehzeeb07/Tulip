import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import "./CustomOrder.css";

export default function CustomOrder() {
  const sendRequest = useAction(api.customOrders.sendCustomOrderRequest);
  const [form, setForm] = useState({ name: "", email: "", occasion: "Wedding", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await sendRequest(form);
      setStatus("sent");
      setForm({ name: "", email: "", occasion: "Wedding", message: "" });
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <div className="custom-order-page">
      <div className="custom-order-wrap">
        <h1>Custom Orders & Consultations</h1>
        <p className="subtitle">For weddings and events — bring us a mood, we'll bring the flowers.</p>

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
  );
}