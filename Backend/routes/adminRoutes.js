const express = require('express');
const { addVehicle, updateVehicle, getVehicles } = require('../controllers/adminController');
const { authUser } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/vehicle', authUser, addVehicle);
router.put('/vehicle/:id', authUser, updateVehicle);
router.get('/vehicles', authUser, getVehicles);

module.exports = router;

