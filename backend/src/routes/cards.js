const express = require("express"); 
const router = express.Router();
const handler = require("../handlers/cardHandler");

router.post("/cards", handler.createCard);
router.get("/cards", handler.getAllCards);
router.get("/cards/:id", handler.getCard);
router.put("/cards/:id", handler.updateCard);
router.delete("/cards/:id", handler.deleteCard);
router.post("/cards/topCard", handler.getTopCard); //13

//Nova rota: jogar carta
router.post("/cards/playCard", (req, res) => {
  const { cardPlayed, currentPlayerIndex, players, direction } = req.body;

  if (!players || !Array.isArray(players) || players.length === 0) {
    return res.status(400).json({ error: "Lista de jogadores inválida" });
  }

  if (currentPlayerIndex < 0 || currentPlayerIndex >= players.length) {
    return res.status(400).json({ error: "Índice de jogador inválido" });
  }

  if (!["clockwise", "counterclockwise"].includes(direction)) {
    return res.status(400).json({ error: "Direção inválida" });
  }

  let nextIndex;
  let skippedPlayer = null;

  // Sentido horário
  if (direction === "clockwise") {
    if (cardPlayed === "skip") {
      skippedPlayer = players[(currentPlayerIndex + 1) % players.length];
      nextIndex = (currentPlayerIndex + 2) % players.length;
    } else {
      nextIndex = (currentPlayerIndex + 1) % players.length;
    }
  }

  // Sentido anti-horário
  if (direction === "counterclockwise") {
    if (cardPlayed === "skip") {
      skippedPlayer = players[(currentPlayerIndex - 1 + players.length) % players.length];
      nextIndex = (currentPlayerIndex - 2 + players.length) % players.length;
    } else {
      nextIndex = (currentPlayerIndex - 1 + players.length) % players.length;
    }
  }

  return res.status(200).json({
    nextPlayerIndex: nextIndex,
    nextPlayer: players[nextIndex],
    ...(skippedPlayer && { skippedPlayer }), 
  });
});

module.exports = router;

