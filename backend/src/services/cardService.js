const getNextId = require("../utils/getNextId");
const repository = require("../repositories/cardRepository");

async function createCard(data) {
  const id = await getNextId("cardid");

  const card = {
    id: id.toString(),
    color: data.color,
    value: data.value,
    gameId: data.gameId
  };

  return await repository.saveCard(card);
}

async function getCard(id) {
  return await repository.findCardById(id);
}

async function updateCard(id, updates) {
  return await repository.updateCardById(id, updates);
}

async function deleteCard(id) {
  return await repository.deleteCardById(id);
}

async function getAllCards() {
  return await repository.findAllCards();
}

module.exports = {
  createCard,
  getCard,
  updateCard,
  deleteCard,
  getAllCards
};
