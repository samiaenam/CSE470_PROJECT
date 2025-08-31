const express = require("express");
const router = express.Router();
const carpoolController = require("../controllers/carpoolController");

// ============================
// ADMIN
// ============================

// Create a new route (admin only)
router.post("/rides", carpoolController.createRide);

// ============================
// USER
// ============================

// Get pickup points + available destinations for an area
router.get("/rides/:pickupArea", carpoolController.getPickupPoints);

// Get drop points for a pickup area + destination
router.get("/rides/:pickupArea/:destinationArea", carpoolController.getDropPoints);

// Book a ride (always for tomorrow)
router.post("/book", carpoolController.bookRide);

module.exports = router;
