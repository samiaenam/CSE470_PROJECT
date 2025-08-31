const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
  routeName: {
    type: String,
    required: true,
  },
  pickupArea: {
    type: String, // e.g., "Bashundhara"
    required: true,
  },
  pickupPoints: [
    {
      type: String, // e.g., "Block C Gate", "Block D Mosque"
    }
  ],
  destinationArea: {
    type: String, // e.g., "Gulshan"
    required: true,
  },
  dropPoints: [
    {
      type: String, // e.g., "Circle 1", "Circle 2"
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Ride", rideSchema);
