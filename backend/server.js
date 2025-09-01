require("dotenv").config();
const http = require("http");
const app = require("./src/app");
const mongoose = require("./src/database/config");
const initWebSocket = require("./wsServer"); //importando o wsServer

const PORT = process.env.PORT || 3000;

// cria servidor http a partir do express
const server = http.createServer(app);

// inicializa WebSocket no mesmo servidor
initWebSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

mongoose.connection.once("connected", async () => {
  console.log("MongoDB connected successfully");

  const Card = require("./src/models/cardModel");
  const populateCards = require("./src/database/populateCards");

  const count = await Card.countDocuments();
  if (count === 0) {
    await populateCards();
  } else {
    console.log("Baralho já existe, não será recriado.");
  }
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
