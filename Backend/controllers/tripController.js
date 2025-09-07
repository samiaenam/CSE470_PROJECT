// controllers/tripController.js
const Trip = require('../models/Trip');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User'); // <--- ADD THIS


exports.createTrip = async (req, res) => {
try {
const { vehicleId, date, destination, pickupLocation, invitedPhones } = req.body;


if (!vehicleId || !date || !destination || !pickupLocation) return res.status(400).json({ message: 'Required fields missing' });


const vehicle = await Vehicle.findById(vehicleId);
if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
if ((vehicle.bookedDates || []).includes(date)) return res.status(400).json({ message: 'Vehicle not available on this date' });


let invited = [];
if (invitedPhones && invitedPhones.length > 0) {
const users = await User.find({ phone: { $in: invitedPhones } });
invited = users.map(u => ({ user: u._id }));
}


const trip = await Trip.create({
creator: req.user._id,
vehicle: vehicle._id,
date,
destination,
pickupLocations: [{ user: req.user._id, location: pickupLocation }],
invited
});


vehicle.bookedDates = [...(vehicle.bookedDates || []), date];
await vehicle.save();


res.status(201).json(trip);
} catch (err) {
res.status(500).json({ message: err.message });
}
};

exports.availableVehicles = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: 'Date is required' });

    const vehicles = await Vehicle.find({ bookedDates: { $ne: date } });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate('creator vehicle pickupLocations.user invited.user');
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.respondInvite = async (req, res) => {
  try {
    const { status, pickupLocation } = req.body;
    if (!['accepted','declined'].includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const invite = trip.invited.find(i => i.user.toString() === req.user._id.toString());
    if (!invite) return res.status(403).json({ message: 'Not invited to this trip' });

    invite.status = status;

    if (status === 'accepted' && pickupLocation) {
      trip.pickupLocations.push({ user: req.user._id, location: pickupLocation });
    }

    await trip.save();
    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
