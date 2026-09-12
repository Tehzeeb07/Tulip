import { Link } from "react-router-dom";
import { OCCASIONS } from "../data/occasions";
import "./Occasions.css";

export default function Occasions() {
  return (
    <div className="occasions-page">
      <div className="occasions-wrap">
        <div className="occasions-header">
          <h1>Occasions & Collections</h1>
          <p>Curated arrangements for the moments that call for them.</p>
        </div>

        <div className="occasions-grid">
          {OCCASIONS.map((o) => (
            <Link to={`/occasions/${o.slug}`} className="occasion-tile" key={o.slug}>
              <div className={`tile-img tile-${o.slug}`} />
              <div className="tile-text">
                <h2>{o.name}</h2>
                <p>{o.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );