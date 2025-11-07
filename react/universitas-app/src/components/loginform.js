import React, { useState } from "react";
import { login } from "../services/service";

export default function LoginForm({ onRegisterClick }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validate = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    // basic email pattern
    const re = /^\S+@\S+\.\S+$/;
    if (!re.test(email)) {
      setError("Enter a valid email address");
      return false;
    }
    if (!password) {
      setError("Password is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await login(email, password);
      // backend returns `token` object with access/refresh and other user fields
      if (data.token && data.token.access) {
        localStorage.setItem("authToken", data.token.access);
      } else if (data.access) {
        localStorage.setItem("authToken", data.access);
      } else if (data.token) {
        localStorage.setItem("authData", JSON.stringify(data.token));
      } else {
        localStorage.setItem("authData", JSON.stringify(data));
      }
      setSuccess(true);
    } catch (err) {
      const message =
        (err &&
          (err.detail || err.message || err.non_field_errors || err.error)) ||
        "Login failed";
      if (Array.isArray(message)) setError(message.join(" "));
      else if (typeof message === "object") setError(JSON.stringify(message));
      else setError(String(message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
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
        Welcome Back
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
          Login successful
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
            name="email"
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
            autoComplete="email"
          />
        </div>

        <div style={{ marginBottom: 24 }}>
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
            name="password"
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
            placeholder="Enter your password"
            autoComplete="current-password"
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
          {loading ? "Logging in..." : "Sign In"}
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
        Don't have an account?{" "}
        <button
          onClick={onRegisterClick}
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
          Sign up
        </button>
      </div>
    </div>
  );
}
