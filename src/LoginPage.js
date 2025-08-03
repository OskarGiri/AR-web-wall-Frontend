import React from "react";
import "./Auth.css";

function LoginPage() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <img
          src="https://via.placeholder.com/400x200" 
          alt="Room preview"
          className="auth-image"
        />
        <h2 className="auth-title">WELCOME BACK</h2>
        <input type="email" placeholder="Your Email" className="auth-input" />
        <input type="password" placeholder="Password" className="auth-input" />
        <div className="auth-forgot">Forget Password?</div>
        <button className="auth-button">Login</button>
        <div className="auth-divider">instant login</div>
        <div className="auth-social">
          <button className="google-btn">🔵 Google</button>
          <button className="fb-btn">🔹 Facebook</button>
        </div>
        <div className="auth-footer">
          Don’t have an account? <a href="/signup">Sign up</a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
