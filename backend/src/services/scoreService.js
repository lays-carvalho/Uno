const getNextId = require("../utils/getNextId");
const repository = require("../repositories/scoreRepository");
const repoPlayer = require("../repositories/playerRepository");
const repoGame = require("../repositories/gameRepository");
const AppError = require("../utils/appError");

async function createScore(data) {
  const id = await getNextId("scoreid");

  const player = await repoPlayer.findPlayerById(data.playerId);
  if (!player) {
    throw new AppError("Player not found", 404);
  }

  const game = await repoGame.findGameById(data.gameId);
  if (!game) {
    throw new AppError("Game not found", 404);
  }

  const score = {
    id: id,
    playerId: data.playerId,
    gameId: data.gameId,
    score: data.score,
  };

  return await repository.saveScore(score);
}

async function getScore(id) {
  const score = await repository.findScoreById(id);
  if (!score) {
    throw new AppError("Score not found", 404);
  }

  return score;
}

async function updateScore(id, updates) {
  const score = await repository.findScoreById(id);
  if (!score) {
    throw new AppError("Score not found", 404);
  }

  return await repository.updateScoreById(id, updates);
}

async function deleteScore(id) {
  const score = await repository.findScoreById(id);
  if (!score) {
    throw new AppError("Score not found", 404);
  }

  return await repository.deleteScoreById(id);
}

async function getAllScores() {
  return await repository.findAllScores();
}

async function getScoresByGameId(gameId) {
  const scoreDocs = await repository.findScoresByGameId(gameId);
  const scores = {};

  scoreDocs.forEach((doc, index) => {
    const label = `Player${index + 1} - ${doc.playerId}`;
    scores[label] = doc.score;
  });

  return {
    game_id: gameId,
    scores,
  };
}

module.exports = {
  createScore,
  getScore,
  updateScore,
  deleteScore,
  getAllScores,
  getScoresByGameId,
};
