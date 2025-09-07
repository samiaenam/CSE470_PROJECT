// routes/tripRoutes.js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { createTrip, getTrip, respondInvite, availableVehicles } = require('../controllers/tripController');


router.use(authMiddleware);


router.post('/', createTrip);
router.get('/available-vehicles', availableVehicles); // ?date=YYYY-MM-DD
router.get('/:id', getTrip);
router.post('/:id/respond', respondInvite); // { status: 'accepted'/'declined', pickupLocation? }


module.exports = router;