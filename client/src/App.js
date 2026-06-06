import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import StudentDashboard from "./StudentDashboard";
import ExamPage from "./ExamPage";
import ResultPage from "./ResultPage";

import HelpChat from "./HelpChat";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/exam/:id" element={<ExamPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>

      {/* Floating Chatbot */}
      <HelpChat />
    </Router>
  );
}

export default App;