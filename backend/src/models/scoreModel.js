const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  playerId: { type: String, required: true },
  gameId: { type: String, required: true },
  score: { type: Number, required: true },
  result: { 
    type: String,
    required: true,
    enum: ["win", "loss"]
  },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Score", scoreSchema);