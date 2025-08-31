const express = require("express");
const router = express.Router();
const { createRentalRide, getRentalInvite, respondToInvite} = require("../controllers/rentalController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/rent", authMiddleware, createRentalRide);
router.post("/invite", authMiddleware, getRentalInvite);
router.post("/respond", authMiddleware, respondToInvite);

module.exports = router;
