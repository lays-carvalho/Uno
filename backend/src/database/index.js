/*
 * [2025-07-23] João Neto:
 * Exemplo de Database que podemos utilizar
 */
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;
