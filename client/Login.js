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
      if (res.data.role === "admin") navigate("/admin");
      else navigate("/student");
    } catch (err) {
      setError("Invalid email or password!");
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Left - Login Form */}
      <div style={{
        width: "480px", minWidth: "480px",
        display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "60px 56px",
        background: "#fff"
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "48px" }}>
          <div style={{
            width: "44px", height: "44px", borderRadius: "12px",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "22px"
          }}>🎓</div>
          <div>
            <div style={{ fontWeight: "800", fontSize: "18px", color: "#1a1a2e", letterSpacing: "-0.3px" }}>ProctorExam</div>
            <div style={{ fontSize: "12px", color: "#888" }}>Secure Examination Portal</div>
          </div>
        </div>

        <h2 style={{ margin: "0 0 6px", fontSize: "28px", fontWeight: "800", color: "#1a1a2e" }}>
          Welcome back
        </h2>
        <p style={{ margin: "0 0 32px", color: "#888", fontSize: "14px" }}>
          Sign in to continue to ProctorExam
        </p>

        {error && (
          <div style={{
            background: "#fff0f0", border: "1px solid #ffcdd2",
            borderRadius: "10px", padding: "12px 16px",
            color: "#c62828", fontSize: "13px", marginBottom: "20px"
          }}>⚠️ {error}</div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "18px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#555", marginBottom: "7px" }}>
              Email Address
            </label>
            <input
              type="email" placeholder="you@example.com" value={email}
              onChange={(e) => setEmail(e.target.value)} required
              style={{
                width: "100%", padding: "13px 16px", fontSize: "14px",
                border: "1.5px solid #e8e8e8", borderRadius: "10px",
                outline: "none", boxSizing: "border-box", background: "#fafafa"
              }}
              onFocus={(e) => { e.target.style.borderColor = "#667eea"; e.target.style.background = "#fff"; }}
              onBlur={(e) => { e.target.style.borderColor = "#e8e8e8"; e.target.style.background = "#fafafa"; }}
            />
          </div>

          <div style={{ marginBottom: "28px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#555", marginBottom: "7px" }}>
              Password
            </label>
            <input
              type="password" placeholder="Enter your password" value={password}
              onChange={(e) => setPassword(e.target.value)} required
              style={{
                width: "100%", padding: "13px 16px", fontSize: "14px",
                border: "1.5px solid #e8e8e8", borderRadius: "10px",
                outline: "none", boxSizing: "border-box", background: "#fafafa"
              }}
              onFocus={(e) => { e.target.style.borderColor = "#667eea"; e.target.style.background = "#fff"; }}
              onBlur={(e) => { e.target.style.borderColor = "#e8e8e8"; e.target.style.background = "#fafafa"; }}
            />
          </div>

          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "14px",
            background: loading ? "#aaa" : "linear-gradient(135deg, #667eea, #764ba2)",
            color: "white", border: "none", borderRadius: "10px",
            fontSize: "15px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 4px 15px rgba(102,126,234,0.3)"
          }}>
            {loading ? "Signing in..." : "Login →"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "#888" }}>
          Don't have an account?{" "}
          <a href="/register" style={{ color: "#667eea", fontWeight: "700", textDecoration: "none" }}>
            Register here
          </a>
        </p>
      </div>

      {/* Right - Welcome Panel */}
      <div style={{
        flex: 1,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex", flexDirection: "column",
        alignItems: "flex-start", justifyContent: "center",
        padding: "60px 64px", color: "white"
      }}>
        <h1 style={{ margin: "0 0 20px", fontSize: "48px", fontWeight: "800", lineHeight: "1.2", letterSpacing: "-1px" }}>
          Welcome to<br />ProctorExam
        </h1>
        <p style={{ margin: "0 0 48px", fontSize: "16px", opacity: 0.85, lineHeight: "1.7", maxWidth: "420px" }}>
          A secure and intelligent online examination platform with AI-powered proctoring to ensure fair and transparent assessments.
        </p>

        {[
          { icon: "🤖", text: "AI Face Detection Proctoring" },
          { icon: "🔒", text: "Secure JWT Authentication" },
          { icon: "📊", text: "Instant Results & Analytics" },
          { icon: "📷", text: "Real-time Violation Detection" },
        ].map((f, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: "14px",
            marginBottom: "16px"
          }}>
            <span style={{ fontSize: "20px" }}>{f.icon}</span>
            <span style={{ fontSize: "15px", opacity: 0.9, fontWeight: "500" }}>{f.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Login;