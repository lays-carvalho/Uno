const Score = require("../models/scoreModel");

async function saveScore(scoreData) {
  const score = new Score(scoreData);
  return await score.save();
}

async function findScoreById(id) {
  return await Score.findOne({ id });
}

async function updateScoreById(id, updates) {
  return await Score.findOneAndUpdate({ id }, updates, { new: true });
}

async function deleteScoreById(id) {
  return await Score.findOneAndDelete({ id });
}

async function findAllScores() {
  return await Score.find({});
}

module.exports = {
  saveScore,
  findScoreById,
  updateScoreById,
  deleteScoreById,
  findAllScores
};
