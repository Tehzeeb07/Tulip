import "./Reviews.css";

const REVIEWS = [
  {
    id: 1,
    name: "Amara O.",
    occasion: "Wedding",
    rating: 5,
    quote: "The arrangements looked like they belonged in a magazine, not a wedding budget. Every guest asked where the flowers came from.",
  },
  {
    id: 2,
    name: "Daniel K.",
    occasion: "Anniversary",
    rating: 5,
    quote: "I've ordered from a lot of florists over the years — this was the first time the bouquet actually matched the photo.",
  },
  {
    id: 3,
    name: "Priya S.",
    occasion: "Sympathy",
    rating: 5,
    quote: "Quiet, tasteful, exactly what the moment called for. They asked thoughtful questions before making any recommendations.",
  },
  {
    id: 4,
    name: "Marcus T.",
    occasion: "Corporate Event",
    rating: 4,
    quote: "Handled a last-minute order for 40 centerpieces without missing a beat. Would book again for any event.",
  },
  {
    id: 5,
    name: "Elena R.",
    occasion: "Everyday",
    rating: 5,
    quote: "I don't wait for occasions anymore — the Wheatlight arrangement lasted almost two weeks on my kitchen table.",
  },
  {
    id: 6,
    name: "James H.",
    occasion: "Birthday",
    rating: 5,
    quote: "Composed exactly to what I described over the phone. Felt like working with a real florist, not ordering off a catalogue.",
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
  return (
    <div className="reviews-page">
      <div className="reviews-wrap">
        <div className="reviews-header">
          <h1>Reviews & Testimonials</h1>
          <p>What people say after collecting their arrangement.</p>
        </div>

        <div className="reviews-grid">
          {REVIEWS.map((r) => (
            <div className="review-card" key={r.id}>
              <Stars count={r.rating} />
              <p className="quote">"{r.quote}"</p>
              <div className="review-footer">
                <span className="review-name">{r.name}</span>
                <span className="review-occasion">{r.occasion}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}