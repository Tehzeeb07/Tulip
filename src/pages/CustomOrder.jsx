import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMutation, useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Navbar from "../components/Navbar";
import AuthRequiredModal from "../components/AuthRequiredModal";
import RollingTextButton from "../components/RollingTextButton";
import "./CustomOrder.css";

const FOCAL_BLOOMS = [
  {
    id: "garden-roses",
    name: "English Garden Roses",
    price: 85,
    image: "/images/products/marchesa.jpg",
    desc: "Plump, multi-petaled blooms with sweet, lingering fragrance.",
  },
  {
    id: "ranunculus",
    name: "Japanese Ranunculus",
    price: 95,
    image: "/images/products/elysian-garden.jpg",
    desc: "Delicate, tissue-thin petals layered into sculptural globes.",
  },
  {
    id: "anemones",
    name: "White Anemones",
    price: 80,
    image: "/images/products/quiet-grove.jpg",
    desc: "Paper-soft white petals surrounding velvety dark centers.",
  },
  {
    id: "dahlias",
    name: "Autumn Dahlias",
    price: 75,
    image: "/images/products/amber-field.jpg",
    desc: "Geometric perfection in warm terracotta, amber, and peach.",
  },
  {
    id: "callas",
    name: "Midnight Velvet Callas",
    price: 90,
    image: "/images/products/midnight-velvet.jpg",
    desc: "Sleek, architectural lines with dramatic deep plum tones.",
  },
];

const ACCENT_FOLIAGE = [
  {
    id: "eucalyptus",
    name: "Silver Dollar Eucalyptus",
    price: 15,
    image: "/images/products/moss-stem.jpg",
    desc: "Cool silvery-sage leaves with calming aromatic oils.",
  },
  {
    id: "wheatgrass",
    name: "Dried Wheat & Bunnytails",
    price: 12,
    image: "/images/products/wheatlight.jpg",
    desc: "Tactile golden textures that preserve beautifully.",
  },
  {
    id: "queens-lace",
    name: "Queen Anne's Lace",
    price: 14,
    image: "/images/products/white-sanctuary.jpg",
    desc: "Airy, cloud-like umbels that give bouquets poetic movement.",
  },
  {
    id: "olive-branch",
    name: "Fragrant Olive Branches",
    price: 18,
    image: "/images/products/solstice.jpg",
    desc: "Mediterranean greenery symbolizing peace and abundance.",
  },
  {
    id: "wild-heather",
    name: "Wild Heather & Seeded Stems",
    price: 16,
    image: "/images/products/wild-heath.jpg",
    desc: "Earthy, organic texture straight from alpine meadows.",
  },
];

const VESSELS_WRAPS = [
  {
    id: "linen-wrap",
    name: "French Belgian Linen Wrap",
    price: 18,
    image: "/images/products/linen-wrap-set.jpg",
    desc: "Unbleached, breathable natural linen tied with cotton cord.",
  },
  {
    id: "silk-ribbon",
    name: "Raw Silk Ribbon Duo",
    price: 15,
    image: "/images/products/raw-silk-ribbon-trio.jpg",
    desc: "Hand-torn bias cut silk ribbons trailing in blush and ivory.",
  },
  {
    id: "ceramic-vase",
    name: "Fluted Ceramic Bud Vase",
    price: 35,
    image: "/images/products/ceramic-bud-vase.jpg",
    desc: "Matte-glazed artisanal stoneware vessel ready to display.",
  },
  {
    id: "glass-pitcher",
    name: "Hand-Blown Glass Pitcher",
    price: 45,
    image: "/images/products/hand-blown-vase_2.jpg",
    desc: "Subtle fluted ribbed glass with organic wave rim.",
  },
];

