const getNextId = require("../utils/getNextId");
const repository = require("../repositories/gameRepository");
const jwt = require("jsonwebtoken");

async function createGame(data) {
  const id = await getNextId("gameid");

  const game = {
    id: id.toString(),
    title: data.title,
    creator: data.creator,
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

async function startGame(gameId, accessToken) {
  const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
  const userId = decoded.id;

  const game = await repository.findGameById(gameId);
  if (!game) {
    throw new Error("Game not found");
  }

  if (game.creator !== userId) {
    throw new Error("Only the game creator can start the game");
  }

  const allReady = game.players.every((playerId) =>
    game.readyPlayers.includes(playerId),
  );

  if (!allReady) {
    throw new Error("Not all players are ready");
  }

  game.status = "active";

  return repository.saveGame(game);
}

async function markAsReady(gameId, accessToken) {
  const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
  const userId = decoded.id;

  const game = await repository.findGameById(gameId);
  if (!game) {
    throw new Error("Game not found");
  }

  if (!game.players.includes(userId)) {
    throw new Error("User not in game");
  }

  if (game.readyPlayers.includes(userId)) {
    throw new Error("User already has been marked as ready");
  }

  game.readyPlayers.push(userId);

  return await repository.saveGame(game);
}

module.exports = {
  createGame,
  getGame,
  updateGame,
  deleteGame,
  getAllGames,
  joinGame,
  startGame,
  markAsReady,
};
