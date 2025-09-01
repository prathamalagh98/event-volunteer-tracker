import React, { useEffect, useState } from "react";
import "./LoadingPage.css";

const API_HEALTH = process.env.REACT_APP_API_BASE
  ? `${process.env.REACT_APP_API_BASE}/api/health`
  : "http://localhost:5000/api/health"; // fallback for local dev

const LoadingPage = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState("Checking server...");
  const [error, setError] = useState("");

  const checkBackend = async () => {
    setError("");
    setBackendStatus("Checking server...");
    try {
      const res = await fetch(API_HEALTH, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // Try both json and text response
      try {
        await res.json();
      } catch {
        await res.text();
      }

      setBackendStatus("✅ Server is Online");
      setTimeout(() => setLoading(false), 700);
    } catch (err) {
      console.error("Backend connection failed:", err);
      setError("❌ Cannot connect to server");
      setBackendStatus("Retry Server is busy");
    }
  };

  useEffect(() => {
    checkBackend();
  }, []);

  if (loading || error) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <h2>Event Volunteer Tracker</h2>
        <p>{backendStatus}</p>

        {error && (
          <button className="retry-btn" onClick={checkBackend}>
            Retry
          </button>
        )}
      </div>
    );
  }

  return <>{children}</>;
};

export default LoadingPage;
