import React, { useEffect, useState } from "react";
import "./Ranking.css";
import unoLogo from "../Assets/Uno-Logo.png";
import BackButton from "../components/BackButton";

const BASE_URL = process.env.REACT_APP_API_URL;

export default function RankingPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const response = await fetch(`${BASE_URL}/api/scores/allUsers`);
        if (!response.ok) {
          throw new Error("Erro ao buscar ranking");
        }

        const data = await response.json();
        setPlayers(data || []);
      } catch (error) {
        console.error(error);
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPlayers();
  }, []);

  return (
    <div className="ranking-page">
      <header className="ranking-header">
        <img src={unoLogo} alt="Uno Logo" className="uno-logo" />
        <h1 className="ranking-title">Ranking</h1>
        <BackButton to="/main" />
      </header>

      <div className="ranking-body">
        {loading ? (
          <div className="ranking-empty">
            <span>Loading ranking...</span>
          </div>
        ) : players.length === 0 ? (
          <div className="ranking-empty">
            <div className="ranking-empty-face">:(</div>
            <span>The ranking is empty.</span>
          </div>
        ) : (
          players.map((p, i) => (
            <div className="ranking-row" key={p.playerId || i}>
              <div className="ranking-position">{i + 1}º</div>

              <div className="ranking-username">
                <span className="field-pill">Player {p.playerId}</span>
              </div>

              <div className="ranking-stats">
                <span className="field-pill stat-total">
                  Total: {p.totalGames}
                </span>
                <span className="field-pill stat-win">Win: {p.wins}</span>
                <span className="field-pill stat-lost">Lost: {p.losses}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
