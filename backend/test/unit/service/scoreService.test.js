const getNextId = require("../../../src/utils/getNextId");
const repository = require("../../../src/repositories/scoreRepository");
const repoPlayer = require("../../../src/repositories/playerRepository");
const repoGame = require("../../../src/repositories/gameRepository");
const AppError = require("../../../src/utils/appError");
const {
  createScore,
  getScore,
  updateScore,
  deleteScore,
  getAllScores,
  getScoresByGameId,
  getPlayerMetrics,
  getGlobalRanking,
  getVictoriesByPlayer
} = require("../../../src/services/scoreService");

jest.mock("../../../src/utils/getNextId");
jest.mock("../../../src/repositories/scoreRepository");
jest.mock("../../../src/repositories/playerRepository");
jest.mock("../../../src/repositories/gameRepository");

describe("Global Ranking", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Should return global ranking successfully", async () => {
    const mockPlayerStats = [
      { _id: "1", wins: 5, losses: 2, totalGames: 7 },
      { _id: "2", wins: 3, losses: 4, totalGames: 7 }
    ];

    repository.findAllScoresGroupedByPlayer.mockResolvedValue(mockPlayerStats);

    const result = await getGlobalRanking();

    expect(result).toHaveLength(2);
    expect(result[0].playerId).toBe("1");
    expect(result[0].wins).toBe(5);
    expect(result[1].playerId).toBe("2");
    expect(result[1].losses).toBe(4);
  });

  test("Should throw error if repository fails", async () => {
    repository.findAllScoresGroupedByPlayer.mockRejectedValue(new Error("DB Error"));

    await expect(getGlobalRanking()).rejects.toThrow("Error retrieving global ranking");
  });

  test("Should return empty array if no scores exist", async () => {
    repository.findAllScoresGroupedByPlayer.mockResolvedValue([]);

    const result = await getGlobalRanking();

    expect(result).toHaveLength(0);
  });
});

describe("Score Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createScore", () => {
  test("should create a score successfully", async () => {
    const data = { playerId: "1", gameId: "g1", score: 50, result: "win" };
    const savedScore = { id: "123", ...data };
    repository.saveScore.mockResolvedValue(savedScore);

    const result = await createScore(data);

    expect(repository.saveScore).toHaveBeenCalledWith(data);
    expect(result).toEqual(savedScore);
  });
});

  describe("getScore", () => {
    test("should return a score by id", async () => {
      const mockScore = { id: "1", playerId: "p1", score: 100 };
      repository.findScoreById.mockResolvedValue(mockScore);

      const result = await getScore("1");

      expect(repository.findScoreById).toHaveBeenCalledWith("1");
      expect(result).toEqual(mockScore);
    });
  });

  describe("updateScore", () => {
    test("should update score by id", async () => {
      const updates = { score: 200 };
      const updatedScore = { id: "1", playerId: "p1", score: 200 };
      repository.updateScoreById.mockResolvedValue(updatedScore);

      const result = await updateScore("1", updates);

      expect(repository.updateScoreById).toHaveBeenCalledWith("1", updates);
      expect(result).toEqual(updatedScore);
    });
  });

  describe("deleteScore", () => {
    test("should delete score by id", async () => {
      repository.deleteScoreById.mockResolvedValue(true);

      const result = await deleteScore("1");

      expect(repository.deleteScoreById).toHaveBeenCalledWith("1");
      expect(result).toBe(true);
    });
  });

  describe("getAllScores", () => {
    test("should return all scores", async () => {
      const mockScores = [{ id: "1" }, { id: "2" }];
      repository.findAllScores.mockResolvedValue(mockScores);

      const result = await getAllScores();

      expect(repository.findAllScores).toHaveBeenCalled();
      expect(result).toEqual(mockScores);
    });
  });

describe("getScoresByGameId", () => {
  test("should return scores array by game id", async () => {
    const gameId = "g1";
    const mockDocs = [
      { playerId: "p1", score: 100 },
      { playerId: "p2", score: 200 },
    ];
    repository.findScoresByGameId.mockResolvedValue(mockDocs);

    const result = await getScoresByGameId(gameId);

    expect(repository.findScoresByGameId).toHaveBeenCalledWith(gameId);

    expect(result).toEqual(mockDocs); 
  });

  test("should return empty array if no scores found", async () => {
    repository.findScoresByGameId.mockResolvedValue([]);

    const result = await getScoresByGameId("g1");

    expect(result).toEqual([]); 
  });
});
});