const mongoose = require("mongoose");

const Light_1_Schema = new mongoose.Schema({
  value: Number, // 1 = ON, 0 = OFF
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Light_1", Light_1_Schema);