// ./pages/MyBookings.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/carpool/my-bookings");
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await axios.delete(`/api/carpool/cancel/${bookingId}`);
      alert("Booking canceled");
      fetchBookings(); // refresh list
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>

      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p>You have no bookings yet.</p>
      ) : (
        <div className="grid gap-4">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="p-4 border rounded shadow-sm flex flex-col gap-2"
            >
              <h2 className="font-semibold">{b.ride.routeName}</h2>
              <p>
                Date: <span className="font-medium">{b.date}</span>
              </p>
              <p>
                Time: <span className="font-medium">{b.ride.time}</span>
              </p>
              <p>
                Pickup:{" "}
                <span className="font-medium">
                  {b.pickupLocation || "Not selected"}
                </span>
              </p>
              <p>
                Drop-off:{" "}
                <span className="font-medium">
                  {b.dropoffLocation || "Not selected"}
                </span>
              </p>
              <button
                onClick={() => handleCancel(b._id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Cancel Booking
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
