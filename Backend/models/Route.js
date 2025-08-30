const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema({
  pickup: { type: String, required: true },
  destination: { type: String, required: true },
  cost: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Route", routeSchema);