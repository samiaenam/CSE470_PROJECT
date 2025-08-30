const Vehicle = require("../models/Vehicle");
const Route = require("../models/Route");

// Vehicle CRUD
exports.addVehicle = async (req, res) => {
  try {
    const { name, type, hourlyRate } = req.body;
    const vehicle = await Vehicle.create({ name, type, hourlyRate });
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Route CRUD
exports.addRoute = async (req, res) => {
  try {
    const { pickup, destination, cost } = req.body;
    const route = await Route.create({ pickup, destination, cost });
    res.status(201).json(route);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(route);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
