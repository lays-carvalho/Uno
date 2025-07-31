const getNextId = require("../utils/getNextId");
const repository = require("../repositories/scoreRepository");

async function createScore(data) {
  const id = await getNextId("scoreid");

  const score = {
    id: id.toString(),
    playerId: data.playerId,
    gameId: data.gameId,
    score: data.score
  };

  return await repository.saveScore(score);
}

async function getScore(id) {
  return await repository.findScoreById(id);
}

async function updateScore(id, updates) {
  return await repository.updateScoreById(id, updates);
}

async function deleteScore(id) {
  return await repository.deleteScoreById(id);
}

async function getAllScores() {
  return await repository.findAllScores();
}

module.exports = {
  createScore,
  getScore,
  updateScore,
  deleteScore,
  getAllScores
};
