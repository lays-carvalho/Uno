import React from "react";
import "./BackButton.css";
import returnIcon from "../Assets/return-icon.png";
import { useNavigate } from "react-router-dom";

export default function BackButton({ to = "/" }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  return (
    <button className="back-button" onClick={handleClick}>
      <div className="icon-wrapper">
        <img src={returnIcon} alt="Return Icon" />
      </div>
      <span>Return</span>
    </button>
  );
}
