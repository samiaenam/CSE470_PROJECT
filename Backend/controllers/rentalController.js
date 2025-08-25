const Rental = require('../models/rentalModel');

exports.createRental = async (req, res) => {
    try {
        const rental = await Rental.create({
            vehicle: req.body.vehicle,
            user: req.user._id,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            cost: req.body.cost
        });
        res.status(201).json(rental);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.inviteFriend = async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id);
        rental.invitedFriends.push(req.body.friendId);
        await rental.save();
        res.json(rental);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.respondInvite = async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id);
        if (req.body.response === 'accept') {
            rental.acceptedFriends.push(req.user._id);
        }
        rental.invitedFriends = rental.invitedFriends.filter(
            f => f.toString() !== req.user._id.toString()
        );
        await rental.save();
        res.json(rental);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
