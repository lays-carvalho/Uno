/*
 * [2025-07-23] João Neto:
 * Semana 3: Atividade 5: Criar novo jogo
 */
const gameRepo = require('../repositories/gameRepository');
const { verifyToken } = require('../utils/tokenUtils');

exports.create = async ({ name, rules, token }) => {
  const { userId } = verifyToken(token);
  const game = await gameRepo.create({ 
    name, 
    rules, 
    creatorId: userId,
    status: 'waiting',
    players: [userId]
  });
  return { 
    message: 'Game created successfully', 
    game_id: game.id 
  };
};

/*
 * [2025-07-23] João Neto:
 * Semana 3: Atividade 6: Juntar a um jogo existente
 */
exports.join = async ({ game_id, token }) => {
  const { userId } = verifyToken(token);
  const game = await gameRepo.findById(game_id);
  
  if (!game) throw new Error('Game not found');
  if (game.players.includes(userId)) throw new Error('User already in game');
  if (game.status !== 'waiting') throw new Error('Game already started');

  await gameRepo.addPlayer(game_id, userId);
  return { 
    message: 'User joined the game successfully',
    currentPlayers: game.players.length + 1
  };
};

/*
 * [2025-07-23] João Neto:
 * Semana 3: Atividade 7: Começar jogo quando todos estiverem prontos
 */
exports.start = async ({ game_id, token }) => {
  const { userId } = verifyToken(token);
  const game = await gameRepo.findById(game_id);
  
  if (!game) throw new Error('Game not found');
  if (game.creatorId !== userId) throw new Error('Only creator can start the game');
  if (game.status !== 'waiting') throw new Error('Game already started');
  if (game.players.length < 2) throw new Error('Need at least 2 players to start');

  const updatedGame = await gameRepo.updateStatus(game_id, 'active');
  return { 
    message: 'Game started successfully',
    startTime: updatedGame.startedAt
  };
};