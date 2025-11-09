import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/service"; // pastikan service sudah benar

// --- Komponen Pembantu: StatCard ---
function StatCard({ title, value, colorClass, icon }) {
  const baseStyle = {
    flex: "1 1 calc(25% - 25px)",
    minWidth: "220px",
    padding: "25px 30px",
    borderRadius: "20px",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "130px",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s ease-in-out",
    boxSizing: "border-box",
  };

  const hoverStyle = { transform: "translateY(-5px)" };

  const colors = {
    blue: { background: "linear-gradient(135deg, #4c66ff, #33ccff)" },
    green: { background: "linear-gradient(135deg, #1abc9c, #16a085)" },
    purple: { background: "linear-gradient(135deg, #9b59b6, #8e44ad)" },
    orange: { background: "linear-gradient(135deg, #f39c12, #e67e22)" },
  };

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...baseStyle,
        ...colors[colorClass],
        ...(isHovered ? hoverStyle : {}),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
      >
        {icon && (
          <span style={{ marginRight: "10px", fontSize: "24px" }}>{icon}</span>
        )}
        <p
          style={{
            margin: 0,
            fontSize: "16px",
            opacity: 0.9,
            fontWeight: "500",
          }}
        >
          {title}
        </p>
      </div>
      <p style={{ margin: "0", fontSize: "42px", fontWeight: "bold" }}>
        {value}
      </p>
    </div>
  );
}

