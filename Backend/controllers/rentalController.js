// controllers/rentalController.js
const Rental = require("../models/rentalRideModel");
const Vehicle = require("../models/vehicleModel");
const User = require("../models/User");

// 1. Create a new rental trip
exports.createRental = async (req, res) => {
  try {
    const { vehicleId, destination, initiatorPickup, invites } = req.body;
    const initiator = req.user._id; // comes from auth middleware

    // check vehicle exists and available
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle || !vehicle.available) {
      return res.status(400).json({ message: "Vehicle not available" });
    }

    const rental = await Rental.create({
      initiator,
      vehicle: vehicleId,
      destination,
      pickupLocations: [
        { user: initiator, location: initiatorPickup, confirmed: true },
      ],
      invites, // array of { phone }
    });

    // 🔑 mark the vehicle as booked (no longer available)
    vehicle.available = false;
    await vehicle.save();

    res.status(201).json(rental);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. View available vehicles
exports.getAvailableVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ available: true });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. Respond to an invite (accept/decline)
exports.respondInvite = async (req, res) => {
  try {
    const { rentalId, phone, status, pickupLocation } = req.body;

    const rental = await Rental.findById(rentalId);
    if (!rental) return res.status(404).json({ message: "Rental not found" });

    // find the invite for this phone
    const invite = rental.invites.find((i) => i.phone === phone);
    if (!invite) return res.status(404).json({ message: "Invite not found" });

    // ✅ make sure only invited person can respond
    const user = await User.findById(req.user._id);
    if (!user || user.phone !== phone) {
      return res.status(403).json({ message: "You are not authorized to respond to this invite" });
    }

    // update status
    invite.status = status;

    if (status === "accepted") {
      // attach pickup location ONLY when accepted
      rental.pickupLocations.push({
        user: req.user._id,
        location: pickupLocation || "Not specified",
        confirmed: true,
      });
      invite.user = req.user._id; // link invite to user
    } else {
      // if declined, remove any accidental pickup location for this user
      rental.pickupLocations = rental.pickupLocations.filter(
        (p) => p.user.toString() !== req.user._id.toString()
      );
      invite.user = req.user._id;
    }

    await rental.save();
    res.json(rental);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4. View user’s rentals (only accepted)
exports.getMyRentals = async (req, res) => {
  try {
    const rentals = await Rental.find({
      $or: [
        { initiator: req.user._id }, // trips they created
        { "invites.user": req.user._id, "invites.status": "accepted" }, // trips they accepted
      ],
    })
      .populate("vehicle")
      .populate("initiator", "name email");

    res.json(rentals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 5. Cancel a rental (only initiator)
exports.cancelRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: "Rental not found" });

    if (rental.initiator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only initiator can cancel" });
    }

    rental.status = "cancelled";
    await rental.save();

    res.json({ message: "Rental cancelled", rental });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
