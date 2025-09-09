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

async function findScoresByGameId(gameId) {
  return await Score.find({ gameId });
}

async function findScoresByPlayerId(playerId) {
  try {
    return await Score.find({ playerId: playerId });
  } catch (error) {
    console.error("Error finding scores by playerId:", error);
    throw error;
  }
}

async function findAllScoresGroupedByPlayer() {
  try {
    return await Score.aggregate([
      {
        $group: {
          _id: "$playerId",
          wins: { $sum: { $cond: [{ $eq: ["$result", "win"] }, 1, 0] } },
          losses: { $sum: { $cond: [{ $eq: ["$result", "loss"] }, 1, 0] } },
          totalGames: { $sum: 1 }
        }
      },
      { $sort: { wins: -1 } } // Ordena por vitórias (descendente)
    ]);
  } catch (error) {
    console.error("Error grouping scores by player:", error);
    throw error;
  }
}

module.exports = {
  saveScore,
  findScoreById,
  updateScoreById,
  deleteScoreById,
  findAllScores,
  findScoresByGameId,
  findScoresByPlayerId,
  findAllScoresGroupedByPlayer
};