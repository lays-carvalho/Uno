const service = require("../services/gameService");

async function createGame(req, res, next) {
  try {
    const game = await service.createGame(req.body);
    res
      .status(201)
      .json({ message: "Game created successfully", game_id: game.id });
  } catch (error) {
    next(error);
  }
}

async function getGame(req, res, next) {
  try {
    const game = await service.getGame(req.params.id);
    res.json(game);
  } catch (error) {
    next(error);
  }
}

async function updateGame(req, res, next) {
  try {
    const updated = await service.updateGame(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

async function deleteGame(req, res, next) {
  try {
    await service.deleteGame(req.params.id);
    res.json({ message: "Game deleted successfully" });
  } catch (error) {
    next(error);
  }
}

async function getAllGames(req, res, next) {
  try {
    const games = await service.getAllGames();
    res.json(games);
  } catch (error) {
    next(error);
  }
}

async function joinGame(req, res, next) {
  const { gameId, accessToken } = req.body;

  try {
    await service.joinGame(gameId, accessToken);
    return res
      .status(201)
      .json({ message: "User joined the game successfully" });
  } catch (error) {
    next(error);
  }
}

async function startGame(req, res, next) {
  const { gameId, accessToken } = req.body;

  try {
    await service.startGame(gameId, accessToken);
    res.status(200).json({ message: "Game started successfully" });
  } catch (error) {
    next(error);
  }
}

async function markAsReady(req, res, next) {
  const { gameId, accessToken } = req.body;

  try {
    await service.markAsReady(gameId, accessToken);
    res.json({ message: "Player marked as ready" });
  } catch (error) {
    next(error);
  }
}

async function leaveGame(req, res, next) {
  const { game_id, access_token } = req.body;

  try {
    await service.leaveGame(game_id, access_token);
    res.json({ message: "User left the game successfully" });
  } catch (error) {
    next(error);
  }
}

async function endGame(req, res, next) {
  const { game_id, access_token } = req.body;

  try {
    await service.endGame(game_id, access_token);
    res.json({ message: "Game ended successfully" });
  } catch (error) {
    next(error);
  }
}

async function getGameState(req, res, next) {
  const { game_id } = req.body;

  try {
    const state = await service.getGameState(game_id);
    res.json(state);
  } catch (error) {
    next(error);
  }
}

async function getPlayersInGame(req, res, next) {
  const { game_id } = req.body;

  try {
    const result = await service.getPlayersInGame(game_id);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function getCurrentPlayer(req, res, next) {
  const { game_id } = req.body;

  try {
    const result = await service.getCurrentPlayer(game_id);
    res.json(result);
  } catch (error) {
    next(error);
  }
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
