const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');
const {
  createTrip,
  getTrip,
  respondInvite,
  availableVehicles,
  myTripsAndInvites,
  getAllTrips,
  cancelTrip,
} = require('../controllers/tripController');

router.use(authMiddleware);

// Create a trip
router.post('/', createTrip);

// Get available vehicles for a date
router.get('/available-vehicles', availableVehicles);

// Get my trips + invites
router.get('/my-trips', myTripsAndInvites);

// Respond to an invite
router.post('/:id/respond', respondInvite);

// Get a specific trip (creator, invited, or admin)
router.get('/:id', getTrip);

// Cancel trip (only creator)
router.delete('/:id', cancelTrip);

// Admin-only: get all trips
router.get('/admin/all', adminMiddleware, getAllTrips);

module.exports = router;
