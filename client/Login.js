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
    <div style={{
      minHeight: "100vh",
      display: "flex",
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      {/* Left Panel */}
      <div style={{
        flex: 1,
        background: "linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 40px",
        color: "white",
      }}>
        <div style={{
          width: "72px", height: "72px", borderRadius: "20px",
          background: "linear-gradient(135deg, #667eea, #764ba2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "36px", marginBottom: "28px",
          boxShadow: "0 8px 32px rgba(102,126,234,0.4)"
        }}>🎓</div>

        <h1 style={{ margin: "0 0 12px", fontSize: "32px", fontWeight: "800", letterSpacing: "-0.5px" }}>
          ProctorExam
        </h1>
        <p style={{ margin: "0 0 48px", opacity: 0.6, fontSize: "15px", textAlign: "center" }}>
          Secure Online Examination Platform
        </p>

        {[
          { icon: "🤖", title: "AI Proctoring", desc: "Real-time face detection" },
          { icon: "🔒", title: "Secure & Safe", desc: "JWT encrypted sessions" },
          { icon: "📊", title: "Instant Results", desc: "Detailed performance reports" },
        ].map((f, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: "16px",
            marginBottom: "20px", width: "100%", maxWidth: "300px",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "14px", padding: "16px",
            border: "1px solid rgba(255,255,255,0.08)"
          }}>
            <span style={{ fontSize: "24px" }}>{f.icon}</span>
            <div>
              <div style={{ fontWeight: "700", fontSize: "14px" }}>{f.title}</div>
              <div style={{ opacity: 0.5, fontSize: "12px", marginTop: "2px" }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Right Panel - Login Form */}
      <div style={{
        width: "480px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8f9ff",
        padding: "40px",
      }}>
        <div style={{ width: "100%", maxWidth: "360px" }}>
          <h2 style={{ margin: "0 0 8px", fontSize: "26px", fontWeight: "800", color: "#1a1a2e" }}>
            Welcome back
          </h2>
          <p style={{ margin: "0 0 32px", color: "#888", fontSize: "14px" }}>
            Sign in to your account
          </p>

          {error && (
            <div style={{
              background: "#fff0f0", border: "1px solid #ffcdd2",
              borderRadius: "10px", padding: "12px 16px",
              color: "#c62828", fontSize: "14px", marginBottom: "20px"
            }}>⚠️ {error}</div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#444", marginBottom: "6px" }}>
                Email Address
              </label>
              <input
                type="email" placeholder="you@example.com" value={email}
                onChange={(e) => setEmail(e.target.value)} required
                style={{
                  width: "100%", padding: "12px 16px", fontSize: "14px",
                  border: "2px solid #e8e8e8", borderRadius: "10px",
                  outline: "none", boxSizing: "border-box",
                  background: "white", transition: "border 0.2s"
                }}
                onFocus={(e) => e.target.style.borderColor = "#667eea"}
                onBlur={(e) => e.target.style.borderColor = "#e8e8e8"}
              />
            </div>

            <div style={{ marginBottom: "28px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#444", marginBottom: "6px" }}>
                Password
              </label>
              <input
                type="password" placeholder="Enter your password" value={password}
                onChange={(e) => setPassword(e.target.value)} required
                style={{
                  width: "100%", padding: "12px 16px", fontSize: "14px",
                  border: "2px solid #e8e8e8", borderRadius: "10px",
                  outline: "none", boxSizing: "border-box",
                  background: "white"
                }}
                onFocus={(e) => e.target.style.borderColor = "#667eea"}
                onBlur={(e) => e.target.style.borderColor = "#e8e8e8"}
              />
            </div>

            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "14px",
              background: loading ? "#aaa" : "linear-gradient(135deg, #667eea, #764ba2)",
              color: "white", border: "none", borderRadius: "10px",
              fontSize: "15px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 15px rgba(102,126,234,0.35)",
              letterSpacing: "0.3px"
            }}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <span style={{ color: "#888", fontSize: "14px" }}>Don't have an account? </span>
            <a href="/register" style={{ color: "#667eea", fontWeight: "700", fontSize: "14px", textDecoration: "none" }}>
              Register here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;