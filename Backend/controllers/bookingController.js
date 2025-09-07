// // const Booking = require("../models/bookingModel");
// // const Ride = require("../models/rideModel");

// // // helper to format/normalize time strings
// // function formatTimeRaw(raw) {
// //   if (!raw && raw !== 0) return null;
// //   let s = String(raw).trim();
// //   if (!s) return null;
// //   const parts = s.split(":").map(p => p.trim());
// //   let hh = 0, mm = 0;
// //   if (parts.length === 1) {
// //     hh = Number(parts[0]);
// //     mm = 0;
// //   } else {
// //     hh = Number(parts[0]);
// //     mm = Number(parts[1] || 0);
// //   }
// //   if (Number.isNaN(hh) || Number.isNaN(mm)) return null;
// //   hh = ((hh % 24) + 24) % 24;
// //   mm = Math.max(0, Math.min(59, mm));
// //   return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
// // }

// // function toDateOnly(d) {
// //   const date = (d instanceof Date) ? new Date(d) : new Date(String(d));
// //   date.setHours(0,0,0,0);
// //   return date;
// // }

// // // POST /api/carpool/book
// // exports.bookRide = async (req, res) => {
// //   try {
// //     const { rideId, date, time, pickup, dropoff } = req.body;
// //     const userId = req.user._id;

// //     if (!rideId || !time || !pickup || !dropoff) {
// //       return res.status(400).json({ message: "rideId, time, pickup and dropoff required" });
// //     }

// //     const bookingDate = toDateOnly(date || new Date());
// //     const today = toDateOnly(new Date());
// //     const tomorrow = new Date(today);
// //     tomorrow.setDate(today.getDate() + 1);

// //     // booking allowed only for today or tomorrow
// //     if (bookingDate.getTime() !== today.getTime() && bookingDate.getTime() !== tomorrow.getTime()) {
// //       return res.status(400).json({ message: "Bookings allowed only for today or tomorrow" });
// //     }

// //     const ride = await Ride.findById(rideId);
// //     if (!ride) return res.status(404).json({ message: "Ride not found" });

// //     if (ride.femaleOnly && req.user.gender !== "female") {
// //       return res.status(403).json({ message: "This ride is restricted to female passengers only" });
// //     }

// //     const normalizedTime = formatTimeRaw(time);
// //     if (!normalizedTime) return res.status(400).json({ message: "Invalid time format" });

// //     // ensure this time exists in ride
// //     const normalizedRideTimes = (ride.times || []).map(formatTimeRaw).filter(Boolean);
// //     if (!normalizedRideTimes.includes(normalizedTime)) {
// //       return res.status(400).json({ message: "Selected time is not available for this ride" });
// //     }

// //     // if booking for today, cannot book once ride has started
// //     if (bookingDate.getTime() === today.getTime()) {
// //       const now = new Date();
// //       const [h, m] = normalizedTime.split(":").map(Number);
// //       const rideStart = new Date(today);
// //       rideStart.setHours(h, m, 0, 0);
// //       if (now >= rideStart) {
// //         return res.status(400).json({ message: "This ride has already started" });
// //       }
// //     }

// //     // prevent duplicate booking for same user/ride/date/time
// //     const existingBooking = await Booking.findOne({
// //       user: userId,
// //       ride: rideId,
// //       date: bookingDate,
// //       time: normalizedTime,
// //       status: "booked",
// //     });
// //     if (existingBooking) return res.status(400).json({ message: "You already booked this ride/time" });

// //     // seat availability (count current booked seats for ride/date/time)
// //     const activeBookings = await Booking.countDocuments({
// //       ride: rideId,
// //       date: bookingDate,
// //       time: normalizedTime,
// //       status: "booked",
// //     });

// //     if (activeBookings >= ride.totalSeats) {
// //       return res.status(400).json({ message: "No seats available for this slot" });
// //     }

// //     const booking = new Booking({
// //       user: userId,
// //       ride: rideId,
// //       date: bookingDate,
// //       time: normalizedTime,
// //       pickup,
// //       dropoff,
// //       status: "booked",
// //     });

// //     await booking.save();
// //     res.status(201).json({ message: "Booking successful", booking });
// //   } catch (err) {
// //     console.error("bookRide error:", err);
// //     res.status(500).json({ message: "Server error", error: err.message });
// //   }
// // };

