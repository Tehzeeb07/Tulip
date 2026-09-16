import { Link } from "react-router-dom";
import { useState } from "react";
import { PRODUCTS } from "../data/products";
import Navbar from "../components/Navbar";
import "./Accessories.css";

const ITEMS = PRODUCTS.filter((p) => p.type === "accessory");

const CATEGORIES = ["All", "Vessels", "Wrapping", "Gift Sets", "Cards", "Tools"];
const PRICE_RANGES = [
  { label: "All", min: 0, max: Infinity },
  { label: "Under $30", min: 0, max: 30 },
  { label: "$30–$70", min: 30, max: 70 },
  { label: "$70+", min: 70, max: Infinity },
];

function AccessoryCard({ item }) {
  const imageList = item.images && item.images.length > 0 ? item.images : [item.image];
  const [imgIndex, setImgIndex] = useState(0);

  const handleShuffle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((prev) => (prev + 1) % imageList.length);
  };

  return (
    <Link to={`/product/${item.id}`} className="acc-card">
      <div className="acc-img-wrap">
        <img
          src={imageList[imgIndex]}
          alt={`${item.name} angle ${imgIndex + 1}`}
          className="acc-img"
          loading="lazy"
          key={imgIndex}
        />

        {imageList.length > 1 && (
          <button
            type="button"
            className="card-shuffle-btn"
            onClick={handleShuffle}
            title="Click to shuffle photo angle"
            aria-label="Shuffle photo"
          >
            🔀
          </button>
        )}

        {imageList.length > 1 && (
          <div className="card-dots">
            {imageList.map((_, i) => (
              <span
                key={i}
                className={`card-dot ${imgIndex === i ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setImgIndex(i);
                }}
              />
            ))}
          </div>
        )}
      </div>
      <h3>{item.name}</h3>
      <div className="acc-meta">
        <span>{item.desc}</span>
        <span>${item.price}</span>
      </div>
    </Link>
  );
}

export default function Accessories() {
  const [category, setCategory] = useState("All");
  const [priceRange, setPriceRange] = useState(PRICE_RANGES[0]);

  const filtered = ITEMS.filter((item) => {
    const matchesCategory = category === "All" || item.occasion === category;
    const matchesPrice = item.price >= priceRange.min && item.price <= priceRange.max;
    return matchesCategory && matchesPrice;
  });

  return (
    <>
      <Navbar />
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
                <AccessoryCard item={item} key={item.id} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}