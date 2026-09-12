import { useParams, Link } from "react-router-dom";
import { PRODUCTS } from "../data/products";
import { OCCASIONS } from "../data/occasions";
import "./OccasionDetail.css";

export default function OccasionDetail() {
  const { slug } = useParams();
  const occasion = OCCASIONS.find((o) => o.slug === slug);

  if (!occasion) {
    return (
      <div className="occasion-detail-page">
        <div className="occasion-detail-wrap">
          <p className="not-found">
            That collection couldn't be found. <Link to="/occasions">Back to Occasions</Link>
          </p>
        </div>
      </div>
    );
  }

  const picks = PRODUCTS.filter((p) => occasion.matches.includes(p.occasion));

  return (
    <div className="occasion-detail-page">
      <div className="occasion-detail-wrap">
        <Link to="/occasions" className="back-link">← Back to Occasions</Link>

        <div className="occasion-detail-header">
          <h1>{occasion.name}</h1>
          <p>{occasion.tagline}</p>
        </div>

        {picks.length === 0 ? (
          <p className="no-results">No arrangements curated for this collection yet.</p>
        ) : (
          <div className="picks-grid">
            {picks.map((item) => (
              <Link to={`/product/${item.id}`} className="pick-card" key={item.id}>
                <div className="pick-img" />
                <h3>{item.name}</h3>
                <div className="pick-meta">
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