// // // Cancel
// // exports.cancelBooking = async (req, res) => {
// //   try {
// //     const booking = await Booking.findById(req.params.id);
// //     if (!booking) return res.status(404).json({ message: "Booking not found" });

// //     if (booking.user.toString() !== req.user._id.toString()) {
// //       return res.status(403).json({ message: "Not authorized" });
// //     }

// //     booking.status = "cancelled";
// //     await booking.save();
// //     res.json({ message: "Booking cancelled successfully" });
// //   } catch (err) {
// //     console.error("cancelBooking error:", err);
// //     res.status(500).json({ message: "Server error", error: err.message });
// //   }
// // };

// // // Get user's bookings
// // exports.getMyBookings = async (req, res) => {
// //   try {
// //     const bookings = await Booking.find({ user: req.user._id }).populate("ride").sort({ date: 1, time: 1 });
// //     res.json(bookings);
// //   } catch (err) {
// //     console.error("getMyBookings error:", err);
// //     res.status(500).json({ message: "Server error", error: err.message });
// //   }
// // };

// // // exports.getAvailableRides = async (req, res) => {
// // //   try {
// // //     const { date } = req.query;
// // //     if (!date) return res.status(400).json({ message: "Date is required" });

// // //     // Normalize the requested date
// // //     const queryDate = new Date(date);
// // //     queryDate.setHours(0, 0, 0, 0);

// // //     const today = new Date();
// // //     today.setHours(0, 0, 0, 0);

// // //     const tomorrow = new Date(today);
// // //     tomorrow.setDate(today.getDate() + 1);

// // //     // ✅ Only allow today or tomorrow
// // //     if (
// // //       queryDate.getTime() !== today.getTime() &&
// // //       queryDate.getTime() !== tomorrow.getTime()
// // //     ) {
// // //       return res.status(400).json({ message: "Bookings allowed only for today or tomorrow" });
// // //     }

// // //     // 🚗 Get all ride templates
// // //     const rides = await Ride.find();

// // //     const ridesWithSeats = await Promise.all(
// // //       rides.map(async (ride) => {
// // //         // Count existing bookings for this ride+date
// // //         const activeBookings = await Booking.countDocuments({
// // //           ride: ride._id,
// // //           date: queryDate, // booking stores actual date
// // //           status: "booked",
// // //         });

// // //         const availableSeats = ride.totalSeats - activeBookings;

// // //         // Restrict female-only rides
// // //         if (ride.femaleOnly && req.user.gender !== "female") {
// // //           return {
// // //             ride: {
// // //               _id: ride._id,
// // //               routeName: ride.routeName,
// // //               femaleOnly: true,
// // //               restricted: true,
// // //               totalSeats: ride.totalSeats,
// // //               times: ride.times,
// // //               pickupLocations: ride.pickupLocations,
// // //               dropoffLocations: ride.dropoffLocations,
// // //             },
// // //             availableSeats,
// // //           };
// // //         }

// // //         return { ride, availableSeats };
// // //       })
// // //     );

// // //     res.json(ridesWithSeats);
// // //   } catch (err) {
// // //     console.error("getAvailableRides error:", err);
// // //     res.status(500).json({ message: "Server error", error: err.message });
// // //   }
// // // };

// // // GET /available?date=YYYY-MM-DD
// // const getAvailableRides = async (req, res) => {
// //   try {
// //     const { date } = req.query;
// //     if (!date) return res.status(400).json({ message: "date required (YYYY-MM-DD)" });

// //     // Normalize to midnight for consistent date-only matching
// //     const day = new Date(date);
// //     day.setHours(0, 0, 0, 0);

// //     // Fetch all ride templates
// //     const rides = await Ride.find();

// //     // Fetch bookings for that date
// //     const bookings = await Booking.find({ date: day, status: "booked" });

// //     // Count bookings per rideId
// //     const bookingCounts = {};
// //     bookings.forEach((b) => {
// //       const id = b.ride.toString();
// //       bookingCounts[id] = (bookingCounts[id] || 0) + 1;
// //     });

// //     // Build response: ride + available seats
// //     const result = rides.map((ride) => {
// //       const booked = bookingCounts[ride._id.toString()] || 0;
// //       const availableSeats = Math.max(ride.totalSeats - booked, 0);

