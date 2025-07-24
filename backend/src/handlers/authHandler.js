/*
 * [2025-07-23] João Neto:
 * Semana 3: Atividade 4: Obter perfil do usuário
 */
const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

const logout = async (req, res) => {
  try {
    const result = await authService.logoutUser();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Logout failed' });
  }
};

const profile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token not provided' });
    }

    const result = await authService.getProfile(token);
    res.status(200).json(result);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = {
  register,
  login,
  logout,
  profile,
};
