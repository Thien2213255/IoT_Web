const mongoose = require("mongoose");

const Light_2_Schema = new mongoose.Schema({
  value: Number, // 1 = ON, 0 = OFF
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Light_2", Light_2_Schema);