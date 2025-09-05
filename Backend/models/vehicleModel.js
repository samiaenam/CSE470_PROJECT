// models/vehicleModel.js
const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  name: { type: String, required: true },  // e.g., "Toyota Corolla"
  type: { type: String, required: true },  // "Sedan", "SUV", etc.
  seats: { type: Number, required: true },
  image: { type: String, required: true }, // car photo URL
  rentPerHour: { type: Number, required: true },
  unavailableDates: [
    { type: Date }  // list of dates where this vehicle is already booked
  ],
});

module.exports = mongoose.model("Vehicle", vehicleSchema);
