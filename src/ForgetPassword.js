import React, { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendOtp = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsOtpSent(true);
        setMessage("OTP sent to your email.");
      } else {
        setMessage(data.message || "Failed to send OTP.");
      }
    } catch (err) {
      setMessage("Error sending OTP");
    }
  };

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password }),
      });
      const data = await res.json();
      setMessage(data.message);

      if (res.ok) {
        // Optionally redirect to login
      }
    } catch (err) {
      setMessage("Error resetting password");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <button onClick={() => window.history.back()}>&larr;</button>
      <h2>Forget Password</h2>
      <img
        src="http://localhost:5000/textures/yourImage.jpg"
        alt="Preview"
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <input
        type="email"
        placeholder="Valid Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSendOtp}>Send OTP</button>

      {isOtpSent && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <input
            type="password"
            placeholder="Strong Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button onClick={handleResetPassword}>Login</button>
        </>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}

export default ForgotPassword;
