import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function StudentResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const name = localStorage.getItem("name");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await axios.get(`http://localhost:5050/results/user/${userId}`);
      setResults(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const avgScore = results.length
    ? Math.round(results.reduce((a, b) => a + Math.round((b.score / b.total) * 100), 0) / results.length)
    : 0;

  const passed = results.filter(r => Math.round((r.score / r.total) * 100) >= 60).length;

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
          <button onClick={() => navigate("/student")} style={{
            padding: "8px 18px", background: "#f0f0ff", color: "#667eea",
            border: "1px solid #d0d0ff", borderRadius: "8px", cursor: "pointer",
            fontSize: "13px", fontWeight: "600"
          }}>← Dashboard</button>
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
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1 style={{ margin: "0 0 6px", fontSize: "26px", fontWeight: "700" }}>
            📊 My Results
          </h1>
          <p style={{ margin: 0, opacity: 0.85, fontSize: "14px" }}>
            {name} — Your exam history
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "800px", margin: "32px auto", padding: "0 24px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "28px" }}>
          {[
            { icon: "📝", label: "Total Exams", value: results.length, color: "#667eea", bg: "#f0f0ff" },
            { icon: "✅", label: "Passed", value: passed, color: "#2e7d32", bg: "#e8f5e9" },
            { icon: "📈", label: "Avg Score", value: `${avgScore}%`, color: "#e65100", bg: "#fff3e0" },
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

        {/* Results List */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px" }}>
            <p style={{ color: "#888" }}>Loading results...</p>
          </div>
        ) : results.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", background: "white", borderRadius: "16px" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
            <p style={{ color: "#888" }}>Abhi koi exam nahi di hai.</p>
            <button onClick={() => navigate("/student")} style={{
              padding: "12px 24px", background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "white", border: "none", borderRadius: "10px",
              fontSize: "14px", fontWeight: "600", cursor: "pointer", marginTop: "12px"
            }}>Take Exam →</button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "16px" }}>
            {results.map((r, i) => {
              const pct = Math.round((r.score / r.total) * 100);
              const pass = pct >= 60;
              return (
                <div key={i} style={{
                  background: "white", borderRadius: "16px", padding: "24px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  border: `1px solid ${pass ? "#e8f5e9" : "#ffebee"}`,
                  borderLeft: `4px solid ${pass ? "#4CAF50" : "#f44336"}`
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{
                        width: "52px", height: "52px", borderRadius: "50%",
                        background: pass ? "#e8f5e9" : "#ffebee",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "13px", fontWeight: "800",
                        color: pass ? "#2e7d32" : "#c62828"
                      }}>{pct}%</div>
                      <div>
                        <h3 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: "700", color: "#1a1a2e" }}>
                          {r.title}
                        </h3>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          <span style={{
                            background: "#f5f5f5", color: "#666",
                            padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600"
                          }}>Score: {r.score}/{r.total}</span>
                          <span style={{
                            background: pass ? "#e8f5e9" : "#ffebee",
                            color: pass ? "#2e7d32" : "#c62828",
                            padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "700"
                          }}>{pass ? "✓ PASS" : "✗ FAIL"}</span>
                          {r.violations > 0 && (
                            <span style={{
                              background: "#fff3e0", color: "#e65100",
                              padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600"
                            }}>⚠️ {r.violations} violations</span>
                          )}
                          <span style={{
                            background: "#f5f5f5", color: "#888",
                            padding: "3px 10px", borderRadius: "20px", fontSize: "12px"
                          }}>📅 {new Date(r.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ width: "120px", textAlign: "right" }}>
                      <div style={{ height: "8px", background: "#f0f0f0", borderRadius: "4px", overflow: "hidden" }}>
                        <div style={{
                          height: "100%", borderRadius: "4px",
                          background: pass ? "linear-gradient(135deg, #4CAF50, #81C784)" : "linear-gradient(135deg, #f44336, #e57373)",
                          width: `${pct}%`, transition: "width 0.5s"
                        }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentResults;