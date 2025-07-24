/*
 * [2025-07-23] João Neto:
 * Criação do bando de dados (MongoDB)
 */
const app = require('./src/app');
const connectDB = require('./src/database');

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

