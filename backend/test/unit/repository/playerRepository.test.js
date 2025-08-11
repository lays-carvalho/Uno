const Player = require("../../../src/models/playerModel");
const playerRepository = require("../../../src/repositories/playerRepository");

jest.mock("../../../src/models/playerModel");

describe("Player Repository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("savePlayer", () => {
    test("should save a new player", async () => {
      const playerData = { id: "1", name: "John" };
      const mockSave = jest.fn().mockResolvedValue(playerData);
      Player.mockImplementation(() => ({ save: mockSave }));

      const result = await playerRepository.savePlayer(playerData);

      expect(Player).toHaveBeenCalledWith(playerData);
      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual(playerData);
    });
  });

  describe("findPlayerById", () => {
    test("should find a player by id", async () => {
      const mockPlayer = { id: "1", name: "John" };
      Player.findOne.mockResolvedValue(mockPlayer);

      const result = await playerRepository.findPlayerById("1");

      expect(Player.findOne).toHaveBeenCalledWith({ id: "1" });
      expect(result).toEqual(mockPlayer);
    });
  });

  describe("findPlayerByEmail", () => {
    test("should find a player by email", async () => {
      const mockPlayer = { id: "1", email: "test@test.com" };
      Player.findOne.mockResolvedValue(mockPlayer);

      const result = await playerRepository.findPlayerByEmail("test@test.com");

      expect(Player.findOne).toHaveBeenCalledWith({ email: "test@test.com" });
      expect(result).toEqual(mockPlayer);
    });
  });

  describe("updatePlayerById", () => {
    test("should update a player by id", async () => {
      const updates = { name: "Jane" };
      const updatedPlayer = { id: "1", name: "Jane" };
      Player.findOneAndUpdate.mockResolvedValue(updatedPlayer);

      const result = await playerRepository.updatePlayerById("1", updates);

      expect(Player.findOneAndUpdate).toHaveBeenCalledWith(
        { id: "1" },
        updates,
        { new: true },
      );
      expect(result).toEqual(updatedPlayer);
    });
  });

  describe("deletePlayerById", () => {
    test("should delete a player by id", async () => {
      const deletedPlayer = { id: "1" };
      Player.findOneAndDelete.mockResolvedValue(deletedPlayer);

      const result = await playerRepository.deletePlayerById("1");

      expect(Player.findOneAndDelete).toHaveBeenCalledWith({ id: "1" });
      expect(result).toEqual(deletedPlayer);
    });
  });

  describe("findAllPlayers", () => {
    test("should return all players", async () => {
      const mockPlayers = [{ id: "1" }, { id: "2" }];
      Player.find.mockResolvedValue(mockPlayers);

      const result = await playerRepository.findAllPlayers();

      expect(Player.find).toHaveBeenCalledWith({});
      expect(result).toEqual(mockPlayers);
    });
  });
});
