const service = require("../services/cardService");

async function createCard(req, res, next) {
  try {
    const card = await service.createCard(req.body);
    res.status(201).json(card);
  } catch (error) {
    next(error);
  }
}

async function getCard(req, res, next) {
  try {
    const card = await service.getCard(req.params.id);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }
    res.json(card);
  } catch (error) {
    next(error);
  }
}

async function updateCard(req, res, next) {
  try {
    const updated = await service.updateCard(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Card not found" });
    }
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

async function deleteCard(req, res, next) {
  try {
    const deleted = await service.deleteCard(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Card not found" });
    }
    res.json({ message: "Card deleted successfully" });
  } catch (error) {
    next(error);
  }
}

async function getAllCards(req, res, next) {
  try {
    const cards = await service.getAllCards();
    res.json(cards);
  } catch (error) {
    next(error);
  }
}

async function getTopCard(req, res, next) {
  try {
    const { game_id } = req.body;
    const result = await service.getTopCard(game_id);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createCard,
  getCard,
  updateCard,
  deleteCard,
  getAllCards,
  getTopCard,
};
