import { useState } from "react";
import "./Accessories.css";
import { Link } from "react-router-dom";

const ITEMS = [
  { id: 1, name: "Hand-blown Vase", desc: "Ceramic, amber glaze", price: 65, category: "Vessels" },
  { id: 2, name: "Linen Wrap Set", desc: "Natural linen, waxed twine", price: 22, category: "Wrapping" },
  { id: 3, name: "Candle & Bouquet Set", desc: "Soy candle, seasonal blooms", price: 95, category: "Gift Sets" },
  { id: 4, name: "Letterpress Card", desc: "Blank, hand-inked border", price: 8, category: "Cards" },
  { id: 5, name: "Ceramic Bud Vase", desc: "Matte white, small form", price: 38, category: "Vessels" },
  { id: 6, name: "Chocolate & Bloom Box", desc: "Local chocolatier pairing", price: 78, category: "Gift Sets" },
];

const CATEGORIES = ["All", "Vessels", "Wrapping", "Gift Sets", "Cards"];
const PRICE_RANGES = [
  { label: "All", min: 0, max: Infinity },
  { label: "Under $30", min: 0, max: 30 },
  { label: "$30–$70", min: 30, max: 70 },
  { label: "$70+", min: 70, max: Infinity },
];

export default function Accessories() {
  const [category, setCategory] = useState("All");
  const [priceRange, setPriceRange] = useState(PRICE_RANGES[0]);

  const filtered = ITEMS.filter((item) => {
    const matchesCategory = category === "All" || item.category === category;
    const matchesPrice = item.price >= priceRange.min && item.price <= priceRange.max;
    return matchesCategory && matchesPrice;
  });

  return (
    <div className="accessories-page">
      <div className="accessories-wrap">
        <div className="accessories-header">
          <h1>Accessories & Gifts</h1>
          <p>To complete an arrangement, or send one properly.</p>
        </div>

        <div className="filters">
          <div className="filter-group">
            <span className="filter-label">Category</span>
            <div className="filter-buttons">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  className={`filter-btn ${category === c ? "active" : ""}`}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <span className="filter-label">Price</span>
            <div className="filter-buttons">
              {PRICE_RANGES.map((p) => (
                <button
                  key={p.label}
                  className={`filter-btn ${priceRange.label === p.label ? "active" : ""}`}
                  onClick={() => setPriceRange(p)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="no-results">No items match those filters.</p>
        ) : (
          <div className="accessories-grid">
            {filtered.map((item) => (
              <div className="acc-card" key={item.id}>
                <div className="acc-img" />
                <h3>{item.name}</h3>
                <div className="acc-meta">
                  <span>{item.desc}</span>
                  <span>${item.price}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}