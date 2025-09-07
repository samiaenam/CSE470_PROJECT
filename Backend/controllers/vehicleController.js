const Vehicle = require("../models/Vehicle");

// Helper: normalize to YYYY-MM-DD
function toYMD(input) {
  if (!input) return null;
  const d = new Date(input);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

// Create Vehicle (Admin only)
exports.createVehicle = async (req, res) => {
  try {
    const { name, type, licensePlate, seats } = req.body;
    if (!name || !type || !licensePlate || !seats) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await Vehicle.findOne({ licensePlate });
    if (existing) {
      return res.status(400).json({ message: "Vehicle with this license plate already exists" });
    }

    const vehicle = await Vehicle.create({
      name,
      type,
      licensePlate,
      seats,
      bookedDates: [], // start empty
      createdBy: req.user._id,
    });

    res.status(201).json(vehicle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Vehicles (optionally filter by date availability)
exports.getVehicles = async (req, res) => {
  try {
    const { date, page = 1, limit = 50 } = req.query;

    if (date) {
      const formatted = toYMD(date);
      if (!formatted) return res.status(400).json({ message: "Invalid date" });

      // Only return vehicles NOT booked on that date
      const vehicles = await Vehicle.find({
        bookedDates: { $ne: formatted },
      }).sort({ createdAt: -1 });

      return res.json(vehicles);
    }

    // Paginated list (no date filter)
    const skip = (Math.max(1, parseInt(page)) - 1) * Math.max(1, parseInt(limit));
    const vehicles = await Vehicle.find().sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single vehicle
exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Vehicle (Admin only)
exports.updateVehicle = async (req, res) => {
  try {
    const updates = { ...req.body };

    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Vehicle (Admin only)
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.json({ message: "Vehicle deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
