const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const rideController = require("../controllers/rideController");

// Booking
router.get("/my-bookings", authMiddleware, rideController.getUserBookings);
router.post("/book", authMiddleware, rideController.bookRide);


// Admin: create, delete rides
router.post("/", authMiddleware, rideController.createRide);
router.delete("/:id", authMiddleware, rideController.deleteRide);

// Get rides
router.get("/", authMiddleware, rideController.getRides);
router.get("/:id", authMiddleware, rideController.getRide);

// Manage pickup/dropoff
router.post("/:id/add-pickup", authMiddleware, rideController.addPickup);
router.post("/:id/remove-pickup", authMiddleware, rideController.removePickup);
router.post("/:id/add-dropoff", authMiddleware, rideController.addDropoff);
router.post("/:id/remove-dropoff", authMiddleware, rideController.removeDropoff);



module.exports = router;
