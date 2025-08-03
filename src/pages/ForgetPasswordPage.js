import React, { useState } from "react";
import "./Auth.css";
import wallImage from "../assets/wall.jpg";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const sendOtp = async () => {
    if (!email) return alert("Enter your email first");

    try {
      const res = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      alert(data.message);
      if (res.ok) setOtpSent(true);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to send OTP");
    }
  };

  const resetPassword = async () => {
    if (!otp || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password }),
      });

      const data = await res.json();
      alert(data.message);

      if (res.ok) {
        window.location.href = "/"; // Redirect to login
      }
    } catch (err) {
      console.error(err);
      alert("❌ Failed to reset password");
    }
  };

  return (
    <div className="auth-container">
      <img src={wallImage} alt="Wall Design" className="auth-image" />
      <div className="auth-form">
        <h2>Forget Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {!otpSent && (
          <button className="auth-btn" onClick={sendOtp}>
            Send OTP
          </button>
        )}

        {otpSent && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button className="auth-btn" onClick={resetPassword}>
              Reset Password
            </button>
          </>
        )}

        <p>
          Remember your password? <a href="/">Login</a>
        </p>
      </div>
    </div>
  );
}
