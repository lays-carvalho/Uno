import React, { useState } from "react";

const EnterGameModal = ({ gameCode, setGameCode, onEnter, onCancel }) => {
  const [hoverEnter, setHoverEnter] = useState(false);
  const [hoverCancel, setHoverCancel] = useState(false);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#3F3F3F",
          padding: "30px",
          borderRadius: "12px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "400px",
        }}
      >
        <input
          type="text"
          placeholder="GAME CODE"
          value={gameCode}
          onChange={(e) => setGameCode(e.target.value)}
          autoFocus
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "20px",
            border: "none",
            textAlign: "center",
            fontWeight: "bold",
          }}
        />

        {/* ENTER GAME */}
        <button
          onClick={onEnter}
          onMouseEnter={() => setHoverEnter(true)}
          onMouseLeave={() => setHoverEnter(false)}
          style={{
            background: hoverEnter ? "#444" : "#666",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "background 0.3s",
          }}
        >
          ENTER GAME
        </button>

        {/* CANCEL */}
        <button
          onClick={onCancel}
          onMouseEnter={() => setHoverCancel(true)}
          onMouseLeave={() => setHoverCancel(false)}
          style={{
            marginTop: "12px",
            background: hoverCancel ? "#8c1b0fff" : "#D43B30",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "background 0.3s",
          }}
        >
          CANCEL
        </button>
      </div>
    </div>
  );
};

export default EnterGameModal;
