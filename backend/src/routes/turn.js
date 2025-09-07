const express = require("express");
const router = express.Router();

/**
 * POST /nextTurn
 * Calcula o próximo jogador no sentido horário
 */
router.post("/nextTurn", (req, res) => {
  const { players, currentPlayerIndex } = req.body;

  if (!players || !Array.isArray(players) || players.length === 0) {
    return res.status(400).json({ error: "Lista de jogadores inválida" });
  }

  if (currentPlayerIndex < 0 || currentPlayerIndex >= players.length) {
    return res.status(400).json({ error: "Índice de jogador inválido" });
  }

  const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
  const nextPlayer = players[nextPlayerIndex];

  return res.status(200).json({
    nextPlayerIndex,
    nextPlayer,
  });
});

module.exports = router;
