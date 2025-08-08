const request = require("supertest");
const app = require("../app"); // seu app Express
const mongoose = require("mongoose");
const Game = require("../models/gameModel.js");

describe("Teste de limite de jogadores", () => {
  beforeAll(async () => {
    // Conecta ao banco de dados de teste
    await mongoose.connect("mongodb://admin:admin@localhost:27017/uno-db?authSource=admin", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Limpa o banco após os testes
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  it("Deve permitir adicionar mais jogadores do que o limite definido (mostrar falha)", async () => {
    // Cria um novo jogo com limite de 4 jogadores
    const createGameRes = await request(app).post("/games").send({
      name: "Teste Limite",
      maxPlayers: 4,
    });

    expect(createGameRes.status).toBe(201); // Espera status 201 criado
    const gameId = createGameRes.body.id;

    // Adiciona 6 jogadores (2 além do limite de 4)
    for (let i = 1; i <= 6; i++) {
      const joinRes = await request(app).post(`/games/${gameId}/join`).send({
        name: `Jogador ${i}`,
      });

      console.log(`Tentativa ${i}:`, joinRes.status, joinRes.body.message || "");
    }

    // Verifica o total de jogadores no jogo
    const updatedGame = await Game.findOne({ id: gameId }).populate("players");

    if (!updatedGame) {
      throw new Error("Jogo não encontrado no banco de dados.");
    }

    console.log("Jogadores adicionados:", updatedGame.players.length);

    // Este expect mostra a falha se o limite foi quebrado
    expect(updatedGame.players.length).toBeGreaterThan(4); // Deve falhar se limite for respeitado
  });
});
