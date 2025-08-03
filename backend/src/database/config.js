//config.js

const mongoose = require("mongoose");

const mongoUrl = process.env.DATABASE_URL;

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = mongoose;
