const Booking = require("../models/bookingModel");
const Ride = require("../models/rideModel");

// @desc Book a seat on a carpool ride
// @route POST /api/carpool/book
exports.bookRide = async (req, res) => {
  try {
    const { rideId, date, time, pickup, dropoff } = req.body;
    const userId = req.user._id;

    // 1. Validate date (today or tomorrow only)
    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    bookingDate.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (
      bookingDate.getTime() !== today.getTime() &&
      bookingDate.getTime() !== tomorrow.getTime()
    ) {
      return res.status(400).json({ message: "Bookings allowed only for today or tomorrow" });
    }

    // 2. Find the ride
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found" });
    if (ride.femaleOnly && req.user.gender !== "female") {
        return res.status(403).json({ message: "This ride is restricted to female passengers only" });
    }   

    // 3. Validate time
    if (!ride.times.includes(time)) {
      return res.status(400).json({ message: "Invalid ride time" });
    }

    // 4. Disallow booking after ride start time if today
    if (bookingDate.getTime() === today.getTime()) {
      const now = new Date();
      const [hours, minutes] = time.split(":").map(Number);
      const rideStart = new Date(today);
      rideStart.setHours(hours, minutes, 0, 0);

      if (now >= rideStart) {
        return res.status(400).json({ message: "This ride has already started" });
      }
    }

    // 5. Prevent duplicate booking
    const existingBooking = await Booking.findOne({
      user: userId,
      ride: rideId,
      date: bookingDate,
      time,
      status: "booked",
    });
    if (existingBooking) {
      return res.status(400).json({ message: "You already booked this ride" });
    }

    // 6. Check seat availability
    const activeBookings = await Booking.countDocuments({
      ride: rideId,
      date: bookingDate,
      time,
      status: "booked",
    });

    if (activeBookings >= ride.totalSeats) {
      return res.status(400).json({ message: "No seats available" });
    }

    // 7. Create booking
    const booking = new Booking({
      user: userId,
      ride: rideId,
      date: bookingDate,
      time,
      pickup,
      dropoff,
    });

    await booking.save();
    res.status(201).json({ message: "Booking successful", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Cancel a booking
// @route POST /api/carpool/cancel/:id
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    booking.status = "cancelled";
    await booking.save();
    res.json({ message: "Booking cancelled successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Get user's bookings
// @route GET /api/carpool/mybookings
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("ride")
      .sort({ date: 1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Get available rides for a given date
// @route GET /api/carpool/available?date=YYYY-MM-DD
exports.getAvailableRides = async (req, res) => {
  try {
    const { date } = req.query;
    const queryDate = new Date(date);
    queryDate.setHours(0, 0, 0, 0);

    const rides = await Ride.find();

    const ridesWithSeats = await Promise.all(
      rides.map(async (ride) => {
        const activeBookings = await Booking.countDocuments({
          ride: ride._id,
          date: queryDate,
          status: "booked",
        });

        // Calculate available seats
        const availableSeats = ride.totalSeats - activeBookings;

        // 🚨 If ride is female-only and user is not female
        if (ride.femaleOnly && req.user.gender !== "female") {
          return {
            ride: {
              _id: ride._id,
              femaleOnly: true,
              restricted: true, // frontend can use this
            },
            availableSeats,
          };
        }

        // Normal ride or female-only visible to female user
        return {
          ride,
          availableSeats,
        };
      })
    );

    res.json(ridesWithSeats);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
