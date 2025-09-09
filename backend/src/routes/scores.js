const express = require("express");
const router = express.Router();
const scoreHandler = require("../handlers/scoreHandler");

// ROTAS ESTÁTICAS PRIMEIRO (para evitar conflitos)
router.get("/scores/allUsers", scoreHandler.getGlobalRanking);
router.get("/scores/win/byPlayer", scoreHandler.getVictoriesByPlayer);

// ROTAS DINÂMICAS DEPOIS
router.post("/scores", scoreHandler.createScore);
router.get("/scores", scoreHandler.getAllScores);
router.post("/scores/byGame", scoreHandler.getScoresByGameId);
router.get("/scores/byPlayer/:playerId", scoreHandler.getScoresByPlayer);

// ROTAS COM :id POR ÚLTIMO
router.get("/scores/:id", scoreHandler.getScore);
router.put("/scores/:id", scoreHandler.updateScore);
router.delete("/scores/:id", scoreHandler.deleteScore);

module.exports = router;