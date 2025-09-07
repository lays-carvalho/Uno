const getNextId = require("../../../src/utils/getNextId");
const repository = require("../../../src/repositories/cardRepository");
const cardService = require("../../../src/services/cardService");

jest.mock("../../../src/utils/getNextId");
jest.mock("../../../src/repositories/cardRepository");

describe("Card Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createCard", () => {
    test("should create a card with generated id and save it in the repository", async () => {
      getNextId.mockResolvedValue(123);
      const data = { color: "red", value: "5", gameId: "1" };
      const savedCard = { id: "123", ...data };
      repository.saveCard.mockResolvedValue(savedCard);

      const result = await cardService.createCard(data);

      expect(getNextId).toHaveBeenCalledWith("cardid");
      expect(repository.saveCard).toHaveBeenCalledWith({
        id: "123",
        color: "red",
        value: "5",
        gameId: "1",
      });
      expect(result).toEqual(savedCard);
    });
  });

  describe("getCard", () => {
    test("should find by id", async () => {
      const mockCard = { id: "1", color: "blue" };
      repository.findCardById.mockResolvedValue(mockCard);

      const result = await cardService.getCard("1");

      expect(repository.findCardById).toHaveBeenCalledWith("1");
      expect(result).toEqual(mockCard);
    });
  });

  describe("updateCard", () => {
    test("should update by id", async () => {
      const updates = { color: "green" };
      const updatedCard = { id: "1", color: "green" };
      repository.updateCardById.mockResolvedValue(updatedCard);

      const result = await cardService.updateCard("1", updates);

      expect(repository.updateCardById).toHaveBeenCalledWith("1", updates);
      expect(result).toEqual(updatedCard);
    });
  });

  describe("deleteCard", () => {
    test("should delete by id", async () => {
      repository.deleteCardById.mockResolvedValue(true);

      const result = await cardService.deleteCard("1");

      expect(repository.deleteCardById).toHaveBeenCalledWith("1");
      expect(result).toBe(true);
    });
  });

  describe("getAllCards", () => {
    test("should return all", async () => {
      const mockCards = [{ id: "1" }, { id: "2" }];
      repository.findAllCards.mockResolvedValue(mockCards);

      const result = await cardService.getAllCards();

      expect(repository.findAllCards).toHaveBeenCalled();
      expect(result).toEqual(mockCards);
    });
  });

  describe("getTopCard", () => {
    test("should return a top card for game", async () => {
      const gameId = "10";
      const mockCard = {
        id: "123",
        color: "yellow",
        value: "7",
        gameId: "10",
        createdAt: new Date(),
      };
      repository.getTopDiscardCard.mockResolvedValue(mockCard);

      const result = await cardService.getTopCard(gameId);

      expect(repository.getTopDiscardCard).toHaveBeenCalledWith(gameId);
      expect(result).toEqual({
        game_id: 10,
        top_card: {
          id: "123",
          color: "yellow",
          value: "7",
          gameId: "10",
          createdAt: mockCard.createdAt,
        },
      });
    });

    test("should throw error if there isn't top card", async () => {
      repository.getTopDiscardCard.mockResolvedValue(null);

      await expect(cardService.getTopCard("10")).rejects.toThrow(
        "No card found for this game",
      );

      expect(repository.getTopDiscardCard).toHaveBeenCalledWith("10");
    });
  });
});
