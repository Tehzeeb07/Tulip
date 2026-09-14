import { useEffect, useRef, useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

/*
  Changes:
  - Fetch saved bouquets via api.saved.getSavedForCurrentUser()
  - Persist avatar uploads to Cloudinary, then call api.users.updateAvatar.mutate({ avatarUrl })
  - Remove Add to cart / Save buttons from product cards
  Notes:
  - Requires new Convex functions (see below): saved.getSavedForCurrentUser (query) and users.updateAvatar (mutation).
  - Requires Cloudinary env vars:
      REACT_APP_CLOUDINARY_CLOUD_NAME
      REACT_APP_CLOUDINARY_UPLOAD_PRESET
*/

export default function Profile() {
  const { signOut } = useAuthActions();
  const navigate = useNavigate();

  // existing user record (Convex query)
  const user = useQuery(api.users.getCurrentUser);

  // NEW: saved bouquets for the current user (array or undefined while loading)
  const savedBouquets = useQuery(api.saved.getSavedForCurrentUser);

  // NEW: mutation to update user's avatarUrl in Convex
  const updateAvatar = useMutation(api.users.updateAvatar);

  const [tab, setTab] = useState("about");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);
  const objectUrlRef = useRef(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const openPicker = () => inputRef.current?.click();

  // Upload flow:
  // 1. Upload file to Cloudinary (unsigned preset)
  // 2. Receive upload response (secure_url)
  // 3. Call Convex mutation to save URL on user record
  async function handleAvatarChange(e) {
    const file = e?.target?.files?.[0];
    if (!file) return;

    // show local preview while uploading
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const previewUrl = URL.createObjectURL(file);
    objectUrlRef.current = previewUrl;
    setAvatarPreview(previewUrl);

    // Upload to Cloudinary (requires env vars)
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
      // fail-safe: keep preview but surface error in console
      console.error("Cloudinary env vars missing. Set REACT_APP_CLOUDINARY_CLOUD_NAME and REACT_APP_CLOUDINARY_UPLOAD_PRESET.");
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("upload_preset", uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        throw new Error("Cloudinary upload failed");
      }

      const body = await res.json();
      const avatarUrl = body.secure_url;

      // Persist avatar URL to Convex user record
      await updateAvatar({ avatarUrl });

      // After mutation, the api.users.getCurrentUser query should update automatically.
      // Clear local preview (we prefer backend value)
      setAvatarPreview(null);
    } catch (err) {
      console.error("Avatar upload failed", err);
      // keep preview so user sees the image; optionally show UI error
    } finally {
      setUploading(false);
    }
  }

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const isLoading = user === undefined || savedBouquets === undefined;
  const initial = user?.username?.[0]?.toUpperCase() ?? "?";
  const displayName = user?.displayName ?? user?.username ?? "Your Name";

  // Use the savedBouquets length when available; fallback to 0
  const savedCount = Array.isArray(savedBouquets) ? savedBouquets.length : (user?.savedCount ?? 0);

  // Placeholder products (if you have a real products query, replace this)
  const cards = savedBouquets && savedBouquets.length > 0
    ? savedBouquets.slice(0, 6).map((b) => ({
        id: b.id,
        title: b.title ?? b.name ?? "Bouquet",
        tag: b.category ?? "Bouquet",
        price: b.price ? `$${b.price}` : b.displayPrice ?? "$—",
      }))
    : [
        { id: 1, title: "Peony Dream Bouquet", tag: "Premium", price: "$120" },
        { id: 2, title: "Romantic Blush", tag: "Classic", price: "$85" },
        { id: 3, title: "Spring Mix", tag: "Seasonal", price: "$70" },
      ];

  return (
    <div className="tulip-profile">
      {/* HERO / Banner */}
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
            aria-label="Change avatar"
            title={uploading ? "Uploading..." : "Change avatar"}
          >
            {/* Prefer persisted avatar from backend; show local preview while uploading */}
            {uploading ? (
              // while uploading, show preview if available
              avatarPreview ? (
                <img src={avatarPreview} alt="avatar preview" className="avatar-img" />
              ) : (
                <div className="avatar-fallback">{initial}</div>
              )
            ) : (
              // prefer user.avatarUrl (persisted) > avatarPreview > initial
              (user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="avatar" className="avatar-img" />
              ) : avatarPreview ? (
                <img src={avatarPreview} alt="avatar preview" className="avatar-img" />
              ) : (
                <div className="avatar-fallback">{initial}</div>
              ))
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="visually-hidden"
              onChange={handleAvatarChange}
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

      {/* Tabs */}
      <div className="tabs-wrap">
        <div className="tabs-inner">
          <nav className="tabs" aria-label="Profile sections">
            <button className={`tab ${tab === "about" ? "active" : ""}`} onClick={() => setTab("about")}>
              About
            </button>
            <button className={`tab ${tab === "products" ? "active" : ""}`} onClick={() => setTab("products")}>
              Bouquets
            </button>
          </nav>

          <div className="tab-actions">
            <button className="edit-btn">Edit Profile</button>
            {/* Rewards button left for visual parity — you can remove it if not needed */}
            <button className="coin-btn" onClick={() => null} aria-hidden>Rewards</button>
          </div>
        </div>
      </div>

      {/* Main content */}
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
                      {/* Removed Add to cart and Save buttons as requested */}
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