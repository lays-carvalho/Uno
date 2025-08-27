const mongoose = require("mongoose");

const trackingSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  endpointAccess: { type: String, required: true },
  requestMethod: { type: String, required: true },
  statusCode: { type: Number, required: true },
  responseTime: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  userId: { type: String }, 
});

module.exports = mongoose.model("Tracking", trackingSchema);
