import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import AdminDashboard from "./AdminDashboard";
import AdminResults from "./AdminResults";
import AdminExams from "./AdminExams";
import StudentDashboard from "./StudentDashboard";
import StudentResults from "./StudentResults";
import ExamPage from "./ExamPage";
import ResultPage from "./ResultPage";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={
          <ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/exams" element={
          <ProtectedRoute allowedRole="admin"><AdminExams /></ProtectedRoute>
        } />
        <Route path="/admin/results" element={
          <ProtectedRoute allowedRole="admin"><AdminResults /></ProtectedRoute>
        } />
        <Route path="/student" element={
          <ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>
        } />
        <Route path="/student/results" element={
          <ProtectedRoute allowedRole="student"><StudentResults /></ProtectedRoute>
        } />
        <Route path="/exam/:id" element={
          <ProtectedRoute allowedRole="student"><ExamPage /></ProtectedRoute>
        } />
        <Route path="/result" element={
          <ProtectedRoute allowedRole="student"><ResultPage /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;