const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
  routeName: { type: String, required: true },
  pickupLocations: [{ type: String, required: true }],
  dropoffLocations: [{ type: String, required: true }],
  totalSeats: { type: Number, required: true },
  times: [{ type: String, required: true }],
  femaleOnly: { type: Boolean, default: false }, // 🚨 New field
});

module.exports = mongoose.model("Ride", rideSchema);
