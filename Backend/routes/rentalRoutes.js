// routes/rentalRoutes.js
const express = require("express");
const router = express.Router();
const rentalController = require("../controllers/rentalController");
const {authMiddleware} = require("../middleware/authMiddleware");

// ✅ create rental
router.post("/", authMiddleware, rentalController.createRental);

// ✅ get available vehicles
router.get("/vehicles", authMiddleware, rentalController.getAvailableVehicles);

// ✅ respond to an invite (accept/decline)
router.post("/respond", authMiddleware, rentalController.respondInvite);

// ✅ view my rentals (only accepted or initiated)
router.get("/my", authMiddleware, rentalController.getMyRentals);

// ✅ cancel rental (only initiator)
router.put("/:id/cancel", authMiddleware, rentalController.cancelRental);

module.exports = router;
