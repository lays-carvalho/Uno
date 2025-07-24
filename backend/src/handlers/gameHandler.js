/*
 * [2025-07-23] João Neto:
 * Semana 3: Atividade 7: Começar jogo quando todos estiverem prontos
 */
const gameService = require('../services/gameService');

// Helper para extrair token
const extractToken = (req) => req.headers.authorization?.split(' ')[1];

exports.create = async (req, res) => {
  try {
    const token = extractToken(req);
    const gameData = {
      ...req.body,
      token // Passa o token junto com os dados do jogo
    };
    const newGame = await gameService.create(gameData); 
    res.status(201).json({
      message: "Game created successfully",
      game_id: newGame._id
    });
  } catch (err) {
    res.status(400).json({ 
      error: "Failed to create game",
      details: err.message 
    });
  }
};

exports.join = async (req, res) => {
  try {
    const token = extractToken(req);
    const joinData = {
      game_id: req.body.game_id,
      token
    };
    await gameService.join(joinData); 
    res.status(200).json({ 
      message: "Successfully joined the game" 
    });
  } catch (err) {
    res.status(400).json({
      error: "Failed to join game",
      details: err.message
    });
  }
};

exports.start = async (req, res) => {
  try {
    const token = extractToken(req);
    const startData = {
      game_id: req.body.game_id,
      token
    };
    await gameService.start(startData); 
    res.status(200).json({ 
      message: "Game started successfully" 
    });
  } catch (err) {
    res.status(403).json({
      error: "Failed to start game",
      details: err.message
    });
  }
};