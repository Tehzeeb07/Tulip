import { Link } from "react-router-dom";
import { BLOG_POSTS } from "../data/blogPosts";
import "./Blog.css";

export default function Blog() {
  return (
    <div className="blog-page">
      <div className="blog-wrap">
        <div className="blog-header">
          <h1>Flower Care Journal</h1>
          <p>Care tips, styling notes, and seasonal guidance from the studio.</p>
        </div>

        <div className="blog-grid">
          {BLOG_POSTS.map((post) => (
            <Link to={`/blog/${post.slug}`} className="blog-card" key={post.slug}>
              <div className="blog-img" />
              <span className="blog-category">{post.category}</span>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <span className="blog-readtime">{post.readTime}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}