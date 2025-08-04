import React, { useState, useEffect } from "react";
import "./Homepage.css";
import { useNavigate } from "react-router-dom";

export default function Homepage() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail"); // Logged-in user

   useEffect(() => {
    const needsRefresh = sessionStorage.getItem("refreshHome");
    if (needsRefresh === "true") {
      sessionStorage.removeItem("refreshHome"); // clear the flag
      window.location.reload(); // refresh once automatically
    }
  }, []);

  const categories = ["All", "Hall", "Bedroom", "Kitchen"];
  const designs = [
    { name: "Vibrant colour", image: "http://localhost:5000/textures/brick.jpg" },
    { name: "Landscape", image: "http://localhost:5000/textures/wood.jpg" },
    { name: "Light beige", image: "http://localhost:5000/textures/marble.jpg" },
    { name: "Smoky blue", image: "http://localhost:5000/textures/brick.jpg" },
  ];

  // Track hearts: Array of booleans for each card
  const [favorites, setFavorites] = useState(Array(designs.length).fill(false));

  // ✅ Load user's favorites from DB when page loads
  useEffect(() => {
    if (!userEmail) return;
    fetch(`http://localhost:5000/api/favorites/${userEmail}`)
      .then((res) => res.json())
      .then((data) => {
        const favTitles = data.map((fav) => fav.title);
        // Set hearts red for saved favorites
        setFavorites(designs.map((d) => favTitles.includes(d.name)));
      })
      .catch((err) => console.error("Failed to fetch favorites", err));
  }, [userEmail]);

  // ✅ Toggle heart + save/remove favorite in DB
  const toggleFavorite = async (index) => {
    const updated = [...favorites];
    updated[index] = !updated[index];
    setFavorites(updated);

    const design = designs[index];

    if (!userEmail) {
      alert("Please login to use favorites");
      return;
    }

    if (updated[index]) {
      // Add to favorites
      await fetch("http://localhost:5000/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail, title: design.name, image: design.image }),
      });
    } else {
      // Remove from favorites
      await fetch("http://localhost:5000/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail, title: design.name, image: design.image }),
      });
    }
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="logo">
          <h1>Vivid space</h1>
          <p>"See It. Feel It. Live It."</p>
        </div>
        <div
          className="profile-icon"
          onClick={() => navigate("/profile")}
          style={{ cursor: "pointer" }}
        >
          👤
        </div>
      </header>

      {/* Search Bar */}
      <div className="search-bar">
        <input type="text" placeholder="Search" />
      </div>

      {/* Categories */}
      <div className="category-row">
        {categories.map((cat, index) => (
          <button key={index} className={index === 0 ? "active" : ""}>
            {cat}
          </button>
        ))}
      </div>

      {/* Design Cards */}
      <div className="design-grid">
        {designs.map((item, idx) => (
          <div key={idx} className="design-card">
            <img src={item.image} alt={item.name} />
            <p>{item.name}</p>
            <span
              className="heart"
              onClick={() => toggleFavorite(idx)}
              style={{
                cursor: "pointer",
                fontSize: "20px",
                color: favorites[idx] ? "red" : "black",
              }}
            >
              {favorites[idx] ? "❤️" : "♡"}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom Buttons */}
      <button className="ar-button" onClick={() => navigate("/Arpage")}>
        🟢 Launch AR
      </button>
      <button className="Favorite" onClick={() => navigate("/favorites")}>
        ❤️ My Favorites
      </button>
    </div>
  );
}
