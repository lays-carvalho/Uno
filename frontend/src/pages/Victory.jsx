import React from "react";

const VictoryCard = ({ playerName }) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#414141", // fundo cinza escuro
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#111", // fundo da carta
          borderRadius: "16px",
          width: "260px",
          height: "400px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          boxSizing: "border-box",
          position: "relative",
          padding: "24px 0",
        }}
      >
        {/* Barra colorida topo */}
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "12px",
            borderTopLeftRadius: "1px",
            borderTopRightRadius: "1px",
            overflow: "hidden",
            position: "absolute",
            top: 30,
          }}
        >
          <div style={{ flex: 1, background: "#8cb028" }} />
          <div style={{ flex: 1, background: "#6ca3c2" }} />
          <div style={{ flex: 1, background: "#c93827" }} />
          <div style={{ flex: 1, background: "#e2b633" }} />
        </div>

        {/* Texto Victory centralizado */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "4rem",
            fontWeight: "bold",
            fontFamily: "Arial, sans-serif",
            color: "#e2b633",
            WebkitTextStroke: "4px #111", // borda preta no texto
            textAlign: "center",
          }}
        >
          <span style={{ position: "relative", zIndex: 2 }}>Victory</span>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%) rotate(-5deg)",
              width: "100%",
              height: "110%",
              border: "8px solid #c93827",
              borderRadius: "70%",
              zIndex: 1,
            }}
          ></div>
        </div>

        {/* Nome do jogador */}
        <div
          style={{
            background: "#e0e0e0",
            borderRadius: "12px",
            padding: "8px 16px",
            fontSize: "1.1rem",
            fontWeight: "500",
            color: "#111",
            marginTop: "auto",
            marginBottom: "50px",
          }}
        >
           {"Player " + (playerName || "N")}
        </div>

        {/* Barra colorida fundo */}
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "12px",
            borderBottomLeftRadius: "1px",
            borderBottomRightRadius: "1px",
            overflow: "hidden",
            position: "absolute",
            bottom: 30,
          }}
        >
          <div style={{ flex: 1, background: "#8cb028" }} />
          <div style={{ flex: 1, background: "#6ca3c2" }} />
          <div style={{ flex: 1, background: "#c93827" }} />
          <div style={{ flex: 1, background: "#e2b633" }} />
        </div>
      </div>
    </div>
  );
};

export default VictoryCard;
