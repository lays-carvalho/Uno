const Game = require("../models/gameModel");

async function saveGame(gameData) {
  const game = new Game(gameData);
  return await game.save();
}

async function findGameById(id) {
  return await Game.findOne({ id });
}

async function updateGameById(id, updates) {
  return await Game.findOneAndUpdate({ id }, updates, { new: true });
}

async function deleteGameById(id) {
  return await Game.findOneAndDelete({ id });
}

async function findAllGames() {
  return await Game.find({});
}

module.exports = {
  saveGame,
  findGameById,
  updateGameById,
  deleteGameById,
  findAllGames
};
