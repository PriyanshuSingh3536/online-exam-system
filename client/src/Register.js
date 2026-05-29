import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5050/register", { name, email, password, role });
      navigate("/");
    } catch (err) {
      setError("Registration failed! Email already exists.");
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
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "16px",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px", fontSize: "28px"
          }}>🎓</div>
          <h1 style={{ margin: 0, fontSize: "26px", fontWeight: "700", color: "#1a1a2e" }}>
            Create Account
          </h1>
          <p style={{ margin: "6px 0 0", color: "#888", fontSize: "14px" }}>
            Join ProctorExam today
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "#fff0f0", border: "1px solid #ffcdd2",
            borderRadius: "10px", padding: "12px 16px",
            color: "#c62828", fontSize: "14px", marginBottom: "20px"
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#444", marginBottom: "6px" }}>
              Full Name
            </label>
            <input
              type="text" placeholder="Priyanshu Singh" value={name}
              onChange={(e) => setName(e.target.value)} required
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

          <div style={{ marginBottom: "16px" }}>
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
                fontFamily: "'Segoe UI', sans-serif"
              }}
              onFocus={(e) => e.target.style.borderColor = "#667eea"}
              onBlur={(e) => e.target.style.borderColor = "#e8e8e8"}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#444", marginBottom: "6px" }}>
              Password
            </label>
            <input
              type="password" placeholder="Min 6 characters" value={password}
              onChange={(e) => setPassword(e.target.value)} required
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

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#444", marginBottom: "6px" }}>
              I am a
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              <div
                onClick={() => setRole("student")}
                style={{
                  flex: 1, padding: "12px", borderRadius: "10px", cursor: "pointer", textAlign: "center",
                  border: `2px solid ${role === "student" ? "#667eea" : "#e8e8e8"}`,
                  background: role === "student" ? "#f0f0ff" : "white",
                  color: role === "student" ? "#667eea" : "#666",
                  fontWeight: "600", fontSize: "14px", transition: "all 0.2s"
                }}
              >
                👨‍🎓 Student
              </div>
              <div
                onClick={() => setRole("admin")}
                style={{
                  flex: 1, padding: "12px", borderRadius: "10px", cursor: "pointer", textAlign: "center",
                  border: `2px solid ${role === "admin" ? "#667eea" : "#e8e8e8"}`,
                  background: role === "admin" ? "#f0f0ff" : "white",
                  color: role === "admin" ? "#667eea" : "#666",
                  fontWeight: "600", fontSize: "14px", transition: "all 0.2s"
                }}
              >
                👨‍💼 Admin
              </div>
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            style={{
              width: "100%", padding: "14px",
              background: loading ? "#aaa" : "linear-gradient(135deg, #667eea, #764ba2)",
              color: "white", border: "none", borderRadius: "10px",
              fontSize: "15px", fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 15px rgba(102,126,234,0.4)",
              fontFamily: "'Segoe UI', sans-serif"
            }}
          >
            {loading ? "Creating account..." : "Create Account →"}
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", margin: "24px 0", gap: "12px" }}>
          <div style={{ flex: 1, height: "1px", background: "#eee" }}></div>
          <span style={{ color: "#aaa", fontSize: "13px" }}>or</span>
          <div style={{ flex: 1, height: "1px", background: "#eee" }}></div>
        </div>

        <p style={{ textAlign: "center", margin: 0, fontSize: "14px", color: "#666" }}>
          Already have an account?{" "}
          <a href="/" style={{ color: "#667eea", fontWeight: "600", textDecoration: "none" }}>
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;