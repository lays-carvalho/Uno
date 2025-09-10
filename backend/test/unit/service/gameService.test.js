const { base } = require("../../../src/models/gameModel");
const gameRepository = require("../../../src/repositories/gameRepository");
const playerRepository = require("../../../src/repositories/playerRepository");
const GameCard = require("../../../src/models/gameCardModel");
const Card = require("../../../src/models/cardModel");

const {
  joinGame,
  startGame,
  endGame,
  deleteGame,
  createGame,
  getAllGames,
  markAsReady,
  leaveGame,
  distributeCards
} = require("../../../src/services/gameService");

const jwt = require("jsonwebtoken");
const getNextId = require("../../../src/utils/getNextId");

jest.mock("../../../src/repositories/gameRepository");
jest.mock("../../../src/repositories/playerRepository");
jest.mock("jsonwebtoken");
jest.mock("../../../src/utils/getNextId");

jest.mock("../../../src/models/gameCardModel", () => ({
  countDocuments: jest.fn(),
  find: jest.fn(),
  insertMany: jest.fn(),
  updateOne: jest.fn(),
  updateMany: jest.fn()
}));

jest.mock("../../../src/models/cardModel", () => ({
  find: jest.fn()
}));

global.AppError = Error;

beforeEach(() => {
  jest.clearAllMocks();
  
  GameCard.countDocuments.mockResolvedValue(0);
  GameCard.find.mockResolvedValue([]);
  GameCard.insertMany.mockResolvedValue([]);
  GameCard.updateOne.mockResolvedValue({});
  GameCard.updateMany.mockResolvedValue({});
  
  Card.find.mockResolvedValue([]);
});

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

  test("Should throw error if game has already started", async () => {
    const game = { id: baseGameId, players: [], status: "active" };
    gameRepository.findGameById.mockResolvedValue(game);

    await expect(joinGame(baseGameId, fakeToken)).rejects.toThrow(
      "Cannot join game that has already started",
    );
  });

  test("Should throw error if game is full", async () => {
    const game = { 
      id: baseGameId, 
      players: ["1", "2", "3", "4"], 
      maxPlayers: 4,
      status: "not_started"
    };
    gameRepository.findGameById.mockResolvedValue(game);

    await expect(joinGame(baseGameId, fakeToken)).rejects.toThrow(
      "Game is full. Maximum 4 players allowed",
    );
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
      players: ["1", "2"],
      readyPlayers: ["1", "2"],
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
      "Minimum 2 players required to start the game",
    );

    expect(gameRepository.findGameById).toHaveBeenCalledWith(baseGameId);
    expect(gameRepository.updateGameById).not.toHaveBeenCalled();
  });

  test("Should start game successfully with 2 players", async () => {
    const mockGame = makeGame({
      players: ["1", "2"],
      readyPlayers: ["1", "2"],
      status: "not_started"
    });

    gameRepository.findGameById.mockResolvedValue(mockGame);
    gameRepository.updateGameById.mockResolvedValue({
      ...mockGame,
      status: "active",
      currentPlayer: "1"
    });

    const result = await startGame(baseGameId, fakeToken);

    expect(result.updatedGame.status).toBe("active");
    expect(result.updatedGame.currentPlayer).toBeDefined();
    expect(gameRepository.updateGameById).toHaveBeenCalled();
  });

  test("Should throw error if game is not in not_started status", async () => {
    const game = makeGame({
      status: "active",
      players: ["1", "2"],
      readyPlayers: ["1", "2"]
    });

    gameRepository.findGameById.mockResolvedValue(game);

    await expect(startGame(baseGameId, fakeToken)).rejects.toThrow(
      "Game can only be started from 'not_started' status",
    );
  });

  test("Should throw error if creator is not ready", async () => {
    const game = makeGame({
      readyPlayers: ["2"],
      players: ["1", "2"]
    });

    gameRepository.findGameById.mockResolvedValue(game);

    await expect(startGame(baseGameId, fakeToken)).rejects.toThrow(
      "Game creator must be ready to start the game",
    );
  });
});

