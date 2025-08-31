// models/rentalRideModel.js
const mongoose = require("mongoose");

const rentalRideSchema = new mongoose.Schema({
  initiator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  vehicle: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  initiatorPickup: {
    type: String,
    required: true,
  },
  invites: [
    {
      emailOrPhone: { type: String, required: true },
      status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" },
      pickupLocation: { type: String } // optional, only if they want to set
    }
  ],
  status: {
    type: String,
    enum: ["open", "in-progress", "completed", "cancelled"],
    default: "open",
  },
}, { timestamps: true });

module.exports = mongoose.model("Rental", rentalRideSchema);
