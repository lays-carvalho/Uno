const service = require("../services/playerService");
const scoreService = require("../services/scoreService"); 

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

// João Neto(ToDo) padronizado para POST
async function postPlayerInfo(req, res, next) {
  const { accessToken } = req.body;

  try {
    let player = await service.postPlayerInfo(accessToken); 

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    // Remover __v se existir
    player = player.toObject ? player.toObject() : player;
    delete player.__v;

    // TO DO: Buscar scores do jogador 
    let wins = 0;
    let loss = 0;
    let total = 0;

    try {
      
      const scores = [];
      wins = scores.filter(s => s.result === "win").length;
      loss = scores.filter(s => s.result === "loss").length;
      total = wins + loss;
    } catch (error) {
      console.warn('Aviso: Sistema de scores não implementado');
    }

    // Adicionar métricas ao retorno, removi o password por segurança
    const profile = {
      _id: player._id,
      id: player.id,
      name: player.name,
      email: player.email,
      createdAt: player.createdAt,
      wins,      // ← Adicionado
      loss,      // ← Adicionado  
      total      // ← Adicionado
    };

    res.status(200).json(profile);
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
  postPlayerInfo, //João Neto(ToDo) exportando corrigido
  login,
  logout,
};