// //       return {
// //         ride,
// //         availableSeats,
// //       };
// //     });

// //     res.json(result);
// //   } catch (err) {
// //     console.error("getAvailableRides error:", err);
// //     res.status(500).json({ message: "Server error", error: err.message });
// //   }
// // };

// // module.exports = { getAvailableRides };
// const Booking = require("../models/bookingModel");
// const Ride = require("../models/rideModel");
// const User = require("../models/User");

// // 📌 Book a ride
// const bookRide = async (req, res) => {
//   try {
//     const { rideId, date, time, pickup, dropoff } = req.body;
//     const userId = req.user._id;

//     if (!rideId || !date || !time || !pickup || !dropoff) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // Normalize date (ignore time portion)
//     const rideDate = new Date(date);
//     rideDate.setHours(0, 0, 0, 0);

//     // Find ride template
//     const ride = await Ride.findById(rideId);
//     if (!ride) return res.status(404).json({ message: "Ride not found" });

//     // Validate time, pickup, dropoff
//     if (!ride.times.includes(time)) {
//       return res.status(400).json({ message: "Invalid time for this ride" });
//     }
//     if (!ride.pickupLocations.includes(pickup)) {
//       return res.status(400).json({ message: "Invalid pickup location" });
//     }
//     if (!ride.dropoffLocations.includes(dropoff)) {
//       return res.status(400).json({ message: "Invalid dropoff location" });
//     }

//     // Female-only restriction
//     if (ride.femaleOnly) {
//       const user = await User.findById(userId);
//       if (!user) return res.status(404).json({ message: "User not found" });
//       if (user.gender !== "female") {
//         return res
//           .status(403)
//           .json({ message: "This ride is restricted to females only" });
//       }
//     }

//     // Check seat availability
//     const bookedSeats = await Booking.countDocuments({
//       ride: rideId,
//       date: rideDate,
//       status: "booked",
//     });
//     if (bookedSeats >= ride.totalSeats) {
//       return res.status(400).json({ message: "No seats available" });
//     }

//     // Prevent duplicate booking
//     const existing = await Booking.findOne({
//       user: userId,
//       ride: rideId,
//       date: rideDate,
//       status: "booked",
//     });
//     if (existing) {
//       return res.status(400).json({ message: "You already booked this ride" });
//     }

//     // Create booking
//     const booking = new Booking({
//       user: userId,
//       ride: rideId,
//       date: rideDate,
//       time,
//       pickup,
//       dropoff,
//     });

//     await booking.save();
//     res.status(201).json({ message: "Ride booked successfully", booking });
//   } catch (err) {
//     console.error("bookRide error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // 📌 Cancel a booking
// const cancelBooking = async (req, res) => {
//   try {
//     const booking = await Booking.findOne({
//       _id: req.params.id,
//       user: req.user._id,
//     });
//     if (!booking) return res.status(404).json({ message: "Booking not found" });

//     booking.status = "cancelled";
//     await booking.save();

//     res.json({ message: "Booking cancelled", booking });
//   } catch (err) {
//     console.error("cancelBooking error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // 📌 Get my bookings
// const getMyBookings = async (req, res) => {
//   try {
//     const bookings = await Booking.find({ user: req.user._id }).populate("ride");
//     res.json(bookings);
//   } catch (err) {
//     console.error("getMyBookings error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // 📌 Get available rides for a date
// // 📌 Get available rides for a date
// const getAvailableRides = async (req, res) => {
//   try {
//     const { date } = req.query;
//     if (!date) {
//       return res.status(400).json({ message: "date required (YYYY-MM-DD)" });
//     }

//     const rideDate = new Date(date);
//     rideDate.setHours(0, 0, 0, 0);

//     // get logged in user
//     const user = await User.findById(req.user._id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const rides = await Ride.find();
//     const bookings = await Booking.find({ date: rideDate, status: "booked" });

//     const bookingCounts = {};
//     bookings.forEach((b) => {
//       const id = b.ride.toString();
//       bookingCounts[id] = (bookingCounts[id] || 0) + 1;
//     });

//     const result = rides.map((ride) => {
//       const booked = bookingCounts[ride._id.toString()] || 0;
//       const availableSeats = Math.max(ride.totalSeats - booked, 0);

//       // ✅ mark restricted only if femaleOnly AND user is not female
//       const restricted = ride.femaleOnly && user.gender !== "female";

