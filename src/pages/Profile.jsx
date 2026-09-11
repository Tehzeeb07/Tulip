import { useEffect, useRef, useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const { signOut } = useAuthActions();
  const navigate = useNavigate();
  const user = useQuery(api.users.getCurrentUser);
  const [activeTab, setActiveTab] = useState("account");
  const [avatar, setAvatar] = useState(null);
  const inputRef = useRef(null);
  const objectUrlRef = useRef(null);

  useEffect(() => {
    // cleanup previously created object URLs
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleAvatarChange = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      const url = URL.createObjectURL(file);
      objectUrlRef.current = url;
      setAvatar(url);
      // TODO: upload the file to persistent storage/backend here
    }
  };

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const handleNavKey = (key, tab) => {
    if (key === "Enter" || key === " ") {
      setActiveTab(tab);
    }
  };

  // Temporary favorites; replace with real data when available
  const favorites = [
    { id: 1, name: "The Marchesa", price: "$185" },
    { id: 2, name: "Vermeil", price: "$210" },
    { id: 3, name: "Moss & Stem", price: "$225" },
  ];

  const initial = user?.username ? user.username[0].toUpperCase() : "?";

  // Loading state while Convex query resolves
  const isLoading = user === undefined;

  return (
    <div className="profile-page">
      <div className="profile-shell">
        <aside className="profile-sidebar" aria-label="Account sidebar">
          <div
            className="avatar-wrap"
            role="button"
            tabIndex={0}
            onClick={openFilePicker}
            onKeyDown={(e) => e.key === "Enter" && openFilePicker()}
            aria-label="Change profile photo"
          >
            {avatar ? (
              <img src={avatar} alt="Profile avatar" className="avatar-img" />
            ) : (
              <div className="avatar">{initial}</div>
            )}
            <button
              type="button"
              className="avatar-edit-btn"
              onClick={openFilePicker}
              aria-label="Change photo"
            >
              Change photo
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="visually-hidden"
            />
          </div>

          {isLoading ? (
            <>
              <div className="skeleton name-skel" />
              <div className="skeleton email-skel" />
            </>
          ) : (
            <>
              <h1 className="sidebar-name">{user?.username || "Your Account"}</h1>
              <p className="sidebar-email">{user?.email || "—"}</p>
            </>
          )}

          <div className="sidebar-divider" />

          <nav className="sidebar-nav" role="navigation" aria-label="Profile sections">
            <button
              type="button"
              className={`nav-item ${activeTab === "account" ? "active" : ""}`}
              onClick={() => setActiveTab("account")}
              onKeyDown={(e) => handleNavKey(e.key, "account")}
            >
              Account
            </button>
            <button
              type="button"
              className={`nav-item ${activeTab === "favorites" ? "active" : ""}`}
              onClick={() => setActiveTab("favorites")}
              onKeyDown={(e) => handleNavKey(e.key, "favorites")}
            >
              Favorites
            </button>
          </nav>

          <button className="signout-btn" onClick={handleSignOut}>
            Log Out
          </button>
        </aside>

        <main className="profile-main">
          {activeTab === "account" && (
            <section className="card">
              <h2>Account Details</h2>

              {isLoading ? (
                <div className="detail-grid">
                  <div className="detail-item">
                    <div className="skeleton label-skel" />
                    <div className="skeleton value-skel" />
                  </div>
                  <div className="detail-item">
                    <div className="skeleton label-skel" />
                    <div className="skeleton value-skel" />
                  </div>
                </div>
              ) : (
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Username</span>
                    <span className="detail-value">{user?.username || "—"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{user?.email || "—"}</span>
                  </div>
                </div>
              )}
            </section>
          )}

          {activeTab === "favorites" && (
            <section className="card">
              <div className="card-head">
                <h2>Saved Favorites</h2>
                <span className="count-pill" aria-live="polite">
                  {favorites.length}
                </span>
              </div>

              {favorites.length === 0 ? (
                <p className="empty-state">You haven't saved any arrangements yet.</p>
              ) : (
                <div className="favorites-grid">
                  {favorites.map((item) => (
                    <article className="fav-card" key={item.id}>
                      <div
                        className="fav-img"
                        role="img"
                        aria-label={`${item.name} image placeholder`}
                      />
                      <div className="fav-info">
                        <h3>{item.name}</h3>
                        <span>{item.price}</span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}