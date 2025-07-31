//src/app.js
const express = require("express");
const app = express();
const playerRoutes = require("./routes/players");
const gameRoutes = require("./routes/games");
const cardRoutes = require("./routes/cards"); 
const scoreRoutes = require("./routes/scores");

app.use(express.json());

//rotas 
app.use("/api", playerRoutes);
app.use("/api", gameRoutes);
app.use("/api", cardRoutes);
app.use("/api", scoreRoutes);


app.get("/", (req, res) => {
  res.send("🎮 API do Capstone-UNO está funcionando! 👾");
});


module.exports = app;
