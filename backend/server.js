require("dotenv").config();
const app = require("./src/app");
const mongoose = require("./src/database/config");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

mongoose.connection.once("connected", async () => {
  console.log("MongoDB connected successfully");

  const Card = require("./src/models/cardModel");
  const populateCards = require("./src/database/populateCards");

  const count = await Card.countDocuments();
  if (count === 0) {
    await populateCards();
  } else {
    console.log("Baralho já existe, não será recriado.");
  }
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
