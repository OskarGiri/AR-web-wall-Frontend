import React, { useState } from "react";
import "./Auth.css";
import wallImage from "../assets/wall.jpg";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) return alert("Enter email and password");

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      alert(data.message);

      if (res.ok) {
        // ✅ Save login info (for route protection if needed)
        localStorage.setItem("userEmail", email);

        // ✅ Redirect to Homepage after successful login
        window.location.href = "/home";
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server error during login");
    }
  };

  return (
    <div className="auth-container">
      <img src={wallImage} alt="Wall Design" className="auth-image" />
      <div className="auth-form">
        <h2>WELCOME BACK</h2>
        <input type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <div className="forgot-row">
          <a href="#">Forget Password?</a>
        </div>

        <button className="auth-btn" onClick={handleLogin}>Login</button>

        <p>instant login</p>
        <div className="social-login">
          <button className="google-btn">Google</button>
          <button className="fb-btn">Facebook</button>
        </div>

        <p>Don’t have an account? <a href="/signup">Sign up</a></p>
      </div>
    </div>
  );
}
