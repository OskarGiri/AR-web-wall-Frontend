import React, { useEffect } from "react";
import "./Homepage.css";
import { useNavigate } from "react-router-dom";

export default function Homepage() {
  const navigate = useNavigate();

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

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="logo">
          <h1>Vivid space</h1>
          <p>"See It. Feel It. Live It."</p>
        </div>
        <div className="profile-icon">👤</div>
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
            <span className="heart">♡</span>
          </div>
        ))}
      </div>

      {/* Bottom AR Button */}
      <button className="ar-button" onClick={() => navigate("/Arpage")}>
        🟢 Launch AR
      </button>
    </div>
  );
}

