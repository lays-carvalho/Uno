/*
 * [2025-07-23] João Neto:
 * Exemplo de Service que podemos utilizar
 */
const playerRepository = require('../repositories/playerRepository');

exports.createPlayer = async (data) => {
  return playerRepository.create(data);
};

exports.getAllPlayers = async () => {
  return playerRepository.findAll();
};
