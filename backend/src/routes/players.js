/*
 * [2025-07-23] João Neto:
 * Exemplo de camada que podemos utilizar
 */

const express = require('express');
const router = express.Router();
const playerHandler = require('../handlers/playerHandler');

router.post('/', playerHandler.createPlayer);
router.get('/', playerHandler.getAllPlayers);

module.exports = router;
