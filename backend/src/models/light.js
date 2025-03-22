const mongoose = require("mongoose");

const LightSchema = new mongoose.Schema({
  value: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Light", LightSchema);