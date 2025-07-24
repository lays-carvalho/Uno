/*
 * [2025-07-23] João Neto:
 * Semana 3: Atividade 4: Obter perfil do usuário
 */
const express = require('express');
const router = express.Router();

// Verificação de importação segura
let authHandler;
try {
  authHandler = require('../handlers/authHandler');
} catch (error) {
  console.error('Erro ao importar authHandler:', error.message);
  module.exports = router; // Exporta um router vazio para não quebrar o app
  return;
}

// Verifica se todas as funções esperadas existem
if (
  typeof authHandler.register === 'function' &&
  typeof authHandler.login === 'function' &&
  typeof authHandler.logout === 'function' &&
  typeof authHandler.profile === 'function'
) {
  router.post('/register', authHandler.register);
  router.post('/login', authHandler.login);
  router.post('/logout', authHandler.logout);
  router.get('/profile', authHandler.profile);
} else {
  console.error('authHandler está incompleto ou com funções inválidas.');
}

module.exports = router;
