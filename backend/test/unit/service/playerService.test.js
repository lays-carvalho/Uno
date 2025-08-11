const getNextId = require("../../../src/utils/getNextId");
const repository = require("../../../src/repositories/playerRepository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const BlacklistedToken = require("../../../src/models/tokensModel");
const playerService = require("../../../src/services/playerService");

jest.mock("../../../src/utils/getNextId");
jest.mock("../../../src/repositories/playerRepository");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../../../src/models/tokensModel");

describe("Player Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "secret";
  });

  describe("createPlayer", () => {
    test("should create player with hashed password", async () => {
      getNextId.mockResolvedValue(1);
      repository.findPlayerByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashed123");
      const data = { name: "John", email: "john@test.com", password: "1234" };
      const savedPlayer = { id: "1", ...data, password: "hashed123" };
      repository.savePlayer.mockResolvedValue(savedPlayer);

      const result = await playerService.createPlayer(data);

      expect(getNextId).toHaveBeenCalledWith("playerid");
      expect(repository.findPlayerByEmail).toHaveBeenCalledWith(data.email);
      expect(bcrypt.hash).toHaveBeenCalledWith("1234", 10);
      expect(repository.savePlayer).toHaveBeenCalledWith({
        id: "1",
        name: "John",
        email: "john@test.com",
        password: "hashed123",
      });
      expect(result).toEqual(savedPlayer);
    });

    test("should throw error if email already exists", async () => {
      repository.findPlayerByEmail.mockResolvedValue({ id: "1" });
      const data = { name: "John", email: "john@test.com", password: "1234" };

      await expect(playerService.createPlayer(data)).rejects.toThrow(
        "User already exists with this email.",
      );
    });
  });

  describe("getPlayer", () => {
    test("should find by id", async () => {
      const mockPlayer = { id: "1", name: "John" };
      repository.findPlayerById.mockResolvedValue(mockPlayer);

      const result = await playerService.getPlayer("1");

      expect(repository.findPlayerById).toHaveBeenCalledWith("1");
      expect(result).toEqual(mockPlayer);
    });
  });

  describe("updatePlayer", () => {
    test("should update by id", async () => {
      const updates = { name: "Jane" };
      const updated = { id: "1", name: "Jane" };
      repository.updatePlayerById.mockResolvedValue(updated);

      const result = await playerService.updatePlayer("1", updates);

      expect(repository.updatePlayerById).toHaveBeenCalledWith("1", updates);
      expect(result).toEqual(updated);
    });
  });

  describe("deletePlayer", () => {
    test("should delete by id", async () => {
      repository.deletePlayerById.mockResolvedValue(true);

      const result = await playerService.deletePlayer("1");

      expect(repository.deletePlayerById).toHaveBeenCalledWith("1");
      expect(result).toBe(true);
    });
  });

  describe("getAllPlayers", () => {
    test("should return all players", async () => {
      const mockPlayers = [{ id: "1" }];
      repository.findAllPlayers.mockResolvedValue(mockPlayers);

      const result = await playerService.getAllPlayers();

      expect(repository.findAllPlayers).toHaveBeenCalled();
      expect(result).toEqual(mockPlayers);
    });
  });

  describe("getPlayerInfo", () => {
    test("should return player info if token is valid", async () => {
      const token = "valid.token";
      BlacklistedToken.findOne.mockResolvedValue(null);
      jwt.verify.mockReturnValue({ id: "1" });
      const mockPlayer = { id: "1", name: "John" };
      repository.findPlayerById.mockResolvedValue(mockPlayer);

      const result = await playerService.getPlayerInfo(token);

      expect(BlacklistedToken.findOne).toHaveBeenCalledWith({ token });
      expect(jwt.verify).toHaveBeenCalledWith(token, "secret");
      expect(result).toEqual(mockPlayer);
    });

    test("should return error if token isn't provided", async () => {
      await expect(playerService.getPlayerInfo(null)).rejects.toThrow(
        "Access token is required",
      );
    });

    test("should return error if token is on blacklist", async () => {
      const token = "blacklisted.token";
      BlacklistedToken.findOne.mockResolvedValue({ token });

      await expect(playerService.getPlayerInfo(token)).rejects.toThrow(
        "Token is invalidated",
      );
    });
  });

  describe("login", () => {
    test("should return token if credentials is right", async () => {
      const mockUser = { id: "1", password: "hashed" };
      repository.findPlayerByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("signed.token");

      const result = await playerService.login("john@test.com", "1234");

      expect(repository.findPlayerByEmail).toHaveBeenCalledWith(
        "john@test.com",
      );
      expect(bcrypt.compare).toHaveBeenCalledWith("1234", "hashed");
      expect(jwt.sign).toHaveBeenCalledWith({ id: "1" }, "secret", {
        expiresIn: "6h",
      });
      expect(result).toBe("signed.token");
    });

    test("should throw error if password is wrong", async () => {
      const mockUser = { id: "1", password: "hashed" };
      repository.findPlayerByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        playerService.login("john@test.com", "wrong"),
      ).rejects.toThrow("Invalid credentials");
    });
  });

  describe("logout", () => {
    test("should add token to blacklist with expiration date", async () => {
      const token = "some.token";
      jwt.decode.mockReturnValue({ exp: 1700000000 });
      const mockBlacklisted = { token, expiresAt: new Date(1700000000 * 1000) };
      BlacklistedToken.create.mockResolvedValue(mockBlacklisted);

      const result = await playerService.logout(token);

      expect(jwt.decode).toHaveBeenCalledWith(token);
      expect(BlacklistedToken.create).toHaveBeenCalledWith({
        token,
        expiresAt: new Date(1700000000 * 1000),
      });
      expect(result).toEqual(mockBlacklisted);
    });
  });
});
