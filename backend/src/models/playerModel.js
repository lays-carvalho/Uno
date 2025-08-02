const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true }, // aqui number
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Player", playerSchema);
