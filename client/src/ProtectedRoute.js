import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Login nahi hai toh login page pe bhejo
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Role match nahi karta toh sahi page pe bhejo
  if (allowedRole && role !== allowedRole) {
    if (role === "admin") return <Navigate to="/admin" replace />;
    if (role === "student") return <Navigate to="/student" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;