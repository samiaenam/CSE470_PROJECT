const express = require('express');
const { createRental, inviteFriend, respondInvite } = require('../controllers/rentalController');
const { authUser } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authUser, createRental);
router.post('/:id/invite', authUser, inviteFriend);
router.post('/:id/respond', authUser, respondInvite);

module.exports = router;
