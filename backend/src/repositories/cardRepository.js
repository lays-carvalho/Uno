const Card = require("../models/cardModel");

async function saveCard(cardData) {
  const card = new Card(cardData);
  return await card.save();
}

async function findCardById(id) {
  return await Card.findOne({ id });
}

async function updateCardById(id, updates) {
  return await Card.findOneAndUpdate({ id }, updates, { new: true });
}

async function deleteCardById(id) {
  return await Card.findOneAndDelete({ id });
}

async function findAllCards() {
  return await Card.find({});
}

async function getTopDiscardCard(gameId) {
  return await Card.findOne({ gameId })
    .sort({ createdAt: -1 }); // pega a carta mais recente
}

module.exports = {
  saveCard,
  findCardById,
  updateCardById,
  deleteCardById,
  findAllCards,
  getTopDiscardCard
};
