import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const name = localStorage.getItem("name");

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/exams`);
      setExams(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleDelete = async (examId) => {
    if (!window.confirm("Are you sure you want to delete this exam? All questions will also be deleted!")) return;
    try {
     await axios.delete(`${process.env.REACT_APP_API_URL}/exam/${examId}`);
      setExams(exams.filter(e => e.id !== examId));
    } catch (err) {
      alert("Delete failed!");
    }
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
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => navigate("/admin")} style={{
            padding: "8px 18px", background: "#f0f0ff", color: "#667eea",
            border: "1px solid #d0d0ff", borderRadius: "8px", cursor: "pointer",
            fontSize: "13px", fontWeight: "600"
          }}>+ Create Exam</button>
          <button onClick={() => navigate("/admin/results")} style={{
            padding: "8px 18px", background: "#f0f0ff", color: "#667eea",
            border: "1px solid #d0d0ff", borderRadius: "8px", cursor: "pointer",
            fontSize: "13px", fontWeight: "600"
          }}>📊 Results</button>
          <button onClick={() => { localStorage.clear(); navigate("/"); }} style={{
            padding: "8px 18px", background: "#fff0f0", color: "#e53935",
            border: "1px solid #ffcdd2", borderRadius: "8px", cursor: "pointer",
            fontSize: "13px", fontWeight: "600"
          }}>Logout</button>
        </div>
      </div>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "32px", color: "white"
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h1 style={{ margin: "0 0 6px", fontSize: "26px", fontWeight: "700" }}>
            📚 All Exams
          </h1>
          <p style={{ margin: 0, opacity: 0.85, fontSize: "14px" }}>
            Manage your created exams
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "32px auto", padding: "0 24px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "28px" }}>
          {[
            { icon: "📝", label: "Total Exams", value: exams.length, color: "#667eea", bg: "#f0f0ff" },
            { icon: "❓", label: "Total Questions", value: exams.reduce((a, b) => a + (b.question_count || 0), 0), color: "#43a047", bg: "#e8f5e9" },
          ].map((stat, i) => (
            <div key={i} style={{
              background: "white", borderRadius: "16px", padding: "20px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              display: "flex", alignItems: "center", gap: "14px"
            }}>
              <div style={{
                width: "46px", height: "46px", borderRadius: "12px",
                background: stat.bg, fontSize: "20px",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>{stat.icon}</div>
              <div>
                <div style={{ fontSize: "24px", fontWeight: "700", color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: "13px", color: "#888" }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Exams List */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px" }}>
            <p style={{ color: "#888" }}>Loading...</p>
          </div>
        ) : exams.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", background: "white", borderRadius: "16px" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
            <p style={{ color: "#888" }}>No exams created yet.</p>
            <button onClick={() => navigate("/admin")} style={{
              padding: "12px 24px", background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "white", border: "none", borderRadius: "10px",
              fontSize: "14px", fontWeight: "600", cursor: "pointer", marginTop: "12px"
            }}>+ Create First Exam</button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "16px" }}>
            {exams.map((exam) => (
              <div key={exam.id} style={{
                background: "white", borderRadius: "16px", padding: "24px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                border: "1px solid #f0f0f0"
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", gap: "16px", flex: 1 }}>
                    <div style={{
                      width: "52px", height: "52px", borderRadius: "14px",
                      background: "linear-gradient(135deg, #667eea18, #764ba218)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "24px", flexShrink: 0
                    }}>📋</div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: "700", color: "#1a1a2e" }}>
                        {exam.title}
                      </h3>
                      <p style={{ margin: "0 0 10px", color: "#888", fontSize: "13px" }}>
                        {exam.description || "No description"}
                      </p>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <span style={{
                          background: "#e8f5e9", color: "#2e7d32",
                          padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600"
                        }}>⏱ {exam.duration} min</span>
                        <span style={{
                          background: "#e3f2fd", color: "#1565c0",
                          padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600"
                        }}>🆔 ID: {exam.id}</span>
                        <span style={{
                          background: "#f3e5f5", color: "#6a1b9a",
                          padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600"
                        }}>📅 {new Date(exam.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "8px", marginLeft: "16px" }}>
                    <button
                      onClick={() => handleDelete(exam.id)}
                      style={{
                        padding: "8px 16px", background: "#fff0f0", color: "#e53935",
                        border: "1px solid #ffcdd2", borderRadius: "8px",
                        cursor: "pointer", fontSize: "13px", fontWeight: "600"
                      }}>🗑 Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminExams;