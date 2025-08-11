const getNextId = require("../../../src/utils/getNextId");
const repository = require("../../../src/repositories/scoreRepository");
const scoreService = require("../../../src/services/scoreService");

jest.mock("../../../src/utils/getNextId");
jest.mock("../../../src/repositories/scoreRepository");

describe("Score Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createScore", () => {
    test("should create a score with generated id", async () => {
      getNextId.mockResolvedValue(10);
      const data = { playerId: "p1", gameId: "g1", score: 50 };
      const savedScore = { id: "10", ...data };
      repository.saveScore.mockResolvedValue(savedScore);

      const result = await scoreService.createScore(data);

      expect(getNextId).toHaveBeenCalledWith("scoreid");
      expect(repository.saveScore).toHaveBeenCalledWith({
        id: "10",
        playerId: "p1",
        gameId: "g1",
        score: 50,
      });
      expect(result).toEqual(savedScore);
    });
  });

  describe("getScore", () => {
    test("should return a score by id", async () => {
      const mockScore = { id: "1", playerId: "p1", score: 100 };
      repository.findScoreById.mockResolvedValue(mockScore);

      const result = await scoreService.getScore("1");

      expect(repository.findScoreById).toHaveBeenCalledWith("1");
      expect(result).toEqual(mockScore);
    });
  });

  describe("updateScore", () => {
    test("should update score by id", async () => {
      const updates = { score: 200 };
      const updatedScore = { id: "1", playerId: "p1", score: 200 };
      repository.updateScoreById.mockResolvedValue(updatedScore);

      const result = await scoreService.updateScore("1", updates);

      expect(repository.updateScoreById).toHaveBeenCalledWith("1", updates);
      expect(result).toEqual(updatedScore);
    });
  });

  describe("deleteScore", () => {
    test("should delete score by id", async () => {
      repository.deleteScoreById.mockResolvedValue(true);

      const result = await scoreService.deleteScore("1");

      expect(repository.deleteScoreById).toHaveBeenCalledWith("1");
      expect(result).toBe(true);
    });
  });

  describe("getAllScores", () => {
    test("should return all scores", async () => {
      const mockScores = [{ id: "1" }, { id: "2" }];
      repository.findAllScores.mockResolvedValue(mockScores);

      const result = await scoreService.getAllScores();

      expect(repository.findAllScores).toHaveBeenCalled();
      expect(result).toEqual(mockScores);
    });
  });

  describe("getScoresByGameId", () => {
    test("should return formatted scores by game id", async () => {
      const gameId = "g1";
      const mockDocs = [
        { playerId: "p1", score: 100 },
        { playerId: "p2", score: 200 },
      ];
      repository.findScoresByGameId.mockResolvedValue(mockDocs);

      const result = await scoreService.getScoresByGameId(gameId);

      expect(repository.findScoresByGameId).toHaveBeenCalledWith(gameId);
      expect(result).toEqual({
        game_id: "g1",
        scores: {
          "Player1 - p1": 100,
          "Player2 - p2": 200,
        },
      });
    });

    test("should return empty scores object if no scores found", async () => {
      repository.findScoresByGameId.mockResolvedValue([]);

      const result = await scoreService.getScoresByGameId("g1");

      expect(result).toEqual({
        game_id: "g1",
        scores: {},
      });
    });
  });
});
