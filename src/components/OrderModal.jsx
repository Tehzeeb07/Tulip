import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import "./OrderModal.css";

export default function OrderModal({ isOpen, onClose, product, selectedSize, user, activeImage }) {
  const createOrder = useMutation(api.orders.createOrder);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("idle"); // idle | placing | success | error

  if (!isOpen || !product) return null;

  const displayImage = activeImage || product.image;

  const handleConfirm = async (e) => {
    e.preventDefault();
    setStatus("placing");
    try {
      await createOrder({
        productId: product.id,
        productName: product.name,
        price: product.price,
        size: selectedSize || product.sizes?.[0] || "Standard",
        notes: notes.trim() || undefined,
      });
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const handleClose = () => {
    setStatus("idle");
    setNotes("");
    onClose();
  };

  return (
    <div className="order-modal-backdrop" onClick={handleClose}>
      <div className="order-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="order-modal-close" onClick={handleClose} aria-label="Close">
          ×
        </button>

        {status === "success" ? (
          <div className="order-success-view">
            <div className="order-success-icon">✓</div>
            <h2 className="order-modal-title">Order Confirmed!</h2>
            <p className="order-success-msg">
              Thank you, <strong>{user?.name || user?.username || "there"}</strong>! Your order for{" "}
              <strong>{product.name}</strong> ({selectedSize || "Standard"}) has been placed.
            </p>
            <p className="order-success-sub">
              Our florists will compose your piece fresh. We've linked this order to your account.
            </p>
            <button className="order-modal-btn-primary" onClick={handleClose}>
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleConfirm}>
            <div className="order-modal-header-row">
              <div className="order-modal-header-text">
                <div className="order-modal-badge">Direct Studio Order</div>
                <h2 className="order-modal-title">Place Your Order</h2>
                <p className="order-modal-desc">
                  Composed fresh by hand on the day of collection.
                </p>
              </div>
              {displayImage && (
                <div className="order-modal-item-preview">
                  <img src={displayImage} alt={product.name} />
                </div>
              )}
            </div>

            <div className="order-summary-box">
              <div className="order-summary-row">
                <span className="summary-label">Arrangement</span>
                <span className="summary-value">{product.name}</span>
              </div>
              <div className="order-summary-row">
                <span className="summary-label">Size</span>
                <span className="summary-value">{selectedSize || "Standard"}</span>
              </div>
              <div className="order-summary-row">
                <span className="summary-label">Ordering As</span>
                <span className="summary-value">{user?.email || user?.username}</span>
              </div>
              <div className="order-summary-divider" />
              <div className="order-summary-row total-row">
                <span>Total</span>
                <span className="total-price">${product.price}</span>
              </div>
            </div>

            <div className="order-field">
              <label htmlFor="order-notes">Gift Note or Collection Instructions (optional)</label>
              <textarea
                id="order-notes"
                placeholder="Include a message for the handwritten card, or specify your pickup day/time..."
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {status === "error" && (
              <p className="order-error">Something went wrong placing your order. Please try again.</p>
            )}

            <button
              type="submit"
              className="order-modal-btn-primary"
              disabled={status === "placing"}
            >
              {status === "placing" ? "Placing Order..." : `Confirm Order — $${product.price}`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
