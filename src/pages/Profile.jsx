import { useEffect, useRef, useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

/*
  Safe Profile component:
  - Only depends on api.users.getCurrentUser (no saved:getSavedForCurrentUser).
  - Uses user.savedIds or user.savedCount when present for the "Saved" count.
  - Keeps local avatar preview only (no upload/mutation).
  - Prevents the Convex "Could not find public function" crash.
*/

export default function Profile() {
  const { signOut } = useAuthActions();
  const navigate = useNavigate();

  // Only query the current user (must exist)
  const user = useQuery(api.users.getCurrentUser);

  const [tab, setTab] = useState("about");
  const [avatarPreview, setAvatarPreview] = useState(() => localStorage.getItem("tulip_avatar") || null);
  const inputRef = useRef(null);

  const openPicker = () => inputRef.current?.click();
  const onAvatarChange = (e) => {
    const f = e?.target?.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      localStorage.setItem("tulip_avatar", base64);
      setAvatarPreview(base64);
    };
    reader.readAsDataURL(f);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const isLoading = user === undefined;
  const initial = user?.username?.[0]?.toUpperCase() ?? "?";
  const displayName = user?.displayName ?? user?.username ?? "Your Name";

  // Safe saved count: prefer user.savedIds (array) or user.savedCount numeric; fallback to 0
  const savedCount =
    Array.isArray(user?.savedIds) ? user.savedIds.length : (typeof user?.savedCount === "number" ? user.savedCount : 0);

  // Placeholder bouquets; you can replace with an actual products query later
  const cards = [
    { id: 1, title: "Peony Dream Bouquet", tag: "Premium", price: "$120" },
    { id: 2, title: "Romantic Blush", tag: "Classic", price: "$85" },
    { id: 3, title: "Spring Mix", tag: "Seasonal", price: "$70" },
  ];

  return (
    <div className="tulip-profile">
      <div
        className="hero"
        style={{
          backgroundImage:
            `linear-gradient(180deg, rgba(240,220,235,0.25), rgba(250,240,245,0.18)), url('/banner.jpg')`,
        }}
      >
        <div className="hero-inner">
          <div
            className="avatar-hero"
            onClick={openPicker}
            onKeyDown={(e) => e.key === "Enter" && openPicker()}
            role="button"
            tabIndex={0}
            aria-label="Change avatar (preview only)"
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt="avatar preview" className="avatar-img" />
            ) : (
              (user?.avatarUrl ? <img src={user.avatarUrl} alt="avatar" className="avatar-img" /> : <div className="avatar-fallback">{initial}</div>)
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="visually-hidden"
              onChange={onAvatarChange}
            />
          </div>

          <h1 className="hero-name">{displayName}</h1>
          <div className="hero-handle">@{user?.username ?? "username"}</div>

          <ul className="hero-stats">
            <li>
              <span className="num">{savedCount}</span>
              <span className="lbl">Saved</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="tabs-wrap">
        <div className="tabs-inner">
          <nav className="tabs" aria-label="Profile sections">
            <button className={`tab ${tab === "about" ? "active" : ""}`} onClick={() => setTab("about")}>About</button>
            <button className={`tab ${tab === "products" ? "active" : ""}`} onClick={() => setTab("products")}>Bouquets</button>
          </nav>

          <div className="tab-actions">
            <button className="edit-btn">Edit Profile</button>
            <button className="coin-btn" onClick={() => null} aria-hidden>Rewards</button>
          </div>
        </div>
      </div>

      <main className="content">
        <aside className="side-card glass" aria-label="Account information">
          {isLoading ? (
            <div className="skeleton side-skel" />
          ) : (
            <>
              <div className="side-avatar">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="small avatar" />
                ) : avatarPreview ? (
                  <img src={avatarPreview} alt="small avatar preview" />
                ) : (
                  <div className="small-fallback">{initial}</div>
                )}
              </div>

              <h3 className="side-name">{displayName}</h3>
              <div className="side-handle">@{user?.username ?? "username"}</div>

              <div style={{ marginTop: 8 }}>
                <button className="edit-btn full" onClick={() => null}>Edit Profile</button>
              </div>

              <div style={{ marginTop: 8 }}>
                <button className="logout small" onClick={handleSignOut}>Log Out</button>
              </div>
            </>
          )}
        </aside>

        <section className="main-col">
          {tab === "about" && (
            <div className="glass about-panel">
              <h2 className="section-title">About</h2>
              <div className="bio">
                {user?.bio ?? "Add a short description about your shop, featured collections, or ordering details."}
              </div>

              <div className="meta-grid">
                <div>
                  <strong>Contact</strong>
                  <div>{user?.contactEmail ?? user?.email ?? "—"}</div>
                </div>
              </div>
            </div>
          )}

          {tab === "products" && (
            <div className="glass gallery-panel">
              <h2 className="section-title">Featured Bouquets</h2>
              <div className="cards-grid">
                {cards.map((c) => (
                  <article className="product-card" key={c.id}>
                    <div className="thumb" aria-hidden />
                    <div className="card-body">
                      <div className="tag">{c.tag}</div>
                      <h3 className="card-title">{c.title}</h3>
                      <div className="price">{c.price}</div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}