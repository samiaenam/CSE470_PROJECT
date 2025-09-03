// ./pages/Carpool.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Carpool({ user }) {
  const [rides, setRides] = useState([]);
  const [date, setDate] = useState(() => {
    const today = new Date().toISOString().split("T")[0];
    return today;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRides = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/carpool/available?date=${date}`);
        setRides(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRides();
  }, [date]);

  const handleBook = async (rideId) => {
    try {
      const res = await axios.post("/api/carpool/book", {
        rideId,
        date,
      });
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Carpool Rides</h1>

      {/* Date selector */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Select Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded p-2"
        />
      </div>

      {loading ? (
        <p>Loading rides...</p>
      ) : (
        <div className="grid gap-4">
          {rides.length === 0 ? (
            <p>No rides available</p>
          ) : (
            rides.map(({ ride, availableSeats }) => {
              // Hide female-only rides unless user.gender === "female"
              if (ride.femaleOnly && user?.gender !== "female") {
                return (
                  <div
                    key={ride._id}
                    className="p-4 border rounded bg-pink-50 text-gray-500"
                  >
                    <p>
                      🚺 Female-only ride ({ride.routeName}) — not visible for
                      your account
                    </p>
                  </div>
                );
              }

              return (
                <div
                  key={ride._id}
                  className="p-4 border rounded shadow-sm flex flex-col gap-2"
                >
                  <h2 className="font-semibold">{ride.routeName}</h2>
                  <p>
                    Time: <span className="font-medium">{ride.time}</span>
                  </p>
                  <p>
                    Available Seats:{" "}
                    <span className="font-medium">{availableSeats}</span> /{" "}
                    {ride.totalSeats}
                  </p>
                  <p>
                    Pickup options:{" "}
                    {ride.pickupLocations?.join(", ") || "Not specified"}
                  </p>
                  <p>
                    Drop-off options:{" "}
                    {ride.dropoffLocations?.join(", ") || "Not specified"}
                  </p>
                  {availableSeats > 0 ? (
                    <button
                      onClick={() => handleBook(ride._id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Book Seat
                    </button>
                  ) : (
                    <p className="text-red-500">No seats left</p>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
