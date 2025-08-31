const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you already have a User model
    required: true,
  },
  rideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ride",
    required: true,
  },
  pickupPoint: {
    type: String,
    required: true,
  },
  dropPoint: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["booked", "cancelled"],
    default: "booked",
  }
});

module.exports = mongoose.model("Booking", bookingSchema);
