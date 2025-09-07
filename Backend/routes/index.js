// routes/index.js
const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const vehicleRoutes = require("./vehicleRoutes");
const tripRoutes = require("./tripRoutes")
const carpoolRoutes = require("./carpoolRoutes")
router.use("/carpools", carpoolRoutes)

router.use("/trips", tripRoutes)
router.use("/auth", authRoutes);
router.use("/vehicles", vehicleRoutes);

module.exports = router;
