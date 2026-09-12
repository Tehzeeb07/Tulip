import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PRODUCTS } from "../data/products";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const product = PRODUCTS.find((p) => p.id === id);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || "");

  if (!product) {
    return (
      <div className="product-page">
        <div className="product-wrap">
          <p className="not-found">
            That arrangement couldn't be found. <Link to="/bouquets">Back to the collection</Link>
          </p>
        </div>
      </div>
    );
  }

  const backLink = product.type === "accessory" ? "/accessories" : "/bouquets";
  const backLabel = product.type === "accessory" ? "Accessories & Gifts" : "The Collection";

  return (
    <div className="product-page">
      <div className="product-wrap">
        <Link to={backLink} className="back-link">← Back to {backLabel}</Link>

        <div className="product-grid">
          <div className="product-img" />

          <div className="product-info">
            <span className="product-tag">{product.occasion}</span>
            <h1>{product.name}</h1>
            <p className="product-desc">{product.desc}</p>
            <p className="product-price">${product.price}</p>

            {product.sizes && product.sizes.length > 0 && (
              <div className="size-section">
                <span className="section-label">Size</span>
                <div className="size-buttons">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`size-btn ${selectedSize === size ? "active" : ""}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="care-section">
              <span className="section-label">Care Tips</span>
              <p className="care-text">{product.careTips}</p>
            </div>

            <p className="visit-note">
              This piece is composed in-store — visit Tulip to collect your arrangement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}