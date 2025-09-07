import React, { useState } from "react";
import unoLogo from "../Assets/Uno-Logo.png";
import CreateGameModal from "./CreateGameModal";
import EnterGameModal from "./EnterGameModal";

const GameList = () => {
  const [games, setGames] = useState([]);
  const [hoverButton, setHoverButton] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEnterModal, setShowEnterModal] = useState(false);
  const [newGameName, setNewGameName] = useState("");
  const [gameCode, setGameCode] = useState("");

  const addGame = () => {
    if (!newGameName.trim()) return;

    const newGame = {
      id: games.length + 1,
      name: newGameName,
      players: 0,
      maxPlayers: 4,
      color: ["#8cb028", "#6ca3d2", "#E2B633", "#C93827"][games.length % 4],
    };

    setGames([...games, newGame]);
    setNewGameName("");
    setShowCreateModal(false);
  };

  const enterGame = () => {
    if (!gameCode.trim()) return;

    // Por enquanto só simula a entrada
    alert(`Entrando no jogo com código: ${gameCode}`);

    setGameCode("");
    setShowEnterModal(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        position: "relative",
      }}
    >
      {/* Logo */}
      <img
        src={UnoLogo}
        alt="Uno Logo"
        style={{
          position: "absolute",
          top: "2px",
          left: "2px",
          width: "100px",
          height: "auto",
        }}
      />

      {/* Área principal */}
      <div
        style={{
          background: "#3F3F3F",
          borderRadius: "12px",
          width: "800px",
          minHeight: "450px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
        }}
      >
        {/* Campo de busca */}
        <input
          type="text"
          placeholder="SEARCH"
          style={{
            width: "80%",
            padding: "8px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "none",
            textAlign: "center",
            fontWeight: "bold",
          }}
        />

        {/* Lista de jogos */}
        <div
          style={{
            width: "100%",
            maxHeight: "320px",
            overflowY: "auto",
            marginBottom: "20px",
            paddingRight: "6px",
          }}
        >
          {games.length === 0 ? (
            <p style={{ color: "#ccc", textAlign: "center" }}>
              Nenhum jogo disponível
            </p>
          ) : (
            games.map((game) => (
              <div
                key={game.id}
                style={{
                  background: game.color,
                  borderRadius: "6px",
                  padding: "12px 16px",
                  marginBottom: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontWeight: "bold",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                <span>{game.name}</span>
                <span>{`${game.players} / ${game.maxPlayers}`}</span>
              </div>
            ))
          )}
        </div>

        {/* Botões */}
        <div style={{ display: "flex", gap: "16px", marginTop: "auto" }}>
          <button
            onClick={() => setShowCreateModal(true)}
            onMouseEnter={() => setHoverButton("create")}
            onMouseLeave={() => setHoverButton("")}
            style={{
              background: hoverButton === "create" ? "#444" : "#666",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "background 0.3s",
            }}
          >
            CREATE GAME
          </button>

          <button
            onClick={() => setShowEnterModal(true)}
            onMouseEnter={() => setHoverButton("enter")}
            onMouseLeave={() => setHoverButton("")}
            style={{
              background: hoverButton === "enter" ? "#444" : "#666",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "background 0.3s",
            }}
          >
            ENTER GAME
          </button>
        </div>
      </div>

      {/* Modais */}
      {showCreateModal && (
        <CreateGameModal
          newGameName={newGameName}
          setNewGameName={setNewGameName}
          onCreate={addGame}
          onCancel={() => setShowCreateModal(false)}
        />
      )}

      {showEnterModal && (
        <EnterGameModal
          gameCode={gameCode}
          setGameCode={setGameCode}
          onEnter={enterGame}
          onCancel={() => setShowEnterModal(false)}
        />
      )}
    </div>
  );
};

export default GameList;
