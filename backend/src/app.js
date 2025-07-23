const express = require('express');
const app = express();
const playerRoutes = require('./routes/players');
const gameRoutes = require('./routes/games');
const cardRoutes = require('./routes/cards');
const scoreRoutes = require('./routes/scores');

app.use(express.json());

app.use('/players', playerRoutes);
app.use('/games', gameRoutes);
app.use('/cards', cardRoutes);
app.use('/scores', scoreRoutes);

module.exports = app;
