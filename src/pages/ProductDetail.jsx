import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PRODUCTS } from "../data/products";
import "./ProductDetail.css";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import Navbar from "../components/Navbar";
import AuthRequiredModal from "../components/AuthRequiredModal";
import OrderModal from "../components/OrderModal";

export default function ProductDetail() {
  const { id } = useParams();
  const product = PRODUCTS.find((p) => p.id === id);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || "");
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);

  const user = useQuery(api.users.getCurrentUser);
  const favorites = useQuery(api.favorites.getFavorites) || [];
  const toggleFavorite = useMutation(api.favorites.toggleFavorite);
  const isFavorited = favorites.includes(product?.id);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [authModalAction, setAuthModalAction] = useState("place an order");

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="product-page">
          <div className="product-wrap">
            <p className="not-found">
              That arrangement couldn't be found. <Link to="/bouquets">Back to the collection</Link>
            </p>
          </div>
        </div>
      </>
    );
  }

  const imageList = product.images && product.images.length > 0 ? product.images : [product.image];

  const handleShuffle = () => {
    if (imageList.length <= 1) return;
    setIsShuffling(true);
    setActiveImgIndex((prev) => (prev + 1) % imageList.length);
    setTimeout(() => setIsShuffling(false), 300);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    if (imageList.length <= 1) return;
    setActiveImgIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (imageList.length <= 1) return;
    setActiveImgIndex((prev) => (prev + 1) % imageList.length);
  };

  const handleOrderClick = () => {
    // Shuffle image when user clicks to order / add to cart!
    handleShuffle();
    if (!user) {
      setAuthModalAction("place an order");
      setShowAuthModal(true);
    } else {
      setShowOrderModal(true);
    }
  };

  const handleFavoriteClick = () => {
    if (!user) {
      setAuthModalAction("save favorites to your account");
      setShowAuthModal(true);
    } else {
      toggleFavorite({ productId: product.id });
    }
  };

  const backLink = product.type === "accessory" ? "/accessories" : "/bouquets";
  const backLabel = product.type === "accessory" ? "Accessories & Gifts" : "The Collection";

  return (
    <>
      <Navbar />
      <div className="product-page">
        <div className="product-wrap">
          <Link to={backLink} className="back-link">← Back to {backLabel}</Link>

          <div className="product-grid">
            <div className="product-gallery-col">
              <div 
                className={`product-img-wrap ${isShuffling ? "shuffling" : ""}`}
                onClick={handleShuffle}
                title={imageList.length > 1 ? "Click photo to shuffle angle" : ""}
              >
                <img
                  src={imageList[activeImgIndex]}
                  alt={`${product.name} angle ${activeImgIndex + 1}`}
                  className="product-img"
                  key={activeImgIndex}
                />

                {imageList.length > 1 && (
                  <>
                    <button 
                      type="button" 
                      className="gallery-nav-btn prev" 
                      onClick={handlePrev} 
                      aria-label="Previous image"
                    >
                      ‹
                    </button>
                    <button 
                      type="button" 
                      className="gallery-nav-btn next" 
                      onClick={handleNext} 
                      aria-label="Next image"
                    >
                      ›
                    </button>
                    <div className="gallery-shuffle-pill">
                      <span>🔀 Click to shuffle ({activeImgIndex + 1}/{imageList.length})</span>
                    </div>
                  </>
                )}
              </div>

              {imageList.length > 1 && (
                <div className="product-thumbnails">
                  {imageList.map((img, idx) => (
                    <button
                      type="button"
                      key={idx}
                      className={`thumbnail-btn ${activeImgIndex === idx ? "active" : ""}`}
                      onClick={() => setActiveImgIndex(idx)}
                      aria-label={`View photo ${idx + 1}`}
                    >
                      <img src={img} alt="" className="thumbnail-img" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="product-info">
              <span className="product-tag">{product.occasion}</span>
              <h1>{product.name}</h1>
              <p className="product-desc">{product.desc}</p>
              <p className="product-price">${product.price}</p>

              <div className="product-actions">
                <button
                  type="button"
                  className="order-btn"
                  onClick={handleOrderClick}
                >
                  Order Now — ${product.price}
                </button>
                <button
                  type="button"
                  className="save-btn"
                  onClick={handleFavoriteClick}
                >
                  {isFavorited ? "♥ Saved to Favorites" : "♡ Save to Favorites"}
                </button>
              </div>

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
                This piece is composed fresh in-store. Ordering reserves your arrangement for collection.
              </p>
            </div>
          </div>
        </div>
      </div>

      <AuthRequiredModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        actionName={authModalAction}
      />

      <OrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        product={product}
        selectedSize={selectedSize}
        user={user}
        activeImage={imageList[activeImgIndex]}
      />
    </>
  );
}