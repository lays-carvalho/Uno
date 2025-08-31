const express = require("express");
const router = express.Router();
const handler = require("../handlers/gameHandler");
const deckHandler = require("../handlers/deckHandler");
const turnHandler = require("../handlers/turnHandler");

router.post("/games", handler.createGame);
router.get("/games", handler.getAllGames);
router.get("/games/:id", handler.getGame);
router.put("/games/:id", handler.updateGame);
router.delete("/games/:id", handler.deleteGame);
router.post("/games/joinGame", handler.joinGame);
router.post("/games/markAsReady", handler.markAsReady);
router.post("/games/startGame", handler.startGame);
router.post("/games/leave", handler.leaveGame);
router.post("/games/end", handler.endGame);
router.post("/games/state", handler.getGameState);
router.post("/games/players", handler.getPlayersInGame);
router.post("/games/currentPlayer", handler.getCurrentPlayer);

router.get("/games/:gameId/deck", deckHandler.getDeckSnapshot);

router.get("/games/:id/hand/:player", turnHandler.getPlayerHand);
router.put("/games/:id/playcard", turnHandler.playCard);
router.put("/games/:id/draw", turnHandler.drawCard);

module.exports = router;
