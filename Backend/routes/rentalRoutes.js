const express = require("express");
const router = express.Router();
const { rentVehicle, inviteFriend, respondInvite } = require("../controllers/rentalController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/rent", authMiddleware, rentVehicle);
router.post("/invite", authMiddleware, inviteFriend);
router.post("/respond", authMiddleware, respondInvite);

module.exports = router;
