import { useState } from "react";
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

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  const favorites = [
    { id: 1, name: "The Marchesa", price: "$185" },
    { id: 2, name: "Vermeil", price: "$210" },
    { id: 3, name: "Moss & Stem", price: "$225" },
  ];

  const initial = user?.username ? user.username[0].toUpperCase() : "?";

  return (
    <div className="profile-page">
      <div className="profile-shell">
        <aside className="profile-sidebar">
          <label className="avatar-wrap">
            {avatar ? (
              <img src={avatar} alt="Profile" className="avatar-img" />
            ) : (
              <div className="avatar">{initial}</div>
            )}
            <span className="avatar-edit">Change photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: "none" }}
            />
          </label>

          <h1 className="sidebar-name">{user?.username || "Your Account"}</h1>
          <p className="sidebar-email">{user?.email || "—"}</p>

          <div className="sidebar-divider" />

          <nav className="sidebar-nav">
            <span
              className={`nav-item ${activeTab === "account" ? "active" : ""}`}
              onClick={() => setActiveTab("account")}
            >
              Account
            </span>
            <span
              className={`nav-item ${activeTab === "favorites" ? "active" : ""}`}
              onClick={() => setActiveTab("favorites")}
            >
              Favorites
            </span>
          </nav>

          <button className="signout-btn" onClick={handleSignOut}>
            Log Out
          </button>
        </aside>

        <main className="profile-main">
          {activeTab === "account" && (
            <section className="card">
              <h2>Account Details</h2>
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
            </section>
          )}

          {activeTab === "favorites" && (
            <section className="card">
              <div className="card-head">
                <h2>Saved Favorites</h2>
                <span className="count-pill">{favorites.length}</span>
              </div>

              {favorites.length === 0 ? (
                <p className="empty-state">You haven't saved any arrangements yet.</p>
              ) : (
                <div className="favorites-grid">
                  {favorites.map((item) => (
                    <div className="fav-card" key={item.id}>
                      <div className="fav-img" />
                      <div className="fav-info">
                        <h3>{item.name}</h3>
                        <span>{item.price}</span>
                      </div>
                    </div>
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