const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    ride: { type: mongoose.Schema.Types.ObjectId, ref: "Ride", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    pickup: { type: String, required: true },
    dropoff: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
