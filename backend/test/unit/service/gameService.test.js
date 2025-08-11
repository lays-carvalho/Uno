const { base } = require("../../../src/models/gameModel");
const gameRepository = require("../../../src/repositories/gameRepository");
const {
  joinGame,
  startGame,
  endGame,
  deleteGame,
  createGame,
  getAllGames,
  markAsReady,
  leaveGame,
} = require("../../../src/services/gameService");
const jwt = require("jsonwebtoken");

jest.mock("../../../src/repositories/gameRepository");
jest.mock("jsonwebtoken");

describe("Join Game", () => {
  let baseGame;
  let baseUserId;
  let baseGameId;
  let fakeToken;

  beforeEach(() => {
    jest.clearAllMocks();
    baseUserId = "1";
    baseGameId = "1";
    fakeToken = "fake.jwt.token";

    baseGame = {
      id: baseGameId,
      players: [],
    };

    jwt.verify.mockReturnValue({ id: baseUserId });
  });

  test("Should throw error if user already in the game", async () => {
    const game = { id: baseGameId, players: [baseUserId] };
    gameRepository.findGameById.mockResolvedValue(game);

    await expect(joinGame(baseGameId, fakeToken)).rejects.toThrow(
      "User already in the game",
    );
    expect(gameRepository.saveGame).not.toHaveBeenCalled();
  });

  test("Player must be able to join a game where there are no players yet", async () => {
    gameRepository.findGameById.mockResolvedValue(baseGame);
    gameRepository.saveGame.mockResolvedValue({
      ...baseGame,
      players: [baseUserId],
    });

    const result = await joinGame(baseGameId, fakeToken);

    expect(gameRepository.findGameById).toHaveBeenCalledWith(baseGameId);
    expect(gameRepository.saveGame).toHaveBeenCalledWith({
      id: baseGameId,
      players: [baseUserId],
    });

    expect(result.players).toContain(baseUserId);
  });

  test("Player should not be able to join a game that does not exist", async () => {
    gameRepository.findGameById.mockResolvedValue(null);

    await expect(joinGame(baseGameId, fakeToken)).rejects.toThrow(
      "Game not found",
    );

    expect(gameRepository.findGameById).toHaveBeenCalledWith(baseGameId);
    expect(gameRepository.saveGame).not.toHaveBeenCalled();
  });

  test("Player must be able to join an existing game where there are already players", async () => {
    const otherUserId = "2";

    baseGame.players = [baseUserId];

    jwt.verify.mockReturnValue({ id: otherUserId });

    gameRepository.findGameById.mockResolvedValue(baseGame);
    gameRepository.saveGame.mockResolvedValue({
      ...baseGame,
      players: [baseUserId, otherUserId],
    });

    const result = await joinGame(baseGameId, fakeToken);

    expect(gameRepository.findGameById).toHaveBeenCalledWith(baseGameId);
    expect(gameRepository.saveGame).toHaveBeenCalledWith({
      id: baseGameId,
      players: [baseUserId, otherUserId],
    });

    expect(result.players).toContain(baseUserId);
    expect(result.players).toContain(otherUserId);
    expect(result.players.length).toBe(2);
  });
});

describe("Start Game", () => {
  let baseGameId;
  let fakeToken;
  let creatorId;
  let baseGame;

  beforeEach(() => {
    jest.clearAllMocks();

    baseGameId = "1";
    fakeToken = "fake.jwt.token";
    creatorId = "1";

    baseGame = {
      id: baseGameId,
      creator: creatorId,
      players: ["1", "1"],
      readyPlayers: ["1", "1"],
      status: "not_started",
      currentPlayer: null,
    };

    jwt.verify.mockReturnValue({ id: creatorId });
  });

  function makeGame(overrides = {}) {
    return { ...baseGame, ...overrides };
  }

  test("Should throw error if game does not exist", async () => {
    gameRepository.findGameById.mockResolvedValue(null);
    await expect(startGame(baseGameId, fakeToken)).rejects.toThrow(
      "Game not found",
    );
  });

  test("Should throw error if user is not the creator", async () => {
    const game = {
      creator: "2",
      players: ["1", "2"],
      readyPlayers: ["1", "2"],
    };
    gameRepository.findGameById.mockResolvedValue(game);
    jwt.verify.mockReturnValue({ id: "3" });

    await expect(startGame(baseGameId, fakeToken)).rejects.toThrow(
      "Only the game creator can start the game",
    );
  });

  test("Should throw error if not all players are ready", async () => {
    const game = {
      creator: creatorId,
      players: ["1", "2"],
      readyPlayers: ["1"],
    };
    gameRepository.findGameById.mockResolvedValue(game);

    await expect(startGame(baseGameId, fakeToken)).rejects.toThrow(
      "Not all players are ready",
    );
  });

  test("Game should not start with insufficient players (less than two)", async () => {
    const game = makeGame({
      players: ["1"],
      readyPlayers: ["1"],
    });

    gameRepository.findGameById.mockResolvedValue(game);

    await expect(startGame(baseGameId, fakeToken)).rejects.toThrow(
      "Insufficient number of players",
    );

    expect(gameRepository.findGameById).toHaveBeenCalledWith(baseGameId);
    expect(gameRepository.updateGameById).not.toHaveBeenCalled();
  });
});

