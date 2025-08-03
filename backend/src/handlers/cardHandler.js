const service = require("../services/cardService");

async function createCard(req, res) {
  try {
    const card = await service.createCard(req.body);
    res.status(201).json(card);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getCard(req, res) {
  try {
    const card = await service.getCard(req.params.id);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }
    res.json(card);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateCard(req, res) {
  try {
    const updated = await service.updateCard(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Card not found" });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteCard(req, res) {
  try {
    const deleted = await service.deleteCard(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Card not found" });
    }
    res.json({ message: "Card deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getAllCards(req, res) {
  try {
    const cards = await service.getAllCards();
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createCard,
  getCard,
  updateCard,
  deleteCard,
  getAllCards
};
