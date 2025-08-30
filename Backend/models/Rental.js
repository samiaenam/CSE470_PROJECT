const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
  hours: { type: Number, required: true },
  invitedFriends: [
    {
      email: { type: String, required: true },
      status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Rental", rentalSchema);
