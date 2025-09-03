import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./GameLobby.css";
import unoLogo from "../Assets/Uno-Logo.png";
import leaveIcon from "../Assets/leave-icon.png";
import copyIcon from "../Assets/copy-icon.png";
import crowIcon from "../Assets/crow-icon.png";

export default function GameLobby() {
  const [mainStatus, setMainStatus] = useState("waiting");
  const [copied, setCopied] = useState(false);
  const [closing, setClosing] = useState(false);

  const navigate = useNavigate();
  const roomCode = "A3F9B45DC";

  const players = [
    { name: "Laura", color: "green", owner: true, status: "ready" },
    { name: "Pedro", color: "blue", owner: false, status: "ready" },
    { name: "Alice", color: "yellow", owner: false, status: "ready" },
    { name: "Bob", color: "red", owner: false, status: "waiting" },
  ];

  const toggleMainStatus = () => {
    setMainStatus(prev => (prev === "waiting" ? "ready" : "waiting"));
  };

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleLeave = () => {
    setClosing(true);
    setTimeout(() => {
      navigate("/");
    }, 800);
  };

  return (
    <div className="lobby-background">
      <img src={unoLogo} alt="UNO Logo" className="uno-logo-fixed" />

      <div className={`lobby-panel ${closing ? "fall" : ""}`}>
        <h1 className="game-name">GAMENAME</h1>

        <div className="room-code">
          <span>{roomCode}</span>
          <div className="copy-wrapper">
            <button className="copy-btn" onClick={copyRoomCode}>
              <img src={copyIcon} alt="Copy" />
            </button>
            {copied && <div className="copy-toast">Code copied!</div>}
          </div>
        </div>

        <button className="leave-btn" onClick={handleLeave}>
          <img src={leaveIcon} alt="Leave" />
        </button>

        <div className="player-grid">
          {players.map((player, index) => (
            <PlayerCard key={index} {...player} />
          ))}
        </div>

        <div className="main-action">
          <button
            className={`ready-btn ${mainStatus}`}
            onClick={toggleMainStatus}
          >
            {mainStatus.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
}

function PlayerCard({ color, name, owner, status }) {
  return (
    <div className={`player-card ${color}`}>
      {owner && <img src={crowIcon} alt="Owner" className="owner-icon" />}
      <span className="player-name">{name}</span>
      <div className={`player-status ${status}`}>{status.toUpperCase()}</div>
    </div>
  );
}
