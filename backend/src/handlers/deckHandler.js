const GameCard = require("../models/gameCardModel");
const repository = require("../repositories/gameRepository"); 

async function getDeckSnapshot(req, res, next) {
  const { gameId } = req.params;
  try {
    // Busca o jogo
    const game = await repository.findGameById(gameId);
    if (!game) throw new Error("Game not found");

    // Busca todas as cartas do jogo
    const cards = await GameCard.find({ gameId });

    // Deck: cartas sem dono e sem discardOrder
    const deck = cards
    .filter(c => !c.owner && c.discardOrder === null) 
    .sort(() => Math.random() - 0.5); // embaralha só para exibir
    

    // Discard pile: cartas com discardOrder definido
    const discardPile = cards
      .filter(c => c.discardOrder !== null)
      .sort((a, b) => a.discardOrder - b.discardOrder);

    // Hands: cartas com owner definido, agrupadas por jogador
    const hands = {};
    cards
      .filter(c => c.owner)
      .forEach(c => {
        if (!hands[c.owner]) hands[c.owner] = [];
        hands[c.owner].push({ color: c.color, value: c.value });
      });

    // Resposta final
    res.json({
      gameId,
      players: game.players,       //array 
      currentPlayer: game.currentPlayer,
      count: {
        deck: deck.length,
        hands: Object.values(hands).reduce((acc, arr) => acc + arr.length, 0),
        discardPile: discardPile.length
      },
      discardPile,
      hands,
      deck
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getDeckSnapshot };
