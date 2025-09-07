const mongoose = require("mongoose");

const gameCardSchema = new mongoose.Schema({
  gameId: { type: String, required: true },
  color: { type: String, required: true },
  value: { type: String, required: true },
  owner: { type: Number, default: null },       // jogador que tem a carta
  discardOrder: { type: Number, default: null }, // para pilha de descarte
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("GameCard", gameCardSchema);
