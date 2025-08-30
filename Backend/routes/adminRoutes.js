const express = require("express");
const router = express.Router();
const { addVehicle, updateVehicle, addRoute, updateRoute } = require("../controllers/adminController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/vehicle", authMiddleware, addVehicle);
router.put("/vehicle/:id", authMiddleware, updateVehicle);
router.post("/route", authMiddleware, addRoute);
router.put("/route/:id", authMiddleware, updateRoute);

module.exports = router;
