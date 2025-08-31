const mongoose = require("./config");
const Card = require("../models/cardModel");

async function populateCards() {
  const colors = ["Red", "Blue", "Green", "Yellow"];
  const values = [
    "0","1","2","3","4","5","6","7","8","9",
    "Skip","Reverse","Draw Two"
  ];
  const wilds = ["Wild","Wild Draw Four"];
  let idCounter = 1;
  const cards = [];

  for (const color of colors) {
    for (const value of values) {
      const repeat = value === "0" ? 1 : 2;
      for (let i = 0; i < repeat; i++) {
        cards.push({
          id: idCounter++,
          color,
          value,
          gameId: null
        });
      }
    }
  }

  for (const wild of wilds) {
    for (let i = 0; i < 4; i++) {
      cards.push({
        id: idCounter++,
        color: "Black",
        value: wild,
        gameId: null
      });
    }
  }

  await Card.deleteMany({}); // limpa antes
  await Card.insertMany(cards);
  console.log("Baralho populado com sucesso!");
}

module.exports = populateCards;
