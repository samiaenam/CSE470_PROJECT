const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  name: { type: String, required: true },  // e.g., "Toyota Corolla"
  type: { type: String, required: true },  // "Sedan", "SUV", etc.
  seats: { type: Number, required: true },
  image: { type: String, required: true }, // store car photo URL
  rentPerHour: { type: Number, required: true },
  available: { type: Boolean, default: true },
});

module.exports = mongoose.model("Vehicle", vehicleSchema);
