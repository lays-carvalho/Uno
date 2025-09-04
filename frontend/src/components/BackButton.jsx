import React from "react";
import "./BackButton.css";
import returnIcon from "../Assets/return-icon.png";

export default function BackButton({ onClick }) {
  return (
    <button className="back-button" onClick={onClick}>
      <div className="icon-wrapper">
        <img src={returnIcon} alt="Return Icon" />
      </div>
      <span>Return</span>
    </button>
  );
}
