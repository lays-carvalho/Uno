const getNextId = require("../utils/getNextId");
const repository = require("../repositories/playerRepository");

async function createPlayer(data) {
  const id = await getNextId("playerid"); // gera próximo número

  const player = {
    id: id.toString(), // ou só id, se quiser número no JSON
    name: data.name,
    age: data.age,
    email: data.email,
  };

  return await repository.savePlayer(player);
}

async function getPlayer(id) {
  return await repository.findPlayerById(id);
}

async function updatePlayer(id, updates) {
  return await repository.updatePlayerById(id, updates);
}

async function deletePlayer(id) {
  return await repository.deletePlayerById(id);
}

async function getAllPlayers() {
  return await repository.findAllPlayers();
}

module.exports = {
  createPlayer,
  getPlayer,
  updatePlayer,
  deletePlayer,
  getAllPlayers,
};
