const Ride = require("../models/rideModel");
const Booking = require("../models/bookingModel");
const mongoose = require("mongoose");

// 1. Admin creates a new ride (static route)
exports.createRide = async (req, res) => {
  try {
    const { area, destination, pickupLocations, dropLocations } = req.body;

    const ride = new Ride({
      area,
      destination,
      pickupLocations: pickupLocations.map(loc => ({ name: loc, type: "pickup" })),
      dropLocations: dropLocations.map(loc => ({ name: loc, type: "drop" }))
    });

    await ride.save();
    res.status(201).json({ success: true, ride });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. User gets available destinations from an area
exports.getDestinationsFromArea = async (req, res) => {
  try {
    const { area } = req.params;
    const rides = await Ride.find({ area, active: true });

    const destinations = [...new Set(rides.map(r => r.destination))];
    res.json({ success: true, destinations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. User gets pickup locations for an area
exports.getPickupLocations = async (req, res) => {
  try {
    const { area } = req.params;
    const rides = await Ride.find({ area, active: true });
    const pickupLocations = rides.flatMap(r => r.pickupLocations);

    res.json({ success: true, pickupLocations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. User gets drop locations for a destination
exports.getDropLocations = async (req, res) => {
  try {
    const { area, destination } = req.params;
    const ride = await Ride.findOne({ area, destination, active: true });

    if (!ride) {
      return res.status(404).json({ success: false, message: "Route not found" });
    }

    res.json({ success: true, dropLocations: ride.dropLocations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. User books a ride (auto-scheduled for tomorrow)
exports.bookRide = async (req, res) => {
  try {
    const { rideId, userId, pickupLocation, dropLocation } = req.body;

    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ success: false, message: "Ride not found" });

    // Only allow booking for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const booking = new Booking({
      ride: rideId,
      user: userId,
      pickupLocation,
      dropLocation,
      date: tomorrow
    });

    await booking.save();
    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
