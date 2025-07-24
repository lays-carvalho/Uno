/*
 * [2025-07-23] João Neto:
 * Exemplo de Handler que podemos utilizar
 */

const playerService = require('../services/playerService');

exports.createPlayer = async (req, res) => {
  try {
    const player = await playerService.createPlayer(req.body);
    res.status(201).json(player);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllPlayers = async (req, res) => {
  try {
    const players = await playerService.getAllPlayers();
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
