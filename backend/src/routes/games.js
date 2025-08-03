const express = require("express");
const router = express.Router();
const handler = require("../handlers/gameHandler");

router.post("/games", handler.createGame);
router.get("/games", handler.getAllGames);
router.get("/games/:id", handler.getGame);
router.put("/games/:id", handler.updateGame);
router.delete("/games/:id", handler.deleteGame);
router.post("/games/joinGame", handler.joinGame);
router.post("/games/markAsReady", handler.markAsReady);
router.post("/games/startGame", handler.startGame);
router.post("/games/leave", handler.leaveGame); //8
router.post("/games/end", handler.endGame); //9
router.post("/games/state", handler.getGameState); //10
router.post("/games/players", handler.getPlayersInGame); //11


module.exports = router;
