import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/loginform";
import RegisterForm from "./components/registerform";
import StudentDashboard from "./components/dashboard/stu-dashboard";
import InstructorDashboard from "./components/dashboard/ins-dashboard";
import { ProtectedRoute, PublicRoute } from "./components/protected_route";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route - redirect to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Authentication routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginForm />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterForm />
            </PublicRoute>
          }
        />

        {/* Student Dashboard */}
        <Route
          path="/dashboard/student"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Instructor Dashboard */}
        <Route
          path="/dashboard/instructor"
          element={
            <ProtectedRoute>
              <InstructorDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
