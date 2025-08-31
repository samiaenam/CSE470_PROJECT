const Ride = require("../models/rideModel");

// ============================
// CREATE RIDE (Admin)
// ============================
const createRide = async (req, res) => {
  try {
    const { routeName, pickupArea, pickupPoints, destinationArea, dropPoints } = req.body;

    if (!routeName || !pickupArea || !pickupPoints || !destinationArea || !dropPoints) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const ride = new Ride({
      routeName,
      pickupArea,
      pickupPoints,
      destinationArea,
      dropPoints,
    });

    await ride.save();
    res.status(201).json({ message: "Ride created successfully", ride });
  } catch (error) {
    console.error("Error creating ride:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// GET ALL RIDES (Admin)
// ============================
const getAllRides = async (req, res) => {
  try {
    const rides = await Ride.find();
    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// DELETE RIDE (Admin)
// ============================
const deleteRide = async (req, res) => {
  try {
    const ride = await Ride.findByIdAndDelete(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    res.json({ message: "Ride deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// UPDATE RIDE DETAILS (Admin)
// ============================
const updateRideDetails = async (req, res) => {
  try {
    const ride = await Ride.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    res.json({ message: "Ride updated successfully", ride });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// ADD PICKUP POINT
// ============================
const addPickupPoint = async (req, res) => {
  try {
    const { pickupPoint } = req.body;

    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    if (!ride.pickupPoints.includes(pickupPoint)) {
      ride.pickupPoints.push(pickupPoint);
      await ride.save();
    }

    res.json({ message: "Pickup point added", ride });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// REMOVE PICKUP POINT
// ============================
const removePickupPoint = async (req, res) => {
  try {
    const { pickupPoint } = req.body;

    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    ride.pickupPoints = ride.pickupPoints.filter((point) => point !== pickupPoint);
    await ride.save();

    res.json({ message: "Pickup point removed", ride });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// ADD DROP-OFF POINT
// ============================
const addDropPoint = async (req, res) => {
  try {
    const { dropPoint } = req.body;

    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    if (!ride.dropPoints.includes(dropPoint)) {
      ride.dropPoints.push(dropPoint);
      await ride.save();
    }

    res.json({ message: "Drop-off point added", ride });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// REMOVE DROP-OFF POINT
// ============================
const removeDropPoint = async (req, res) => {
  try {
    const { dropPoint } = req.body;

    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    ride.dropPoints = ride.dropPoints.filter((point) => point !== dropPoint);
    await ride.save();

    res.json({ message: "Drop-off point removed", ride });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createRide,
  getAllRides,
  deleteRide,
  updateRideDetails,
  addPickupPoint,
  removePickupPoint,
  addDropPoint,
  removeDropPoint,
};
