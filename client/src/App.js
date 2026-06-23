import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import StudentDashboard from "./StudentDashboard";
import ExamPage from "./ExamPage";
import ResultPage from "./ResultPage";
import StudentResults from "./StudentResults";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
       <Route path="/student" element={<StudentDashboard />} />
        <Route path="/exam/:id" element={<ExamPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/student/results" element={<StudentResults />} />
      </Routes>

      {/* Floating Chatbot */}
     
    </Router>
  );
}

export default App;