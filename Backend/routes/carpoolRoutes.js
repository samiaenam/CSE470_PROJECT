// const express = require("express");
// const { authUser } = require("../middleware/authMiddleware");
// const {
//   createRide,
//   updateRide,
//   deleteRide,
//   getAllRides,
// } = require("../controllers/carpoolController");

// const {
//   bookRide,
//   cancelBooking,
//   getMyBookings,
//   getAvailableRides,
// } = require("../controllers/bookingController");

// const router = express.Router();

// /**
//  * ADMIN ROUTES (protected, only admin should access in real system)
//  */
// router.post("/rides", createRide);        // Create a ride (admin)
// router.put("/rides/:id", updateRide);     // Update ride (admin)
// router.delete("/rides/:id", deleteRide);  // Delete ride (admin)
// router.get("/rides", getAllRides);        // List all rides (admin/user)

// /**
//  * USER ROUTES (need authentication)
//  */
// router.post("/book", authUser, bookRide);           // Book a ride
// router.post("/cancel/:id", authUser, cancelBooking);// Cancel booking
// router.get("/mybookings", authUser, getMyBookings); // View my bookings
// router.get("/available", getAvailableRides);        // View available rides

// module.exports = router;
const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  createRide,
  updateRide,
  deleteRide,
  getAllRides,
} = require("../controllers/carpoolController");

const {
  bookRide,
  cancelBooking,
  getMyBookings,
  getAvailableRides,
} = require("../controllers/bookingController");





const router = express.Router();

/**
 * ADMIN ROUTES (protected, in real app should check admin role)
 */
router.post("/rides", createRide);        // Create a ride
router.put("/rides/:id", updateRide);     // Update a ride
router.delete("/rides/:id", deleteRide);  // Delete a ride
router.get("/rides", getAllRides);        // List all rides

/**
 * USER ROUTES (need authentication)
 */
router.post("/book", authMiddleware, bookRide);            // Book a ride
router.post("/cancel/:id", authMiddleware, cancelBooking); // Cancel booking
router.get("/mybookings", authMiddleware, getMyBookings);  // View my bookings
router.get("/available", authMiddleware, getAvailableRides); // View available rides

module.exports = router;
