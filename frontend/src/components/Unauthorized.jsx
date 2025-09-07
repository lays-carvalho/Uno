import React from "react";
import { useNavigate } from "react-router-dom";
import "./Unauthorized.css";

export default function Unauthorized({ message, backTo = "/" }) {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-container">
      <h1>{message || "You need to be logged in to access this page"}</h1>
      <button className="unauthorized-btn" onClick={() => navigate(backTo)}>
        Back to Landing Page
      </button>
    </div>
  );
}
