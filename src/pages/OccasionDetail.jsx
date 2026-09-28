import { useParams, Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { PRODUCTS } from "../data/products";
import { OCCASIONS } from "../data/occasions";
import Navbar from "../components/Navbar";
import "./OccasionDetail.css";

export default function OccasionDetail() {
  const { slug } = useParams();
  const occasion = OCCASIONS.find((o) => o.slug === slug);
  const remoteProducts = useQuery(api.products.getProducts);
  const allProducts = remoteProducts && remoteProducts.length > 0 ? remoteProducts : PRODUCTS;

  if (!occasion) {
    return (
      <>
        <Navbar />
        <div className="occasion-detail-page">
          <div className="occasion-detail-wrap">
            <p className="not-found">
              That collection couldn't be found. <Link to="/occasions">Back to Occasions</Link>
            </p>
          </div>
        </div>
      </>
    );
  }

  const picks = allProducts.filter((p) => occasion.matches.includes(p.occasion));

  return (
    <>
      <Navbar />
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
                <div className="pick-img-wrap">
                  <img src={item.image} alt={item.name} className="pick-img" loading="lazy" />
                </div>
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
    </>
  );
}