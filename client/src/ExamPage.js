import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import * as faceapi from "face-api.js";

function ExamPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [violations, setViolations] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [camError, setCamError] = useState(false);
  const [faceStatus, setFaceStatus] = useState("Initializing...");
  const [modelsLoaded, setModelsLoaded] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const faceRef = useRef(null);
  const violationsRef = useRef(0);
  const submitCalledRef = useRef(false);

  const userId = localStorage.getItem("userId");
  const name = localStorage.getItem("name");

  useEffect(() => {
    fetchExam();
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      setModelsLoaded(true);
      setFaceStatus("Ready ✅");
    } catch (err) {
      console.error("Models load failed:", err);
      setFaceStatus("Model Error");
    }
  };

  const fetchExam = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/exam/${id}`);
      setExam(res.data.exam);
      const shuffled = [...res.data.questions].sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
      setTimeLeft(res.data.exam.duration * 60);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(err => console.log("Play error:", err));
        }
      }, 500);

    } catch (err) {
      setCamError(true);
      addViolation("Camera access denied");
    }
  };

  const addViolation = (reason) => {
    violationsRef.current += 1;
    setViolations(violationsRef.current);
    console.log(`Violation ${violationsRef.current}: ${reason}`);

    if (violationsRef.current === 3) {
      alert(`⚠️ WARNING!\n\n3 violations recorded!\nReason: ${reason}\n\n2 more violations and exam will be AUTO-SUBMITTED!`);
    }

    if (violationsRef.current >= 5) {
      alert(`🚫 EXAM AUTO-SUBMITTED!\n\n5 violations detected!\nReason: ${reason}`);
      handleSubmit();
    }
  };

  const startFaceDetection = () => {
    faceRef.current = setInterval(async () => {
      if (!videoRef.current || !modelsLoaded) return;
      try {
        const detections = await faceapi.detectAllFaces(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        );
        if (detections.length === 0) {
          setFaceStatus("❌ No Face");
          addViolation("Face not detected");
        } else if (detections.length > 1) {
          setFaceStatus("⚠️ Multiple Faces");
          addViolation("Multiple faces detected - cheating!");
        } else {
          setFaceStatus("✅ Face OK");
        }
      } catch (err) {
        console.error("Face detection error:", err);
      }
    }, 3000);
  };

  useEffect(() => {
    if (!examStarted) return;
    const handleVisibility = () => {
      if (document.hidden) {
        addViolation("Tab switch");
        alert("⚠️ Warning! Tab switch detected. Violation recorded!");
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [examStarted]);

  useEffect(() => {
    if (!examStarted) return;
    const handleFsChange = () => {
      if (!document.fullscreenElement) {
        addViolation("Fullscreen exit");
        alert("⚠️ Warning! Fullscreen exit detected!");
        enterFullscreen();
      }
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, [examStarted]);

  useEffect(() => {
    if (!examStarted) return;
    const block = (e) => e.preventDefault();
    document.addEventListener("contextmenu", block);
    document.addEventListener("copy", block);
    document.addEventListener("paste", block);
    return () => {
      document.removeEventListener("contextmenu", block);
      document.removeEventListener("copy", block);
      document.removeEventListener("paste", block);
    };
  }, [examStarted]);

  useEffect(() => {
    if (!examStarted) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [examStarted]);

  const enterFullscreen = () => {
    if (document.documentElement.requestFullscreen)
      document.documentElement.requestFullscreen();
  };

  const handleStartExam = async () => {
    await startCamera();
    enterFullscreen();
    setExamStarted(true);
    setTimeout(() => startFaceDetection(), 2000);
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = async () => {
    if (submitCalledRef.current) return;
    submitCalledRef.current = true;

    clearInterval(timerRef.current);
    clearInterval(faceRef.current);
    if (document.exitFullscreen) document.exitFullscreen();
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());

    let score = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct_answer) score++;
    });

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/result/save`, {
        exam_id: id, user_id: userId,
        score, total: questions.length,
        violations: violationsRef.current,
      });
    } catch (err) {
      console.error(err);
    }

    navigate("/result", {
      state: {
        score, total: questions.length,
        violations: violationsRef.current,
        examTitle: exam.title, questions, answers
      }
    });
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f6fb", fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
        <p style={{ color: "#888" }}>Loading exam...</p>
      </div>
    </div>
  );

  if (!exam) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p>Exam not found!</p>
    </div>
  );

  if (!examStarted) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif", padding: "20px" }}>
        <div style={{ background: "white", borderRadius: "24px", padding: "40px", maxWidth: "560px", width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div style={{ fontSize: "52px", marginBottom: "12px" }}>📋</div>
            <h1 style={{ margin: "0 0 6px", fontSize: "24px", fontWeight: "700", color: "#1a1a2e" }}>{exam.title}</h1>
            <p style={{ margin: 0, color: "#888", fontSize: "14px" }}>{exam.description}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
            {[
              { icon: "⏱", label: "Duration", value: `${exam.duration} minutes` },
              { icon: "❓", label: "Questions", value: questions.length },
              { icon: "📷", label: "Proctoring", value: "Camera + AI" },
              { icon: "🤖", label: "Face Detection", value: modelsLoaded ? "Ready ✅" : "Loading..." },
            ].map((item, i) => (
              <div key={i} style={{ background: "#f8f9ff", borderRadius: "12px", padding: "14px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "20px" }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: "11px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>{item.label}</div>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: "#1a1a2e" }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: "#fff8f0", border: "1px solid #ffe0b2", borderRadius: "12px", padding: "16px", marginBottom: "24px" }}>
            <p style={{ margin: "0 0 10px", fontWeight: "700", color: "#e65100", fontSize: "14px" }}>⚠️ Important Rules:</p>
            {[
              "Camera + AI Face Detection ON throughout",
              "Do NOT switch tabs",
              "Stay in fullscreen mode",
              "Only ONE face should be visible",
              "Face must be visible at all times",
              "5 violations = Exam auto-submitted!"
            ].map((rule, i) => (
              <div key={i} style={{ fontSize: "13px", color: "#555", marginBottom: "5px", display: "flex", gap: "8px" }}>
                <span style={{ color: "#ff6b35" }}>•</span> {rule}
              </div>
            ))}
          </div>

          {camError && (
            <div style={{ background: "#ffebee", border: "1px solid #ffcdd2", borderRadius: "10px", padding: "12px", marginBottom: "16px", color: "#c62828", fontSize: "13px" }}>
              ❌ Camera access denied!
            </div>
          )}

          <button onClick={handleStartExam} style={{
            width: "100%", padding: "15px",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            color: "white", border: "none", borderRadius: "12px",
            fontSize: "16px", fontWeight: "700", cursor: "pointer",
            boxShadow: "0 4px 15px rgba(102,126,234,0.4)"
          }}>🚀 Start Exam Now</button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <p>Loading questions...</p>
    </div>
  );

  const currentQuestion = questions[currentQ];

  if (!currentQuestion) return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <p>Loading...</p>
    </div>
  );

  const timerColor = timeLeft < 60 ? "#e74c3c" : timeLeft < 300 ? "#f39c12" : "#27ae60";

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6fb", fontFamily: "'Segoe UI', sans-serif", userSelect: "none" }}>

      {/* Watermark */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: "none", zIndex: 0, overflow: "hidden"
      }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            top: `${15 + i * 16}%`,
            left: "50%",
            transform: "translateX(-50%) rotate(-30deg)",
            fontSize: "18px", fontWeight: "700",
            color: "rgba(102,126,234,0.06)",
            whiteSpace: "nowrap", letterSpacing: "4px"
          }}>
            {name} • ProctorExam • {name} • ProctorExam
          </div>
        ))}
      </div>

      {/* Top Bar */}
      <div style={{
        background: "linear-gradient(135deg, #1a1a2e, #16213e)",
        padding: "0 24px", height: "60px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 2px 20px rgba(0,0,0,0.3)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#27ae60", boxShadow: "0 0 8px #27ae60" }}></div>
          <span style={{ color: "white", fontWeight: "600", fontSize: "15px" }}>{exam.title}</span>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.1)", borderRadius: "10px",
          padding: "8px 18px", display: "flex", alignItems: "center", gap: "8px"
        }}>
          <span style={{ fontSize: "16px" }}>⏱</span>
          <span style={{ fontFamily: "monospace", fontSize: "20px", fontWeight: "800", color: timerColor, letterSpacing: "2px" }}>
            {formatTime(timeLeft)}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{
            padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700",
            background: faceStatus.includes("OK") ? "rgba(39,174,96,0.2)" : "rgba(231,76,60,0.2)",
            color: faceStatus.includes("OK") ? "#27ae60" : "#e74c3c"
          }}>
            🤖 {faceStatus}
          </span>

          {violations > 0 && (
            <span style={{
              background: violations >= 3 ? "#e74c3c" : "#f39c12",
              color: "white", padding: "4px 12px", borderRadius: "20px",
              fontSize: "12px", fontWeight: "700"
            }}>
              ⚠️ {violations}/5 Violations
            </span>
          )}

          {/* Camera Preview */}
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: "80px", height: "60px", borderRadius: "8px",
              border: `2px solid ${faceStatus.includes("OK") ? "#27ae60" : "#e74c3c"}`,
              objectFit: "cover",
              background: "#000",
              transform: "scaleX(-1)"
            }}
          />
        </div>
      </div>

      {/* Violation Warning Bar */}
      {violations >= 3 && violations < 5 && (
        <div style={{
          background: "#e74c3c", color: "white", padding: "10px 24px",
          textAlign: "center", fontSize: "14px", fontWeight: "600"
        }}>
          🚨 {violations} violations recorded! {5 - violations} more and exam will be AUTO-SUBMITTED!
        </div>
      )}

      {/* Main Content */}
      <div style={{ display: "flex", maxWidth: "1100px", margin: "24px auto", gap: "20px", padding: "0 20px", position: "relative", zIndex: 1 }}>

        {/* Question Panel */}
        <div style={{ flex: 1, background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "13px", color: "#888", fontWeight: "600" }}>
              Question {currentQ + 1} of {questions.length}
            </span>
            <span style={{ fontSize: "13px", color: "#667eea", fontWeight: "600" }}>
              {Object.keys(answers).length} answered
            </span>
          </div>

          <div style={{ height: "4px", background: "#f0f0f0", borderRadius: "2px", marginBottom: "24px" }}>
            <div style={{
              height: "100%", borderRadius: "2px",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              width: `${((currentQ + 1) / questions.length) * 100}%`,
              transition: "width 0.3s"
            }}></div>
          </div>

          <h2 style={{ margin: "0 0 24px", fontSize: "18px", fontWeight: "700", color: "#1a1a2e", lineHeight: "1.5" }}>
            {currentQuestion.question}
          </h2>

          {["A", "B", "C", "D"].map((letter) => {
            const optKey = `option_${letter.toLowerCase()}`;
            const isSelected = answers[currentQuestion.id] === letter;
            return (
              <div key={letter} onClick={() => handleAnswer(currentQuestion.id, letter)} style={{
                padding: "14px 18px", margin: "10px 0", borderRadius: "12px",
                border: `2px solid ${isSelected ? "#667eea" : "#f0f0f0"}`,
                background: isSelected ? "#f0f0ff" : "white",
                cursor: "pointer", display: "flex", alignItems: "center", gap: "14px",
                transition: "all 0.2s",
                boxShadow: isSelected ? "0 2px 12px rgba(102,126,234,0.2)" : "none"
              }}>
                <span style={{
                  width: "32px", height: "32px", borderRadius: "8px", flexShrink: 0,
                  background: isSelected ? "linear-gradient(135deg, #667eea, #764ba2)" : "#f5f5f5",
                  color: isSelected ? "white" : "#666",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: "700", fontSize: "13px"
                }}>{letter}</span>
                <span style={{ fontSize: "15px", color: isSelected ? "#1a1a2e" : "#444", fontWeight: isSelected ? "600" : "400" }}>
                  {currentQuestion[optKey]}
                </span>
              </div>
            );
          })}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "28px" }}>
            <button onClick={() => setCurrentQ(prev => Math.max(0, prev - 1))}
              disabled={currentQ === 0} style={{
                padding: "11px 24px", borderRadius: "10px",
                border: "2px solid #e0e0e0", background: "white",
                color: currentQ === 0 ? "#ccc" : "#444",
                cursor: currentQ === 0 ? "not-allowed" : "pointer",
                fontWeight: "600", fontSize: "14px"
              }}>← Previous</button>

            {currentQ === questions.length - 1 ? (
              <button onClick={() => { if (window.confirm("Exam submit karna chahte ho?")) handleSubmit(); }} style={{
                padding: "11px 28px", borderRadius: "10px", border: "none",
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                color: "white", cursor: "pointer", fontWeight: "700", fontSize: "14px",
                boxShadow: "0 4px 12px rgba(102,126,234,0.3)"
              }}>Submit Exam ✓</button>
            ) : (
              <button onClick={() => setCurrentQ(prev => Math.min(questions.length - 1, prev + 1))} style={{
                padding: "11px 24px", borderRadius: "10px", border: "none",
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                color: "white", cursor: "pointer", fontWeight: "600", fontSize: "14px"
              }}>Next →</button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ width: "220px" }}>
          {/* AI Proctoring Status */}
          <div style={{
            background: "white", borderRadius: "16px", padding: "16px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "16px",
            border: `1px solid ${faceStatus.includes("OK") ? "#e8f5e9" : "#ffebee"}`
          }}>
            <p style={{ margin: "0 0 8px", fontSize: "12px", fontWeight: "700", color: "#888", textTransform: "uppercase" }}>AI Proctoring</p>
            <div style={{ fontSize: "14px", fontWeight: "600", color: faceStatus.includes("OK") ? "#2e7d32" : "#c62828" }}>
              {faceStatus}
            </div>
            <div style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>
              Checked every 3 seconds
            </div>
            <div style={{ marginTop: "10px", height: "6px", background: "#f0f0f0", borderRadius: "3px" }}>
              <div style={{
                height: "100%", borderRadius: "3px",
                background: violations >= 4 ? "#e74c3c" : violations >= 2 ? "#f39c12" : "#27ae60",
                width: `${(violations / 5) * 100}%`,
                transition: "width 0.3s"
              }}></div>
            </div>
            <div style={{ fontSize: "11px", color: "#888", marginTop: "4px" }}>
              Violations: {violations}/5
            </div>
          </div>

          {/* Question Navigator */}
          <div style={{ background: "white", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "16px" }}>
            <p style={{ margin: "0 0 14px", fontSize: "12px", fontWeight: "700", color: "#888", textTransform: "uppercase" }}>Questions</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {questions.map((q, i) => (
                <div key={i} onClick={() => setCurrentQ(i)} style={{
                  width: "36px", height: "36px", borderRadius: "8px", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: "700", fontSize: "13px",
                  background: i === currentQ ? "linear-gradient(135deg, #667eea, #764ba2)" : answers[q.id] ? "#e8f5e9" : "#f5f5f5",
                  color: i === currentQ ? "white" : answers[q.id] ? "#2e7d32" : "#666",
                  border: i === currentQ ? "none" : answers[q.id] ? "1.5px solid #a5d6a7" : "1.5px solid #e0e0e0"
                }}>{i + 1}</div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button onClick={() => { if (window.confirm("Exam submit karna chahte ho?")) handleSubmit(); }} style={{
            width: "100%", padding: "13px", borderRadius: "12px", border: "none",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            color: "white", cursor: "pointer", fontWeight: "700", fontSize: "14px",
            boxShadow: "0 4px 12px rgba(102,126,234,0.3)"
          }}>Submit Exam ✓</button>
        </div>
      </div>
    </div>
  );
}

export default ExamPage;