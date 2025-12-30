import React from "react";
import { useNavigate } from "react-router-dom";
import UnoLogo from "./Uno Logo.png";
import BackButton from "../components/BackButton";

function HowToPlay() {
  const navigate = useNavigate();

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
      {/* Logo no canto superior esquerdo */}
      <img
        src={UnoLogo}
        alt="UNO Logo"
        style={{
          position: "fixed",
          top: "16px",
          left: "16px",
          width: "120px",
          height: "auto",
          zIndex: 10,
        }}
      />

      {/* BackButton acima do card */}
      <div style={{ position: "absolute", top: "16px", right: "16px" }}>
        <BackButton to="/" />
      </div>

      {/* Card central */}
      <div
        style={{
          background: "#689139ff",
          color: "#ffffffff",
          borderRadius: "50px",
          padding: "30px 20px",       
          width: "90%",
          maxWidth: "650px",
          height: "85vh",           
          textAlign: "left",
          boxShadow: "5px 4px 10px rgba(0, 0, 0, 1)",
          textShadow: "1.5px 1px 2px rgba(0, 0, 0, 1)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between", 
          overflow: "hidden",       
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "10px", fontSize: "1.5rem" }}>
          HOW TO PLAY
        </h1>

        <div style={{ fontSize: "14px", lineHeight: "1.4rem" }}>
          <p><strong>Goal:</strong> Get rid of all your cards first.</p>

          <p><strong>Cards:</strong></p>
          <ul>
            <li>Numbers: 0–9 in red, blue, green, yellow.</li>
            <li>Specials:</li>
            <ul>
              <li>+2: next player draws 2</li>
              <li>+4: next player draws 4, you choose color</li>
              <li>Reverse: changes play direction</li>
              <li>Skip: next player loses turn</li>
              <li>Wild: choose any color</li>
            </ul>
          </ul>

          <p><strong>Gameplay:</strong></p>
          <ul>
            <li>Play a card matching color or number, or a special card.</li>
            <li>If you can’t play, draw a card.</li>
          </ul>

          <p><strong>UNO Rules:</strong></p>
          <ul>
            <li>Click UNO when you have 1 card.</li>
            <li>Others can click ANTI-UNO if they think you forgot.</li>
            <li>If blocked, draw 1 card.</li>
            <li>Mistaken blocks/ANTI-UNO → player who clicked draws 1 card.</li>
          </ul>

          <p><strong>End:</strong></p>
          <ul>
            <li>Game ends when someone has no cards or no one can play.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HowToPlay;
