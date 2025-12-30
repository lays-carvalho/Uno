import React from "react";
import UnoLogo from "./Uno Logo.png";
import BackButton from "../components/BackButton";

function HowToPlay({ backTo }) {
  return (
    <div
      style={{
        height: "100vh",
        background: "#111",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontFamily: "Arial, sans-serif",
        position: "relative",
        padding: "10px",
        boxSizing: "border-box",
      }}
    >
      {/* Logo */}
      <img
        src={UnoLogo}
        alt="UNO Logo"
        style={{
          position: "fixed",
          top: "16px",
          left: "16px",
          width: "120px",
          zIndex: 10,
        }}
      />

      {/* Botão Return */}
      <div style={{ position: "absolute", top: "16px", right: "16px" }}>
        <BackButton to={backTo} />
      </div>

      {/* Card */}
      <div
        style={{
          background: "#689139ff",
          borderRadius: "50px",
          padding: "30px 20px",
          width: "90%",
          maxWidth: "650px",
          height: "85vh",
          boxShadow: "5px 4px 10px rgba(0, 0, 0, 1)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "10px" }}>
          HOW TO PLAY
        </h1>

        <div style={{ fontSize: "14px", lineHeight: "1.4rem" }}>
          <p><strong>Goal:</strong> Get rid of all your cards first.</p>

          <p><strong>Cards:</strong></p>
          <ul>
            <li>Numbers: 0–9 (red, blue, green, yellow)</li>
            <li>+2, +4, Reverse, Skip, Wild</li>
          </ul>

          <p><strong>Gameplay:</strong></p>
          <ul>
            <li>Match color or number</li>
            <li>If you can’t play, draw a card</li>
          </ul>

          <p><strong>UNO Rules:</strong></p>
          <ul>
            <li>Click UNO with 1 card</li>
            <li>ANTI-UNO if someone forgets</li>
          </ul>

          <p><strong>End:</strong></p>
          <ul>
            <li>First to finish cards wins</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HowToPlay;
