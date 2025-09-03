// const Ride = require("../models/rideModel");
// const Booking = require("../models/bookingModel");

// /* =========================
//    ADMIN SIDE
// ========================= */

// // @desc Create a carpool ride (Admin only)
// // @route POST /api/carpool/ride
// exports.createRide = async (req, res) => {
//   try {
//     const { routeName, totalSeats, times, pickupLocations, dropoffLocations } = req.body;

//     const ride = new Ride({
//       routeName,
//       totalSeats,
//       times, // array like ["07:00", "09:00"]
//       pickupLocations, // array of strings
//       dropoffLocations, // array of strings
//     });

//     await ride.save();
//     res.status(201).json({ message: "Ride created successfully", ride });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // @desc Update ride (Admin can add/remove pickup/dropoff or change seats/times)
// // @route PUT /api/carpool/ride/:id
// exports.updateRide = async (req, res) => {
//   try {
//     const ride = await Ride.findById(req.params.id);
//     if (!ride) return res.status(404).json({ message: "Ride not found" });

//     const { totalSeats, times, pickupLocations, dropoffLocations } = req.body;

//     if (totalSeats) ride.totalSeats = totalSeats;
//     if (times) ride.times = times;
//     if (pickupLocations) ride.pickupLocations = pickupLocations;
//     if (dropoffLocations) ride.dropoffLocations = dropoffLocations;

//     await ride.save();
//     res.json({ message: "Ride updated", ride });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // @desc Delete a ride
// // @route DELETE /api/carpool/ride/:id
// exports.deleteRide = async (req, res) => {
//   try {
//     const ride = await Ride.findByIdAndDelete(req.params.id);
//     if (!ride) return res.status(404).json({ message: "Ride not found" });

//     res.json({ message: "Ride deleted" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // @desc Get all rides (Admin)
// // @route GET /api/carpool/rides
// exports.getAllRides = async (req, res) => {
//   try {
//     const rides = await Ride.find();
//     res.json(rides);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

const Ride = require("../models/rideModel");

// @desc Create a new ride (Admin)
// @route POST /api/carpool/rides
exports.createRide = async (req, res) => {
  try {
    const { routeName, pickupLocations, dropoffLocations, totalSeats, times, femaleOnly } = req.body;

    const ride = new Ride({
      routeName,
      pickupLocations,
      dropoffLocations,
      totalSeats,
      times,       // e.g. ["07:00", "09:00"]
      femaleOnly,  // true / false
    });

    await ride.save();
    res.status(201).json({ message: "Ride created successfully", ride });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Update a ride (Admin)
// @route PUT /api/carpool/rides/:id
exports.updateRide = async (req, res) => {
  try {
    const ride = await Ride.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    res.json({ message: "Ride updated successfully", ride });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Delete a ride (Admin)
// @route DELETE /api/carpool/rides/:id
exports.deleteRide = async (req, res) => {
  try {
    const ride = await Ride.findByIdAndDelete(req.params.id);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    res.json({ message: "Ride deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Get all rides (Admin/User)
// @route GET /api/carpool/rides
exports.getAllRides = async (req, res) => {
  try {
    const rides = await Ride.find();
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
