const express = require('express');
const { registerUser, loginUser, getUserProfile, logoutUser } = require('../controllers/userController');
const { authUser } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authUser, getUserProfile);
router.post('/logout', authUser, logoutUser);

module.exports = router;
