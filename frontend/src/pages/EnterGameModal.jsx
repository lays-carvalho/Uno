import React from "react";

const EnterGameModal = ({ gameCode, setGameCode, onEnter, onCancel }) => {
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
        <button
          onClick={onEnter}
          style={{
            background: "#666",
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
        <button
          onClick={onCancel}
          style={{
            marginTop: "12px",
            background: "#C93827",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          CANCEL
        </button>
      </div>
    </div>
  );
};

export default EnterGameModal;
