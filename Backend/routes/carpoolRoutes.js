const express = require("express");
const router = express.Router();
const carpoolController = require("../controllers/carpoolController");

// ========== ADMIN ==========
router.post("/rides", carpoolController.createRide); 
// Body: { area, destination, pickupLocations: ["..."], dropLocations: ["..."] }

// ========== USER ==========
router.get("/rides/:area/destinations", carpoolController.getDestinationsFromArea);
// Example: /rides/Bashundhara/destinations

router.get("/rides/:area/pickup-locations", carpoolController.getPickupLocations);
// Example: /rides/Bashundhara/pickup-locations

router.get("/rides/:area/:destination/drop-locations", carpoolController.getDropLocations);
// Example: /rides/Bashundhara/Gulshan/drop-locations

router.post("/bookings", carpoolController.bookRide); 
// Body: { rideId, userId, pickupLocation, dropLocation }

module.exports = router;
