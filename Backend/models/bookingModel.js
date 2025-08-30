const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  ride: { type: mongoose.Schema.Types.ObjectId, ref: "Ride", required: true },
  user: { type: String, required: true }, // Later replace with userId from JWT
  pickupLocation: { type: String, required: true },
  dropLocation: { type: String, required: true },
  date: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
