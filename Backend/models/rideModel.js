const mongoose = require("mongoose");

// Pickup/Drop locations schema
const locationSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Example: "Bashundhara Gate 1"
  type: { type: String, enum: ["pickup", "drop"], required: true }
});

// Ride Schema (static routes, defined once by admin)
const rideSchema = new mongoose.Schema({
  area: { type: String, required: true }, // Example: "Bashundhara"
  destination: { type: String, required: true }, // Example: "Gulshan"
  pickupLocations: [locationSchema],
  dropLocations: [locationSchema],
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Ride", rideSchema);