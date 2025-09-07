// utils/seatResetCron.js
const cron = require("node-cron");
const Ride = require("../models/Ride");

/**
 * Resets bookedSeats and clears bookings for all rides at 21:00 Asia/Dhaka daily.
 * Keeps schema and route intact.
 */
function startSeatResetCron() {
  // run at 21:00 (9pm) Dhaka timezone
  cron.schedule(
    "0 21 * * *",
    async () => {
      try {
        console.log("[cron] resetting seats at 21:00 Asia/Dhaka");
        // reset bookedSeats and bookings array (if you want to keep booking history, instead archive them)
        await Ride.updateMany({}, { $set: { bookedSeats: 0, bookings: [] } });
        console.log("[cron] seats reset done");
      } catch (err) {
        console.error("[cron] seat reset error:", err);
      }
    },
    {
      scheduled: true,
      timezone: "Asia/Dhaka",
    }
  );
}

module.exports = startSeatResetCron;