describe("Create Game", () => {
  let baseGameData;
  let fakeToken;

  beforeEach(() => {
    jest.clearAllMocks();
    fakeToken = "fake.jwt.token";
    
    baseGameData = {
      accessToken: fakeToken,
      title: "Test Game"
    };

    jwt.verify.mockReturnValue({ id: "1" });
    playerRepository.findPlayerById.mockResolvedValue({ id: "1", name: "Test Player" });
    getNextId.mockResolvedValue(100);
  });

  test("Should create game with not_started status automatically", async () => {
    const mockGame = {
      id: "100",
      title: "Test Game",
      creator: "1",
      status: "not_started",
      maxPlayers: 4,
      players: ["1"]
    };

    gameRepository.saveGame.mockResolvedValue(mockGame);

    const result = await createGame(baseGameData);

    expect(result.status).toBe("not_started");
    expect(result.creator).toBe("1");
    expect(result.players).toContain("1");
    expect(result.maxPlayers).toBe(4);
    expect(gameRepository.saveGame).toHaveBeenCalled();
  });

  test("Should throw error if access token is missing", async () => {
    await expect(createGame({ title: "Test" })).rejects.toThrow(
      "Access token is required"
    );
  });

  test("Should throw error if token is invalid", async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    await expect(createGame(baseGameData)).rejects.toThrow(
      "Invalid or expired token"
    );
  });

  test("Should throw error if user not found", async () => {
    playerRepository.findPlayerById.mockResolvedValue(null);

    await expect(createGame(baseGameData)).rejects.toThrow(
      "User not found"
    );
  });

  test("Should ignore maxPlayers from request body", async () => {
    const gameDataWithMaxPlayers = {
      ...baseGameData,
      maxPlayers: 2
    };

    const mockGame = {
      id: "100",
      title: "Test Game",
      creator: "1",
      status: "not_started",
      maxPlayers: 4,
      players: ["1"]
    };

    gameRepository.saveGame.mockResolvedValue(mockGame);

    const result = await createGame(gameDataWithMaxPlayers);

    expect(result.maxPlayers).toBe(4);
  });
});

describe("Get All Games", () => {
  test("Should return all games", async () => {
    const mockGames = [
      { id: "1", title: "Game 1", status: "not_started" },
      { id: "2", title: "Game 2", status: "active" }
    ];

    gameRepository.findAllGames.mockResolvedValue(mockGames);

    const result = await getAllGames();

    expect(result).toHaveLength(2);
    expect(result[0].title).toBe("Game 1");
    expect(result[1].title).toBe("Game 2");
    expect(gameRepository.findAllGames).toHaveBeenCalled();
  });

  test("Should return empty array if no games exist", async () => {
    gameRepository.findAllGames.mockResolvedValue([]);

    const result = await getAllGames();

    expect(result).toHaveLength(0);
    expect(gameRepository.findAllGames).toHaveBeenCalled();
  });
});

