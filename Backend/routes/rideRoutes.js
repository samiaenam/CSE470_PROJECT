const express = require('express');
const { createRide, joinRide, getRides } = require('../controllers/rideController');
const { authUser } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getRides);
router.post('/', authUser, createRide);
router.post('/:id/join', authUser, joinRide);

module.exports = router;
