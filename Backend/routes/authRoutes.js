const express = require("express");
const { register, login, logout, getProfile, updateProfile } = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.post("/register", register);
router.post("/login", login);

// Protected
router.post("/logout", authMiddleware, logout);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

module.exports = router;
