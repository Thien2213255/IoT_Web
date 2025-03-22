const mongoose = require("mongoose");

const HumiditySchema = new mongoose.Schema({
  value: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Humidity", HumiditySchema);