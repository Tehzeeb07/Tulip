import { Link } from "react-router-dom";
import { OCCASIONS } from "../data/occasions";
import Navbar from "../components/Navbar";
import "./Occasions.css";

export default function Occasions() {
  return (
    <>
      <Navbar />
      <div className="occasions-page">
        <div className="occasions-wrap">
          <div className="occasions-header">
            <h1>Occasions & Collections</h1>
            <p>Curated arrangements for the moments that call for them.</p>
          </div>

          <div className="occasions-grid">
            {OCCASIONS.map((o) => (
              <Link to={`/occasions/${o.slug}`} className="occasion-tile" key={o.slug}>
                <div className="tile-img-wrap">
                  <img src={o.image} alt={o.name} className="tile-img" loading="lazy" />
                </div>
                <div className="tile-text">
                  <h2>{o.name}</h2>
                  <p>{o.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}