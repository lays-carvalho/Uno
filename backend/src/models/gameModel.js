/*
 * [2025-07-23] João Neto:
 * Modelo do jogo UNO com validações
 */
const mongoose = require('mongoose'); 


const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'O nome do jogo é obrigatório'],
    trim: true,
    maxlength: [100, 'O nome não pode exceder 100 caracteres']
  },
  rules: {
    type: String,
    default: 'Regras padrão do UNO'
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['waiting', 'active', 'finished'],
    default: 'waiting'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  startedAt: {
    type: Date
  }
}, {
  versionKey: false // Remove o campo __v
});

// Índices para melhorar consultas
gameSchema.index({ creatorId: 1 });
gameSchema.index({ status: 1 });

module.exports = mongoose.model('Game', gameSchema);