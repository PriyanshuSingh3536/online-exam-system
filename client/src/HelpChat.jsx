import React, { useState } from "react";

function HelpChat() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Help Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: "none",
          backgroundColor: "#667eea",
          color: "white",
          fontSize: "24px",
          cursor: "pointer",
          zIndex: 999999,
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
        }}
      >
        💬
      </button>

      {/* Chat Box */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "350px",
            height: "450px",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            zIndex: 999999,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: "#667eea",
              color: "white",
              padding: "15px",
              fontWeight: "bold",
              fontSize: "16px"
            }}
          >
            Help Center
          </div>

          {/* Content */}
          <div
            style={{
              flex: 1,
              padding: "15px",
              overflowY: "auto"
            }}
          >
            <h3>👋 Welcome!</h3>

            <p><b>How do I start the exam?</b></p>
            <p>Click on "Start Exam Now".</p>

            <hr />

            <p><b>Camera not working?</b></p>
            <p>Allow camera permission and refresh the page.</p>

            <hr />

            <p><b>Face not detected?</b></p>
            <p>Make sure your face is clearly visible in the camera.</p>

            <hr />

            <p><b>Why was my exam auto submitted?</b></p>
            <p>5 violations automatically submit the exam.</p>

            <hr />

            <p><b>Can I switch tabs?</b></p>
            <p>No. Tab switching is recorded as a violation.</p>
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "10px",
              borderTop: "1px solid #ddd",
              textAlign: "center",
              fontSize: "12px",
              color: "#666"
            }}
          >
            Online Exam Help Assistant
          </div>
        </div>
      )}
    </>
  );
}

export default HelpChat;