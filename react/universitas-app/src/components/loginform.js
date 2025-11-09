import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { dashboardService, authService } from "../services/service";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      console.log("✅ Login successful:", response);

      // ✅ PERBAIKAN: Normalisasi role ke lowercase sebelum disimpan
      const normalizedRole = response.role?.toLowerCase().trim();
      
      // Debug log untuk memastikan data tersimpan dengan benar
      console.log("📝 Saving to localStorage:", {
        email: response.email,
        role: normalizedRole,
        original_role: response.role
      });

      // Simpan ke localStorage dengan format yang konsisten
      localStorage.setItem("user_email", response.email);
      localStorage.setItem("user_role", normalizedRole); // ✅ Simpan dalam lowercase
      localStorage.setItem("access_token", response.access_token);
      
      // Simpan juga data user lengkap untuk keperluan lain
      localStorage.setItem("user_data", JSON.stringify({
        email: response.email,
        role: normalizedRole,
        full_name: response.full_name || "",
        major: response.major || ""
      }));

      // Show success message
      setSuccess("Login berhasil! Redirecting...");

      // Redirect based on normalized role
      setTimeout(() => {
        // ✅ Gunakan normalized role untuk routing
        if (normalizedRole === "student" || normalizedRole === "mahasiswa") {
          navigate("/dashboard/student");
        } else if (normalizedRole === "instructor" || normalizedRole === "dosen") {
          navigate("/dashboard/instructor");
        } else if (normalizedRole === "admin") {
          navigate("/dashboard/admin");
        } else {
          console.warn("⚠️ Unknown role:", normalizedRole);
          navigate("/");
        }
      }, 1000);
    } catch (err) {
      console.error("❌ Login error details:", err);

      // Handle different error types
      if (err.message) {
        setError(err.message);
      } else if (err.detail) {
        setError(err.detail);
      } else if (err.non_field_errors) {
        setError(err.non_field_errors[0]);
      } else if (err.email) {
        setError(`Email: ${err.email[0]}`);
      } else if (err.password) {
        setError(`Password: ${err.password[0]}`);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("Login failed! Please check your email and password.");
      }

      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-purple-50 to-pink-100">
      <div className="w-full max-w-md p-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white backdrop-blur-lg bg-opacity-90 p-8 rounded-2xl shadow-xl border border-purple-100"
        >
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-purple-800 mb-2">
              Welcome Back! 👋
            </h2>
            <p className="text-gray-600">Please login to your account</p>
          </div>

          <div className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-purple-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-200 bg-white bg-opacity-90"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@student.prasetiyamulya.ac.id"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-purple-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-200 bg-white bg-opacity-90"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                  minLength={8}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 animate-shake">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-4 rounded-lg bg-green-50 border border-green-200 animate-fade-in">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-600 mt-0.5 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-green-700 text-sm font-medium">
                    {success}
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-3 px-4 rounded-xl transition duration-200 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Processing...
                </span>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Additional Links */}
            <div className="text-center text-sm text-gray-600">
              <p>
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="text-purple-600 hover:text-purple-700 font-semibold transition-colors"
                >
                  Register here
                </a>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;