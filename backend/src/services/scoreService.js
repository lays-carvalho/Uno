const scoreRepository = require("../repositories/scoreRepository");
const AppError = require("../utils/appError");

async function createScore(data) {
  return await scoreRepository.saveScore(data);
}

async function getScore(id) {
  const score = await scoreRepository.findScoreById(id);
  if (!score) throw new AppError("Score not found", 404);
  return score;
}

async function updateScore(id, updates) {
  return await scoreRepository.updateScoreById(id, updates);
}

async function deleteScore(id) {
  return await scoreRepository.deleteScoreById(id);
}

async function getAllScores() {
  return await scoreRepository.findAllScores();
}

async function getScoresByGameId(gameId) {
  return await scoreRepository.findScoresByGameId(gameId);
}

async function getPlayerMetrics(playerId) {
  try {
    const scores = await scoreRepository.findScoresByPlayerId(playerId);
    
    const wins = scores.filter(score => score.result === "win").length;
    const loss = scores.filter(score => score.result === "loss").length;
    const total = wins + loss;
    
    return {
      wins,
      loss, 
      total
    };
  } catch (error) {
    console.error("Error getting player metrics:", error);
    return {
      wins: 0,
      loss: 0,
      total: 0
    };
  }
}

// NOVA FUNÇÃO: Ranking Global
async function getGlobalRanking() {
  try {
    const playerStats = await scoreRepository.findAllScoresGroupedByPlayer();
    
    const ranking = await Promise.all(
      playerStats.map(async (stat) => {
        return {
          playerId: stat._id,
          wins: stat.wins,
          losses: stat.losses,
          totalGames: stat.totalGames
        };
      })
    );
    
    return ranking;
  } catch (error) {
    console.error("Error getting global ranking:", error);
    throw new AppError("Error retrieving global ranking", 500);
  }
}

// NOVA FUNÇÃO: Vitórias por Jogador
async function getVictoriesByPlayer() {
  try {
    const playerStats = await scoreRepository.findAllScoresGroupedByPlayer();
    
    return playerStats.reduce((acc, stat) => {
      acc[stat._id] = { win: stat.wins, lose: stat.losses };
      return acc;
    }, {});
  } catch (error) {
    console.error("Error getting victories by player:", error);
    throw new AppError("Error retrieving victories by player", 500);
  }
}

module.exports = {
  createScore,
  getScore,
  updateScore,
  deleteScore,
  getAllScores,
  getScoresByGameId,
  getPlayerMetrics,
  getGlobalRanking,
  getVictoriesByPlayer 
};