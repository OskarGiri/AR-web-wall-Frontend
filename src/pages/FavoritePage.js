import React, { useEffect, useState } from "react";

export default function FavoritePage() {
  const [favorites, setFavorites] = useState([]);
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!userEmail) return;
    fetch(`http://localhost:5000/api/favorites/${userEmail}`)
      .then((res) => res.json())
      .then((data) => setFavorites(data))
      .catch((err) => console.error("Failed to load favorites", err));
  }, [userEmail]);

  const removeFavorite = async (title, image) => {
    await fetch("http://localhost:5000/api/favorites", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userEmail, title, image }),
    });

    setFavorites((prev) => prev.filter((fav) => fav.title !== title || fav.image !== image));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Favorites ❤️</h2>
      {favorites.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px" }}>
          {favorites.map((fav, idx) => (
            <div key={idx} style={{ border: "1px solid #ccc", padding: "10px", textAlign: "center", borderRadius: "8px" }}>
              <img src={fav.image} alt={fav.title} style={{ width: "100%", borderRadius: "8px" }} />
              <p>{fav.title}</p>
              <button
                onClick={() => removeFavorite(fav.title, fav.image)}
                style={{ background: "red", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px" }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
