// tests/scoreRepository.test.js
const Score = require("../../../src/models/scoreModel");
const repository = require("../../../src/repositories/scoreRepository");

jest.mock("../../../src/models/scoreModel");


describe("findScoresByPlayerId", () => {
  test("Should find scores by player ID", async () => {
    const playerId = "1";
    const mockScores = [
      { playerId: "1", gameId: "game1", result: "win" },
      { playerId: "1", gameId: "game2", result: "loss" }
    ];

    Score.find.mockResolvedValue(mockScores);

    const result = await findScoresByPlayerId(playerId);

    expect(Score.find).toHaveBeenCalledWith({ playerId: playerId });
    expect(result).toHaveLength(2);
    expect(result[0].playerId).toBe("1");
  });

  test("Should return empty array if no scores found", async () => {
    const playerId = "999";
    Score.find.mockResolvedValue([]);

    const result = await findScoresByPlayerId(playerId);

    expect(result).toHaveLength(0);
  });

  test("Should throw error on database failure", async () => {
    const playerId = "1";
    Score.find.mockRejectedValue(new Error("Database error"));

    await expect(findScoresByPlayerId(playerId)).rejects.toThrow("Database error");
  });
});

describe("Score Repository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should save a score", async () => {
    const scoreData = { id: "1", playerId: "p1", gameId: "g1", score: 100 };
    const saveMock = jest.fn().mockResolvedValue(scoreData);
    Score.mockImplementation(() => ({ save: saveMock }));

    const result = await repository.saveScore(scoreData);

    expect(saveMock).toHaveBeenCalled();
    expect(result).toEqual(scoreData);
  });

  test("should find a score by id", async () => {
    const scoreData = { id: "1" };
    Score.findOne.mockResolvedValue(scoreData);

    const result = await repository.findScoreById("1");

    expect(Score.findOne).toHaveBeenCalledWith({ id: "1" });
    expect(result).toEqual(scoreData);
  });

  test("should update a score by id", async () => {
    const updatedScore = { id: "1", score: 200 };
    Score.findOneAndUpdate.mockResolvedValue(updatedScore);

    const result = await repository.updateScoreById("1", { score: 200 });

    expect(Score.findOneAndUpdate).toHaveBeenCalledWith(
      { id: "1" },
      { score: 200 },
      { new: true },
    );
    expect(result).toEqual(updatedScore);
  });

  test("should delete a score by id", async () => {
    const deletedScore = { id: "1" };
    Score.findOneAndDelete.mockResolvedValue(deletedScore);

    const result = await repository.deleteScoreById("1");

    expect(Score.findOneAndDelete).toHaveBeenCalledWith({ id: "1" });
    expect(result).toEqual(deletedScore);
  });

  test("should find all scores", async () => {
    const scores = [{ id: "1" }, { id: "2" }];
    Score.find.mockResolvedValue(scores);

    const result = await repository.findAllScores();

    expect(Score.find).toHaveBeenCalledWith({});
    expect(result).toEqual(scores);
  });

  test("should find scores by gameId", async () => {
    const scores = [{ id: "1", gameId: "g1" }];
    Score.find.mockResolvedValue(scores);

    const result = await repository.findScoresByGameId("g1");

    expect(Score.find).toHaveBeenCalledWith({ gameId: "g1" });
    expect(result).toEqual(scores);
  });
});
