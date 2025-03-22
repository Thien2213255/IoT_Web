const mongoose = require("mongoose");

const Fan_2_Schema = new mongoose.Schema({
  value: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Fan_2", Fan_2_Schema);