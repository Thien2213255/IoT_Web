const mongoose = require("mongoose");

const TemperatureSchema = new mongoose.Schema({
  value: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Temperature", TemperatureSchema);