import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords match nahi kar rahe!");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/reset-password`, { token, password });
      setMessage(res.data.message);
      setLoading(false);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong!");
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif", padding: "20px"
    }}>
      <div style={{
        background: "white", borderRadius: "24px", padding: "48px 40px",
        width: "100%", maxWidth: "420px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "16px",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px", fontSize: "28px"
          }}>🔒</div>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "700", color: "#1a1a2e" }}>
            Reset Password
          </h1>
          <p style={{ margin: "8px 0 0", color: "#888", fontSize: "14px" }}>
            Naya password set karein
          </p>
        </div>

        {message && (
          <div style={{
            background: "#e8f5e9", border: "1px solid #a5d6a7",
            borderRadius: "10px", padding: "12px 16px",
            color: "#2e7d32", fontSize: "14px", marginBottom: "20px"
          }}>✅ {message} — Login page pe redirect ho rahe hain...</div>
        )}

        {error && (
          <div style={{
            background: "#fff0f0", border: "1px solid #ffcdd2",
            borderRadius: "10px", padding: "12px 16px",
            color: "#c62828", fontSize: "14px", marginBottom: "20px"
          }}>⚠️ {error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "18px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#444", marginBottom: "6px" }}>
              New Password
            </label>
            <input
              type="password" placeholder="Min 6 characters" value={password}
              onChange={(e) => setPassword(e.target.value)} required
              style={{
                width: "100%", padding: "12px 16px", fontSize: "14px",
                border: "2px solid #e8e8e8", borderRadius: "10px",
                outline: "none", boxSizing: "border-box"
              }}
              onFocus={(e) => e.target.style.borderColor = "#667eea"}
              onBlur={(e) => e.target.style.borderColor = "#e8e8e8"}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#444", marginBottom: "6px" }}>
              Confirm Password
            </label>
            <input
              type="password" placeholder="Dobara likho" value={confirm}
              onChange={(e) => setConfirm(e.target.value)} required
              style={{
                width: "100%", padding: "12px 16px", fontSize: "14px",
                border: "2px solid #e8e8e8", borderRadius: "10px",
                outline: "none", boxSizing: "border-box"
              }}
              onFocus={(e) => e.target.style.borderColor = "#667eea"}
              onBlur={(e) => e.target.style.borderColor = "#e8e8e8"}
            />
          </div>

          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "14px",
            background: loading ? "#aaa" : "linear-gradient(135deg, #667eea, #764ba2)",
            color: "white", border: "none", borderRadius: "10px",
            fontSize: "15px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 4px 15px rgba(102,126,234,0.4)"
          }}>
            {loading ? "Resetting..." : "Reset Password →"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;