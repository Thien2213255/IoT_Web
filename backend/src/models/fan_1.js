const mongoose = require("mongoose");

const Fan_1_Schema = new mongoose.Schema({
  value: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Fan_1", Fan_1_Schema);