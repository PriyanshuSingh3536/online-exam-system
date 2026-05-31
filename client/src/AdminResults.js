import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const name = localStorage.getItem("name");

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/results`);
      setResults(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const passed = results.filter(r => Math.round((r.score / r.total) * 100) >= 60).length;
  const failed = results.length - passed;
  const avgScore = results.length ? Math.round(results.reduce((a, b) => a + Math.round((b.score / b.total) * 100), 0) / results.length) : 0;

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
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h1 style={{ margin: "0 0 6px", fontSize: "26px", fontWeight: "700" }}>
            📊 Results Dashboard
          </h1>
          <p style={{ margin: 0, opacity: 0.85, fontSize: "14px" }}>
            All student exam results at a glance
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "1000px", margin: "32px auto", padding: "0 24px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "16px", marginBottom: "28px" }}>
          {[
            { icon: "📝", label: "Total Attempts", value: results.length, color: "#667eea", bg: "#f0f0ff" },
            { icon: "✅", label: "Passed", value: passed, color: "#2e7d32", bg: "#e8f5e9" },
            { icon: "❌", label: "Failed", value: failed, color: "#c62828", bg: "#ffebee" },
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
                <div style={{ fontSize: "22px", fontWeight: "700", color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: "12px", color: "#888" }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: "white", borderRadius: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #f0f0f0" }}>
            <h2 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#1a1a2e" }}>
              All Results
            </h2>
          </div>

          {loading ? (
            <p style={{ padding: "40px", textAlign: "center", color: "#888" }}>Loading...</p>
          ) : results.length === 0 ? (
            <div style={{ padding: "60px", textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
              <p style={{ color: "#888" }}>Abhi koi result nahi hai.</p>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8f9ff" }}>
                  {["Student", "Exam", "Score", "Percentage", "Status", "Violations", "Date"].map(h => (
                    <th key={h} style={{
                      padding: "12px 16px", textAlign: "left",
                      fontSize: "12px", fontWeight: "700", color: "#888",
                      textTransform: "uppercase", letterSpacing: "0.5px"
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => {
                  const pct = Math.round((r.score / r.total) * 100);
                  const pass = pct >= 60;
                  return (
                    <tr key={r.id} style={{ borderTop: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{
                            width: "34px", height: "34px", borderRadius: "50%",
                            background: "linear-gradient(135deg, #667eea, #764ba2)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "white", fontWeight: "700", fontSize: "13px", flexShrink: 0
                          }}>{r.name ? r.name[0].toUpperCase() : "S"}</div>
                          <div>
                            <div style={{ fontWeight: "600", fontSize: "14px", color: "#1a1a2e" }}>{r.name}</div>
                            <div style={{ fontSize: "12px", color: "#888" }}>{r.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "14px", color: "#444" }}>{r.title}</td>
                      <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: "600", color: "#1a1a2e" }}>
                        {r.score}/{r.total}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ flex: 1, height: "6px", background: "#f0f0f0", borderRadius: "3px", minWidth: "60px" }}>
                            <div style={{ width: `${pct}%`, height: "100%", borderRadius: "3px", background: pass ? "#4CAF50" : "#f44336" }}></div>
                          </div>
                          <span style={{ fontSize: "13px", fontWeight: "700", color: pass ? "#2e7d32" : "#c62828" }}>{pct}%</span>
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{
                          padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700",
                          background: pass ? "#e8f5e9" : "#ffebee",
                          color: pass ? "#2e7d32" : "#c62828"
                        }}>{pass ? "✓ PASS" : "✗ FAIL"}</span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{
                          padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600",
                          background: r.violations > 0 ? "#fff3e0" : "#e8f5e9",
                          color: r.violations > 0 ? "#e65100" : "#2e7d32"
                        }}>{r.violations > 0 ? `⚠️ ${r.violations}` : "✓ 0"}</span>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "13px", color: "#888" }}>
                        {new Date(r.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminResults;