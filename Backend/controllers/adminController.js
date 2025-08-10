// routes/adminRoutes.js
import express from "express";
import User from "../models/userModel.js";
import { verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Promote user to admin
router.put("/promote/:userId", verifyAdmin, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { role: "admin" },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User promoted to admin", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Demote admin to user
router.put("/demote/:userId", verifyAdmin, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { role: "user" },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Admin demoted to user", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
