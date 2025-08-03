import React, { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import { FiArrowLeft, FiSearch } from "react-icons/fi";

function Favorites() {
  const userEmail = "test@example.com"; // Replace with logged-in user's email
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/favorites/${userEmail}`)
      .then((res) => res.json())
      .then((data) => setFavorites(data))
      .catch((err) => console.error("Error fetching favorites:", err));
  }, []);

  const removeFavorite = async (fav) => {
    await fetch("http://localhost:5000/api/favorites", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userEmail,
        title: fav.title,
        image: fav.image,
      }),
    });

    setFavorites(favorites.filter((f) => f._id !== fav._id));
  };

  return (
    <div style={{ padding: "15px", maxWidth: "1200px", margin: "auto" }}>
      {/* Top Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <FiArrowLeft size={24} onClick={() => window.history.back()} />
        <FiSearch size={24} />
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: "clamp(20px, 5vw, 36px)",
          fontWeight: "bold",
          margin: "20px 0",
        }}
      >
        Favorite
      </h1>

      {/* Favorites Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "20px",
        }}
      >
        {favorites.length === 0 ? (
          <p style={{ fontSize: "18px", opacity: 0.7 }}>No favorites yet</p>
        ) : (
          favorites.map((item) => (
            <div
              key={item._id}
              style={{
                background: "white",
                borderRadius: "15px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                overflow: "hidden",
                position: "relative",
                transition: "transform 0.2s",
              }}
            >
              <img
                src={item.image}
                alt={item.title}
                style={{ width: "100%", height: "150px", objectFit: "cover" }}
              />
              <div style={{ padding: "8px 12px" }}>
                <p style={{ margin: 0, fontSize: "16px" }}>{item.title}</p>
              </div>
              <FaHeart
                color="red"
                style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                  cursor: "pointer",
                }}
                onClick={() => removeFavorite(item)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Favorites;
