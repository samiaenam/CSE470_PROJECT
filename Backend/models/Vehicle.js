const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["car", "bike", "van", "bus"], required: true },
  hourlyRate: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Vehicle", vehicleSchema);
