const mongoose = require('mongoose');


const tripSchema = new mongoose.Schema({
creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
date: { type: String, required: true }, // store as string YYYY-MM-DD
destination: { type: String, required: true },
pickupLocations: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, location: String }],
invited: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' } }],
});


module.exports = mongoose.model('Trip', tripSchema);