import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";

import StudentDashboard from "./StudentDashboard";
import ExamPage from "./ExamPage";
import ResultPage from "./ResultPage";
import StudentResults from "./StudentResults";

import AdminDashboard from "./AdminDashboard";
import AdminExams from "./AdminExams";
import AdminResults from "./AdminResults";

function App() {
  return (
    <Router>
      <Routes>

        {/* Authentication */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Routes */}
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/exam/:id" element={<ExamPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/student/results" element={<StudentResults />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/exams" element={<AdminExams />} />
        <Route path="/admin/results" element={<AdminResults />} />

      </Routes>
    </Router>
  );
}

export default App;