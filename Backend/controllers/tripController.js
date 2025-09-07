// const Trip = require('../models/Trip');
// const Vehicle = require('../models/Vehicle');
// const User = require('../models/User');

// // Create a trip
// exports.createTrip = async (req, res) => {
//   try {
//     const { vehicleId, date, destination, pickupLocation, invitedPhones } = req.body;
//     if (!vehicleId || !date || !destination || !pickupLocation) {
//       return res.status(400).json({ message: 'Required fields missing' });
//     }

//     // Find vehicle and check availability
//     const vehicle = await Vehicle.findById(vehicleId);
//     if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
//     if ((vehicle.bookedDates || []).includes(date)) {
//       return res.status(400).json({ message: 'Vehicle not available on this date' });
//     }

//     // Resolve invited friends by phone
//     let invitedFriends = [];
//     if (invitedPhones && invitedPhones.length > 0) {
//       const users = await User.find({ phone: { $in: invitedPhones } });
//       invitedFriends = users.map(u => ({
//         friend: u._id,
//         status: 'pending',
//       }));
//     }

//     // Create trip
//     const trip = await Trip.create({
//       createdBy: req.user._id,
//       vehicle: vehicle._id,
//       date,
//       destination,
//       pickupLocations: [{ user: req.user._id, location: pickupLocation }],
//       invitedFriends,
//     });

//     // Mark vehicle unavailable
//     vehicle.bookedDates = [...(vehicle.bookedDates || []), date];
//     await vehicle.save();

//     res.status(201).json(trip);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Get available vehicles for a date
// exports.availableVehicles = async (req, res) => {
//   try {
//     const { date } = req.query;
//     if (!date) return res.status(400).json({ message: 'Date is required' });

//     const vehicles = await Vehicle.find({ bookedDates: { $ne: date } });
//     res.json(vehicles);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Get a specific trip
// exports.getTrip = async (req, res) => {
//   try {
//     const trip = await Trip.findById(req.params.id)
//       .populate('createdBy', 'name email')
//       .populate('vehicle', 'name licensePlate seats')
//       .populate('pickupLocations.user', 'name email')
//       .populate('invitedFriends.friend', 'name email');

//     if (!trip) return res.status(404).json({ message: 'Trip not found' });
//     res.json(trip);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Respond to an invite
// exports.respondInvite = async (req, res) => {
//   try {
//     const { status, pickupLocation } = req.body;
//     if (!['accepted', 'declined'].includes(status)) {
//       return res.status(400).json({ message: 'Invalid status' });
//     }

//     const trip = await Trip.findById(req.params.id);
//     if (!trip) return res.status(404).json({ message: 'Trip not found' });

//     const invite = trip.invitedFriends.find(
//       i => i.friend.toString() === req.user._id.toString()
//     );
//     if (!invite) return res.status(403).json({ message: 'Not invited to this trip' });

//     invite.status = status;

//     if (status === 'accepted' && pickupLocation) {
//       trip.pickupLocations.push({ user: req.user._id, location: pickupLocation });
//       invite.pickupLocation = pickupLocation;
//     }

//     await trip.save();
//     res.json(trip);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Get all invites for logged-in user
// exports.getMyInvites = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const trips = await Trip.find({ "invitedFriends.friend": userId })
//       .populate("createdBy", "name email")
//       .populate("vehicle", "name licensePlate seats")
//       .populate("invitedFriends.friend", "name email");

//     const invites = [];
//     trips.forEach((trip) => {
//       trip.invitedFriends.forEach((invite) => {
//         if (invite.friend._id.toString() === userId.toString()) {
//           invites.push({
//             trip: {
//               _id: trip._id,
//               destination: trip.destination,
//               date: trip.date,
//               vehicle: trip.vehicle,
//               createdBy: trip.createdBy,
//             },
//             status: invite.status,
//             pickupLocation: invite.pickupLocation,
//           });
//         }
//       });
//     });

//     res.json(invites);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
// // Get trips created by user + trips where user is invited
// exports.myTripsAndInvites = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     // Trips created by me
//     const createdTrips = await Trip.find({ createdBy: userId })
//       .populate("vehicle", "name licensePlate seats")
//       .populate("createdBy", "name");

