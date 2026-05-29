import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [examId, setExamId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correct, setCorrect] = useState("A");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const name = localStorage.getItem("name");

  const handleCreateExam = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5050/exam/create", {
        title, description, duration, created_by: userId,
      });
      setExamId(res.data.examId);
      setStep(2);
    } catch (err) {
      alert("Exam create failed!");
    }
  };

  const handleAddQuestion = () => {
    if (!question || !optionA || !optionB || !optionC || !optionD) {
      alert("Saare fields bharo!");
      return;
    }
    setQuestions([...questions, {
      question, option_a: optionA, option_b: optionB,
      option_c: optionC, option_d: optionD, correct_answer: correct,
    }]);
    setQuestion(""); setOptionA(""); setOptionB("");
    setOptionC(""); setOptionD(""); setCorrect("A");
  };

  const handleSaveQuestions = async () => {
    if (questions.length === 0) { alert("Kam se kam ek question add karo!"); return; }
    try {
      await axios.post("http://localhost:5050/exam/questions", { exam_id: examId, questions });
      setStep(3);
    } catch (err) {
      alert("Questions save failed!");
    }
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px", fontSize: "14px",
    border: "2px solid #e8e8e8", borderRadius: "10px",
    outline: "none", boxSizing: "border-box",
    fontFamily: "'Segoe UI', sans-serif", marginBottom: "14px"
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
          <button onClick={() => navigate("/admin/exams")} style={{
            padding: "8px 18px", background: "#f0f0ff", color: "#667eea",
            border: "1px solid #d0d0ff", borderRadius: "8px", cursor: "pointer",
            fontSize: "13px", fontWeight: "600"
          }}>📚 View Exams</button>
          <button onClick={() => navigate("/admin/results")} style={{
            padding: "8px 18px", background: "#f0f0ff", color: "#667eea",
            border: "1px solid #d0d0ff", borderRadius: "8px", cursor: "pointer",
            fontSize: "13px", fontWeight: "600"
          }}>📊 View Results</button>
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
            Admin Dashboard 👨‍💼
          </h1>
          <p style={{ margin: 0, opacity: 0.85, fontSize: "14px" }}>
            Welcome, {name}! Create and manage exams here.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "800px", margin: "32px auto", padding: "0 24px" }}>

        {/* Progress Steps */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "28px" }}>
          {["Exam Details", "Add Questions", "Done!"].map((s, i) => (
            <React.Fragment key={i}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "50%",
                  background: step >= i + 1 ? "linear-gradient(135deg, #667eea, #764ba2)" : "#e0e0e0",
                  color: "white", display: "flex", alignItems: "center",
                  justifyContent: "center", fontWeight: "700", fontSize: "13px"
                }}>
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: "13px", fontWeight: "600", color: step === i + 1 ? "#667eea" : "#aaa" }}>
                  {s}
                </span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: "2px", background: step > i + 1 ? "#667eea" : "#e0e0e0", margin: "0 12px" }}></div>}
            </React.Fragment>
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div style={{ background: "white", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <h2 style={{ margin: "0 0 20px", fontSize: "18px", color: "#1a1a2e" }}>📝 Exam Details</h2>
            <form onSubmit={handleCreateExam}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#444" }}>Exam Title</label>
              <input type="text" placeholder="e.g. Math Chapter 5 Test" value={title}
                onChange={(e) => setTitle(e.target.value)} required style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = "#667eea"}
                onBlur={(e) => e.target.style.borderColor = "#e8e8e8"} />

              <label style={{ fontSize: "13px", fontWeight: "600", color: "#444" }}>Description</label>
              <textarea placeholder="Exam description..." value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ ...inputStyle, height: "80px", resize: "vertical" }}
                onFocus={(e) => e.target.style.borderColor = "#667eea"}
                onBlur={(e) => e.target.style.borderColor = "#e8e8e8"} />

              <label style={{ fontSize: "13px", fontWeight: "600", color: "#444" }}>Duration (minutes)</label>
              <input type="number" placeholder="e.g. 30" value={duration}
                onChange={(e) => setDuration(e.target.value)} required style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = "#667eea"}
                onBlur={(e) => e.target.style.borderColor = "#e8e8e8"} />

              <button type="submit" style={{
                width: "100%", padding: "13px",
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                color: "white", border: "none", borderRadius: "10px",
                fontSize: "15px", fontWeight: "600", cursor: "pointer"
              }}>Create Exam →</button>
            </form>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <div style={{ background: "white", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "16px" }}>
              <h2 style={{ margin: "0 0 20px", fontSize: "18px", color: "#1a1a2e" }}>❓ Add Question</h2>

              <label style={{ fontSize: "13px", fontWeight: "600", color: "#444" }}>Question</label>
              <input type="text" placeholder="Enter question..." value={question}
                onChange={(e) => setQuestion(e.target.value)} style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = "#667eea"}
                onBlur={(e) => e.target.style.borderColor = "#e8e8e8"} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {[["A", optionA, setOptionA], ["B", optionB, setOptionB],
                  ["C", optionC, setOptionC], ["D", optionD, setOptionD]].map(([letter, val, setter]) => (
                  <div key={letter}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#444" }}>Option {letter}</label>
                    <input type="text" placeholder={`Option ${letter}`} value={val}
                      onChange={(e) => setter(e.target.value)}
                      style={{ ...inputStyle, marginBottom: 0 }}
                      onFocus={(e) => e.target.style.borderColor = "#667eea"}
                      onBlur={(e) => e.target.style.borderColor = "#e8e8e8"} />
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "14px", marginBottom: "16px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#444", display: "block", marginBottom: "8px" }}>
                  Correct Answer
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {["A", "B", "C", "D"].map((l) => (
                    <div key={l} onClick={() => setCorrect(l)} style={{
                      width: "44px", height: "44px", borderRadius: "10px", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: "700", fontSize: "15px",
                      background: correct === l ? "linear-gradient(135deg, #667eea, #764ba2)" : "#f0f0f0",
                      color: correct === l ? "white" : "#666",
                      border: correct === l ? "none" : "2px solid #e0e0e0"
                    }}>{l}</div>
                  ))}
                </div>
              </div>

              <button onClick={handleAddQuestion} style={{
                width: "100%", padding: "12px",
                background: "#f0f0ff", color: "#667eea",
                border: "2px solid #d0d0ff", borderRadius: "10px",
                fontSize: "14px", fontWeight: "600", cursor: "pointer"
              }}>+ Add Question</button>
            </div>

            {/* Questions List */}
            {questions.length > 0 && (
              <div style={{ background: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <h3 style={{ margin: "0 0 16px", color: "#1a1a2e" }}>
                  Added Questions ({questions.length})
                </h3>
                {questions.map((q, i) => (
                  <div key={i} style={{
                    padding: "12px 16px", background: "#f8f9ff",
                    borderRadius: "10px", marginBottom: "8px",
                    borderLeft: "4px solid #667eea",
                    display: "flex", justifyContent: "space-between", alignItems: "center"
                  }}>
                    <span style={{ fontSize: "14px", color: "#333" }}>
                      <strong>Q{i + 1}.</strong> {q.question}
                    </span>
                    <span style={{
                      background: "#e8f5e9", color: "#2e7d32", padding: "3px 10px",
                      borderRadius: "20px", fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap"
                    }}>✓ {q.correct_answer}</span>
                  </div>
                ))}
                <button onClick={handleSaveQuestions} style={{
                  width: "100%", padding: "13px", marginTop: "12px",
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  color: "white", border: "none", borderRadius: "10px",
                  fontSize: "15px", fontWeight: "600", cursor: "pointer"
                }}>Save All & Publish Exam →</button>
              </div>
            )}
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div style={{ background: "white", borderRadius: "16px", padding: "48px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", textAlign: "center" }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎉</div>
            <h2 style={{ margin: "0 0 8px", color: "#1a1a2e", fontSize: "22px" }}>Exam Published!</h2>
            <p style={{ color: "#888", marginBottom: "24px" }}>
              Exam ID: <strong>#{examId}</strong> — Students can now take this exam.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button onClick={() => { setStep(1); setTitle(""); setDescription(""); setDuration(""); setQuestions([]); setExamId(null); }} style={{
                padding: "12px 24px", background: "linear-gradient(135deg, #667eea, #764ba2)",
                color: "white", border: "none", borderRadius: "10px",
                fontSize: "14px", fontWeight: "600", cursor: "pointer"
              }}>+ Create Another Exam</button>
              <button onClick={() => navigate("/admin/exams")} style={{
                padding: "12px 24px", background: "#f0f0ff", color: "#667eea",
                border: "2px solid #d0d0ff", borderRadius: "10px",
                fontSize: "14px", fontWeight: "600", cursor: "pointer"
              }}>📚 View All Exams</button>
              <button onClick={() => navigate("/admin/results")} style={{
                padding: "12px 24px", background: "#f0f0ff", color: "#667eea",
                border: "2px solid #d0d0ff", borderRadius: "10px",
                fontSize: "14px", fontWeight: "600", cursor: "pointer"
              }}>📊 View Results</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;