const gameService = require("../services/gameService");

async function getPlayerHand(req, res, next) {
  try {
    const { id: gameId, player } = req.params;
    const result = await gameService.getPlayerHand(gameId, player);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function playCard(req, res, next) {
  try {
    const { id: gameId } = req.params;
    const { player, cardPlayed } = req.body;
    const result = await gameService.playCard(gameId, player, cardPlayed);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function drawCard(req, res, next) {
  try {
    const { id: gameId } = req.params;
    const { player } = req.body;
    const result = await gameService.drawCard(gameId, player);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { getPlayerHand, playCard, drawCard };
