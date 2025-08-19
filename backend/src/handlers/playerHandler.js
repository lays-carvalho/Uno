const service = require("../services/playerService");

async function createPlayer(req, res, next) {
  try {
    await service.createPlayer(req.body);
    res.status(201).json({ message: "Player created successfully" });
  } catch (error) {
    next(error);
  }
}

async function getPlayer(req, res, next) {
  try {
    const player = await service.getPlayer(req.params.id);
    res.json(player);
  } catch (error) {
    next(error);
  }
}

async function updatePlayer(req, res, next) {
  try {
    const updated = await service.updatePlayer(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Player not found" });
    }
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

async function deletePlayer(req, res, next) {
  try {
    const deleted = await service.deletePlayer(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Player not found" });
    }
    res.json({ message: "Player deleted successfully" });
  } catch (error) {
    next(error);
  }
}

async function getAllPlayers(req, res, next) {
  try {
    const players = await service.getAllPlayers();
    res.json(players);
  } catch (error) {
    next(error);
  }
}

async function getPlayerInfo(req, res, next) {
  const { accessToken } = req.body;

  try {
    const player = await service.getPlayerInfo(accessToken);
    res.status(200).json(player);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    const token = await service.login(email, password);
    res.json({ message: "Login successful", accessToken: token });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  const { accessToken } = req.body;

  try {
    await service.logout(accessToken);
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createPlayer,
  getPlayer,
  updatePlayer,
  deletePlayer,
  getAllPlayers,
  getPlayerInfo,
  login,
  logout,
};
