// server.js
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const rideRoutes = require('./routes/rideRoutes');
const rentalRoutes = require('./routes/rentalRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/admin', adminRoutes);

// DB + Server start
mongoose.connect(process.env.DB_CONNECT)
    .then(() => {
        console.log('✅ MongoDB connected');
        app.listen(process.env.PORT, () =>
            console.log(`🚀 Server running on http://localhost:${process.env.PORT}`)
        );
    })
    .catch(err => console.error('❌ MongoDB connection failed:', err));