//       return {
//         ride,
//         availableSeats,
//         restricted,
//       };
//     });

//     res.json(result);
//   } catch (err) {
//     console.error("getAvailableRides error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };


// // ✅ Export controllers
// module.exports = {
//   bookRide,
//   cancelBooking,
//   getMyBookings,
//   getAvailableRides,
// };
// // controllers/bookingController.js (newly implemented based on requirements)
// const Booking = require("../models/bookingModel");
// const Ride = require("../models/rideModel");

// // Book a ride
// const bookRide = async (req, res) => {
//   try {
//     const { rideId, date, time, pickup, dropoff } = req.body;

//     const ride = await Ride.findById(rideId);
//     if (!ride) return res.status(404).json({ message: "Ride not found" });

//     if (!ride.times.includes(time)) return res.status(400).json({ message: "Invalid time" });
//     if (!ride.pickupLocations.includes(pickup)) return res.status(400).json({ message: "Invalid pickup" });
//     if (!ride.dropoffLocations.includes(dropoff)) return res.status(400).json({ message: "Invalid dropoff" });

//     const parsedDate = new Date(date);
//     parsedDate.setHours(0, 0, 0, 0); // Normalize to start of day

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);
//     const dayAfterTomorrow = new Date(tomorrow);
//     dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

//     if (parsedDate < today || parsedDate >= dayAfterTomorrow) {
//       return res.status(400).json({ message: "Bookings are only allowed for today or tomorrow" });
//     }

//     // Assume req.user is set by authMiddleware and has gender field (e.g., 'male' or 'female')
//     if (ride.femaleOnly && req.user.gender !== "female") {
//       return res.status(403).json({ message: "This ride is female-only" });
//     }

//     const bookedCount = await Booking.countDocuments({
//       ride: rideId,
//       date: parsedDate,
//       time,
//       status: "booked",
//     });

//     if (bookedCount >= ride.totalSeats) {
//       return res.status(400).json({ message: "No seats available for this time" });
//     }

//     const booking = new Booking({
//       user: req.user._id,
//       ride: rideId,
//       date: parsedDate,
//       time,
//       pickup,
//       dropoff,
//     });

//     await booking.save();
//     res.status(201).json({ message: "Seat booked successfully", booking });
//   } catch (err) {
//     console.error("bookRide error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // Cancel booking
// const cancelBooking = async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id);
//     if (!booking) return res.status(404).json({ message: "Booking not found" });
//     if (booking.user.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: "Not authorized to cancel this booking" });
//     }
//     if (booking.status === "cancelled") return res.status(400).json({ message: "Already cancelled" });

//     booking.status = "cancelled";
//     await booking.save();
//     res.json({ message: "Booking cancelled" });
//   } catch (err) {
//     console.error("cancelBooking error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // Get user's bookings
// const getMyBookings = async (req, res) => {
//   try {
//     const bookings = await Booking.find({ user: req.user._id }).populate("ride");
//     res.json(bookings);
//   } catch (err) {
//     console.error("getMyBookings error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // Get available rides for a date (with per-time availability)
// const getAvailableRides = async (req, res) => {
//   try {
//     const { date } = req.query;
//     if (!date) return res.status(400).json({ message: "Date required" });

//     const parsedDate = new Date(date);
//     parsedDate.setHours(0, 0, 0, 0);
//     if (isNaN(parsedDate.getTime())) return res.status(400).json({ message: "Invalid date" });

//     const rides = await Ride.find();

//     // Assume req.user.gender
//     const userGender = req.user.gender || "male"; // Default to male if not set

//     const availableRides = await Promise.all(
//       rides.map(async (ride) => {
//         const restricted = ride.femaleOnly && userGender !== "female";

//         if (restricted) {
//           return { ride, availablePerTime: {}, availableSeats: 0, restricted: true };
//         }

//         const availablePerTime = {};
//         let totalAvailable = 0;

//         for (const time of ride.times) {
//           const booked = await Booking.countDocuments({
//             ride: ride._id,
//             date: parsedDate,
//             time,
//             status: "booked",
//           });
//           const available = Math.max(0, ride.totalSeats - booked);
//           availablePerTime[time] = available;
//           totalAvailable += available;
//         }

//         return { ride, availablePerTime, availableSeats: totalAvailable, restricted: false };
//       })
//     );

