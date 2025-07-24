/*
 * [2025-07-23] João Neto:
 * Semana 3: Atividade 1: Registrar um novo usuário
 */
const User = require('../models/userModel');

exports.findByUsername = (username) => User.findOne({ username });
exports.findByEmail = (email) => User.findOne({ email });
exports.findById = (id) => User.findById(id);
exports.createUser = (data) => User.create(data);