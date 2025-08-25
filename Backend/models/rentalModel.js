const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'vehicle', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    invitedFriends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    acceptedFriends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    cost: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('rental', rentalSchema);
