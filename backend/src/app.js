const express = require("express");
const app = express();
const playerRoutes = require("./routes/players");
const gameRoutes = require("./routes/games");
const cardRoutes = require("./routes/cards");
const scoreRoutes = require("./routes/scores");
const errorHandler = require("./middleware/errorHandler");
const trackingMiddleware = require("./middleware/trackingMiddleware");
const statsRoutes = require("./routes/stats");
const turn = require("./routes/turn");

app.use(express.json());

app.use(trackingMiddleware); 

//rotas
app.use("/api", playerRoutes);
app.use("/api", gameRoutes);
app.use("/api", cardRoutes);
app.use("/api", scoreRoutes);
app.use("/api", statsRoutes);
app.use("/api", turn);

app.get("/", (req, res) => {
  res.send("🎮 API do Capstone-UNO está funcionando! 👾");
});

app.use(errorHandler);

module.exports = app;