describe("Delete Game", () => {
  test("Should delete game successfully", async () => {
    const gameId = "1";
    const mockGame = { id: gameId, title: "Test Game" };

    gameRepository.findGameById.mockResolvedValue(mockGame);
    gameRepository.deleteGameById.mockResolvedValue(mockGame);

    const result = await deleteGame(gameId);

    expect(result).toEqual(mockGame);
    expect(gameRepository.deleteGameById).toHaveBeenCalledWith(gameId);
  });

  test("Should throw error if game not found when deleting", async () => {
    gameRepository.findGameById.mockResolvedValue(null);

    await expect(deleteGame("999")).rejects.toThrow(
      "Game not found"
    );
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
    gameRepository.saveGame.mockResolvedValue({
      ...game,
      readyPlayers: ["1"]
    });

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

  test("Should mark user as left but keep game active if not all left", async () => {
    const game = {
      status: "active",
      players: ["1", "2"],
      leftPlayers: [],
      readyPlayers: ["1", "2"],
    };
    gameRepository.findGameById.mockResolvedValue(game);
    gameRepository.saveGame.mockResolvedValue({
      ...game,
      leftPlayers: ["1"],
      readyPlayers: ["2"],
      status: "active",
    });

    const result = await leaveGame(baseGameId, fakeToken);
    expect(result.leftPlayers).toContain("1");
    expect(result.status).toBe("active");
    expect(result.readyPlayers).not.toContain("1");
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

  test("Should end game successfully", async () => {
    const game = { 
      id: baseGameId,
      creator: "1", 
      status: "active",
      players: ["1", "2"],
      readyPlayers: ["1", "2"]
    };
    
    gameRepository.findGameById.mockResolvedValue(game);
    gameRepository.saveGame.mockResolvedValue({
      ...game,
      status: "inactive"
    });

    const result = await endGame(baseGameId, fakeToken);
    expect(result.status).toBe("inactive");
  });
});

describe("Distribute Cards", () => {
  let baseGameId;

  beforeEach(() => {
    jest.clearAllMocks();
    baseGameId = "1";
  });

  test("Should throw error if game not found", async () => {
    gameRepository.findGameById.mockResolvedValue(null);
    
    await expect(distributeCards("invalid-id")).rejects.toThrow(
      "Game not found"
    );
  });

  test("Should throw error if no players in game", async () => {
    const game = { id: baseGameId, players: [] };
    gameRepository.findGameById.mockResolvedValue(game);
    
    await expect(distributeCards(baseGameId)).rejects.toThrow(
      "No players in the game"
    );
  });

  test("Should create cards if none exist", async () => {
    const game = { id: baseGameId, players: ["1", "2"] };
    const mockCards = [
      { _id: "card1", color: "Red", value: "5" },
      { _id: "card2", color: "Blue", value: "7" }
    ];

    gameRepository.findGameById.mockResolvedValue(game);
    GameCard.countDocuments.mockResolvedValue(0);
    Card.find.mockResolvedValue(mockCards);
    GameCard.insertMany.mockResolvedValue();
    GameCard.find.mockResolvedValue(mockCards);
    GameCard.updateOne.mockResolvedValue();
    GameCard.updateMany.mockResolvedValue();

    const result = await distributeCards(baseGameId);

    expect(GameCard.insertMany).toHaveBeenCalled();
    expect(result.message).toBe("Cards dealt successfully.");
  });

  test("Should distribute cards to players", async () => {
    const game = { id: baseGameId, players: ["1", "2"] };
    const mockCards = [
      { _id: "card1", color: "Red", value: "5", owner: null, discardOrder: null },
      { _id: "card2", color: "Blue", value: "7", owner: null, discardOrder: null },
      { _id: "card3", color: "Green", value: "2", owner: null, discardOrder: null },
      { _id: "card4", color: "Yellow", value: "8", owner: null, discardOrder: null },
      { _id: "card5", color: "Red", value: "Skip", owner: null, discardOrder: null },
      { _id: "card6", color: "Blue", value: "Reverse", owner: null, discardOrder: null },
      { _id: "card7", color: "Green", value: "Draw", owner: null, discardOrder: null },
      { _id: "card8", color: "Yellow", value: "0", owner: null, discardOrder: null },
      { _id: "card9", color: "Red", value: "1", owner: null, discardOrder: null },
      { _id: "card10", color: "Blue", value: "2", owner: null, discardOrder: null },
      { _id: "card11", color: "Green", value: "3", owner: null, discardOrder: null },
      { _id: "card12", color: "Yellow", value: "4", owner: null, discardOrder: null },
      { _id: "card13", color: "Red", value: "5", owner: null, discardOrder: null },
      { _id: "card14", color: "Blue", value: "6", owner: null, discardOrder: null }
    ];

    gameRepository.findGameById.mockResolvedValue(game);
    GameCard.countDocuments.mockResolvedValue(14);
    GameCard.find.mockResolvedValue(mockCards);
    GameCard.updateOne.mockResolvedValue();
    GameCard.updateMany.mockResolvedValue();

    const result = await distributeCards(baseGameId);

    expect(result.players).toHaveProperty("1");
    expect(result.players).toHaveProperty("2");
    expect(result.firstDiscard).toBeDefined();
    expect(GameCard.updateMany).toHaveBeenCalled();
  });

  test("Should throw error if no valid number card for discard pile", async () => {
    const game = { id: baseGameId, players: ["1", "2"] };
    const mockCards = [
      { _id: "card1", color: "Red", value: "Reverse", owner: null, discardOrder: null },
      { _id: "card2", color: "Blue", value: "Skip", owner: null, discardOrder: null },
      { _id: "card3", color: "Green", value: "Draw", owner: null, discardOrder: null }
    ];

    gameRepository.findGameById.mockResolvedValue(game);
    GameCard.countDocuments.mockResolvedValue(1);
    GameCard.find.mockResolvedValue(mockCards);

    await expect(distributeCards(baseGameId)).rejects.toThrow(
      "No valid number card to start discard pile"
    );
  });
});