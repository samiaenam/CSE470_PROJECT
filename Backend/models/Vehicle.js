const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },         // e.g. "Toyota Corolla"
    type: { type: String, required: true },         // e.g. "Car", "Bike"
    licensePlate: { type: String, required: true, unique: true },
    seats: { type: Number, required: true },

    // Store only UNAVAILABLE dates as YYYY-MM-DD strings
    bookedDates: [{ type: String }],

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // admin who added
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
