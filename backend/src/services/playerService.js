const getNextId = require("../utils/getNextId");
const repository = require("../repositories/playerRepository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function createPlayer(data) {
  const id = await getNextId("playerid");
  const playerExists = await repository.findPlayerByEmail(data.email);

  if (playerExists) {
    throw new Error("User already exists with this email.");
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
  return await repository.findPlayerById(id);
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

async function login(email, password) {
  const user = await repository.findPlayerByEmail(email);
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!user || !isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "6h",
    },
  );

  return token;
}

module.exports = {
  createPlayer,
  getPlayer,
  updatePlayer,
  deletePlayer,
  getAllPlayers,
  login,
};
