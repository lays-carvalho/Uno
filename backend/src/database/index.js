/*
 * [2025-07-23] João Neto:
 * Conexão com o banco de dados MongoDB usando Mongoose
 */

const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/capstone';

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(mongoURI);
    console.log('✅ Conectado ao MongoDB');
  }
}

module.exports = connectDB;