export default function CustomOrder() {
  const user = useQuery(api.users.getCurrentUser);
  const sendRequest = useAction(api.customOrders.sendCustomOrderRequest);
  const createOrder = useMutation(api.orders.createOrder);

  const [activeTab, setActiveTab] = useState("builder"); // "builder" | "consultation"

  // Builder States
  const [selectedFocal, setSelectedFocal] = useState(FOCAL_BLOOMS[0]);
  const [selectedAccents, setSelectedAccents] = useState([ACCENT_FOLIAGE[0]]);
  const [selectedVessel, setSelectedVessel] = useState(VESSELS_WRAPS[0]);
  const [specialNote, setSpecialNote] = useState("");
  const [builderStatus, setBuilderStatus] = useState("idle"); // idle | placing | success | error

  // Consultation Form States
  const [form, setForm] = useState({ name: "", email: "", occasion: "Wedding", message: "" });
  const [consultStatus, setConsultStatus] = useState("idle");

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

  const toggleAccent = (accent) => {
    if (selectedAccents.some((a) => a.id === accent.id)) {
      if (selectedAccents.length > 1) {
        setSelectedAccents(selectedAccents.filter((a) => a.id !== accent.id));
      }
    } else {
      if (selectedAccents.length < 3) {
        setSelectedAccents([...selectedAccents, accent]);
      }
    }
  };

  const totalPrice =
    selectedFocal.price +
    selectedAccents.reduce((sum, a) => sum + a.price, 0) +
    selectedVessel.price;

  const handleBuilderSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setBuilderStatus("placing");
    try {
      const compositionDetails = `[Custom Bouquet Studio Order]\nFocal: ${selectedFocal.name} ($${selectedFocal.price})\nAccents: ${selectedAccents.map((a) => `${a.name} ($${a.price})`).join(", ")}\nVessel: ${selectedVessel.name} ($${selectedVessel.price})\n${specialNote ? `Notes: ${specialNote}` : ""}`;

      await createOrder({
        productId: `custom-${selectedFocal.id}`,
        productName: `Custom Atelier: ${selectedFocal.name}`,
        price: totalPrice,
        size: "Bespoke Composition",
        notes: compositionDetails,
      });

      setBuilderStatus("success");
    } catch (err) {
      console.error(err);
      setBuilderStatus("error");
    }
  };

  const handleConsultSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setConsultStatus("sending");
    try {
      await sendRequest(form);
      setConsultStatus("sent");
    } catch (err) {
      setConsultStatus("error");
    }
  };

  return (
    <>
      <Navbar />
      <div className="custom-order-page">
        <div className="custom-order-wrap">
          <div className="studio-header">
            <span className="studio-tag">Atelier & Bespoke Design</span>
            <h1>The Floral Atelier</h1>
            <p className="subtitle">
              Compose a one-of-a-kind arrangement stem-by-stem, or request a private consultation for your wedding or event.
            </p>

            {/* Mode Switcher Tabs */}
            <div className="studio-tabs">
              <button
                type="button"
                className={`studio-tab ${activeTab === "builder" ? "active" : ""}`}
                onClick={() => setActiveTab("builder")}
              >
                🌸 Interactive Bouquet Studio
              </button>
              <button
                type="button"
                className={`studio-tab ${activeTab === "consultation" ? "active" : ""}`}
                onClick={() => setActiveTab("consultation")}
              >
                💌 Event Consultation Form
              </button>
            </div>
          </div>

          {!user && (
            <div className="custom-order-guest-notice">
              <div className="notice-content">
                <strong>Studio Guest Access:</strong> You can compose your arrangement freely. To place your custom order or submit a consultation, please log in or create an account.
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

          {/* =======================================================
              TAB 1: INTERACTIVE BOUQUET STUDIO
             ======================================================= */}
          {activeTab === "builder" && (
            <div className="builder-layout">
              {builderStatus === "success" ? (
                <div className="builder-success-card">
                  <div className="success-icon-badge">✓</div>
                  <h2>Your Custom Bouquet is Confirmed!</h2>
                  <p>
                    Thank you, <strong>{user?.name || user?.username || "Flower Lover"}</strong>. Our florists will source your selected{" "}
                    <strong>{selectedFocal.name}</strong> and compose your custom arrangement on collection day.
                  </p>
                  <button
                    type="button"
                    className="builder-reset-btn"
                    onClick={() => {
                      setBuilderStatus("idle");
                      setSpecialNote("");
                    }}
                  >
                    Compose Another Arrangement
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBuilderSubmit} className="builder-form">
                  {/* STEP 1: FOCAL BLOOM */}
                  <div className="builder-section">
                    <div className="section-title-row">
                      <span className="step-num">01</span>
                      <div>
                        <h3>Select Your Focal Bloom</h3>
                        <p>The hero flower that sets the color and sculptural tone.</p>
                      </div>
                    </div>

                    <div className="options-cards-grid">
                      {FOCAL_BLOOMS.map((focal) => (
                        <div
                          key={focal.id}
                          className={`builder-card ${selectedFocal.id === focal.id ? "selected" : ""}`}
                          onClick={() => setSelectedFocal(focal)}
                        >
                          <img src={focal.image} alt={focal.name} className="builder-card-img" />
                          <div className="builder-card-content">
                            <h4>{focal.name}</h4>
                            <p>{focal.desc}</p>
                            <span className="card-price">${focal.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* STEP 2: ACCENT FOLIAGE */}
                  <div className="builder-section">
                    <div className="section-title-row">
                      <span className="step-num">02</span>
                      <div>
                        <h3>Choose Texture & Foliage (Pick 1 to 3)</h3>
                        <p>Textural botanicals that add movement and wild beauty.</p>
                      </div>
                    </div>

                    <div className="options-cards-grid">
                      {ACCENT_FOLIAGE.map((accent) => {
                        const isSelected = selectedAccents.some((a) => a.id === accent.id);
                        return (
                          <div
                            key={accent.id}
                            className={`builder-card ${isSelected ? "selected" : ""}`}
                            onClick={() => toggleAccent(accent)}
                          >
                            <img src={accent.image} alt={accent.name} className="builder-card-img" />
                            <div className="builder-card-content">
                              <h4>{accent.name}</h4>
                              <p>{accent.desc}</p>
                              <span className="card-price">+${accent.price}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* STEP 3: VESSEL & PRESENTATION */}
                  <div className="builder-section">
                    <div className="section-title-row">
                      <span className="step-num">03</span>
                      <div>
                        <h3>Vessel & Presentation</h3>
                        <p>How your arrangement will be dressed and delivered.</p>
                      </div>
                    </div>

                    <div className="options-cards-grid">
                      {VESSELS_WRAPS.map((vessel) => (
                        <div
                          key={vessel.id}
                          className={`builder-card ${selectedVessel.id === vessel.id ? "selected" : ""}`}
                          onClick={() => setSelectedVessel(vessel)}
                        >
                          <img src={vessel.image} alt={vessel.name} className="builder-card-img" />
                          <div className="builder-card-content">
                            <h4>{vessel.name}</h4>
                            <p>{vessel.desc}</p>
                            <span className="card-price">+${vessel.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* STEP 4: LIVE RECIPE & SUMMARY */}
                  <div className="recipe-summary-box">
                    <h3>Your Bespoke Recipe</h3>
                    <div className="recipe-items">
                      <div className="recipe-row">
                        <span>Focal Bloom: {selectedFocal.name}</span>
                        <span>${selectedFocal.price}</span>
                      </div>
                      {selectedAccents.map((accent) => (
                        <div key={accent.id} className="recipe-row accent-row">
                          <span>+ {accent.name}</span>
                          <span>${accent.price}</span>
                        </div>
                      ))}
                      <div className="recipe-row">
                        <span>Presentation: {selectedVessel.name}</span>
                        <span>${selectedVessel.price}</span>
                      </div>
                      <div className="recipe-divider" />
                      <div className="recipe-row total-row">
                        <span>Estimated Total</span>
                        <span className="recipe-total">${totalPrice}</span>
                      </div>
                    </div>

                    <div className="builder-notes-field">
                      <label htmlFor="builder-notes">Special Requests or Occasion Notes</label>
                      <textarea
                        id="builder-notes"
                        rows={3}
                        placeholder="e.g. Please emphasize warm peach tones, or leave stems long for a tall vase..."
                        value={specialNote}
                        onChange={(e) => setSpecialNote(e.target.value)}
                      />
                    </div>

                    {builderStatus === "error" && (
                      <p className="error-text">Unable to place custom order. Please try again.</p>
                    )}

                    <button
                      type="submit"
                      className="builder-order-btn"
                      disabled={builderStatus === "placing"}
                    >
                      {builderStatus === "placing" ? "Composing Order..." : `Order Custom Bouquet — $${totalPrice}`}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* =======================================================
              TAB 2: EVENT CONSULTATION FORM
             ======================================================= */}
          {activeTab === "consultation" && (
            <div className="consultation-layout">
              {consultStatus === "sent" ? (
                <div className="success-box">
                  Thank you — your consultation request has been received. Our floral director will be in touch within 24 hours.
                </div>
              ) : (
                <form onSubmit={handleConsultSubmit}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                  <select
                    name="occasion"
                    value={form.occasion}
                    onChange={(e) => setForm({ ...form, occasion: e.target.value })}
                  >
                    <option>Wedding</option>
                    <option>Private Dinner / Event</option>
                    <option>Editorial / Commercial</option>
                    <option>Other Bespoke Inquiry</option>
                  </select>
                  <textarea
                    name="message"
                    placeholder="Tell us about your event date, venue, guest count, and visual mood..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={6}
                    required
                  />
                  {consultStatus === "error" && (
                    <p className="error-text">Something went wrong — please try again.</p>
                  )}
                  <button type="submit" disabled={consultStatus === "sending"}>
                    {consultStatus === "sending" ? "Sending Request..." : "Send Consultation Request"}
                  </button>
                </form>
              )}
            </div>
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