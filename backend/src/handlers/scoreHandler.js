const service = require("../services/scoreService");

async function createScore(req, res) {
  try {
    const score = await service.createScore(req.body);
    res.status(201).json(score);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getScore(req, res) {
  try {
    const score = await service.getScore(req.params.id);
    if (!score) {
      return res.status(404).json({ message: "Score not found" });
    }
    res.json(score);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateScore(req, res) {
  try {
    const updated = await service.updateScore(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Score not found" });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteScore(req, res) {
  try {
    const deleted = await service.deleteScore(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Score not found" });
    }
    res.json({ message: "Score deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getAllScores(req, res) {
  try {
    const scores = await service.getAllScores();
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createScore,
  getScore,
  updateScore,
  deleteScore,
  getAllScores
};
