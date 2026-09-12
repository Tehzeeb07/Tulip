import { Link } from "react-router-dom";
import { useState } from "react";
import { PRODUCTS } from "../data/products";
import "./Accessories.css";

const ITEMS = PRODUCTS.filter((p) => p.type === "accessory");

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
    const matchesCategory = category === "All" || item.occasion === category;
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
              <Link to={`/product/${item.id}`} className="acc-card" key={item.id}>
                <div className="acc-img" />
                <h3>{item.name}</h3>
                <div className="acc-meta">
                  <span>{item.desc}</span>
                  <span>${item.price}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}