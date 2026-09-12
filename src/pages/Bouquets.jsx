import { useState } from "react";
import "./Bouquets.css";

const ALL_BOUQUETS = [
  { id: 1, name: "The Marchesa", desc: "Garden rose, ranunculus", price: 185, occasion: "Wedding" },
  { id: 2, name: "Amber Field", desc: "Dahlia, dried grasses", price: 140, occasion: "Everyday" },
  { id: 3, name: "Quiet Grove", desc: "Eucalyptus, white anemone", price: 120, occasion: "Sympathy" },
  { id: 4, name: "Vermeil", desc: "Burgundy peony, thistle", price: 210, occasion: "Wedding" },
  { id: 5, name: "Wheatlight", desc: "Sunflower, wheat, cosmos", price: 115, occasion: "Everyday" },
  { id: 6, name: "Moss & Stem", desc: "Orchid, moss, fern", price: 225, occasion: "Events" },
];

const OCCASIONS = ["All", "Wedding", "Everyday", "Sympathy", "Events"];
const PRICE_RANGES = [
  { label: "All", min: 0, max: Infinity },
  { label: "Under $150", min: 0, max: 150 },
  { label: "$150–$200", min: 150, max: 200 },
  { label: "$200+", min: 200, max: Infinity },
];

export default function Bouquets() {
  const [occasion, setOccasion] = useState("All");
  const [priceRange, setPriceRange] = useState(PRICE_RANGES[0]);

  const filtered = ALL_BOUQUETS.filter((b) => {
    const matchesOccasion = occasion === "All" || b.occasion === occasion;
    const matchesPrice = b.price >= priceRange.min && b.price <= priceRange.max;
    return matchesOccasion && matchesPrice;
  });

  return (
    <div className="bouquets-page">
      <div className="bouquets-wrap">
        <div className="bouquets-header">
          <h1>The Collection</h1>
          <p>Composed to order, restocked with the season.</p>
        </div>

        <div className="filters">
          <div className="filter-group">
            <span className="filter-label">Occasion</span>
            <div className="filter-buttons">
              {OCCASIONS.map((o) => (
                <button
                  key={o}
                  className={`filter-btn ${occasion === o ? "active" : ""}`}
                  onClick={() => setOccasion(o)}
                >
                  {o}
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
          <p className="no-results">No arrangements match those filters.</p>
        ) : (
          <div className="bouquet-grid">
            {filtered.map((b) => (
              <div className="bouquet-card" key={b.id}>
                <div className="bouquet-img" />
                <h3>{b.name}</h3>
                <div className="bouquet-meta">
                  <span>{b.desc}</span>
                  <span>${b.price}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}