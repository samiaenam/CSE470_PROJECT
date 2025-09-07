// routes/vehicleRoutes.js
const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicleController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { adminMiddleware } = require("../middleware/adminMiddleware");

// User routes
router.get("/", authMiddleware, vehicleController.getVehicles);       // ?date=YYYY-MM-DD
router.get("/:id", authMiddleware, vehicleController.getVehicleById);

// Admin routes
router.post("/", authMiddleware, adminMiddleware, vehicleController.createVehicle);
router.put("/:id", authMiddleware, adminMiddleware, vehicleController.updateVehicle);
router.delete("/:id", authMiddleware, adminMiddleware, vehicleController.deleteVehicle);

module.exports = router;
