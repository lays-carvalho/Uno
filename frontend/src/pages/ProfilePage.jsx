import React from "react";
import "./ProfilePage.css";
import UnoLogo from "../Assets/Uno-Logo.png";
import { FaUser, FaEnvelope } from "react-icons/fa";
import BackButton from "../components/BackButton";

export default function ProfilePage() {
  const player = {
    name: "Laura",
    email: "laura@email.com",
    matchesTotal: 42,
    matchesWon: 21,
    matchesLost: 21,
  };

  return (
    <div className="profile-container">
      <img src={UnoLogo} alt="UNO Logo" className="uno-logo" />

      <BackButton text="Return" />

      <h1 className="profile-title">Profile</h1>

      <div className="info-card">
        <div className="field">
          <div className="icon-circle">
            <FaUser size={18} color="#686868" />
          </div>
          <span>{player.name}</span>
        </div>
        <div className="field">
          <div className="icon-circle">
            <FaEnvelope size={18} color="#686868" />
          </div>
          <span>{player.email}</span>
        </div>
      </div>

      <div className="stats">
        <div className="stat-card blue">
          <p>Total Matches</p>
          <h2>{player.matchesTotal}</h2>
        </div>
        <div className="stat-card green">
          <p>Won</p>
          <h2>{player.matchesWon}</h2>
        </div>
        <div className="stat-card red">
          <p>Lost</p>
          <h2>{player.matchesLost}</h2>
        </div>
      </div>
    </div>
  );
}
