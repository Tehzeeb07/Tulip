import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { BLOG_POSTS } from "../data/blogPosts";
import { CARE_SHORTS } from "../data/careShorts";
import "./Blog.css";

export default function Blog() {
  const [activeShort, setActiveShort] = useState(null);

  return (
    <>
      <Navbar />
      <div className="blog-page">
      <div className="blog-wrap">
        <div className="blog-header">
          <h1>Flower Care Journal</h1>
          <p>Care tips, styling notes, and seasonal guidance from the studio.</p>
        </div>

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