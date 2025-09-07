const getNextId = require("../utils/getNextId");
const repository = require("../repositories/cardRepository");
const AppError = require("../utils/appError");

async function createCard(data) {
  const id = await getNextId("cardid");

  const card = {
    id: id.toString(),
    color: data.color,
    value: data.value,
    gameId: data.gameId,
  };

  return await repository.saveCard(card);
}

async function getCard(id) {
  const card = await repository.findCardById(id);
  if (!card) {
    throw new AppError("Card not found", 404);
  }

  return card;
}

async function updateCard(id, updates) {
  const card = await repository.findCardById(id);
  if (!card) {
    throw new AppError("Card not found", 404);
  }

  return await repository.updateCardById(id, updates);
}

async function deleteCard(id) {
  const card = await repository.findCardById(id);
  if (!card) {
    throw new AppError("Card not found", 404);
  }

  return await repository.deleteCardById(id);
}

async function getAllCards() {
  return await repository.findAllCards();
}

async function getTopCard(gameId) {
  const card = await repository.getTopDiscardCard(gameId);

  if (!card) {
    throw new AppError("No card found for this game", 400);
  }

  return {
    game_id: parseInt(gameId),
    top_card: {
      id: card.id,
      color: card.color,
      value: card.value,
      gameId: card.gameId,
      createdAt: card.createdAt,
    },
  };
}

module.exports = {
  createCard,
  getCard,
  updateCard,
  deleteCard,
  getAllCards,
  getTopCard,
};
