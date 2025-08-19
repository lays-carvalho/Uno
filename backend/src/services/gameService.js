const getNextId = require("../utils/getNextId");
const repository = require("../repositories/gameRepository");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

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
  const game = await repository.findGameById(id);
  if (!game) {
    throw new AppError("Game not found", 404);
  }

  return game;
}

async function updateGame(id, updates) {
  const game = await repository.findGameById(id);
  if (!game) {
    throw new AppError("Game not found", 404);
  }

  return await repository.updateGameById(id, updates);
}

async function deleteGame(id) {
  const game = await repository.findGameById(id);
  if (!game) {
    throw new AppError("Game not found", 404);
  }

  return await repository.deleteGameById(id);
}

async function getAllGames() {
  return await repository.findAllGames();
}

async function joinGame(gameId, accessToken) {
  const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
  const userId = decoded.id;

  const game = await repository.findGameById(gameId);
  if (!game) {
    throw new AppError("Game not found", 404);
  }

  if (game.players.includes(userId)) {
    throw new AppError("User already in the game", 409);
  }

  game.players.push(userId);

  return await repository.saveGame(game);
}

async function startGame(gameId, accessToken) {
  const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
  const userId = decoded.id;

  const game = await repository.findGameById(gameId);
  if (!game) {
    throw new AppError("Game not found", 404);
  }

  if (game.creator !== userId) {
    throw new AppError("Only the game creator can start the game", 403);
  }

  if (game.players.length < 2) {
    throw new AppError("Insufficient number of players", 400);
  }

  if (game.players.length < 2) {
    throw new Error("Insufficient number of players");
  }

  const allReady = game.players.every((playerId) =>
    game.readyPlayers.includes(playerId),
  );

  if (!allReady) {
    throw new AppError("Not all players are ready", 400);
  }

  const updatedGame = await repository.updateGameById(gameId, {
    status: "active",
    currentPlayer: game.players[0],
  });

  return updatedGame;
}

async function markAsReady(gameId, accessToken) {
  const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
  const userId = decoded.id;

  const game = await repository.findGameById(gameId);
  if (!game) {
    throw new AppError("Game not found", 404);
  }

  if (!game.players.includes(userId)) {
    throw new AppError("User not in game", 400);
  }

  if (game.readyPlayers.includes(userId)) {
    throw new AppError("User already has been marked as ready", 400);
  }

  game.readyPlayers.push(userId);

  return await repository.saveGame(game);
}

async function leaveGame(gameId, accessToken) {
  const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
  const userId = decoded.id;

  const game = await repository.findGameById(gameId);
  if (!game) {
    throw new AppError("Game not found", 404);
  }

  if (game.status !== "active" && game.status !== "not_started") {
    throw new AppError("Game is not in progress", 400);
  }

  if (!game.players.includes(userId)) {
    throw new AppError("User not in the game", 400);
  }

  if (game.leftPlayers.includes(userId)) {
    throw new AppError("User already left the game", 400);
  }

  game.leftPlayers.push(userId);

  game.readyPlayers = game.readyPlayers.filter((id) => id !== userId);

  const allLeft = game.players.every((id) => game.leftPlayers.includes(id));

  if (allLeft) {
    game.status = "inactive";
  }

  return await repository.saveGame(game);
}

async function endGame(gameId, accessToken) {
  const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
  const userId = decoded.id;

  const game = await repository.findGameById(gameId);
  if (!game) {
    throw new AppError("Game not found", 404);
  }

  if (game.creator !== userId) {
    throw new AppError("Only the game creator can end the game", 401);
  }

  if (game.status !== "active") {
    throw new Error("Game is not active");
  }

  game.status = "inactive";

  return await repository.saveGame(game);
}

async function getGameState(gameId) {
  const game = await repository.findGameById(gameId);
  if (!game) {
    throw new AppError("Game not found", 404);
  }

  return {
    game_id: game.id,
    state: game.status === "active" ? "in_progress" : game.status,
  };
}

async function getPlayersInGame(gameId) {
  const game = await repository.findGameById(gameId);
  if (!game) {
    throw new AppError("Game not found", 404);
  }

  return {
    game_id: game.id,
    players: game.players,
    left_players: game.leftPlayers,
  };
}

async function getCurrentPlayer(gameId) {
  const game = await repository.findGameById(gameId);
  if (!game) {
    throw new AppError("Game not found", 404);
  }

  return {
    game_id: game.id,
    current_player: game.currentPlayer,
  };
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
  leaveGame,
  endGame,
  getGameState,
  getPlayersInGame,
  getCurrentPlayer,
};
