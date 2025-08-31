const Ride = require("../models/rideModel");
const Booking = require("../models/bookingModel");

// ============================
// ADMIN: Create a new route
// ============================
exports.createRide = async (req, res) => {
  try {
    const { routeName, pickupArea, pickupPoints, destinationArea, dropPoints } = req.body;

    const newRide = new Ride({
      routeName,
      pickupArea,
      pickupPoints,
      destinationArea,
      dropPoints
    });

    await newRide.save();

    res.status(201).json({
      message: "Ride route created successfully",
      ride: newRide
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to create ride", error: err.message });
  }
};

// ============================
// USER: Get pickup points by area
// ============================
exports.getPickupPoints = async (req, res) => {
  try {
    const { pickupArea } = req.params;
    const rides = await Ride.find({ pickupArea });

    if (!rides.length) return res.status(404).json({ message: "No routes from this area" });

    res.status(200).json({
      pickupArea,
      pickupPoints: rides.flatMap(r => r.pickupPoints),
      destinations: rides.map(r => r.destinationArea)
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching pickup points", error: err.message });
  }
};

// ============================
// USER: Get drop points by pickup + destination
// ============================
exports.getDropPoints = async (req, res) => {
  try {
    const { pickupArea, destinationArea } = req.params;
    const ride = await Ride.findOne({ pickupArea, destinationArea });

    if (!ride) return res.status(404).json({ message: "No route found" });

    res.status(200).json({
      pickupArea,
      destinationArea,
      dropPoints: ride.dropPoints
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching drop points", error: err.message });
  }
};

// ============================
// USER: Book ride (always for tomorrow)
// ============================
exports.bookRide = async (req, res) => {
  try {
    const { userId, rideId, pickupPoint, dropPoint } = req.body;

    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    // Set booking date = tomorrow
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const booking = new Booking({
      userId,
      rideId,
      pickupPoint,
      dropPoint,
      date: tomorrow,
    });

    await booking.save();

    res.status(201).json({
      message: "Ride booked successfully for tomorrow",
      booking
    });
  } catch (err) {
    res.status(500).json({ message: "Booking failed", error: err.message });
  }
};
