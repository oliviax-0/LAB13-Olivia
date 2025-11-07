import "./App.css";
import LoginForm from "./components/loginform";
import RegisForm from "./components/regisform";
import { useState } from "react";

function App() {
  const [page, setPage] = useState("login");

  return (
    <div className="App">
      <main style={{ padding: 24, maxWidth: 480, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            gap: 2,
            marginBottom: 24,
            backgroundColor: "#edf2f7",
            padding: 2,
            borderRadius: 6,
          }}
        >
          <button
            onClick={() => setPage("login")}
            style={{
              flex: 1,
              padding: "0.75rem",
              border: "none",
              borderRadius: 4,
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
              backgroundColor: page === "login" ? "#ffffff" : "transparent",
              color: page === "login" ? "#2d3748" : "#4a5568",
              boxShadow:
                page === "login" ? "0 1px 3px 0 rgba(0, 0, 0, 0.1)" : "none",
              transition: "all 0.2s ease",
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => setPage("register")}
            style={{
              flex: 1,
              padding: "0.75rem",
              border: "none",
              borderRadius: 4,
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
              backgroundColor: page === "register" ? "#ffffff" : "transparent",
              color: page === "register" ? "#2d3748" : "#4a5568",
              boxShadow:
                page === "register" ? "0 1px 3px 0 rgba(0, 0, 0, 0.1)" : "none",
              transition: "all 0.2s ease",
            }}
          >
            Sign Up
          </button>
        </div>

        {page === "login" ? (
          <LoginForm onRegisterClick={() => setPage("register")} />
        ) : (
          <RegisForm
            onRegisterSuccess={() => {
              setPage("login");
            }}
            onLoginClick={() => setPage("login")}
          />
        )}
      </main>
    </div>
  );
}

export default App;
