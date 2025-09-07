// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  isAdmin: { type: Boolean, default: false }, // Add this
});

module.exports = mongoose.model("User", userSchema);