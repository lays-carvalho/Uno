const gameService = require("../services/gameService");

async function getPlayerHand(req, res, next) {
  try {
    const { id: gameId, player } = req.params;
    const result = await gameService.getPlayerHand(gameId, player);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/*async function playCard(req, res, next) {
  try {
    const { id: gameId } = req.params;
    const { players, currentPlayerIndex, cardPlayed, direction } = req.body;

    let nextPlayerIndex;
    let skippedPlayer = null;
    let newDirection = direction;

    if (cardPlayed === "skip") {
      // pula o próximo jogador
      if (direction === "clockwise") {
        skippedPlayer = players[(currentPlayerIndex + 1) % players.length];
        nextPlayerIndex = (currentPlayerIndex + 2) % players.length;
      } else {
        skippedPlayer =
          players[
            (currentPlayerIndex - 1 + players.length) % players.length
          ];
        nextPlayerIndex =
          (currentPlayerIndex - 2 + players.length) % players.length;
      }
    } else if (cardPlayed === "reverse") {
      // inverte direção
      newDirection =
        direction === "clockwise" ? "counterclockwise" : "clockwise";

      if (newDirection === "clockwise") {
        nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
      } else {
        nextPlayerIndex =
          (currentPlayerIndex - 1 + players.length) % players.length;
      }
    } else {
      // carta normal → apenas passa turno
      if (direction === "clockwise") {
        nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
      } else {
        nextPlayerIndex =
          (currentPlayerIndex - 1 + players.length) % players.length;
      }
    }

    const response = {
      nextPlayerIndex,
      nextPlayer: players[nextPlayerIndex],
    };

    if (skippedPlayer) response.skippedPlayer = skippedPlayer;
    if (cardPlayed === "reverse") response.newDirection = newDirection;

    res.json({ status: 200, body: response });
  } catch (err) {
    next(err);
  }
}
*/

async function playCard(req, res, next) {
  try {
    const { id: gameId } = req.params;
    const { player, cardPlayed } = req.body;

    const result = await gameService.playCard(gameId, player, cardPlayed);

    res.json(result);
  } catch (err) {
    next(err);
  }
}


/*async function drawCard(req, res, next) {
  try {
    const { playerHand, deck, currentCard } = req.body;

    if (!playerHand || !deck || !currentCard) {
      return res.status(400).json({ error: "playerHand, deck e currentCard são obrigatórios" });
    }

    // Função auxiliar para verificar se a carta pode ser jogada
    const isPlayable = (card, topCard) => {
      const [color, value] = card.split("_");
      const [topColor, topValue] = topCard.split("_");

      return color === topColor || value === topValue || color === "wild";
    };

    let newHand = [...playerHand];
    let drawnCard = null;
    let playable = false;

    // Acumulador para simular compra de cartas até achar uma jogável
    for (let i = 0; i < deck.length; i++) {
      const card = deck[i];
      newHand.push(card);
      drawnCard = card;

      if (isPlayable(card, currentCard)) {
        playable = true;
        break;
      }
    }

    res.json({
      status: 200,
      body: {
        newHand,
        drawnCard,
        playable
      }
    });

  } catch (err) {
    next(err);
  }
}
  */

async function drawCard(req, res, next) {
  try {
    const { id: gameId } = req.params;
    const { player } = req.body;

    const result = await gameService.drawCard(gameId, player);

    res.json(result);
  } catch (err) {
    next(err);
  }
}


module.exports = { getPlayerHand, playCard, drawCard };
