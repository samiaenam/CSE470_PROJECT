// models/Ride.js
const mongoose = require("mongoose");

const bookingSubSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pickup: String,
  dropoff: String,
  seatNumber: Number,
  createdAt: { type: Date, default: Date.now },
});

const rideSchema = new mongoose.Schema(
  {
    routeName: { type: String, required: true }, // e.g. "Uttara → Dhanmondi"
    pickupLocations: { type: [String], required: true, default: [] },
    dropoffLocations: { type: [String], required: true, default: [] },
    times: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) =>
          arr.every((t) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(t)),
        message: "Invalid time format. Use HH:mm (24-hour).",
      },
    },
    totalSeats: { type: Number, required: true, min: 1 },
    bookedSeats: { type: Number, default: 0 }, // quick count
    bookings: { type: [bookingSubSchema], default: [] }, // detailed bookings
    femaleOnly: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ride", rideSchema);
