import React from "react";
import { Navigate } from "react-router-dom";

// Route untuk dashboard/login yang membutuhkan login
export function ProtectedRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Route untuk halaman login/register
export function PublicRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    // Sudah login → redirect ke dashboard sesuai role
    if (user.role === "student")
      return <Navigate to="/dashboard/student" replace />;
    if (user.role === "instructor")
      return <Navigate to="/dashboard/instructor" replace />;
  }

  return children;
}
