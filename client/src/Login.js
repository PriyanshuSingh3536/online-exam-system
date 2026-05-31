import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("name", res.data.name);
      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/student");
      }
    } catch (err) {
      setError("Invalid email or password!");
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif",
      padding: "20px"
    }}>
      <div style={{
        background: "white",
        borderRadius: "24px",
        padding: "48px 40px",
        width: "100%",
        maxWidth: "420px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)"
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "16px",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px", fontSize: "28px"
          }}>🎓</div>
          <h1 style={{ margin: 0, fontSize: "26px", fontWeight: "700", color: "#1a1a2e" }}>
            ProctorExam
          </h1>
          <p style={{ margin: "6px 0 0", color: "#888", fontSize: "14px" }}>
            Secure Online Examination Portal
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "#fff0f0", border: "1px solid #ffcdd2",
            borderRadius: "10px", padding: "12px 16px",
            color: "#c62828", fontSize: "14px", marginBottom: "20px",
            display: "flex", alignItems: "center", gap: "8px"
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "18px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#444", marginBottom: "6px" }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%", padding: "12px 16px", fontSize: "14px",
                border: "2px solid #e8e8e8", borderRadius: "10px",
                outline: "none", boxSizing: "border-box",
                transition: "border 0.2s",
                fontFamily: "'Segoe UI', sans-serif"
              }}
              onFocus={(e) => e.target.style.borderColor = "#667eea"}
              onBlur={(e) => e.target.style.borderColor = "#e8e8e8"}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#444", marginBottom: "6px" }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%", padding: "12px 16px", fontSize: "14px",
                border: "2px solid #e8e8e8", borderRadius: "10px",
                outline: "none", boxSizing: "border-box",
                fontFamily: "'Segoe UI', sans-serif"
              }}
              onFocus={(e) => e.target.style.borderColor = "#667eea"}
              onBlur={(e) => e.target.style.borderColor = "#e8e8e8"}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "14px",
              background: loading ? "#aaa" : "linear-gradient(135deg, #667eea, #764ba2)",
              color: "white", border: "none", borderRadius: "10px",
              fontSize: "15px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 15px rgba(102,126,234,0.4)",
              fontFamily: "'Segoe UI', sans-serif"
            }}
          >
            {loading ? "Logging in..." : "Login →"}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", margin: "24px 0", gap: "12px" }}>
          <div style={{ flex: 1, height: "1px", background: "#eee" }}></div>
          <span style={{ color: "#aaa", fontSize: "13px" }}>or</span>
          <div style={{ flex: 1, height: "1px", background: "#eee" }}></div>
        </div>

        <p style={{ textAlign: "center", margin: 0, fontSize: "14px", color: "#666" }}>
          Don't have an account?{" "}
          <a href="/register" style={{ color: "#667eea", fontWeight: "600", textDecoration: "none" }}>
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;