//     // Filter to only include rides with at least one available seat (unless restricted, but we include for display)
//     const filtered = availableRides.filter((a) => a.availableSeats > 0 || a.restricted);
//     res.json(filtered);
//   } catch (err) {
//     console.error("getAvailableRides error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// module.exports = {
//   bookRide,
//   cancelBooking,
//   getMyBookings,
//   getAvailableRides,
// };
const Booking = require("../models/bookingModel");
const Ride = require("../models/rideModel");

// Book a ride
const bookRide = async (req, res) => {
  try {
    const { rideId, date, time, pickup, dropoff } = req.body;

    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    if (!ride.times.includes(time)) return res.status(400).json({ message: "Invalid time" });
    if (!ride.pickupLocations.includes(pickup)) return res.status(400).json({ message: "Invalid pickup" });
    if (!ride.dropoffLocations.includes(dropoff)) return res.status(400).json({ message: "Invalid dropoff" });

    const parsedDate = new Date(date);
    parsedDate.setHours(0, 0, 0, 0); // Normalize to start of day

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (parsedDate < today) {
      return res.status(400).json({ message: "Cannot book for past dates" });
    }

    if (ride.femaleOnly && req.user.gender !== "female") {
      return res.status(403).json({ message: "This ride is female-only" });
    }

    const bookedCount = await Booking.countDocuments({
      ride: rideId,
      date: parsedDate,
      time,
      status: "booked",
    });

    if (bookedCount >= ride.totalSeats) {
      return res.status(400).json({ message: "No seats available for this time" });
    }

    const booking = new Booking({
      user: req.user._id,
      ride: rideId,
      date: parsedDate,
      time,
      pickup,
      dropoff,
    });

    await booking.save();
    res.status(201).json({ message: "Seat booked successfully", booking });
  } catch (err) {
    console.error("bookRide error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to cancel this booking" });
    }
    if (booking.status === "cancelled") return res.status(400).json({ message: "Already cancelled" });

    booking.status = "cancelled";
    await booking.save();
    res.json({ message: "Booking cancelled" });
  } catch (err) {
    console.error("cancelBooking error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get user's bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id, status: "booked" }).populate("ride");
    res.json(bookings);
  } catch (err) {
    console.error("getMyBookings error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get available rides for a date (with per-time availability)
const getAvailableRides = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: "Date required" });

    const [month, day, year] = date.split("/");
    const parsedDate = new Date(`${year}-${month}-${day}`);
    parsedDate.setHours(0, 0, 0, 0);
    if (isNaN(parsedDate.getTime())) return res.status(400).json({ message: "Invalid date" });

    const rides = await Ride.find();
    const userGender = req.user.gender || "male"; // Default to male if not set

    const availableRides = await Promise.all(
      rides.map(async (ride) => {
        const restricted = ride.femaleOnly && userGender !== "female";

        if (restricted) {
          return { ride, availablePerTime: {}, availableSeats: 0, restricted: true };
        }

        const availablePerTime = {};
        let totalAvailable = 0;

        for (const time of ride.times) {
          const booked = await Booking.countDocuments({
            ride: ride._id,
            date: parsedDate,
            time,
            status: "booked",
          });
          const available = Math.max(0, ride.totalSeats - booked);
          availablePerTime[time] = available;
          totalAvailable += available;
        }

        return { ride, availablePerTime, availableSeats: totalAvailable, restricted: false };
      })
    );

    const filtered = availableRides.filter((a) => a.availableSeats > 0 || a.restricted);
    res.json(filtered);
  } catch (err) {
    console.error("getAvailableRides error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Task to refresh seat counts nightly at 9 PM
const refreshSeatCounts = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const pastBookings = await Booking.find({ date: { $lt: today }, status: "booked" });
    if (pastBookings.length > 0) {
      await Booking.updateMany({ date: { $lt: today }, status: "booked" }, { status: "completed" });
      console.log("Archived past bookings:", pastBookings.length);
    }
  } catch (err) {
    console.error("refreshSeatCounts error:", err);
  }
};

const cron = require("node-cron");
cron.schedule("0 21 * * *", refreshSeatCounts); // Runs daily at 9 PM

module.exports = {
  bookRide,
  cancelBooking,
  getMyBookings,
  getAvailableRides,
};