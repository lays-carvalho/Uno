import React, { useEffect, useState } from "react";
import "./ProfilePage.css";
import UnoLogo from "../Assets/Uno-Logo.png";
import { FaUser, FaEnvelope } from "react-icons/fa";
import BackButton from "../components/BackButton";
import Unauthorized from "../components/Unauthorized";

export default function ProfilePage() {
  const token = localStorage.getItem("token");
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchPlayer = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/players/me`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: token }),
        });

        if (response.ok) {
          const data = await response.json();
          setPlayer({
            name: data.name,
            email: data.email,
            matchesTotal: data.total,
            matchesWon: data.wins,
            matchesLost: data.loss,
          });
        } else {
          setPlayer(null);
        }
      } catch (err) {
        console.error("Error fetching player:", err);
        setPlayer(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [token]);

  if (loading) return <div className="loading-container">Loading...</div>;
  if (!token || !player) return <Unauthorized />;

  return (
    <div className="profile-container">
      <img src={UnoLogo} alt="UNO Logo" className="uno-logo" />

      <BackButton to="/main" />

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
