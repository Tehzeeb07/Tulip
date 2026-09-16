import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import "./WriteReviewModal.css";

const OCCASIONS = [
  "Everyday",
  "Wedding",
  "Anniversary",
  "Sympathy",
  "Events",
  "Birthday",
  "Just Because",
];

// Helper to resize image client-side to keep base64 lightweight (<150KB)
function resizeImage(file, maxWidth = 900, quality = 0.82) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = readerEvent.target.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function WriteReviewModal({ isOpen, onClose, user }) {
  const createReview = useMutation(api.reviews.createReview);

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [occasion, setOccasion] = useState(OCCASIONS[0]);
  const [name, setName] = useState(user?.name || user?.username || "");
  const [quote, setQuote] = useState("");
  const [images, setImages] = useState([]);
  const [isProcessingImg, setIsProcessingImg] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState("");

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setIsProcessingImg(true);
    try {
      const resizedPromises = files.map((file) => resizeImage(file));
      const base64List = await Promise.all(resizedPromises);
      setImages((prev) => [...prev, ...base64List].slice(0, 6)); // max 6 pictures
    } catch (err) {
      console.error("Error processing images:", err);
    } finally {
      setIsProcessingImg(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quote.trim()) {
      setErrorMessage("Please write a few words about your arrangement.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      await createReview({
        userName: name.trim() || user?.name || user?.username || "Verified Customer",
        occasion,
        rating,
        quote: quote.trim(),
        images,
      });

      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMessage("Failed to post review. Please try again.");
    }
  };

  const handleClose = () => {
    setStatus("idle");
    setQuote("");
    setImages([]);
    setErrorMessage("");
    onClose();
  };

  return (
    <div className="review-modal-backdrop" onClick={handleClose}>
      <div className="review-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="review-modal-close" onClick={handleClose} aria-label="Close">
          ×
        </button>

        {status === "success" ? (
          <div className="review-success-view">
            <div className="review-success-icon">✓</div>
            <h2 className="review-modal-title">Thank You!</h2>
            <p className="review-success-msg">
              Your review and arrangement photos have been published to the community.
            </p>
            <button className="review-modal-btn-primary" onClick={handleClose}>
              View Reviews
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="review-form">
            <div className="review-modal-badge">Community Feedback</div>
            <h2 className="review-modal-title">Share Your Experience</h2>
            <p className="review-modal-desc">
              How did your arrangement look and feel in your space?
            </p>

            {/* Rating Stars */}
            <div className="form-group">
              <label className="form-label">Your Rating</label>
              <div className="star-picker">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    className={`star-btn ${star <= (hoverRating || rating) ? "active" : ""}`}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    aria-label={`${star} star`}
                  >
                    ★
                  </button>
                ))}
                <span className="star-rating-text">
                  {rating === 5 ? "Exceptional" : rating === 4 ? "Very Good" : rating === 3 ? "Good" : `${rating} Stars`}
                </span>
              </div>
            </div>

            {/* Occasion & Name in a 2-column row */}
            <div className="form-row">
              <div className="form-group flex-1">
                <label className="form-label" htmlFor="review-name">Your Name</label>
                <input
                  id="review-name"
                  type="text"
                  placeholder="e.g. Sophia L."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="review-input"
                />
              </div>

              <div className="form-group flex-1">
                <label className="form-label" htmlFor="review-occasion">Occasion</label>
                <select
                  id="review-occasion"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="review-select"
                >
                  {OCCASIONS.map((occ) => (
                    <option key={occ} value={occ}>{occ}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quote / Review Text */}
            <div className="form-group">
              <label className="form-label" htmlFor="review-quote">Your Review</label>
              <textarea
                id="review-quote"
                placeholder="Describe the freshness, flower varieties, scent, or how long the blooms lasted..."
                rows={3}
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                className="review-textarea"
                required
              />
            </div>

            {/* Upload Photos Section */}
            <div className="form-group">
              <div className="upload-header">
                <label className="form-label">Upload Photos (Optional)</label>
                <span className="upload-count">{images.length}/6 photos</span>
              </div>

              <div className="photo-upload-container">
                {images.map((imgSrc, idx) => (
                  <div className="photo-preview-item" key={idx}>
                    <img src={imgSrc} alt={`Upload preview ${idx + 1}`} />
                    <button
                      type="button"
                      className="photo-remove-btn"
                      onClick={() => handleRemoveImage(idx)}
                      title="Remove photo"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {images.length < 6 && (
                  <label className={`photo-add-box ${isProcessingImg ? "disabled" : ""}`}>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                      disabled={isProcessingImg}
                    />
                    <span className="photo-add-icon">📷</span>
                    <span className="photo-add-text">
                      {isProcessingImg ? "Processing..." : "+ Add Photo"}
                    </span>
                  </label>
                )}
              </div>
            </div>

            {errorMessage && <p className="review-error">{errorMessage}</p>}

            <button
              type="submit"
              className="review-modal-btn-primary"
              disabled={status === "submitting" || isProcessingImg}
            >
              {status === "submitting" ? "Publishing Review..." : "Publish Review"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
