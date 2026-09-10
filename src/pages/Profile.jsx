import { useAuthActions } from "@convex-dev/auth/react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const { signOut } = useAuthActions();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Placeholder favorites until wishlist backend is built
  const favorites = [
    { id: 1, name: "The Marchesa", price: "$185" },
    { id: 2, name: "Vermeil", price: "$210" },
    { id: 3, name: "Moss & Stem", price: "$225" },
  ];

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div>
          <h1>Your Account</h1>
          <p className="profile-sub">Manage your details and saved favorites.</p>
        </div>
        <button className="signout-btn" onClick={handleSignOut}>
          Log Out
        </button>
      </div>

      <div className="profile-info">
        <div className="info-row">
          <span className="info-label">Username</span>
          <span className="info-value">—</span>
        </div>
        <div className="info-row">
          <span className="info-label">Email</span>
          <span className="info-value">—</span>
        </div>
      </div>

      <div className="favorites-section">
        <h2>Saved Favorites</h2>
        {favorites.length === 0 ? (
          <p className="empty-state">You haven't saved any arrangements yet.</p>
        ) : (
          <div className="favorites-grid">
            {favorites.map((item) => (
              <div className="fav-card" key={item.id}>
                <div className="fav-img" />
                <h3>{item.name}</h3>
                <span>{item.price}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}