const service = require("../services/playerService");

async function createPlayer(req, res) {
  try {
    const player = await service.createPlayer(req.body);
    res.status(201).json(player);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getPlayer(req, res) {
  try {
    const player = await service.getPlayer(req.params.id);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updatePlayer(req, res) {
  try {
    const updated = await service.updatePlayer(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Player not found" });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deletePlayer(req, res) {
  try {
    const deleted = await service.deletePlayer(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Player not found" });
    }
    res.json({ message: "Player deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getAllPlayers(req, res) {
  try {
    const players = await service.getAllPlayers();
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createPlayer,
  getPlayer,
  updatePlayer,
  deletePlayer,
  getAllPlayers,
};