// --- Komponen CourseCard ---
function CourseCard({ courseData }) {
  const [open, setOpen] = useState(false);

  const cardStyle = {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "20px",
    boxShadow: "0 5px 20px rgba(0, 0, 0, 0.06)",
    border: "1px solid #e0e0e0",
    transition: "transform 0.2s ease-in-out",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    paddingBottom: "15px",
    borderBottom: open ? "1px solid #f0f0f0" : "none",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0",
    marginTop: "20px",
    borderRadius: "10px",
    overflow: "hidden",
  };

  const thStyle = {
    backgroundColor: "#eef2ff",
    padding: "15px 20px",
    textAlign: "left",
    fontWeight: "600",
    color: "#4c66ff",
    textTransform: "uppercase",
    fontSize: "13px",
  };

  const tdStyle = {
    padding: "15px 20px",
    borderBottom: "1px solid #f5f5f5",
    color: "#444",
    fontSize: "14px",
    whiteSpace: "nowrap",
  };

  const grades = courseData.grades || [];

  return (
    <div
      style={cardStyle}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "translateY(-3px)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div style={headerStyle} onClick={() => setOpen(!open)}>
        <div>
          <h3
            style={{
              margin: 0,
              color: "#333",
              fontSize: "22px",
              fontWeight: "600",
            }}
          >
            {courseData.name}
          </h3>
          <p
            style={{ margin: "5px 0 0 0", color: "#6c757d", fontSize: "15px" }}
          >
            {courseData.code} • {courseData.credits} Credits • Semester{" "}
            {courseData.semester}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{
              fontSize: "17px",
              fontWeight: "bold",
              color: "#4c66ff",
              marginRight: "20px",
            }}
          >
            {grades.length} Students
          </span>
          <span
            style={{
              fontSize: "14px",
              color: "#6c757d",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          >
            ▶
          </span>
        </div>
      </div>

      {open && (
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={{ ...thStyle, borderTopLeftRadius: "10px" }}>#</th>
                <th style={thStyle}>Student Name</th>
                <th style={thStyle}>Final Score</th>
                <th style={thStyle}>Letter Grade</th>
                <th style={{ ...thStyle, borderTopRightRadius: "10px" }}>
                  Grade Point
                </th>
              </tr>
            </thead>
            <tbody>
              {grades.length > 0 ? (
                grades.map((grade, idx) => (
                  <tr
                    key={idx}
                    style={{
                      backgroundColor: idx % 2 === 0 ? "#ffffff" : "#fcfdff",
                    }}
                  >
                    <td style={tdStyle}>{idx + 1}</td>
                    <td style={tdStyle}>{grade.student_name || "Unknown"}</td>
                    <td style={tdStyle}>{grade.final_grade ?? "-"}</td>
                    <td style={{ ...tdStyle, fontWeight: "bold" }}>
                      <span
                        style={{
                          color: grade.letter_grade?.startsWith("A")
                            ? "#1abc9c"
                            : grade.letter_grade?.startsWith("B")
                            ? "#f39c12"
                            : grade.letter_grade?.startsWith("C")
                            ? "#e67e22"
                            : "#e74c3c",
                          backgroundColor: grade.letter_grade?.startsWith("A")
                            ? "rgba(26, 188, 156, 0.1)"
                            : grade.letter_grade?.startsWith("B")
                            ? "rgba(243, 156, 18, 0.1)"
                            : grade.letter_grade?.startsWith("C")
                            ? "rgba(230, 126, 34, 0.1)"
                            : "rgba(231, 76, 60, 0.1)",
                          padding: "5px 10px",
                          borderRadius: "8px",
                        }}
                      >
                        {grade.letter_grade || "N/A"}
                      </span>
                    </td>
                    <td style={tdStyle}>{grade.grade_point ?? "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      ...tdStyle,
                      textAlign: "center",
                      color: "#888",
                      padding: "20px",
                    }}
                  >
                    No students in this course yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// --- KOMPONEN UTAMA: InstructorDashboard ---
export default function InstructorDashboard({ user }) {
  const navigate = useNavigate(); // ✅ Pastikan navigate dideklarasikan
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleLogout = useCallback(() => {
    try {
      authService.logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      navigate("/login");
    }
  }, [navigate]);

  const fetchDashboard = useCallback(async () => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    const email = user?.email || storedUser.email;

    if (!email) {
      setError("Email instruktur tidak ditemukan. Silakan login kembali.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:8000/api/dashboard/instructor/?email=${encodeURIComponent(
          email
        )}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP Error: ${response.status}`);
      }

      const json = await response.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        Loading dashboard...
      </div>
    );
  if (error)
    return (
      <div style={{ color: "red", textAlign: "center", padding: "50px" }}>
        Error: {error}
      </div>
    );
  if (!data || !data.instructor || !data.courses)
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>No data found.</div>
    );

  const instructor = data.instructor;
  const courses = data.courses;

  const totalStudents = courses.reduce(
    (sum, course) => sum + (course.grades ? course.grades.length : 0),
    0
  );
  const totalCredits = courses.reduce(
    (sum, course) => sum + (course.credits || 0),
    0
  );
  const averageScore = (() => {
    let total = 0;
    let count = 0;
    courses.forEach((c) =>
      c.grades?.forEach((g) => {
        const val = parseFloat(g.final_grade);
        if (!isNaN(val)) {
          total += val;
          count++;
        }
      })
    );
    return count > 0 ? (total / count).toFixed(2) : "N/A";
  })();

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "25px",
        fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          padding: "35px",
          borderRadius: "20px",
          background: "linear-gradient(to right, #ffffff, #f0f4f8)",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "35px",
        }}
      >
        <div>
          <h1
            style={{
              color: "#4c66ff",
              fontSize: "36px",
              marginBottom: "8px",
              fontWeight: "700",
            }}
          >
            Welcome, {instructor.full_name || "Instructor"}! 👋
          </h1>
          <p style={{ margin: 0, color: "#6c757d", fontSize: "16px" }}>
            {instructor.email}
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: "12px 25px",
            borderRadius: "12px",
            border: "none",
            backgroundColor: "#f56565",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px",
            boxShadow: "0 4px 15px rgba(245, 101, 101, 0.4)",
            transition: "0.2s",
          }}
        >
          Logout
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: "25px",
          marginBottom: "50px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <StatCard
          title="Total Courses"
          value={courses.length}
          colorClass="green"
          icon="📚"
        />
        <StatCard
          title="Total Students"
          value={totalStudents}
          colorClass="purple"
          icon="👨‍🎓"
        />
        <StatCard
          title="Total Credits"
          value={totalCredits}
          colorClass="blue"
          icon="🎓"
        />
        <StatCard
          title="Avg. Final Score"
          value={averageScore}
          colorClass="orange"
          icon="📈"
        />
      </div>

      <h2
        style={{
          fontSize: "28px",
          marginBottom: "25px",
          color: "#333",
          fontWeight: "700",
        }}
      >
        My Courses
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {courses.map((course, i) => (
          <CourseCard key={i} courseData={course} />
        ))}
      </div>
    </div>
  );
}
