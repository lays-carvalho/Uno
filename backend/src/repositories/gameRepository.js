/*
 * [2025-07-23] João Neto:
 * Semana 3: Atividade 5: Criar novo jogo
 */
const Game = require('../models/gameModel');

exports.create = (data) => Game.create(data);
exports.findById = (id) => Game.findById(id);
exports.addPlayer = async (game, userId) => {
  if (!game.players.includes(userId)) {
    game.players.push(userId);
    await game.save();
  }
};
exports.startGame = async (id) => {
  const game = await Game.findById(id);
  game.started = true;
  await game.save();
  return game;
};