describe("Mark As Ready", () => {
  let baseGameId, fakeToken, baseUserId;

  beforeEach(() => {
    jest.clearAllMocks();
    baseGameId = "1";
    baseUserId = "1";
    fakeToken = "fake.jwt.token";
    jwt.verify.mockReturnValue({ id: baseUserId });
  });

  test("Should throw error if game not found", async () => {
    gameRepository.findGameById.mockResolvedValue(null);
    await expect(markAsReady(baseGameId, fakeToken)).rejects.toThrow(
      "Game not found",
    );
  });

  test("Should throw error if user not in game", async () => {
    const game = { players: ["2"], readyPlayers: [] };
    gameRepository.findGameById.mockResolvedValue(game);
    await expect(markAsReady(baseGameId, fakeToken)).rejects.toThrow(
      "User not in game",
    );
  });

  test("Should throw error if user already marked as ready", async () => {
    const game = { players: ["1"], readyPlayers: ["1"] };
    gameRepository.findGameById.mockResolvedValue(game);
    await expect(markAsReady(baseGameId, fakeToken)).rejects.toThrow(
      "User already has been marked as ready",
    );
  });

  test("Should mark user as ready successfully", async () => {
    const game = { players: ["1"], readyPlayers: [] };
    gameRepository.findGameById.mockResolvedValue(game);
    gameRepository.saveGame.mockResolvedValue({ ...game, readyPlayers: ["1"] });

    const result = await markAsReady(baseGameId, fakeToken);
    expect(result.readyPlayers).toContain("1");
  });
});

describe("Leave Game", () => {
  let baseGameId, fakeToken, baseUserId;

  beforeEach(() => {
    jest.clearAllMocks();
    baseGameId = "1";
    baseUserId = "1";
    fakeToken = "fake.jwt.token";
    jwt.verify.mockReturnValue({ id: baseUserId });
  });

  test("Should throw if game not found", async () => {
    gameRepository.findGameById.mockResolvedValue(null);
    await expect(leaveGame(baseGameId, fakeToken)).rejects.toThrow(
      "Game not found",
    );
  });

  test("Should throw if game not in progress or not_started", async () => {
    const game = { status: "finished" };
    gameRepository.findGameById.mockResolvedValue(game);
    await expect(leaveGame(baseGameId, fakeToken)).rejects.toThrow(
      "Game is not in progress",
    );
  });

  test("Should throw if user not in game", async () => {
    const game = { status: "active", players: ["2"], leftPlayers: [] };
    gameRepository.findGameById.mockResolvedValue(game);
    await expect(leaveGame(baseGameId, fakeToken)).rejects.toThrow(
      "User not in the game",
    );
  });

  test("Should throw if user already left", async () => {
    const game = {
      status: "active",
      players: ["1"],
      leftPlayers: ["1"],
      readyPlayers: [],
    };
    gameRepository.findGameById.mockResolvedValue(game);
    await expect(leaveGame(baseGameId, fakeToken)).rejects.toThrow(
      "User already left the game",
    );
  });

  test("Should mark user as left and update game status if all left", async () => {
    const game = {
      status: "active",
      players: ["1"],
      leftPlayers: [],
      readyPlayers: ["1"],
    };
    gameRepository.findGameById.mockResolvedValue(game);
    gameRepository.saveGame.mockResolvedValue({
      ...game,
      leftPlayers: ["1"],
      readyPlayers: [],
      status: "inactive",
    });

    const result = await leaveGame(baseGameId, fakeToken);
    expect(result.leftPlayers).toContain("1");
    expect(result.status).toBe("inactive");
  });
});

describe("End Game", () => {
  let baseGameId, fakeToken, baseUserId;

  beforeEach(() => {
    jest.clearAllMocks();
    baseGameId = "1";
    baseUserId = "1";
    fakeToken = "fake.jwt.token";
    jwt.verify.mockReturnValue({ id: baseUserId });
  });

  test("Should throw if game not found", async () => {
    gameRepository.findGameById.mockResolvedValue(null);
    await expect(endGame(baseGameId, fakeToken)).rejects.toThrow(
      "Game not found",
    );
  });

  test("Should throw if user is not creator", async () => {
    const game = { creator: "2", status: "active" };
    gameRepository.findGameById.mockResolvedValue(game);
    await expect(endGame(baseGameId, fakeToken)).rejects.toThrow(
      "Only the game creator can end the game",
    );
  });

  test("Should throw if game not active", async () => {
    const game = { creator: "1", status: "not_started" };
    gameRepository.findGameById.mockResolvedValue(game);
    await expect(endGame(baseGameId, fakeToken)).rejects.toThrow(
      "Game is not active",
    );
  });
});
