import React, { useState } from "react";
import { register } from "../services/service";

const MAJOR_OPTIONS = [
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

export default function RegisForm({ onRegisterSuccess, onLoginClick }) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [major, setMajor] = useState(MAJOR_OPTIONS[0].value);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validate = () => {
    if (!email.trim()) return setError("Email is required");
    const re = /^\S+@\S+\.\S+$/;
    if (!re.test(email)) return setError("Enter a valid email address");
    if (!fullName.trim()) return setError("Full name is required");
    if (!major) return setError("Major is required");
    if (!password) return setError("Password is required");
    if (password !== passwordConfirmation)
      return setError("Password confirmation doesn't match");
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        email,
        full_name: fullName,
        major,
        password,
        password_confirmation: passwordConfirmation,
      };
      const data = await register({
        email: payload.email,
        full_name: payload.full_name,
        major: payload.major,
        password: payload.password,
        password_confirmation: payload.password_confirmation,
      });
      setSuccess("Registration successful — redirecting to login...");

      // Clear form
      setEmail("");
      setFullName("");
      setMajor(MAJOR_OPTIONS[0].value);
      setPassword("");
      setPasswordConfirmation("");

      // Wait a moment to show success message, then switch to login
      setTimeout(() => {
        if (onRegisterSuccess) onRegisterSuccess();
      }, 1500);
    } catch (err) {
      // err may be an object with field errors or a message
      if (err && typeof err === "object") {
        // Prefer the `email`/`password` field errors or `detail`
        const messages = [];
        for (const key of Object.keys(err)) {
          const val = err[key];
          if (Array.isArray(val)) messages.push(`${key}: ${val.join(" ")}`);
          else messages.push(`${key}: ${String(val)}`);
        }
        setError(messages.join(" | "));
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 480,
        margin: "2rem auto",
        padding: 32,
        border: "1px solid #e2e8f0",
        borderRadius: 8,
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        backgroundColor: "#ffffff",
      }}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: 24,
          fontSize: "1.5rem",
          fontWeight: 600,
          color: "#1a202c",
          textAlign: "center",
        }}
      >
        Create Account
      </h2>

      {error && (
        <div
          role="alert"
          style={{
            color: "#e53e3e",
            backgroundColor: "#fff5f5",
            padding: "0.75rem 1rem",
            borderRadius: 4,
            marginBottom: 16,
            fontSize: "0.875rem",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          style={{
            color: "#2f855a",
            backgroundColor: "#f0fff4",
            padding: "0.75rem 1rem",
            borderRadius: 4,
            marginBottom: 16,
            fontSize: "0.875rem",
          }}
        >
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="email"
            style={{
              display: "block",
              marginBottom: 8,
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#4a5568",
            }}
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: 4,
              border: "1px solid #e2e8f0",
              backgroundColor: "#ffffff",
              fontSize: "1rem",
              boxSizing: "border-box",
              transition: "border-color 0.2s ease",
            }}
            placeholder="Enter your email"
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="fullName"
            style={{
              display: "block",
              marginBottom: 8,
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#4a5568",
            }}
          >
            Full name
          </label>
          <input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: 4,
              border: "1px solid #e2e8f0",
              backgroundColor: "#ffffff",
              fontSize: "1rem",
              boxSizing: "border-box",
              transition: "border-color 0.2s ease",
            }}
            placeholder="Enter your full name"
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="major"
            style={{
              display: "block",
              marginBottom: 8,
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#4a5568",
            }}
          >
            Major
          </label>
          <select
            id="major"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: 4,
              border: "1px solid #e2e8f0",
              backgroundColor: "#ffffff",
              fontSize: "1rem",
              boxSizing: "border-box",
              transition: "border-color 0.2s ease",
              appearance: "none",
              backgroundImage:
                "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.5rem center",
              backgroundSize: "1.5em 1.5em",
            }}
          >
            {MAJOR_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="password"
            style={{
              display: "block",
              marginBottom: 8,
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#4a5568",
            }}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: 4,
              border: "1px solid #e2e8f0",
              backgroundColor: "#ffffff",
              fontSize: "1rem",
              boxSizing: "border-box",
              transition: "border-color 0.2s ease",
            }}
            placeholder="Create a password"
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label
            htmlFor="passwordConfirmation"
            style={{
              display: "block",
              marginBottom: 8,
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#4a5568",
            }}
          >
            Confirm password
          </label>
          <input
            id="passwordConfirmation"
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: 4,
              border: "1px solid #e2e8f0",
              backgroundColor: "#ffffff",
              fontSize: "1rem",
              boxSizing: "border-box",
              transition: "border-color 0.2s ease",
            }}
            placeholder="Confirm your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.75rem 1.5rem",
            backgroundColor: "#4299e1",
            color: "white",
            border: "none",
            borderRadius: 4,
            fontSize: "1rem",
            fontWeight: 500,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            transition: "background-color 0.2s ease",
          }}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      <div
        style={{
          marginTop: 24,
          textAlign: "center",
          color: "#4a5568",
          fontSize: "0.875rem",
        }}
      >
        Already have an account?{" "}
        <button
          onClick={onLoginClick}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            margin: 0,
            font: "inherit",
            color: "#4299e1",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Sign in
        </button>
      </div>
    </div>
  );
}
