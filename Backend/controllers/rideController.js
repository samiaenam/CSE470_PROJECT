const Ride = require('../models/rideModel');

// Create a ride (carpool)
exports.createRide = async (req, res) => {
    try {
        const ride = await Ride.create({
            pickup: req.body.pickup,
            destination: req.body.destination,
            seatsAvailable: req.body.seatsAvailable,
            femaleOnly: req.body.femaleOnly || false,
            cost: req.body.cost,
            createdBy: req.user._id
        });
        res.status(201).json(ride);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Join a ride
exports.joinRide = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id);
        if (!ride) return res.status(404).json({ message: 'Ride not found' });

        if (ride.femaleOnly && req.user.gender !== 'female') {
            return res.status(403).json({ message: 'Females only' });
        }

        if (ride.seatsAvailable <= 0) {
            return res.status(400).json({ message: 'No seats available' });
        }

        ride.passengers.push(req.user._id);
        ride.seatsAvailable -= 1;
        await ride.save();

        res.json(ride);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// List all rides
exports.getRides = async (req, res) => {
    try {
        const rides = await Ride.find().populate('createdBy', 'fullname');
        res.json(rides);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
