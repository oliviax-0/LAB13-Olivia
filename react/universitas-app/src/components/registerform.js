import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import registrationService from "../services/regisservice";

const RegisterForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    major: "",
    role: "student",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const majorOptions = [
    {
      value: "artificial_intelligence_and_robotics",
      label: "Artificial Intelligence and Robotics (AIR)",
    },
    { value: "business_mathematics", label: "Business Mathematics (BM)" },
    {
      value: "digital_business_technology",
      label: "Digital Business Technology (DBT)",
    },
    {
      value: "product_design_engineering",
      label: "Product Design Engineering (PDE)",
    },
    {
      value: "food_business_technology",
      label: "Food Business Technology (FBT)",
    },
  ];

  const roleOptions = [
    { value: "student", label: "Student" },
    { value: "instructor", label: "Instructor" },
  ];

  const handleChange = (e) => {
    // Clear error saat user mulai mengetik
    if (error) setError("");

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // 1. Major requirement validation for both roles
    if (!formData.major) {
      setError("Anda harus memilih Program Studi (Major).");
      setLoading(false);
      return;
    }

    // 2. Email domain validation
    if (
      !formData.email.endsWith("@student.prasetiyamulya.ac.id") &&
      !formData.email.endsWith("@prasetiyamulya.ac.id")
    ) {
      setError(
        "Email harus menggunakan domain @student.prasetiyamulya.ac.id atau @prasetiyamulya.ac.id"
      );
      setLoading(false);
      return;
    }

    // 3. Password validation
    if (formData.password !== formData.password_confirmation) {
      setError("Password dan konfirmasi password tidak cocok");
      setLoading(false);
      return;
    }

    // 4. Password strength validation
    if (formData.password.length < 8) {
      setError("Password harus minimal 8 karakter");
      setLoading(false);
      return;
    }

    try {
      await registrationService.register(formData);
      setSuccess("Registrasi berhasil! Mengalihkan ke halaman login...");

      // Reset form
      setFormData({
        email: "",
        full_name: "",
        major: "",
        role: "student",
        password: "",
        password_confirmation: "",
      });

      // Redirect ke login setelah 2 detik dengan state
      setTimeout(() => {
        navigate("/login", {
          state: {
            registrationSuccess: true,
            message: "Registrasi berhasil! Silakan login dengan akun Anda.",
            email: formData.email,
          },
        });
      }, 2000);
    } catch (err) {
      console.error("Registration error:", err);

      if (!err) {
        setError("Terjadi kesalahan saat registrasi");
      } else if (typeof err === "string") {
        setError(err);
      } else if (err.detail) {
        setError(err.detail);
      } else if (err.non_field_errors) {
        setError(
          Array.isArray(err.non_field_errors)
            ? err.non_field_errors.join(" ")
            : err.non_field_errors
        );
      } else {
        const parts = [];
        for (const key in err) {
          if (Array.isArray(err[key])) {
            const fieldName =
              key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ");
            parts.push(`${fieldName}: ${err[key].join(" ")}`);
          } else if (typeof err[key] === "string") {
            const fieldName =
              key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ");
            parts.push(`${fieldName}: ${err[key]}`);
          }
        }
        setError(
          parts.length ? parts.join(" | ") : "Terjadi kesalahan saat registrasi"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-purple-50 to-pink-100 p-4">
      <div className="w-full max-w-2xl">
        <form
          onSubmit={handleSubmit}
          className="bg-white backdrop-blur-lg bg-opacity-90 p-8 rounded-2xl shadow-xl border border-purple-100"
        >
          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-purple-800 mb-2">
              Create Account
            </h2>
            <p className="text-gray-600">Join our university community</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                className="w-full px-4 py-3 border border-purple-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-200 bg-white bg-opacity-90"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="nama@student.prasetiyamulya.ac.id"
              />
              <p className="mt-1 text-xs text-gray-500">
                Use your university email address
              </p>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="full_name"
                className="w-full px-4 py-3 border border-purple-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-200 bg-white bg-opacity-90"
                value={formData.full_name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                User Role <span className="text-red-500">*</span>
              </label>
              <select
                name="role"
                className="w-full px-4 py-3 border border-purple-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-200 bg-white bg-opacity-90 cursor-pointer"
                value={formData.role}
                onChange={handleChange}
                required
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Major */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Program Study (Major) <span className="text-red-500">*</span>
              </label>
              <select
                name="major"
                className="w-full px-4 py-3 border border-purple-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-200 bg-white bg-opacity-90 cursor-pointer"
                value={formData.major}
                onChange={handleChange}
                required
              >
                <option value="">Select your program study</option>
                {majorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                className="w-full px-4 py-3 border border-purple-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-200 bg-white bg-opacity-90"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create a strong password (min. 8 characters)"
                minLength="8"
              />
              <p className="mt-1 text-xs text-gray-500">Minimum 8 characters</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password_confirmation"
                className="w-full px-4 py-3 border border-purple-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-200 bg-white bg-opacity-90"
                value={formData.password_confirmation}
                onChange={handleChange}
                required
                placeholder="Re-enter your password"
                minLength="8"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start">
              <svg
                className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mt-6 p-4 rounded-lg bg-green-50 border border-green-200 flex items-start">
              <svg
                className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-green-600 text-sm font-medium">{success}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-6 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-3 px-4 rounded-xl transition duration-200 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
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
              "Create Account"
            )}
          </button>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-purple-600 hover:text-purple-800 font-semibold transition-colors duration-200"
              >
                Login here
              </Link>
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-xs">
            By creating an account, you agree to our Terms of Service and
            Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
