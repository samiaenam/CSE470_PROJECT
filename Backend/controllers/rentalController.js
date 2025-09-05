// controllers/rentalController.js
const Rental = require("../models/rentalRideModel");
const Vehicle = require("../models/vehicleModel");
const User = require("../models/User");

// 1. Create a new rental trip
exports.createRental = async (req, res) => {
  try {
    const { vehicleId, destination, initiatorPickup, invites, date } = req.body;
    const initiator = req.user._id;

    if (!date) return res.status(400).json({ message: "Rental date is required" });

    const rentalDate = new Date(date);
    rentalDate.setHours(0, 0, 0, 0);

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    // check if vehicle is already booked on that date
    const isUnavailable = vehicle.unavailableDates.some(
      d => d.getTime() === rentalDate.getTime()
    );
    if (isUnavailable) {
      return res.status(400).json({ message: "Vehicle already booked for this date" });
    }

    const rental = await Rental.create({
      initiator,
      vehicle: vehicleId,
      destination,
      date: rentalDate,
      pickupLocations: [
        { user: initiator, location: initiatorPickup, confirmed: true },
      ],
      invites,
    });

    // mark vehicle as unavailable only for that date
    vehicle.unavailableDates.push(rentalDate);
    await vehicle.save();

    res.status(201).json(rental);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. View available vehicles
exports.getAvailableVehicles = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: "Date is required" });

    const queryDate = new Date(date);
    queryDate.setHours(0, 0, 0, 0);

    // find all vehicles NOT booked for that date
    const vehicles = await Vehicle.find({
      unavailableDates: { $ne: queryDate }
    });

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
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize to midnight

    const rentals = await Rental.find({
      $and: [
        {
          $or: [
            { initiator: req.user._id },
            { "invites.user": req.user._id, "invites.status": "accepted" },
          ],
        },
        { date: { $gte: today } }, // only today + future
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
