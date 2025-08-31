const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// CRUD for rides
router.post("/rides", adminController.createRide);
router.get("/rides", adminController.getAllRides);
router.put("/rides/:id", adminController.updateRideDetails);
router.delete("/rides/:id", adminController.deleteRide);

// Pickup management
router.post("/rides/:id/pickup", adminController.addPickupPoint);
router.delete("/rides/:id/pickup", adminController.removePickupPoint);

// Drop-off management
router.post("/rides/:id/dropoff", adminController.addDropPoint);
router.delete("/rides/:id/dropoff", adminController.removeDropPoint);

module.exports = router;
