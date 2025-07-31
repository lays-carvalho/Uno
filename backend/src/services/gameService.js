const getNextId = require("../utils/getNextId");
const repository = require("../repositories/gameRepository");

async function createGame(data) {
  const id = await getNextId("gameid");

  const game = {
    id: id.toString(),
    title: data.title,
    status: data.status,
    maxPlayers: data.maxPlayers,
  };

  return await repository.saveGame(game);
}

async function getGame(id) {
  return await repository.findGameById(id);
}

async function updateGame(id, updates) {
  return await repository.updateGameById(id, updates);
}

async function deleteGame(id) {
  return await repository.deleteGameById(id);
}

async function getAllGames() {
  return await repository.findAllGames();
}

module.exports = {
  createGame,
  getGame,
  updateGame,
  deleteGame,
  getAllGames
};
