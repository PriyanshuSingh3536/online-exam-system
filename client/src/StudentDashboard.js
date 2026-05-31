import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attempted, setAttempted] = useState({});
  const navigate = useNavigate();

  const name = localStorage.getItem("name");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchExams();
  }, []);

  const checkAttempts = async (examList) => {
    const attemptStatus = {};
    for (const exam of examList) {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/check-attempt/${exam.id}/${userId}`);
        attemptStatus[exam.id] = res.data.attempted;
      } catch (err) {
        attemptStatus[exam.id] = false;
      }
    }
    setAttempted(attemptStatus);
  };

  const fetchExams = async () => {
    try {
     const res = await axios.get(`${process.env.REACT_APP_API_URL}/exams`);
      setExams(res.data);
      await checkAttempts(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6fb", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Navbar */}
      <div style={{
        background: "white", padding: "0 32px", height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)", position: "sticky", top: 0, zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px"
          }}>🎓</div>
          <span style={{ fontWeight: "700", fontSize: "18px", color: "#1a1a2e" }}>ProctorExam</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "50%",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: "700", fontSize: "14px"
          }}>
            {name ? name[0].toUpperCase() : "S"}
          </div>
          <span style={{ color: "#444", fontSize: "14px", fontWeight: "500" }}>{name}</span>
          <button onClick={() => navigate("/student/results")} style={{
            padding: "8px 18px", background: "#f0f0ff", color: "#667eea",
            border: "1px solid #d0d0ff", borderRadius: "8px", cursor: "pointer",
            fontSize: "13px", fontWeight: "600"
          }}>📊 My Results</button>
          <button onClick={handleLogout} style={{
            padding: "8px 18px", background: "#fff0f0", color: "#e53935",
            border: "1px solid #ffcdd2", borderRadius: "8px", cursor: "pointer",
            fontSize: "13px", fontWeight: "600"
          }}>Logout</button>
        </div>
      </div>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "40px 32px", color: "white"
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h1 style={{ margin: "0 0 8px", fontSize: "28px", fontWeight: "700" }}>
            Welcome back, {name}! 👋
          </h1>
          <p style={{ margin: 0, opacity: 0.85, fontSize: "15px" }}>
            Ready to take your exam today?
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px 32px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "32px" }}>
          {[
            { icon: "📝", label: "Available Exams", value: exams.length, color: "#667eea" },
            { icon: "✅", label: "Completed", value: Object.values(attempted).filter(Boolean).length, color: "#43a047" },
            { icon: "⏳", label: "Pending", value: Object.values(attempted).filter(v => !v).length, color: "#fb8c00" },
          ].map((stat, i) => (
            <div key={i} style={{
              background: "white", borderRadius: "16px", padding: "20px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: "16px"
            }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "12px",
                background: `${stat.color}18`, fontSize: "22px",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>{stat.icon}</div>
              <div>
                <div style={{ fontSize: "22px", fontWeight: "700", color: "#1a1a2e" }}>{stat.value}</div>
                <div style={{ fontSize: "13px", color: "#888" }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Exams List */}
        <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1a1a2e", marginBottom: "16px" }}>
          Available Exams
        </h2>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>⏳</div>
            <p style={{ color: "#888" }}>Loading exams...</p>
          </div>
        ) : exams.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", background: "white", borderRadius: "16px" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
            <p style={{ color: "#888" }}>Koi exam available nahi hai abhi.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "16px", paddingBottom: "32px" }}>
            {exams.map((exam) => (
              <div key={exam.id} style={{
                background: "white", borderRadius: "16px", padding: "24px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                border: attempted[exam.id] ? "1px solid #e8f5e9" : "1px solid #f0f0f0",
                opacity: attempted[exam.id] ? 0.85 : 1
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{
                    width: "52px", height: "52px", borderRadius: "14px",
                    background: attempted[exam.id] ? "#e8f5e9" : "linear-gradient(135deg, #667eea18, #764ba218)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px"
                  }}>
                    {attempted[exam.id] ? "✅" : "📋"}
                  </div>
                  <div>
                    <h3 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: "700", color: "#1a1a2e" }}>
                      {exam.title}
                    </h3>
                    <p style={{ margin: "0 0 8px", color: "#888", fontSize: "13px" }}>
                      {exam.description}
                    </p>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <span style={{
                        background: "#e8f5e9", color: "#2e7d32", padding: "3px 10px",
                        borderRadius: "20px", fontSize: "12px", fontWeight: "600"
                      }}>⏱ {exam.duration} min</span>
                      <span style={{
                        background: "#e3f2fd", color: "#1565c0", padding: "3px 10px",
                        borderRadius: "20px", fontSize: "12px", fontWeight: "600"
                      }}>📷 Proctored</span>
                      {attempted[exam.id] && (
                        <span style={{
                          background: "#e8f5e9", color: "#2e7d32", padding: "3px 10px",
                          borderRadius: "20px", fontSize: "12px", fontWeight: "600"
                        }}>✓ Completed</span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => !attempted[exam.id] && navigate(`/exam/${exam.id}`)}
                  style={{
                    padding: "12px 28px",
                    background: attempted[exam.id] ? "#f0f0f0" : "linear-gradient(135deg, #667eea, #764ba2)",
                    color: attempted[exam.id] ? "#999" : "white",
                    border: "none", borderRadius: "10px",
                    fontSize: "14px", fontWeight: "600",
                    cursor: attempted[exam.id] ? "not-allowed" : "pointer",
                    boxShadow: attempted[exam.id] ? "none" : "0 4px 12px rgba(102,126,234,0.3)",
                    whiteSpace: "nowrap"
                  }}
                >
                  {attempted[exam.id] ? "✓ Already Given" : "Start Exam →"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;