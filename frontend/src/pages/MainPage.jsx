import React from "react";
import unoLogo from "./Uno Logo.png";

export default function MainPage() {
  const username = "Username";
  const profilePic =
    "https://www.w3schools.com/howto/img_avatar.png"; 

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#191919",
        position: "relative",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* UNO Logo */}
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 2,
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          src={unoLogo}
          alt="UNO Logo"
          style={{
            width: 90,
            height: "auto",
            background: "rgba(25,25,25,0.0)",
            borderRadius: "50%",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
        />
      </div>

      {/* User Profile */}
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 32,
          background: "#ddd",
          borderRadius: 24,
          padding: "6px 24px 6px 12px",
          display: "flex",
          alignItems: "center",
          minWidth: 170,
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        }}
      >
        <img
          src={profilePic}
          alt="Profile"
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            objectFit: "cover",
            background: "#bbb",
            marginRight: 12,
          }}
        />
        <span style={{ fontSize: 16, color: "#222" }}>{username}</span>
      </div>

      {/* Main */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div style={{ display: "flex", gap: "80px" }}>
          {/* HOW TO PLAY */}
          <div
            className="zoom-card"
            style={{
              width: 260,
              height: 340,
              background: "#97B42D",
              borderRadius: 24,
              boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: "#fff",
              fontSize: 36,
              fontWeight: "500",
              textAlign: "center",
              cursor: "pointer",
              transition: "transform 0.2s",
            }}
          >
            HOW
            <br />
            TO
            <br />
            PLAY
          </div>
          {/* PLAY */}
          <div
            className="zoom-card"
            style={{
              width: 260,
              height: 340,
              background: "#7CB3E3",
              borderRadius: 24,
              boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: "#fff",
              fontSize: 36,
              fontWeight: "500",
              textAlign: "center",
              cursor: "pointer",
              transition: "transform 0.2s",
            }}
          >
            PLAY
          </div>
          
          {/* RANKING */}
          <div
            className="zoom-card"
            style={{
              width: 260,
              height: 340,
              background: "#E2B94A",
              borderRadius: 24,
              boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: "#fff",
              fontSize: 36,
              fontWeight: "500",
              textAlign: "center",
              cursor: "pointer",
              transition: "transform 0.2s",
            }}
          >
            RANKING
          </div>
        </div>
      </div>

      <div
        style={{
          position: "fixed",
          right: 32,
          bottom: 32,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: -10,
            width: 110,
            height: 40,
            background: "#E2B94A",
            borderRadius: 8,
            zIndex: 1,
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          }}
        ></div>
        <button
          style={{
            position: "relative",
            zIndex: 2,
            background: "#D32F2F",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "12px 28px",
            fontWeight: "500",
            fontSize: 16,
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            cursor: "pointer",
            minWidth: 110,
            textAlign: "center",
            letterSpacing: 1,
          }}
        >
          ABOUT US
        </button>
      </div>

      <style>
        {`
          .zoom-card {
            transition: transform 0.2s;
          }
          .zoom-card:hover {
            transform: scale(1.08);
            z-index: 10;
          }
        `}
      </style>
    </div>
  );
}