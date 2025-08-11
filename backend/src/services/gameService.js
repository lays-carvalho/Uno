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

  if (game.players.length < 2) {
    throw new Error("Insufficient number of players");
  }

  const allReady = game.players.every((playerId) =>
    game.readyPlayers.includes(playerId),
  );

  if (!allReady) {
    throw new Error("Not all players are ready");
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

async function leaveGame(gameId, accessToken) {
  const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
  const userId = decoded.id;

  const game = await repository.findGameById(gameId);
  if (!game) throw new Error("Game not found");

  if (game.status !== "active" && game.status !== "not_started") {
    throw new Error("Game is not in progress");
  }

  if (!game.players.includes(userId)) {
    throw new Error("User not in the game");
  }

  if (game.leftPlayers.includes(userId)) {
    throw new Error("User already left the game");
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
  if (!game) throw new Error("Game not found");

  if (game.creator !== userId) {
    throw new Error("Only the game creator can end the game");
  }

  if (game.status !== "active") {
    throw new Error("Game is not active");
  }

  game.status = "inactive";

  return await repository.saveGame(game);
}

async function getGameState(gameId) {
  const game = await repository.findGameById(gameId);
  if (!game) throw new Error("Game not found");

  return {
    game_id: game.id,
    state: game.status === "active" ? "in_progress" : game.status,
  };
}

async function getPlayersInGame(gameId) {
  const game = await repository.findGameById(gameId);
  if (!game) throw new Error("Game not found");

  return {
    game_id: game.id,
    players: game.players,
    left_players: game.leftPlayers,
  };
}

async function getCurrentPlayer(gameId) {
  const game = await repository.findGameById(gameId);
  if (!game) {
    throw new Error("Game not found");
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
