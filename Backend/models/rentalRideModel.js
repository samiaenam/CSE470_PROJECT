// models/rentalRideModel.js
const mongoose = require("mongoose");

const rentalRideSchema = new mongoose.Schema({
  initiator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  date: {  // 🆕 add rental date
    type: Date,
    required: true,
  },
  pickupLocations: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      location: { type: String, required: true },
      confirmed: { type: Boolean, default: false },
    },
  ],
  invites: [
    {
      phone: { type: String, required: true },
      status: {
        type: String,
        enum: ["pending", "accepted", "declined"],
        default: "pending",
      },
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
  status: {
    type: String,
    enum: ["open", "in-progress", "completed", "cancelled"],
    default: "open",
  },
}, { timestamps: true });

module.exports = mongoose.model("Rental", rentalRideSchema);
