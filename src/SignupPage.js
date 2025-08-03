import React from "react";
import "./Auth.css";

function SignupPage() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <img
          src="https://via.placeholder.com/400x200" 
          alt="Room preview"
          className="auth-image"
        />
        <h2 className="auth-title">WELCOME TO VIVIDSPACE</h2>
        <input type="text" placeholder="Full Name" className="auth-input" />
        <input type="email" placeholder="Your Email" className="auth-input" />
        <input type="password" placeholder="Password" className="auth-input" />
        <button className="auth-button">Sign Up</button>
        <div className="auth-footer">
          Already have an account? <a href="/login">Login</a>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
