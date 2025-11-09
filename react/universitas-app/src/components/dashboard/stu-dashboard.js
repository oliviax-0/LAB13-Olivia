import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authService, dashboardService } from "../../services/service";

const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Fungsi ambil data dashboard
  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const user = authService.getCurrentUser();
      console.log("👤 Current User:", user);

      if (!user) {
        setError("Please login first");
        navigate("/login");
        return;
      }

      // ✅ Cek role user
      if (user.role !== "student") {
        console.warn(
          `⚠️ User with role "${user.role}" tried to access student dashboard`
        );
        setError("Access denied: This dashboard is only for students.");
        // Redirect ke dashboard dosen (atau halaman lain)
        setTimeout(() => navigate("/instructor-dashboard"), 2000);
        return;
      }

      console.log("📤 Calling API...");
      const response = await dashboardService.getStudentDashboard();
      console.log("✅ API Response:", response);

      if (!response || typeof response !== "object") {
        throw new Error("Invalid response format");
      }

      if (response.grades && !Array.isArray(response.grades)) {
        console.warn("⚠️ grades is not an array, converting to empty array");
        response.grades = [];
      }

      setData(response);
      setError("");
    } catch (err) {
      console.error("❌ Dashboard error:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load dashboard";
      setError(errorMessage);

      if (err?.response?.status === 401) {
        setTimeout(() => navigate("/login"), 2000);
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // ✅ useEffect
  useEffect(() => {
    let isMounted = true;
    if (isMounted) fetchDashboard();
    return () => {
      isMounted = false;
    };
  }, [fetchDashboard]);

  const handleLogout = useCallback(() => {
    try {
      authService.logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      navigate("/login");
    }
  }, [navigate]);

  const getGradeColor = useCallback((grade) => {
    if (!grade) return "text-gray-500";
    if (grade === "A" || grade === "A-") return "text-green-600";
    if (grade.startsWith("B")) return "text-blue-600";
    if (grade.startsWith("C")) return "text-yellow-600";
    return "text-red-600";
  }, []);

  // ✅ Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-purple-50 to-pink-100">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-16 w-16 text-purple-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-4 text-purple-600 font-semibold">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ✅ Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-purple-50 to-pink-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>

          <div className="flex flex-col gap-3">
            <button
              onClick={fetchDashboard}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition duration-200"
            >
              Retry
            </button>
            <button
              onClick={() => navigate("/login")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition duration-200"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-purple-50 to-pink-100">
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  const student = data.student || {};
  const statistics = data.statistics || {};
  const grades = Array.isArray(data.grades) ? data.grades : [];

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-purple-50 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-purple-800">
                Welcome, {student.name || "Student"}! 👋
              </h1>
              <p className="text-gray-600">{student.email || "No email"}</p>
              <p className="text-gray-600">
                Major: {student.major || "Not specified"}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl transition duration-200 shadow-md hover:shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-xl p-6">
            <h3 className="text-sm font-semibold uppercase opacity-90 mb-2">
              GPA
            </h3>
            <p className="text-5xl font-bold">
              {statistics.gpa !== undefined
                ? Number(statistics.gpa).toFixed(2)
                : "0.00"}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl shadow-xl p-6">
            <h3 className="text-sm font-semibold uppercase opacity-90 mb-2">
              Total Courses
            </h3>
            <p className="text-5xl font-bold">
              {statistics.total_courses || 0}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl shadow-xl p-6">
            <h3 className="text-sm font-semibold uppercase opacity-90 mb-2">
              Total Credits
            </h3>
            <p className="text-5xl font-bold">
              {statistics.total_credits || 0}
            </p>
          </div>
        </div>

        {/* Tabel Nilai */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-purple-800 mb-4">My Grades</h2>
          {grades.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b-2 border-purple-100">
                    <th className="px-6 py-4 text-left text-xs font-bold text-purple-800 uppercase">
                      Course
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-purple-800 uppercase">
                      Instructor
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-purple-800 uppercase">
                      Final Grade
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-purple-800 uppercase">
                      Letter Grade
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {grades.map((grade, i) => (
                    <tr key={i} className="hover:bg-purple-50 transition">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {grade.course_name || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {grade.instructor_name || "-"}
                      </td>
                      <td className="px-6 py-4 text-center text-sm">
                        {grade.final_grade ?? "-"}
                      </td>
                      <td
                        className={`px-6 py-4 text-center text-lg font-bold ${getGradeColor(
                          grade.letter_grade
                        )}`}
                      >
                        {grade.letter_grade || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              No grades available yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
