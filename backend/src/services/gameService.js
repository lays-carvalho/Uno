const getNextId = require("../utils/getNextId");
const repository = require("../repositories/gameRepository");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const Card = require("../models/cardModel");
const GameCard = require("../models/gameCardModel"); // cartas clonadas
const playerRepository = require("../repositories/playerRepository");

async function createGame(data) {
  const { accessToken, title } = data;

  // João Neto(ToDo): Validar token e usuário
  if (!accessToken) {
    throw new AppError("Access token is required", 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
  } catch (err) {
    throw new AppError("Invalid or expired token", 401);
  }

  // Verificar se o usuário existe
  const userExists = await playerRepository.findPlayerById(decoded.id);
  if (!userExists) {
    throw new AppError("User not found", 404);
  }

  const id = await getNextId("gameid");

  // João Neto(ToDo): Status definido automaticamente e creator pego do token
  const game = {
    id: id.toString(),
    title: title,
    creator: decoded.id, // ← Pegando do token, não do body
    status: "not_started",
    maxPlayers: 4,
    players: [decoded.id], // Adiciona o criador como jogador
    readyPlayers: [],
    leftPlayers: []
  };

  return await repository.saveGame(game);
}

async function getGame(id) {
  const game = await repository.findGameById(id);
  if (!game) {
    throw new AppError("Game not found", 404);
  }

  return game;
}

async function updateGame(id, updates) {
  const game = await repository.findGameById(id);
  if (!game) {
    throw new AppError("Game not found", 404);
  }

  return await repository.updateGameById(id, updates);
}

async function deleteGame(id) {
  const game = await repository.findGameById(id);
  if (!game) {
    throw new AppError("Game not found", 404);
  }

  return await repository.deleteGameById(id);
}

async function getAllGames() {
  return await repository.findAllGames();
}

async function joinGame(gameId, accessToken) {
  const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
  const userId = decoded.id;

  const game = await repository.findGameById(gameId);
  if (!game) {
    throw new AppError("Game not found", 404);
  }

  // João Neto(ToDo): Verificar se o jogo já está cheio
  if (game.players.length >= game.maxPlayers) {
    throw new AppError("Game is full. Maximum " + game.maxPlayers + " players allowed", 400);
  }

  if (game.players.includes(userId)) {
    throw new AppError("User already in the game", 409);
  }

  // João Neto(ToDo): Verificar se o jogo já começou
  if (game.status !== "not_started") {
    throw new AppError("Cannot join game that has already started", 400);
  }

  game.players.push(userId);

  return await repository.saveGame(game);
}

async function startGame(gameId, accessToken) {
  const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
  const userId = decoded.id;

  const game = await repository.findGameById(gameId);
  if (!game) {
    throw new AppError("Game not found", 404);
  }

  if (game.status !== "not_started") {
    throw new AppError("Game can only be started from 'not_started' status", 400);
  }

  if (game.creator.toString() !== userId.toString()) {
    throw new AppError("Only the game creator can start the game", 403);
  }

  // João Neto(ToDo): Validação de mínimo 2 jogadores
  if (game.players.length < 2) {
    throw new AppError("Minimum 2 players required to start the game. Current: " + game.players.length, 400);
  }

  // João Neto(ToDo): Validação de máximo 4 jogadores
  if (game.players.length > 4) {
    throw new AppError("Maximum 4 players allowed in a game. Current: " + game.players.length, 400);
  }
  // Verifica se o criador está marcado como ready
  if (!game.readyPlayers.includes(userId)) {
    throw new AppError("Game creator must be ready to start the game", 400);
  }

  const allReady = game.players.every((playerId) =>
    game.readyPlayers.includes(playerId)
  );

  if (!allReady) {
    throw new AppError("Not all players are ready", 400);
  }

  const randomIndex = Math.floor(Math.random() * game.readyPlayers.length);
  const randomCurrentPlayer = game.readyPlayers[randomIndex];

  const updatedGame = await repository.updateGameById(gameId, {
    status: "active",
    currentPlayer: randomCurrentPlayer,
  });

  const distributionResult = await distributeCards(gameId);

  return { updatedGame, distribution: distributionResult };
}

async function markAsReady(gameId, accessToken) {
  const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
  const userId = decoded.id;

  const game = await repository.findGameById(gameId);
  if (!game) {
    throw new AppError("Game not found", 404);
  }

  if (!game.players.includes(userId)) {
    throw new AppError("User not in game", 400);
  }

  if (game.readyPlayers.includes(userId)) {
    throw new AppError("User already has been marked as ready", 400);
  }

  game.readyPlayers.push(userId);

  return await repository.saveGame(game);
}

async function leaveGame(gameId, accessToken) {
  const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
  const userId = decoded.id;

  const game = await repository.findGameById(gameId);
  if (!game) {
    throw new AppError("Game not found", 404);
  }

  if (game.status !== "active" && game.status !== "not_started") {
    throw new AppError("Game is not in progress", 400);
  }

  if (!game.players.includes(userId)) {
    throw new AppError("User not in the game", 400);
  }

  if (game.leftPlayers.includes(userId)) {
    throw new AppError("User already left the game", 400);
  }

  game.leftPlayers.push(userId);

  game.readyPlayers = game.readyPlayers.filter((id) => id !== userId);

  const allLeft = game.players.every((id) => game.leftPlayers.includes(id));

  if (allLeft) {
    game.status = "inactive";
  }

  return await repository.saveGame(game);
}

async function endGame(gameId, accessToken) {
  const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
  const userId = decoded.id;

  const game = await repository.findGameById(gameId);
  if (!game) {
    throw new AppError("Game not found", 404);
  }

  if (game.creator.toString() !== userId.toString()) {
    throw new AppError("Only the game creator can end the game", 401);
  }

  if (game.status !== "active") {
    throw new AppError("Game is not active", 400);
  }

  game.status = "inactive";

  return await repository.saveGame(game);
}

async function getGameState(gameId) {
  const game = await repository.findGameById(gameId);
  if (!game) {
    throw new AppError("Game not found", 404);
  }

  return {
    game_id: game.id,
    state: game.status === "active" ? "in_progress" : game.status,
  };
}

async function getPlayersInGame(gameId) {
  const game = await repository.findGameById(gameId);
  if (!game) {
    throw new AppError("Game not found", 404);
  }

  return {
    game_id: game.id,
    players: game.players,
    left_players: game.leftPlayers,
  };
}

async function getCurrentPlayer(gameId) {
  const game = await repository.findGameById(gameId);
  if (!game) {
    throw new AppError("Game not found", 404);
  }

  return {
    game_id: game.id,
    current_player: game.currentPlayer,
  };
}

async function distributeCards(gameId) {
  const game = await repository.findGameById(gameId);
  if (!game) throw new AppError("Game not found", 404);

  if (game.players.length === 0) {
    throw new AppError("No players in the game", 400);
  }

  const existingCards = await GameCard.countDocuments({ gameId });
  if (existingCards === 0) {
    const baseCards = await Card.find({});
    const cloned = baseCards.map((c) => ({
      gameId,
      color: c.color,
      value: c.value,
      deckOrder: 0,
    }));
    await GameCard.insertMany(cloned);
  }

  let availableCards = await GameCard.find({
    gameId,
    owner: null,
    discardOrder: null,
  });

  availableCards = availableCards.sort(() => Math.random() - 0.5);

  for (let i = 0; i < availableCards.length; i++) {
    await GameCard.updateOne({ _id: availableCards[i]._id }, { deckOrder: i });
  }

  const playersHands = {};
  for (const playerId of game.players) {
    const hand = availableCards.splice(0, 7);
    playersHands[playerId] = hand.map((c) => `${c.color} ${c.value}`);

    await GameCard.updateMany(
      { _id: { $in: hand.map((c) => c._id) } },
      { $set: { owner: playerId } },
    );
  }

  const numberCards = availableCards.filter((c) => !isNaN(c.value));
  if (numberCards.length === 0)
    throw new AppError("No valid number card to start discard pile", 400);

  const firstCard = numberCards.sort(() => Math.random() - 0.5)[0];
  await GameCard.updateOne(
    { _id: firstCard._id },
    { $set: { discardOrder: 1 } },
  );

  return {
    message: "Cards dealt successfully.",
    players: playersHands,
    firstDiscard: `${firstCard.color} ${firstCard.value}`,
  };
}

// Função auxiliar para pegar a primeira carta do descarte válida
function drawFirstDiscardCard(availableCards) {
  // Filtra apenas cartas com valor numérico
  const numberCards = availableCards.filter((c) => !isNaN(c.value));
  if (numberCards.length === 0) {
    throw new AppError("No valid number card to start the discard pile", 400);
  }

  // Embaralha as válidas
  const shuffled = numberCards.sort(() => Math.random() - 0.5);

  // Retorna a primeira do embaralhamento
  return shuffled[0];
}

async function getPlayerHand(gameId, playerId) {
  const game = await repository.findGameById(gameId);
  if (!game) throw new AppError("Game not found", 404);

  const topDiscard = await GameCard.findOne({
    gameId,
    discardOrder: { $ne: null },
  }).sort({ discardOrder: -1 });
  if (!topDiscard) throw new AppError("No discard pile found", 400);

  const hand = await GameCard.find({ gameId, owner: playerId });
  const validCards = hand.filter(
    (card) =>
      card.color === topDiscard.color ||
      card.value === topDiscard.value ||
      card.color === "Black",
  );

  return {
    topDiscard: `${topDiscard.color} ${topDiscard.value}`,
    hand: {
      validCards: validCards.map((c) => `${c.color} ${c.value}`),
      otherCards: hand
        .filter((c) => !validCards.includes(c))
        .map((c) => `${c.color} ${c.value}`),
    },
  };
}

async function playCard(gameId, playerId, cardPlayed) {
  const game = await repository.findGameById(gameId);
  if (!game) throw new AppError("Game not found", 404);
  if (game.currentPlayer.toString() !== playerId.toString()) {
    throw new AppError("Not your turn.", 400);
  }

  const topDiscard = await GameCard.findOne({
    gameId,
    discardOrder: { $ne: null },
  }).sort({ discardOrder: -1 });
  if (!topDiscard) throw new AppError("No discard pile found", 400);

  const [color, ...rest] = cardPlayed.split(" ");
  const value = rest.join(" ");
  const card = await GameCard.findOne({
    gameId,
    owner: playerId,
    color,
    value,
  });
  if (!card) throw new AppError("Card not found in player's hand.", 400);

  const isValid =
    card.color === topDiscard.color ||
    card.value === topDiscard.value ||
    card.color === "Black";
  if (!isValid) {
    throw new AppError(
      "Invalid card. Please play a card that matches the top card on the discard pile.",
      400,
    );
  }

  const nextOrder = topDiscard.discardOrder + 1;
  await GameCard.updateOne(
    { _id: card._id },
    { $set: { owner: null, discardOrder: nextOrder } },
  );

  const remainingCards = await GameCard.countDocuments({
    gameId,
    owner: playerId,
  });

  if (remainingCards === 0) {
    await repository.updateGameById(gameId, {
      status: "inactive",
      winner: playerId,
    });

    return {
      message: `Player ${playerId} won the game!`,
      winner: playerId,
    };
  }

  const idx = game.players.findIndex(
    (p) => p.toString() === playerId.toString(),
  );
  const nextIdx = (idx + 1) % game.players.length;
  const nextPlayer = game.players[nextIdx];
  await repository.updateGameById(gameId, { currentPlayer: nextPlayer });

  return { message: "Card played successfully.", nextPlayer };
}

async function drawCard(gameId, playerId) {
  const game = await repository.findGameById(gameId);
  if (!game) throw new AppError("Game not found", 404);
  if (game.currentPlayer.toString() !== playerId.toString()) {
    throw new AppError("Not your turn.", 400);
  }

  // Pega todas cartas disponíveis
  let available = await GameCard.find({
    gameId,
    owner: null,
    discardOrder: null,
  });

  if (available.length === 0) throw new AppError("Deck is empty.", 400);

  // Embaralha antes de escolher a primeira
  available = available.sort(() => Math.random() - 0.5);

  const deckCard = available[0]; // pega a primeira do embaralhamento
  await GameCard.updateOne(
    { _id: deckCard._id },
    { $set: { owner: playerId } },
  );

  return {
    message: `${playerId} drew a card from the deck.`,
    cardDrawn: `${deckCard.color} ${deckCard.value}`,
  };
}

async function autoDrawIfNoValidCards(gameId, playerId) {
  const game = await repository.findGameById(gameId);
  if (!game) throw new AppError("Game not found", 404);

  const topDiscard = await GameCard.findOne({
    gameId,
    discardOrder: { $ne: null },
  }).sort({ discardOrder: -1 });
  if (!topDiscard) throw new AppError("No discard pile found", 400);

  const hand = await GameCard.find({ gameId, owner: playerId });

  // Verifica cartas válidas
  const validCards = hand.filter(
    (card) =>
      card.color === topDiscard.color ||
      card.value === topDiscard.value ||
      card.color === "Black",
  );

  if (validCards.length === 0) {
    // Pega **primeira carta do deck**
    const deckCard = await GameCard.findOne({
      gameId,
      owner: null,
      discardOrder: null,
    });
    if (!deckCard) throw new AppError("Deck is empty.", 400);

    await GameCard.updateOne(
      { _id: deckCard._id },
      { $set: { owner: playerId } },
    );

    // Atualiza o próximo jogador
    const idx = game.players.findIndex(
      (p) => p.toString() === playerId.toString(),
    );
    const nextIdx = (idx + 1) % game.players.length;
    const nextPlayer = game.players[nextIdx];
    await repository.updateGameById(gameId, { currentPlayer: nextPlayer });

    return {
      message: `${playerId} had no valid cards and drew a card automatically.`,
      cardDrawn: `${deckCard.color} ${deckCard.value}`,
      nextPlayer,
    };
  }

  return null; // tem cartas válidas, não faz nada
}

module.exports = {
  createGame,
  getGame,
  updateGame,
  deleteGame,
  getAllGames,
  joinGame,
  startGame,
  markAsReady,
  leaveGame,
  endGame,
  getGameState,
  getPlayersInGame,
  getCurrentPlayer,
  distributeCards,
  drawFirstDiscardCard,
  getPlayerHand,
  playCard,
  drawCard,
  autoDrawIfNoValidCards,
};
