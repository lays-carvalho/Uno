import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import unoLogo from "./Uno Logo.png";
import Unauthorized from "../components/Unauthorized";
import "./MainPage.css";

export default function MainPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/players/me`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: token }),
        });

        const data = await response.json();
        if (response.ok && data.name) {
          setUser({ name: data.name });
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        Loading...
      </div>
    );
  }

  if (!token || !user) {
    return <Unauthorized />;
  }

  const profilePic = "https://www.w3schools.com/howto/img_avatar.png";

  return (
    <div className="main-container">
      <div className="logo-wrapper">
        <img src={unoLogo} alt="UNO Logo" className="logo" />
      </div>

      <button className="user-profile" onClick={() => navigate("/profile")}>
        <img src={profilePic} alt="Profile" className="profile-pic" />
        <span className="username">{user.name}</span>
      </button>

      <div className="center">
        <div className="cards">
          <button className="zoom-card how-to-play" onClick={() => navigate("/how-to-play")}>
            HOW<br />TO<br />PLAY
          </button>

          <button className="zoom-card play" onClick={() => navigate("/play")}>
            PLAY
          </button>

          <button className="zoom-card ranking" onClick={() => navigate("/ranking")}>
            RANKING
          </button>
        </div>
      </div>

      <div className="about-wrapper">
        <div className="about-bg"></div>
        <button className="about-btn" onClick={() => navigate("/aboutus")}>
          ABOUT US
        </button>
      </div>
    </div>
  );
}
