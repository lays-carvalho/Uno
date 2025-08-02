const express = require("express");
const router = express.Router();
const handler = require("../handlers/playerHandler");

router.post("/players", handler.createPlayer);
router.get("/players", handler.getAllPlayers);
router.get("/players/:id", handler.getPlayer);
router.put("/players/:id", handler.updatePlayer);
router.delete("/players/:id", handler.deletePlayer);
router.post("/players/login", handler.login);
router.post("/players/logout", handler.logout);

module.exports = router;
