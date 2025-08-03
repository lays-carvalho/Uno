const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  color: { type: String, required: true },
  value: { type: String, required: true },
  gameId: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Card", cardSchema);
