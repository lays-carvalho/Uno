/*
 * [2025-07-23] João Neto:
 * Semana 3: Atividade 1: Registrar um novo usuário
 */
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'uno-secret';

exports.generateToken = (payload) => jwt.sign(payload, SECRET, { expiresIn: '1h' });
exports.verifyToken = (token) => jwt.verify(token, SECRET);