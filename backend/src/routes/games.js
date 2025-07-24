/*
 * [2025-07-23] João Neto:
 * Semana 3: Atividade 7: Começar jogo quando todos estiverem prontos
 */
const express = require('express');
const router = express.Router();
const gameHandler = require('../handlers/gameHandler');

router.post('/create', gameHandler.create);
router.post('/join', gameHandler.join);
router.post('/start', gameHandler.start);

module.exports = router;