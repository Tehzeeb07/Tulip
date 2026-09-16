import { useParams, Link } from "react-router-dom";
import { BLOG_POSTS } from "../data/blogPosts";
import "./BlogPost.css";

export default function BlogPost() {
  const { slug } = useParams();
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="blogpost-page">
        <div className="blogpost-wrap">
          <p className="not-found">
            That article couldn't be found. <Link to="/blog">Back to the Journal</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="blogpost-page">
      <div className="blogpost-wrap">
        <Link to="/blog" className="back-link">← Back to the Journal</Link>

        <span className="blogpost-category">{post.category}</span>
        <h1>{post.title}</h1>
        <span className="blogpost-readtime">{post.readTime}</span>

        {post.image ? (
          <img src={post.image} alt={post.title} className="blogpost-img-real" />
        ) : (
          <div className="blogpost-img" />
        )}

        <div className="blogpost-body">
          {post.content.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>
    </div>
  );
}