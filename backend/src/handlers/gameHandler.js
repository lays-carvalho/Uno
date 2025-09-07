const service = require("../services/gameService");

async function createGame(req, res, next) {
  try {
    const { accessToken, title} = req.body;

    // Validação básica
    if (!accessToken) {
      return res.status(401).json({ message: "Access token is required" });
    }

    // João Neto(ToDo): Passar o accessToken para o service
    const game = await service.createGame({
      accessToken,
      title
    });
    
    res.status(201).json({ 
      message: "Game created successfully", 
      game_id: game.id 
    });
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
    // Verificação adicional de status
    const game = await service.getGame(gameId);
    if (game.status !== "not_started") {
      return res.status(400).json({ 
        message: "Game can only be started from 'not_started' status" 
      });
    }

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
  const { gameId, accessToken } = req.body;

  try {
    await service.leaveGame(gameId, accessToken);
    res.json({ message: "User left the game successfully" });
  } catch (error) {
    next(error);
  }
}

async function endGame(req, res, next) {
  const { gameId, accessToken } = req.body;

  try {
    await service.endGame(gameId, accessToken);
    res.json({ message: "Game ended successfully" });
  } catch (error) {
    next(error);
  }
}

async function getGameState(req, res, next) {
  const { gameId } = req.body;

  try {
    const state = await service.getGameState(gameId);
    res.json(state);
  } catch (error) {
    next(error);
  }
}

async function getPlayersInGame(req, res, next) {
  const { gameId } = req.body;

  try {
    const result = await service.getPlayersInGame(gameId);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function getCurrentPlayer(req, res, next) {
  const { gameId } = req.body;

  try {
    const result = await service.getCurrentPlayer(gameId);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function distributeCardsHandler(req, res, next) {
  const { gameId } = req.body;

  try {
    const result = await service.distributeCards(gameId);
    res.status(200).json(result);
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
  distributeCardsHandler
};