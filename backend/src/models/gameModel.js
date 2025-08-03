const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  status: {
    type: String,
    enum: ["active", "inactive", "not_started"],
    required: true,
  },
  maxPlayers: { type: Number, required: true },
  players: [{ type: mongoose.Schema.Types.Int32, ref: "Player" }],
  creator: { type: Number, required: true },
  readyPlayers: [{ type: Number }],
  leftPlayers: [{ type: Number }], 
  createdAt: { type: Date, default: Date.now },
  currentPlayer: { type: Number }
});

module.exports = mongoose.model("Game", gameSchema);
