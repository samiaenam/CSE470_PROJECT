const userModel = require('../models/userModel');
const { validationResult } = require('express-validator');
const blackListTokenModel = require('../models/blacklistTokenModel');

// REGISTER USER
module.exports.registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullname, phone, email, password } = req.body;

        if (!fullname?.firstname || !phone || !password) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        const existingUser = await userModel.findOne({ $or: [{ phone }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await userModel.hashPassword(password);

        const user = await userModel.create({
            fullname: {
                firstname: fullname.firstname,
                lastname: fullname.lastname || ''
            },
            phone,
            email: email || null,
            password: hashedPassword,
            role: 'user' // cannot be set from client request
        });

        const token = user.generateAuthToken();
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(201).json({ token, user });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// LOGIN USER
module.exports.loginUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { phone, password } = req.body;

        const user = await userModel.findOne({ phone }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid phone or password' });
        }

        const token = user.generateAuthToken();
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(200).json({ token, user });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// GET USER PROFILE
module.exports.getUserProfile = (req, res) => {
    res.status(200).json(req.user);
};

// LOGOUT USER
module.exports.logoutUser = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if (token) {
            await blackListTokenModel.create({ token });
        }
        res.clearCookie('token');
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
