

const User = require('../models/userModel');

const getPlayerById = async (id) => {
  return await User.findById(id);
};

const getAllPlayers = async () => {
  return await User.find();
};

const createPlayer = async (playerData) => {
  const user = new User(playerData);
  return await user.save();
};

const updatePlayer = async (id, updates) => {
  return await User.findByIdAndUpdate(id, updates, { new: true });
};

const deletePlayer = async (id) => {
  const result = await User.findByIdAndDelete(id);
  return result !== null;
};

module.exports = {
  getPlayerById,
  getAllPlayers,
  createPlayer,
  updatePlayer,
  deletePlayer,
};
