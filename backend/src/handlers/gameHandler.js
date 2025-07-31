const service = require("../services/gameService");

async function createGame(req, res) {
  try {
    const game = await service.createGame(req.body);
    res.status(201).json(game);
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

module.exports = {
  createGame,
  getGame,
  updateGame,
  deleteGame,
  getAllGames
};
