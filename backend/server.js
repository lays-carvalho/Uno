require("dotenv").config();
const app = require("./src/app");
const mongoose = require("./src/database/config");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

mongoose.connection.once("connected", () => {
  console.log("MongoDB connected successfully");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
