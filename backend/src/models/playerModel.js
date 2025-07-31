//models/playerModel.js
/*const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Player", playerSchema);
*/


//models/playerModel.js
const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true }, // aqui number
  name: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Player", playerSchema);
