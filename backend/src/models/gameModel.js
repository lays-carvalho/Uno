const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  status: { type: String, enum: ["active", "inactive"], required: true },
  maxPlayers: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Game", gameSchema);
