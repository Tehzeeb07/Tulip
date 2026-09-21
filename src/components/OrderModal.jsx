import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import "./OrderModal.css";

const WAX_SEALS = [
  { id: "gold", name: "Champagne Gold", hex: "#D4AF37", border: "#B5922F" },
  { id: "burgundy", name: "Imperial Burgundy", hex: "#6B1D2F", border: "#4F1321" },
  { id: "green", name: "Forest Emerald", hex: "#1E4D2B", border: "#14371E" },
  { id: "pink", name: "Tulip Rose", hex: "#FD5DA8", border: "#D8337F" },
];

export default function OrderModal({ isOpen, onClose, product, selectedSize, user, activeImage }) {
  const createOrder = useMutation(api.orders.createOrder);
  const [notes, setNotes] = useState("");
  const [includeGiftNote, setIncludeGiftNote] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [giftMessage, setGiftMessage] = useState("");
  const [sender, setSender] = useState("");
  const [selectedSeal, setSelectedSeal] = useState(WAX_SEALS[0]);
  const [status, setStatus] = useState("idle"); // idle | placing | success | error

  useEffect(() => {
    if (user) {
      setSender(user.name || user.username || "");
    }
  }, [user]);

  if (!isOpen || !product) return null;

  const displayImage = activeImage || product.image;

  const handleConfirm = async (e) => {
    e.preventDefault();
    setStatus("placing");

    let finalNotes = notes.trim();

    if (includeGiftNote && (giftMessage.trim() || recipient.trim())) {
      const giftNoteSection = `[Handwritten Gift Card — ${selectedSeal.name} Wax Seal]\nTo: ${recipient || "You"}\n"${giftMessage}"\nWith Love: ${sender || "An Admirer"}`;
      finalNotes = finalNotes ? `${giftNoteSection}\n\nAdditional Notes: ${finalNotes}` : giftNoteSection;
    }

    try {
      await createOrder({
        productId: product.id,
        productName: product.name,
        price: product.price,
        size: selectedSize || product.sizes?.[0] || "Standard",
        notes: finalNotes || undefined,
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
    setGiftMessage("");
    setRecipient("");
    setIncludeGiftNote(false);
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
            {includeGiftNote && (
              <p className="order-success-sub">
                Our florists will hand-inscribe your card with your <strong>{selectedSeal.name}</strong> wax seal.
              </p>
            )}
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

            {/* Gift Note & Wax Seal Toggle */}
            <div className="gift-note-toggle-row">
              <label className="gift-note-checkbox-label">
                <input
                  type="checkbox"
                  checked={includeGiftNote}
                  onChange={(e) => setIncludeGiftNote(e.target.checked)}
                />
                <span>Add Complimentary Handwritten Gift Card & Wax Seal</span>
              </label>
            </div>

            {includeGiftNote && (
              <div className="gift-note-section">
                <div className="gift-note-inputs">
                  <div className="gift-input-group">
                    <label>Recipient Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Eleanor"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                    />
                  </div>

                  <div className="gift-input-group">
                    <label>Your Message</label>
                    <textarea
                      rows={3}
                      placeholder="Write your note here... It will be inscribed by hand."
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                    />
                  </div>

                  <div className="gift-input-group">
                    <label>Sign-off / Sender</label>
                    <input
                      type="text"
                      placeholder="e.g. Always, Julian"
                      value={sender}
                      onChange={(e) => setSender(e.target.value)}
                    />
                  </div>

                  {/* Wax Seal Picker */}
                  <div className="wax-seal-picker">
                    <label>Select Wax Seal Color</label>
                    <div className="wax-seals-row">
                      {WAX_SEALS.map((seal) => (
                        <button
                          key={seal.id}
                          type="button"
                          className={`wax-seal-btn ${selectedSeal.id === seal.id ? "active" : ""}`}
                          onClick={() => setSelectedSeal(seal)}
                          title={seal.name}
                        >
                          <span
                            className="wax-seal-dot"
                            style={{ backgroundColor: seal.hex, borderColor: seal.border }}
                          />
                          <span className="wax-seal-name">{seal.name.split(" ")[1] || seal.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Card Preview */}
                <div className="letterpress-preview-wrap">
                  <span className="preview-label">Live Card Preview</span>
                  <div className="letterpress-card">
                    <div
                      className="wax-seal-stamp"
                      style={{
                        backgroundColor: selectedSeal.hex,
                        boxShadow: `0 4px 12px ${selectedSeal.hex}55`,
                      }}
                      title={`${selectedSeal.name} Wax Seal`}
                    >
                      <span>T</span>
                    </div>
                    <div className="letterpress-to">
                      Dearest {recipient || "Friend"},
                    </div>
                    <div className="letterpress-body">
                      {giftMessage || "Flowers to brighten your day and remind you how much you are cherished."}
                    </div>
                    <div className="letterpress-from">
                      — {sender || "With love"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="order-field">
              <label htmlFor="order-notes">Special Instructions (optional)</label>
              <textarea
                id="order-notes"
                placeholder="Preferred pickup time or any floral allergies..."
                rows={2}
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
