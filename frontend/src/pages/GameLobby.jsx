import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./GameLobby.css";
import unoLogo from "../Assets/Uno-Logo.png";
import crowIcon from "../Assets/crow-icon.png";
import leaveIcon from "../Assets/leave-icon.png";
import copyIcon from "../Assets/copy-icon.png";

const BASE = process.env.REACT_APP_API_URL || "http://localhost:3000";

export default function GameLobby() {
  const [game, setGame] = useState(null);
  const [players, setPlayers] = useState([]);
  const [userId, setUserId] = useState(null);
  const [closing, setClosing] = useState(false);
  const [copied, setCopied] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");

  // ------------------- PEGAR ID DO USUÁRIO -------------------
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${BASE}/api/players/me`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: token }),
        });
        if (!res.ok) throw new Error("Não foi possível identificar o jogador");
        const data = await res.json();
        setUserId(data.id);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMe();
  }, [token]);

  // ------------------- JOIN GAME -------------------
  const joinGame = useCallback(
    async (gameData) => {
      if (!userId || !gameData) return;
      if (gameData.players.includes(Number(userId))) return;
      if (gameData.players.length >= 4) {
        alert("The room is full!");
        return;
      }

      try {
        const res = await fetch(`${BASE}/api/games/joinGame`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gameId: Number(id), accessToken: token }),
        });
        if (!res.ok) {
          const data = await res.json();
          if (data.error === "User already in the game") return;
          throw new Error(data.error || "Erro ao entrar na sala");
        }
      } catch (err) {
        console.error("Erro ao entrar na sala", err);
      }
    },
    [id, token, userId]
  );

  // ------------------- FETCH GAME -------------------
  const fetchGame = useCallback(async () => {
    if (!userId) return;

    try {
      const res = await fetch(`${BASE}/api/games/${id}`);
      if (!res.ok) throw new Error("Erro ao buscar sala");
      const data = await res.json();

      await joinGame(data);

      const playerDataPromises = data.players.map(async (pId) => {
        try {
          const res = await fetch(`${BASE}/api/players/${pId}`);
          if (!res.ok) return null;
          return res.json();
        } catch {
          return null;
        }
      });

      const playersData = (await Promise.all(playerDataPromises)).filter(Boolean);

      const slotColors = ["green", "blue", "yellow", "red"];
      const slots = Array(4).fill(null);

      playersData.forEach((p, index) => {
        if (index < 4) {
          slots[index] = {
            id: p.id,
            name: p.name,
            owner: Number(p.id) === Number(data.creator),
            status: data.readyPlayers.some((id) => Number(id) === Number(p.id))
              ? "ready"
              : "waiting",
            color: slotColors[index],
          };
        }
      });

      const finalPlayers = slots.map((p, i) =>
        p || { id: `empty-${i}`, name: "EMPTY", owner: false, status: "empty", color: "gray" }
      );

      setGame(data);
      setPlayers(finalPlayers);
    } catch (err) {
      console.error(err);
    }
  }, [id, userId, joinGame]);

  useEffect(() => {
    const interval = setInterval(fetchGame, 3000);
    fetchGame();
    return () => clearInterval(interval);
  }, [fetchGame]);

  // ------------------- LEAVE GAME -------------------
  const handleLeave = async () => {
    if (!game || !userId) return;

    setClosing(true);

    setPlayers((prev) => prev.filter((p) => p.id !== userId));
    setGame((prev) => ({
      ...prev,
      readyPlayers: prev.readyPlayers.filter((pId) => Number(pId) !== Number(userId)),
    }));

    try {
      if (Number(userId) === Number(game.creator)) {
        await fetch(`${BASE}/api/games/${id}`, { method: "DELETE" });
      } else {
        const updatedPlayers = game.players.filter((p) => Number(p) !== Number(userId));
        const updatedReady = game.readyPlayers.filter((pId) => Number(pId) !== Number(userId));
        await fetch(`${BASE}/api/games/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ players: updatedPlayers, readyPlayers: updatedReady }),
        });
      }
    } catch (err) {
      console.error(err);
    }

    setTimeout(() => navigate("/"), 800);
  };

  // ------------------- COPIAR CÓDIGO DO JOGO -------------------
  const copyGameCode = async () => {
    if (!game) return;
    try {
      await navigator.clipboard.writeText(game.id.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  // ------------------- MARCAR COMO READY -------------------
  const markAsReady = async () => {
    if (!game || !userId) return;
    try {
      await fetch(`${BASE}/api/games/markAsReady`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: Number(id), accessToken: token }),
      });

      setPlayers((prev) =>
        prev.map((p) => (p.id === userId ? { ...p, status: "ready" } : p))
      );

      setGame((prev) => ({
        ...prev,
        readyPlayers: [...prev.readyPlayers, Number(userId)],
      }));
    } catch (err) {
      console.error(err);
    }
  };

  // ------------------- START GAME -------------------
  const startGame = async () => {
    if (!game || !userId) return;
    try {
      await fetch(`${BASE}/api/games/startGame`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: Number(id), accessToken: token }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (!game) return <div className="lobby-loading">Carregando sala...</div>;

  const userPlayer = players.find((p) => p.id === userId);

  const allReady =
    game &&
    game.players.length > 1 &&
    game.players.every((pId) => game.readyPlayers.some((id) => Number(id) === Number(pId)));

  return (
    <div className="lobby-background">
      <img src={unoLogo} alt="UNO Logo" className="uno-logo-fixed" />

      <div className={`lobby-panel ${closing ? "fall" : ""}`}>
        <h1 className="game-name">{game.title}</h1>

        <div className="room-code">
          <span>{game.id}</span>
          <div className="copy-wrapper">
            <button className="copy-btn" onClick={copyGameCode}>
              <img src={copyIcon} alt="Copy" />
            </button>
            {copied && <div className="copy-toast">Code copied!</div>}
          </div>
        </div>

        <button className="leave-btn" onClick={handleLeave}>
          <img src={leaveIcon} alt="Leave" />
        </button>

        <div className="player-grid">
          {players.map((p) => (
            <PlayerCard key={p.id} {...p} />
          ))}
        </div>

        <div className="main-action">
          {userPlayer?.status === "waiting" && (
            <button className="ready-btn" onClick={markAsReady}>
              MARK AS READY
            </button>
          )}
          {allReady && userPlayer?.owner && (
            <button className="start-btn" onClick={startGame}>
              START GAME
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function PlayerCard({ color, name, owner, status }) {
  return (
    <div className={`player-card ${color}`}>
      {owner && <img src={crowIcon} alt="Owner" className="owner-icon" />}
      <span className="player-name">{name}</span>
      <div className={`player-status ${status}`}>{status.toUpperCase()}</div>
    </div>
  );
}
