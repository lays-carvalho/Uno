import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./GameList.css";
import unoLogo from "../Assets/Uno-Logo.png";
import CreateGameModal from "./CreateGameModal";
import EnterGameModal from "./EnterGameModal";

const BASE = process.env.REACT_APP_API_URL || "http://localhost:3000";
const COLORS = ["#8CB028", "#6CA3D2", "#E2B633", "#C93827"];

const GameList = () => {
  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [hoverButton, setHoverButton] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEnterModal, setShowEnterModal] = useState(false);
  const [newGameName, setNewGameName] = useState("");
  const [gameCode, setGameCode] = useState("");

  const navigate = useNavigate();

  // ------------------- FETCH GAMES -------------------
  const fetchGames = async () => {
    try {
      const res = await fetch(`${BASE}/api/games`);
      if (!res.ok) throw new Error("Erro ao buscar jogos");
      const data = await res.json();
      setGames(data);
    } catch (err) {
      console.error("Erro ao buscar jogos:", err);
    }
  };

  useEffect(() => {
    fetchGames();
    const interval = setInterval(fetchGames, 5000);
    return () => clearInterval(interval);
  }, []);

  // ------------------- CREATE GAME -------------------
  const addGame = async () => {
    if (!newGameName.trim()) return;

    try {
      const accessToken = localStorage.getItem("token");
      if (!accessToken) throw new Error("Usuário não logado");

      const meRes = await fetch(`${BASE}/api/players/me`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken }),
      });
      if (!meRes.ok) throw new Error("Erro ao buscar dados do jogador");
      const meData = await meRes.json();

      const createRes = await fetch(`${BASE}/api/games`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newGameName,
          creator: meData.id,
          status: "not_started",
          maxPlayers: 4,
          accessToken,
        }),
      });
      if (!createRes.ok) throw new Error("Erro ao criar jogo");

      const createData = await createRes.json();

      setNewGameName("");
      setShowCreateModal(false);

      navigate("/lobby/" + createData.game_id);

      fetchGames();
    } catch (err) {
      console.error(err);
    }
  };

  const enterGame = (id) => {
    navigate("/lobby/" + id);
  };

  return (
    <div className="game-list-background">
      <img src={unoLogo} alt="Uno Logo" className="game-list-logo" />

      <div className="game-list-panel">
        <input
          type="text"
          placeholder="SEARCH"
          className="game-list-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="game-list-container">
          {games.length === 0 ? (
            <p className="no-games-text">Nenhum jogo disponível</p>
          ) : (
            games
              .filter((game) =>
                game.title.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((game, index) => (
                <div
                  key={game._id}
                  className="game-card"
                  style={{ background: COLORS[index % COLORS.length] }}
                  onClick={() => enterGame(game.id)}
                >
                  <span>{game.title}</span>
                  <span>{`${(game.players?.length || 0)} / ${game.maxPlayers}`}</span>
                </div>
              ))
          )}
        </div>

        <div className="game-list-buttons">
          <button
            className={`game-btn ${hoverButton === "create" ? "hover" : ""}`}
            onClick={() => setShowCreateModal(true)}
            onMouseEnter={() => setHoverButton("create")}
            onMouseLeave={() => setHoverButton("")}
          >
            CREATE GAME
          </button>

          <button
            className={`game-btn ${hoverButton === "enter" ? "hover" : ""}`}
            onClick={() => setShowEnterModal(true)}
            onMouseEnter={() => setHoverButton("enter")}
            onMouseLeave={() => setHoverButton("")}
          >
            ENTER GAME
          </button>
        </div>
      </div>

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
          onEnter={() => enterGame(gameCode)}
          onCancel={() => setShowEnterModal(false)}
        />
      )}
    </div>
  );
};

export default GameList;
