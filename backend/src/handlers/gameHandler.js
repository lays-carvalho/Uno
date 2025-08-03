const service = require("../services/gameService");

async function createGame(req, res) {
  try {
    const game = await service.createGame(req.body);
    res
      .status(201)
      .json({ message: "Game created successfully", game_id: game.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getGame(req, res) {
  try {
    const game = await service.getGame(req.params.id);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateGame(req, res) {
  try {
    const updated = await service.updateGame(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Game not found" });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteGame(req, res) {
  try {
    const deleted = await service.deleteGame(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Game not found" });
    }
    res.json({ message: "Game deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getAllGames(req, res) {
  try {
    const games = await service.getAllGames();
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function joinGame(req, res) {
  try {
    const { gameId, accessToken } = req.body;

    await service.joinGame(gameId, accessToken);

    return res.json({ message: "User joined the game successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function startGame(req, res) {
  try {
    const { gameId, accessToken } = req.body;
    const result = await service.startGame(gameId, accessToken);
    res.status(200).json({ message: "Game started successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function markAsReady(req, res) {
  try {
    const { gameId, accessToken } = req.body;

    await service.markAsReady(gameId, accessToken);

    res.json({ message: "Player marked as ready" });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
};
