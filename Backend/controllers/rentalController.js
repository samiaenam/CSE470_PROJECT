const Rental = require("../models/Rental");

// Create rental booking
exports.rentVehicle = async (req, res) => {
  try {
    const { vehicle, hours, invitedFriends } = req.body;

    const rental = await Rental.create({
      user: req.user.userId,
      vehicle,
      hours,
      invitedFriends: invitedFriends || [] // start with invited friends if provided
    });

    res.status(201).json(rental);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Invite a friend to rental
exports.inviteFriend = async (req, res) => {
  try {
    const { rentalId, friendEmail } = req.body;
    const rental = await Rental.findById(rentalId);
    if (!rental) return res.status(404).json({ message: "Rental not found" });

    // prevent duplicate invites
    const alreadyInvited = rental.invitedFriends.find(f => f.email === friendEmail);
    if (alreadyInvited) {
      return res.status(400).json({ message: "Friend already invited" });
    }

    rental.invitedFriends.push({ email: friendEmail, status: "pending" });
    await rental.save();

    res.json({ message: "Friend invited successfully", rental });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Friend accepts/declines
exports.respondInvite = async (req, res) => {
  try {
    const { rentalId, status } = req.body; // status = "accepted" or "declined"
    const rental = await Rental.findById(rentalId);
    if (!rental) return res.status(404).json({ message: "Rental not found" });

    const friend = rental.invitedFriends.find(f => f.email === req.user.email);
    if (!friend) return res.status(400).json({ message: "You are not invited" });

    friend.status = status;
    await rental.save();

    res.json({ message: `Invite ${status}`, rental });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
