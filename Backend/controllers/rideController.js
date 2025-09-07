// controllers/rideController.js
const Ride = require("../models/Ride");
const Booking = require("../models/Booking"); // ✅ FIXED missing import

// Create ride (Admin)
exports.createRide = async (req, res) => {
  try {
    const {
      routeName,
      pickupLocations = [],
      dropoffLocations = [],
      times = [],
      totalSeats = 10,
      femaleOnly = false,
    } = req.body;

    if (!routeName || !times.length) {
      return res
        .status(400)
        .json({ message: "routeName and times are required" });
    }

    const ride = await Ride.create({
      routeName,
      pickupLocations,
      dropoffLocations,
      times,
      totalSeats,
      femaleOnly,
    });

    res.status(201).json(ride);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all rides
exports.getRides = async (req, res) => {
  try {
    const rides = await Ride.find().sort({ createdAt: -1 });
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single ride
exports.getRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: "Ride not found" });
    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete ride (Admin)
exports.deleteRide = async (req, res) => {
  try {
    const ride = await Ride.findByIdAndDelete(req.params.id);
    if (!ride) return res.status(404).json({ message: "Ride not found" });
    res.json({ message: "Ride deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add pickup
exports.addPickup = async (req, res) => {
  try {
    const { location } = req.body;
    if (!location)
      return res.status(400).json({ message: "location required" });

    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    if (ride.pickupLocations.includes(location)) {
      return res.status(400).json({ message: "Already exists" });
    }

    ride.pickupLocations.push(location);
    await ride.save();

    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove pickup
exports.removePickup = async (req, res) => {
  try {
    const { location } = req.body;
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    ride.pickupLocations = ride.pickupLocations.filter((p) => p !== location);
    await ride.save();

    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add dropoff
exports.addDropoff = async (req, res) => {
  try {
    const { location } = req.body;
    if (!location)
      return res.status(400).json({ message: "location required" });

    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    if (ride.dropoffLocations.includes(location)) {
      return res.status(400).json({ message: "Already exists" });
    }

    ride.dropoffLocations.push(location);
    await ride.save();

    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove dropoff
exports.removeDropoff = async (req, res) => {
  try {
    const { location } = req.body;
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    ride.dropoffLocations = ride.dropoffLocations.filter((p) => p !== location);
    await ride.save();

    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Book ride (User) with female-only check, time selection, and seat decrement
exports.bookRide = async (req, res) => {
  try {
    const { rideId, pickup, dropoff, time } = req.body; // get time
    const userId = req.user._id;
    const userGender = req.user.gender; // assuming you store gender in user model

    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    // Validate pickup & dropoff
    if (!ride.pickupLocations.includes(pickup)) {
      return res.status(400).json({ message: "Invalid pickup location" });
    }
    if (!ride.dropoffLocations.includes(dropoff)) {
      return res.status(400).json({ message: "Invalid dropoff location" });
    }

    // Validate time
    if (!ride.times.includes(time)) {
      return res.status(400).json({ message: "Invalid time selected" });
    }

    // Female-only check
    if (ride.femaleOnly && userGender !== "female") {
      return res.status(403).json({ message: "This ride is for females only" });
    }

    // Check seat availability
    if (ride.totalSeats <= 0) {
      return res.status(400).json({ message: "No seats available" });
    }

    // Create booking
    const booking = await Booking.create({
      ride: rideId,
      user: userId,
      pickup,
      dropoff,
      time, // save selected time
    });

    // Decrease seats
    ride.totalSeats -= 1;
    await ride.save();

    res.status(201).json({ message: "Ride booked successfully", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




// Get logged-in user's bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate(
        "ride",
        "routeName pickupLocations dropoffLocations times totalSeats femaleOnly"
      )
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
