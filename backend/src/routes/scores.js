const express = require("express");
const router = express.Router();
const handler = require("../handlers/scoreHandler");

router.post("/scores", handler.createScore);
router.get("/scores", handler.getAllScores);
router.get("/scores/:id", handler.getScore);
router.put("/scores/:id", handler.updateScore);
router.delete("/scores/:id", handler.deleteScore);

module.exports = router;
