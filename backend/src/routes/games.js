const express = require("express");
const router = express.Router();
const handler = require("../handlers/gameHandler");

router.post("/games", handler.createGame);
router.get("/games", handler.getAllGames);
router.get("/games/:id", handler.getGame);
router.put("/games/:id", handler.updateGame);
router.delete("/games/:id", handler.deleteGame);
router.post("/games/joinGame", handler.joinGame);

module.exports = router;
