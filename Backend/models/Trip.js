const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },

    destination: { type: String, required: true },
    date: { type: String, required: true }, // store YYYY-MM-DD string

    pickupLocations: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        location: { type: String },
      },
    ],

    invitedFriends: [
      {
        friend: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" },
        pickupLocation: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);
