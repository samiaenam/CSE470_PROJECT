// controllers/rentalController.js
const RentalRide = require("../models/rentalRideModel");

// Create rental ride with invites
exports.createRentalRide = async (req, res) => {
  try {
    const { vehicle, destination, pickupLocation, invites } = req.body;
    const userId = req.user._id; // initiator

    const ride = new RentalRide({
      initiator: userId,
      vehicle,
      destination,
      initiatorPickup: pickupLocation,
      invites: invites.map(inv => ({ emailOrPhone: inv }))
    });

    await ride.save();
    res.status(201).json({ message: "Rental ride created", ride });
  } catch (error) {
    res.status(500).json({ message: "Error creating rental ride", error });
  }
};

// Get ride details for invitee by email/phone
exports.getRentalInvite = async (req, res) => {
  try {
    const { emailOrPhone } = req.params;
    const rides = await RentalRide.find({
      "invites.emailOrPhone": emailOrPhone,
      status: "open"
    });

    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: "Error fetching invites", error });
  }
};

// Accept/Decline invite
exports.respondToInvite = async (req, res) => {
  try {
    const { rideId } = req.params;
    const { emailOrPhone, response, pickupLocation } = req.body;

    const ride = await RentalRide.findById(rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    const invite = ride.invites.find(inv => inv.emailOrPhone === emailOrPhone);
    if (!invite) return res.status(404).json({ message: "Invite not found" });

    invite.status = response; // "accepted" or "declined"
    if (pickupLocation) invite.pickupLocation = pickupLocation;

    await ride.save();
    res.json({ message: `Invite ${response}`, ride });
  } catch (error) {
    res.status(500).json({ message: "Error responding to invite", error });
  }
};
