const service = require("../services/scoreService");

async function createScore(req, res, next) {
  try {
    const score = await service.createScore(req.body);
    res.status(201).json(score);
  } catch (error) {
    next(error);
  }
}

async function getScore(req, res, next) {
  try {
    const score = await service.getScore(req.params.id);
    res.json(score);
  } catch (error) {
    next(error);
  }
}

async function updateScore(req, res, next) {
  const { id } = req.params;

  try {
    const updated = await service.updateScore(id, req.body);
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

async function deleteScore(req, res, next) {
  const { id } = req.params;

  try {
    await service.deleteScore(id);
    res.json({ message: "Score deleted successfully" });
  } catch (error) {
    next(error);
  }
}

async function getAllScores(req, res, next) {
  try {
    const scores = await service.getAllScores();
    res.json(scores);
  } catch (error) {
    next(error);
  }
}

async function getScoresByGameId(req, res, next) {
  const { id } = req.body;

  try {
    const score = await service.getScoresByGameId(id);
    res.json(score);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createScore,
  getScore,
  updateScore,
  deleteScore,
  getAllScores,
  getScoresByGameId,
};
