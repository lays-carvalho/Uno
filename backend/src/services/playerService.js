const getNextId = require("../utils/getNextId");
const repository = require("../repositories/playerRepository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const BlacklistedToken = require("../models/tokensModel");
const AppError = require("../utils/appError");

async function createPlayer(data) {
  const id = await getNextId("playerid");

  const exists = await repository.findPlayerByEmail(data.email);
  if (exists) {
    throw new AppError("User already exists with this email.", 409);
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const player = {
    id: id.toString(),
    name: data.name,
    email: data.email,
    password: hashedPassword,
  };

  return await repository.savePlayer(player);
}

async function getPlayer(id) {
  const player = await repository.findPlayerById(id);
  if (!player) throw new AppError("Player not found", 404);

  return player;
}

async function updatePlayer(id, updates) {
  return await repository.updatePlayerById(id, updates);
}

async function deletePlayer(id) {
  return await repository.deletePlayerById(id);
}

async function getAllPlayers() {
  return await repository.findAllPlayers();
}

// João Neto(ToDo): ALTERADO: Método renomeado para postPlayerInfo para manter padrão POST
async function postPlayerInfo(accessToken) {
  if (!accessToken) {
    throw new AppError("Access token is required", 401);
  }

  const isBlacklisted = await BlacklistedToken.findOne({ token: accessToken });
  if (isBlacklisted) {
    throw new AppError("Token is invalidated", 401);
  }

  const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
  const player = await getPlayer(decoded.id);

  return player;
}

async function login(email, password) {
  const user = await repository.findPlayerByEmail(email);
  if (!user) throw new AppError("Invalid credentials", 401);

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new AppError("Invalid credentials", 401);

  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "6h" });
}

async function logout(accessToken) {
  const decoded = jwt.decode(accessToken);
  const exp = decoded.exp * 1000;

  return await BlacklistedToken.create({
    token: accessToken,
    expiresAt: new Date(exp),
  });
}

module.exports = {
  createPlayer,
  getPlayer,
  updatePlayer,
  deletePlayer,
  getAllPlayers,
  postPlayerInfo, // João Neto(ToDo): modificado para Post
  login,
  logout,
};