import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Navbar from "../components/Navbar";
import WriteReviewModal from "../components/WriteReviewModal";
import AuthRequiredModal from "../components/AuthRequiredModal";
import RollingTextButton from "../components/RollingTextButton";
import "./Reviews.css";

const SEED_REVIEWS = [
  {
    _id: "seed-1",
    userName: "Amara O.",
    occasion: "Wedding",
    rating: 5,
    quote: "The arrangements looked like they belonged in a magazine, not a wedding budget. Every guest asked where the flowers came from.",
    images: [
      "/images/products/marchesa.jpg",
      "/images/products/marchesa_2.jpg",
    ],
  },
  {
    _id: "seed-2",
    userName: "Daniel K.",
    occasion: "Anniversary",
    rating: 5,
    quote: "I've ordered from a lot of florists over the years — this was the first time the bouquet actually matched the photo.",
    images: [
      "/images/products/amber-field.jpg",
    ],
  },
  {
    _id: "seed-3",
    userName: "Priya S.",
    occasion: "Sympathy",
    rating: 5,
    quote: "Quiet, tasteful, exactly what the moment called for. They asked thoughtful questions before making any recommendations.",
    images: [
      "/images/products/quiet-grove.jpg",
    ],
  },
  {
    _id: "seed-4",
    userName: "Marcus T.",
    occasion: "Corporate Event",
    rating: 4,
    quote: "Handled a last-minute order for 40 centerpieces without missing a beat. Would book again for any event.",
    images: [
      "/images/products/moss-stem.jpg",
    ],
  },
  {
    _id: "seed-5",
    userName: "Elena R.",
    occasion: "Everyday",
    rating: 5,
    quote: "I don't wait for occasions anymore — the Wheatlight arrangement lasted almost two weeks on my kitchen table.",
    images: [
      "/images/products/wheatlight.jpg",
    ],
  },
  {
    _id: "seed-6",
    userName: "James H.",
    occasion: "Birthday",
    rating: 5,
    quote: "Composed exactly to what I described over the phone. Felt like working with a real florist, not ordering off a catalogue.",
    images: [
      "/images/products/vermeil.jpg",
    ],
  },
];

function Stars({ count }) {
  return (
    <div className="stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < count ? "star filled" : "star"}>★</span>
      ))}
    </div>
  );
}

export default function Reviews() {
  const user = useQuery(api.users.getCurrentUser);
  const userReviews = useQuery(api.reviews.getReviews) || [];
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // User submitted reviews appear first, followed by curated seed reviews
  const allReviews = [...userReviews, ...SEED_REVIEWS];

  const handlePostReviewClick = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      setShowWriteModal(true);
    }
  };

  return (
    <>
      <Navbar />
      <div className="reviews-page">
        <div className="reviews-wrap">
          <div className="reviews-header-container">
            <div className="reviews-header">
              <h1>Reviews & Testimonials</h1>
              <p>What people say after collecting their arrangement.</p>
            </div>
            <RollingTextButton
              onClick={handlePostReviewClick}
              className="write-review-btn"
            >
              + Post a Review
            </RollingTextButton>
          </div>

          <div className="reviews-grid">
            {allReviews.map((r) => (
              <div className="review-card" key={r._id || r.id}>
                <div className="review-card-top">
                  <Stars count={r.rating} />
                  {r.createdAt && (
                    <span className="review-date">
                      {new Date(r.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  )}
                </div>

                <p className="quote">"{r.quote}"</p>

                {/* Uploaded Photos Gallery */}
                {r.images && r.images.length > 0 && (
                  <div className="review-photos-grid">
                    {r.images.map((img, i) => (
                      <button
                        type="button"
                        key={i}
                        className="review-photo-btn"
                        onClick={() => setSelectedPhoto(img)}
                        title="Click to view full photo"
                      >
                        <img src={img} alt={`${r.userName}'s flowers photo ${i + 1}`} />
                      </button>
                    ))}
                  </div>
                )}

                <div className="review-footer">
                  <div className="review-author-wrap">
                    <span className="review-name">{r.userName || r.name}</span>
                    {r.userId && <span className="verified-badge">✓ Verified Buyer</span>}
                  </div>
                  <span className="review-occasion">{r.occasion}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AuthRequiredModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        actionName="post a review"
      />

      <WriteReviewModal
        isOpen={showWriteModal}
        onClose={() => setShowWriteModal(false)}
        user={user}
      />

      {/* Lightbox Preview */}
      {selectedPhoto && (
        <div className="lightbox-backdrop" onClick={() => setSelectedPhoto(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox-close"
              onClick={() => setSelectedPhoto(null)}
              aria-label="Close photo"
            >
              ×
            </button>
            <img src={selectedPhoto} alt="Customer floral arrangement" className="lightbox-img" />
          </div>
        </div>
      )}
    </>
  );
}