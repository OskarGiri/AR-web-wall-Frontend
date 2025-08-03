import React, { useState } from "react";
import "./Auth.css";
import wallImage from "../assets/wall.jpg";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    if (!name || !email || !password) return alert("Fill all fields!");

    try {
      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      alert(data.message);

      if (res.ok) {
        // ✅ Redirect to LoginPage after successful signup
        window.location.href = "/";
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server error during signup");
    }
  };

  return (
    <div className="auth-container">
      <img src={wallImage} alt="Wall Design" className="auth-image" />
      <div className="auth-form">
        <h2>WELCOME TO VIVID SPACE</h2>
        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button className="auth-btn" onClick={handleSignup}>Sign Up</button>

        <p>Already have an account? <a href="/">Login</a></p>
      </div>
    </div>
  );
}
