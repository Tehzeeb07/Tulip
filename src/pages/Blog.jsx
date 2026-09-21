import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { BLOG_POSTS } from "../data/blogPosts";
import { CARE_SHORTS } from "../data/careShorts";
import "./Blog.css";

const CARE_TIMELINE = [
  {
    id: "day-1-2",
    range: "Day 1–2",
    title: "The Foundation Cut",
    icon: "✂️",
    badge: "Immediate Care",
    summary: "The first 48 hours determine the lifespan of your arrangement.",
    tasks: [
      "Trim 1-2 inches off every stem at a sharp 45° angle under cool running water.",
      "Dissolve half of the flower food packet in clean, room-temperature water.",
      "Position in a cool room away from direct afternoon sun or heating drafts.",
    ],
  },
  {
    id: "day-3-4",
    range: "Day 3–4",
    title: "Water Refresh & Vase Wash",
    icon: "💧",
    badge: "Bacteria Prevention",
    summary: "Rinse the vase thoroughly instead of merely topping it off.",
    tasks: [
      "Dump out old water completely and wash the vase with gentle soap to eliminate bacteria.",
      "Remove any submerged foliage or leaves that have slipped below the waterline.",
      "Give every stem a fresh 1/2-inch diagonal trim to reopen water channels.",
    ],
  },
  {
    id: "day-5-6",
    range: "Day 5–6",
    title: "Petal Pruning & Distance Check",
    icon: "🥀",
    badge: "Ethylene Guard",
    summary: "Help healthy blooms thrive by plucking spent outer petals.",
    tasks: [
      "Gently remove tired outer guard petals from roses and dahlias.",
      "Ensure the arrangement is at least 3 feet away from fruit bowls (apples & bananas release ethylene gas that triggers wilting).",
      "Top up with cool, crisp water.",
    ],
  },
  {
    id: "day-7-8",
    range: "Day 7–8",
    title: "The Longevity Revival",
    icon: "🌿",
    badge: "Second Bloom",
    summary: "Extend the life of your hardiest focal and textural stems.",
    tasks: [
      "Add the second half of the floral preservative packet.",
      "Move the vase to a cool location or entryway during the night.",
      "Woody stems like eucalyptus and olive branches can be gently recut at the base for deeper drinking.",
    ],
  },
  {
    id: "day-10",
    range: "Day 10+",
    title: "Preservation & Botanical Pressing",
    icon: "📖",
    badge: "Everlasting Memory",
    summary: "Transform your bouquet into enduring botanical keepsakes.",
    tasks: [
      "Separate long-lasting stems: Eucalyptus, Wheatgrass, Heather, and Strawflowers.",
      "Tie stems in small bunches with twine and hang upside down in a dark, dry closet for 2 weeks.",
      "Press delicate petals (anemones, ranunculus) inside our Botanical Flower Press for framing.",
    ],
  },
];

export default function Blog() {
  const [activeShort, setActiveShort] = useState(null);
  const [selectedPhase, setSelectedPhase] = useState(CARE_TIMELINE[0]);

  return (
    <>
      <Navbar />
      <div className="blog-page">
        <div className="blog-wrap">
          <div className="blog-header">
            <span className="journal-tag">Flower Care & Styling Journal</span>
            <h1>Flower Care Journal</h1>
            <p>Care tips, styling notes, and seasonal guidance from the studio.</p>
          </div>

          {/* =======================================================
              INTERACTIVE FLOWER CARE TIMELINE GENERATOR
             ======================================================= */}
          <div className="care-timeline-section">
            <div className="timeline-header-row">
              <div>
                <span className="timeline-badge">Interactive Care Guide</span>
                <h2 className="timeline-title">Bouquet Care Timeline</h2>
                <p className="timeline-subtitle">
                  Select how long you've had your bouquet to view today's custom care checklist:
                </p>
              </div>
            </div>

            {/* Timeline Phase Selector Tabs */}
            <div className="timeline-tabs-row">
              {CARE_TIMELINE.map((phase) => (
                <button
                  key={phase.id}
                  type="button"
                  className={`timeline-tab-btn ${selectedPhase.id === phase.id ? "active" : ""}`}
                  onClick={() => setSelectedPhase(phase)}
                >
                  <span className="tab-icon">{phase.icon}</span>
                  <span className="tab-range">{phase.range}</span>
                </button>
              ))}
            </div>

            {/* Active Phase Interactive Card */}
            <div className="timeline-detail-card">
              <div className="timeline-detail-header">
                <div className="detail-icon-circle">{selectedPhase.icon}</div>
                <div>
                  <div className="detail-badge">{selectedPhase.badge}</div>
                  <h3 className="detail-phase-title">{selectedPhase.range} — {selectedPhase.title}</h3>
                  <p className="detail-phase-summary">{selectedPhase.summary}</p>
                </div>
              </div>

              <div className="detail-tasks-list">
                <h4>Today's Action Checklist</h4>
                <ul>
                  {selectedPhase.tasks.map((task, i) => (
                    <li key={i}>
                      <span className="check-bullet">✓</span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* QUICK CARE CLIPS */}
          <div className="shorts-section">
            <span className="shorts-label">Quick Care Clips</span>
            <div className="shorts-row">
              {CARE_SHORTS.map((short) => (
                <div
                  className="short-card"
                  key={short.id}
                  onClick={() => setActiveShort(short)}
                >
                  <div
                    className="short-thumb"
                    style={short.image ? { backgroundImage: `url(${short.image})` } : undefined}
                  >
                    <span className="play-icon">▶</span>
                  </div>
                  <h4>{short.title}</h4>
                  <span className="short-duration">{short.duration}</span>
                </div>
              ))}
            </div>
          </div>

          {activeShort && (
            <div className="short-modal" onClick={() => setActiveShort(null)}>
              <div className="short-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={() => setActiveShort(null)}>✕</button>
                {activeShort.videoUrl ? (
                  <iframe
                    src={`${activeShort.videoUrl}?autoplay=1&mute=1`}
                    className="short-video"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title={activeShort.title}
                  />
                ) : (
                  <div className="short-placeholder">
                    <p>Video coming soon: {activeShort.title}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* EDITORIAL ARTICLES GRID */}
          <div className="blog-grid">
            {BLOG_POSTS.map((post) => (
              <Link to={`/blog/${post.slug}`} className="blog-card" key={post.slug}>
                {post.image ? (
                  <img src={post.image} alt={post.title} className="blog-img-real" />
                ) : (
                  <div className="blog-img" />
                )}
                <span className="blog-category">{post.category}</span>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
                <span className="blog-readtime">{post.readTime}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}