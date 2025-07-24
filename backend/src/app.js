const express = require('express');
const app = express();
require('dotenv').config();
require('./database')();

// Middlewares essenciais
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração de CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Importações seguras das rotas
try {
  const authRoutes = require('./routes/auth');
  const gameRoutes = require('./routes/games');
  const playerRoutes = require('./routes/players');

  if (typeof authRoutes !== 'function' && typeof authRoutes !== 'object') {
    throw new Error('Arquivo ./routes/auth.js não exporta um router válido.');
  }

  if (typeof gameRoutes !== 'function' && typeof gameRoutes !== 'object') {
    throw new Error('Arquivo ./routes/games.js não exporta um router válido.');
  }

  if (typeof playerRoutes !== 'function' && typeof playerRoutes !== 'object') {
    throw new Error('Arquivo ./routes/players.js não exporta um router válido.');
  }

  // Rotas principais
  app.use('/auth', authRoutes);
  app.use('/games', gameRoutes);
  app.use('/players', playerRoutes);

} catch (err) {
  console.error('Erro ao carregar rotas:', err.message);
}

// Rota de teste
app.get('/', (req, res) => {
  res.send('API do Jogo UNO está operacional!');
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

module.exports = app;
