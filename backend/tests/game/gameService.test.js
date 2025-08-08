// backend/__tests__/gameService.test.js

const jwt = require("jsonwebtoken");
const gameService = require("../services/gameService");
const gameRepository = require("../repositories/gameRepository");

jest.mock("../repositories/gameRepository");
jest.mock("jsonwebtoken");

describe("joinGame", () => {
  it("deve lançar erro ao tentar adicionar jogador acima do limite", async () => {
    const player1 = { id: 1 };
    const player2 = { id: 2 };
    const player3 = { id: 3 };

    const gameId = "game-123";

    // Simula a verificação dos tokens
    jwt.verify.mockImplementation((token) => {
      if (token === "token1") return player1;
      if (token === "token2") return player2;
      if (token === "token3") return player3;
    });

    // Simula o jogo com 2 jogadores já adicionados
    const game = {
      id: gameId,
      players: [1, 2],
      maxPlayers: 2,
      readyPlayers: [],
      leftPlayers: [],
    };

    gameRepository.findGameById.mockResolvedValue(game);

    // Chamada do serviço que deve lançar erro
    await expect(gameService.joinGame(gameId, "token3"))
      .rejects
      .toThrow("Maximum number of players reached");
  });
});
