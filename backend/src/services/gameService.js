const getNextId = require("../utils/getNextId");
const repository = require("../repositories/gameRepository");
const jwt = require("jsonwebtoken");

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

async function joinGame(gameId, accessToken) {
  const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
  const userId = decoded.id;

  const game = await getGame(gameId);
  if (!game) {
    throw new Error("Game not found");
  }

  if (game.players.includes(userId)) {
    throw new Error("User already in the game");
  }

  game.players.push(userId);

  return await repository.saveGame(game);
}

module.exports = {
  createGame,
  getGame,
  updateGame,
  deleteGame,
  getAllGames,
  joinGame,
};