//     // Trips I'm invited to
//     const invitedTripsRaw = await Trip.find({ "invitedFriends.friend": userId })
//       .populate("vehicle", "name licensePlate seats")
//       .populate("createdBy", "name")
//       .populate("invitedFriends.friend", "name");

//     const invitedTrips = invitedTripsRaw.map((trip) => {
//       const invite = trip.invitedFriends.find(
//         (f) => f.friend._id.toString() === userId.toString()
//       );
//       return {
//         _id: trip._id,
//         trip,
//         status: invite.status,
//         pickupLocation: invite.pickupLocation,
//       };
//     });

//     res.json({
//       createdTrips,
//       invitedTrips,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

const Trip = require('../models/Trip');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');

// Create a trip
exports.createTrip = async (req, res) => {
  try {
    const { vehicleId, date, destination, pickupLocation, invitedPhones } = req.body;
    if (!vehicleId || !date || !destination || !pickupLocation) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    if ((vehicle.bookedDates || []).includes(date)) {
      return res.status(400).json({ message: 'Vehicle not available on this date' });
    }

    let invitedFriends = [];
    if (invitedPhones && invitedPhones.length > 0) {
      const users = await User.find({ phone: { $in: invitedPhones } });
      invitedFriends = users.map(u => ({
        friend: u._id,
        status: 'pending',
      }));
    }

    const trip = await Trip.create({
      createdBy: req.user._id,
      vehicle: vehicle._id,
      date,
      destination,
      pickupLocations: [{ user: req.user._id, location: pickupLocation }],
      invitedFriends,
    });

    vehicle.bookedDates = [...(vehicle.bookedDates || []), date];
    await vehicle.save();

    res.status(201).json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get available vehicles
exports.availableVehicles = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: 'Date is required' });
    const vehicles = await Vehicle.find({ bookedDates: { $ne: date } });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a specific trip (creator or invited person can view)
exports.getTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('vehicle', 'name licensePlate seats')
      .populate('pickupLocations.user', 'name email')
      .populate('invitedFriends.friend', 'name email');

    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const userId = req.user._id.toString();
    const isCreator = trip.createdBy._id.toString() === userId;
    const isInvited = trip.invitedFriends.some(
      f => f.friend?._id.toString() === userId || f.phone === req.user.phone
    );

    if (!isCreator && !isInvited && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Respond to an invite
exports.respondInvite = async (req, res) => {
  try {
    const { status, pickupLocation } = req.body;
    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const invite = trip.invitedFriends.find(
      i => i.friend.toString() === req.user._id.toString()
    );
    if (!invite) return res.status(403).json({ message: 'Not invited to this trip' });

    invite.status = status;

    if (status === 'accepted' && pickupLocation) {
      trip.pickupLocations.push({ user: req.user._id, location: pickupLocation });
      invite.pickupLocation = pickupLocation;
    }

    await trip.save();
    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get trips created by user + trips invited to
exports.myTripsAndInvites = async (req, res) => {
  try {
    const userId = req.user._id;

    // Trips created by me
    const createdTrips = await Trip.find({ createdBy: userId })
      .populate("vehicle", "name licensePlate seats")
      .populate("createdBy", "name");

    // Trips I'm invited to
    const invitedTripsRaw = await Trip.find({ "invitedFriends.friend": userId })
      .populate("vehicle", "name licensePlate seats")
      .populate("createdBy", "name")
      .populate("invitedFriends.friend", "name");

    const invitedTrips = invitedTripsRaw.map((trip) => {
      const invite = trip.invitedFriends.find(
        f => f.friend._id.toString() === userId.toString()
      );
      return {
        _id: trip._id,
        trip,
        status: invite.status,
        pickupLocation: invite.pickupLocation,
      };
    });

    res.json({ createdTrips, invitedTrips });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all trips (admin)
exports.getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find()
      .populate("vehicle", "name licensePlate seats")
      .populate("createdBy", "name")
      .populate("invitedFriends.friend", "name");
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cancel trip (only creator)
exports.cancelTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    if (trip.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only creator can cancel the trip' });
    }

    await trip.remove();
    res.json({ message: 'Trip canceled successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
