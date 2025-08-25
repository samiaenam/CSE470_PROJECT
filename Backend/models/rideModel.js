const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    pickup: { type: String, required: true },
    destination: { type: String, required: true },
    seatsAvailable: { type: Number, required: true },
    femaleOnly: { type: Boolean, default: false },
    passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    cost: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('ride', rideSchema);
