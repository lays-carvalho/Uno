const express = require("express");
const router = express.Router();
const handler = require("../handlers/cardHandler");

router.post("/cards", handler.createCard);
router.get("/cards", handler.getAllCards);
router.get("/cards/:id", handler.getCard);
router.put("/cards/:id", handler.updateCard);
router.delete("/cards/:id", handler.deleteCard);
router.post("/cards/topCard", handler.getTopCard); //13

module.exports = router;
