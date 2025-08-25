const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    type: { type: String, enum: ['car', 'van', 'bike'], required: true },
    model: { type: String, required: true },
    capacity: { type: Number, required: true },
    costPerHour: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('vehicle', vehicleSchema);
