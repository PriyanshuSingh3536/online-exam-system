import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { score, total, violations, examTitle, questions, answers } = location.state || {};

  if (!score && score !== 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px", fontFamily: "'Segoe UI', sans-serif" }}>
        <h2>No result found!</h2>
        <button onClick={() => navigate("/student")}>Back to Dashboard</button>
      </div>
    );
  }

  const percentage = Math.round((score / total) * 100);
  const passed = percentage >= 60;

  return (
    <div style={{ minHeight: "100vh", background: "#fff8f5", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Navbar */}
      <div style={{
        background: "white", padding: "0 32px", height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: "linear-gradient(135deg, #ff6b35, #f7c59f)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px"
          }}>🎓</div>
          <span style={{ fontWeight: "700", fontSize: "18px", color: "#1a1a2e" }}>ProctorExam</span>
        </div>
        <button onClick={() => navigate("/student")} style={{
          padding: "8px 18px", background: "#fff3ee", color: "#ff6b35",
          border: "1px solid #ffcbb0", borderRadius: "8px", cursor: "pointer",
          fontSize: "13px", fontWeight: "600"
        }}>← Back to Dashboard</button>
      </div>

      {/* Hero */}
      <div style={{
        background: passed
          ? "linear-gradient(135deg, #ff6b35 0%, #f7c59f 100%)"
          : "linear-gradient(135deg, #c0392b 0%, #e74c3c 100%)",
        padding: "48px 32px", color: "white", textAlign: "center"
      }}>
        {/* Score Circle */}
        <div style={{
          width: "120px", height: "120px", borderRadius: "50%",
          background: "rgba(255,255,255,0.2)",
          border: "4px solid rgba(255,255,255,0.6)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px", backdropFilter: "blur(10px)"
        }}>
          <span style={{ fontSize: "32px", fontWeight: "800" }}>{percentage}%</span>
        </div>
        <h1 style={{ margin: "0 0 8px", fontSize: "28px", fontWeight: "700" }}>
          {passed ? "🎉 Congratulations! You Passed!" : "😔 Better Luck Next Time!"}
        </h1>
        <p style={{ margin: 0, opacity: 0.9, fontSize: "15px" }}>{examTitle}</p>
      </div>

      <div style={{ maxWidth: "750px", margin: "0 auto", padding: "32px 24px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "14px", marginBottom: "28px" }}>
          {[
            { icon: "✅", label: "Correct", value: score, color: "#ff6b35", bg: "#fff3ee" },
            { icon: "❌", label: "Wrong", value: total - score, color: "#c0392b", bg: "#ffebee" },
            { icon: "📝", label: "Total", value: total, color: "#e67e22", bg: "#fef9ee" },
            { icon: "⚠️", label: "Violations", value: violations, color: violations > 0 ? "#c0392b" : "#27ae60", bg: violations > 0 ? "#ffebee" : "#e8f5e9" },
          ].map((s, i) => (
            <div key={i} style={{
              background: "white", borderRadius: "14px", padding: "18px",
              boxShadow: "0 2px 12px rgba(255,107,53,0.1)", textAlign: "center",
              border: `1px solid ${s.bg}`
            }}>
              <div style={{ fontSize: "22px", marginBottom: "6px" }}>{s.icon}</div>
              <div style={{ fontSize: "24px", fontWeight: "800", color: s.color }}>{s.value}</div>
              <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Violations Warning */}
        {violations > 0 && (
          <div style={{
            background: "#fff3ee", border: "1px solid #ffcbb0",
            borderRadius: "12px", padding: "14px 18px", marginBottom: "24px",
            display: "flex", alignItems: "center", gap: "10px"
          }}>
            <span style={{ fontSize: "20px" }}>⚠️</span>
            <span style={{ color: "#c0392b", fontSize: "14px", fontWeight: "500" }}>
              <strong>{violations} violation(s)</strong> recorded. Your result may be reviewed by admin.
            </span>
          </div>
        )}

        {/* Question Review */}
        <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1a1a2e", marginBottom: "16px" }}>
          📋 Question Review
        </h2>

        {questions && questions.map((q, i) => {
          const userAnswer = answers[q.id];
          const isCorrect = userAnswer === q.correct_answer;
          const isSkipped = !userAnswer;

          return (
            <div key={q.id} style={{
              background: "white", borderRadius: "14px", padding: "20px",
              marginBottom: "14px",
              boxShadow: "0 2px 12px rgba(255,107,53,0.08)",
              borderLeft: `4px solid ${isSkipped ? "#ddd" : isCorrect ? "#ff6b35" : "#e74c3c"}`
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                <p style={{ margin: 0, fontWeight: "600", fontSize: "15px", color: "#1a1a2e", flex: 1 }}>
                  Q{i + 1}. {q.question}
                </p>
                <span style={{
                  marginLeft: "12px", padding: "4px 12px", borderRadius: "20px",
                  fontSize: "12px", fontWeight: "700", whiteSpace: "nowrap",
                  background: isSkipped ? "#f5f5f5" : isCorrect ? "#fff3ee" : "#ffebee",
                  color: isSkipped ? "#888" : isCorrect ? "#ff6b35" : "#c0392b"
                }}>
                  {isSkipped ? "⚪ Skipped" : isCorrect ? "✅ Correct" : "❌ Wrong"}
                </span>
              </div>

              {["A", "B", "C", "D"].map((letter) => {
                const optKey = `option_${letter.toLowerCase()}`;
                const isCorrectOpt = letter === q.correct_answer;
                const isUserOpt = letter === userAnswer;

                return (
                  <div key={letter} style={{
                    padding: "10px 14px", margin: "6px 0", borderRadius: "10px",
                    background: isCorrectOpt ? "#fff3ee" : isUserOpt && !isCorrect ? "#ffebee" : "#f9f9f9",
                    border: `1.5px solid ${isCorrectOpt ? "#ff6b35" : isUserOpt && !isCorrect ? "#e74c3c" : "#f0f0f0"}`,
                    display: "flex", alignItems: "center", gap: "10px", fontSize: "14px"
                  }}>
                    <span style={{
                      width: "26px", height: "26px", borderRadius: "50%", flexShrink: 0,
                      background: isCorrectOpt ? "#ff6b35" : isUserOpt && !isCorrect ? "#e74c3c" : "#e0e0e0",
                      color: isCorrectOpt || (isUserOpt && !isCorrect) ? "white" : "#666",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: "700", fontSize: "12px"
                    }}>{letter}</span>
                    <span style={{ flex: 1, color: "#333" }}>{q[optKey]}</span>
                    {isCorrectOpt && <span style={{ color: "#ff6b35", fontSize: "12px", fontWeight: "700" }}>✓ Correct</span>}
                    {isUserOpt && !isCorrect && <span style={{ color: "#e74c3c", fontSize: "12px", fontWeight: "700" }}>✗ Your Answer</span>}
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Bottom Button */}
        <button onClick={() => navigate("/student")} style={{
          width: "100%", padding: "14px",
          background: "linear-gradient(135deg, #ff6b35, #f7c59f)",
          color: "white", border: "none", borderRadius: "12px",
          fontSize: "15px", fontWeight: "700", cursor: "pointer",
          boxShadow: "0 4px 15px rgba(255,107,53,0.3)", marginTop: "8px"
        }}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default ResultPage;