const Player = require("../models/playerModel");

async function savePlayer(playerData) {
  const player = new Player(playerData);
  return await player.save();
}

async function findPlayerById(id) {
  return await Player.findOne({ id });
}

async function updatePlayerById(id, updates) {
  return await Player.findOneAndUpdate({ id }, updates, { new: true });
}

async function deletePlayerById(id) {
  return await Player.findOneAndDelete({ id });
}

async function findAllPlayers() {
  return await Player.find({});
}

module.exports = {
  savePlayer,
  findPlayerById,
  updatePlayerById,
  deletePlayerById,
  findAllPlayers,
};
