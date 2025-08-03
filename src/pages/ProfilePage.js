import React, { useState } from "react";
import "./Auth.css";

export default function ProfilePage() {
  const [name, setName] = useState("oscar giri");
  const [email, setEmail] = useState("xyz@gmail.com");
  const [password, setPassword] = useState("********");

  const handleEdit = () => {
    alert("Profile update simulated (connect backend later).");
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    alert("Logged out");
    window.location.href = "/";
  };

  return (
    <div className="auth-container">
      <div className="auth-form" style={{ textAlign: "center" }}>
        <div style={{ fontSize: "50px", marginBottom: "20px" }}>👤</div>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="auth-btn" style={{ marginBottom: "10px" }} onClick={handleEdit}>
          Edit Profile
        </button>

        <button
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            background: "#f4f4f4",
            cursor: "pointer",
          }}
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
