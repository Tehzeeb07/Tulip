import { useState } from "react";
import "./Bouquets.css";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { PRODUCTS } from "../data/products";

const BOUQUET_PRODUCTS = PRODUCTS.filter((p) => p.type === "bouquet");

const OCCASIONS = ["All", "Wedding", "Everyday", "Sympathy", "Events"];
const PRICE_RANGES = [
  { label: "All", min: 0, max: Infinity },
  { label: "Under $150", min: 0, max: 150 },
  { label: "$150–$200", min: 150, max: 200 },
  { label: "$200+", min: 200, max: Infinity },
];

function BouquetCard({ bouquet }) {
  const imageList = bouquet.images && bouquet.images.length > 0 ? bouquet.images : [bouquet.image];
  const [imgIndex, setImgIndex] = useState(0);

  const handleShuffle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((prev) => (prev + 1) % imageList.length);
  };

  return (
    <Link to={`/product/${bouquet.id}`} className="bouquet-card">
      <div className="bouquet-img-wrap">
        {imageList[imgIndex] ? (
          <img
            src={imageList[imgIndex]}
            alt={`${bouquet.name} angle ${imgIndex + 1}`}
            className="bouquet-img-real"
            key={imgIndex}
          />
        ) : (
          <div className="bouquet-img-placeholder" />
        )}

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
      <h3>{bouquet.name}</h3>
      <div className="bouquet-meta">
        <span>{bouquet.desc}</span>
        <span>${bouquet.price}</span>
      </div>
    </Link>
  );
}

export default function Bouquets() {
  const [bouquets] = useState(BOUQUET_PRODUCTS);
  const [occasion, setOccasion] = useState("All");
  const [priceRange, setPriceRange] = useState(PRICE_RANGES[0]);

  const filtered = bouquets.filter((b) => {
    const matchesOccasion = occasion === "All" || b.occasion === occasion;
    const matchesPrice = b.price >= priceRange.min && b.price <= priceRange.max;
    return matchesOccasion && matchesPrice;
  });

  return (
    <>
      <Navbar />
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
                <BouquetCard bouquet={b} key={b.id} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}