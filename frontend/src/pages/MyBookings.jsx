import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  const loadBookings = async () => {
    try {
      const res = await API.get("/carpools/my-bookings");
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  return (
    <div>
      <h2>My Bookings</h2>
      <ul className="list-group">
        {bookings.map((b) => (
          <li key={b._id} className="list-group-item">
            <b>{b.ride.routeName}</b> — {b.pickup} → {b.dropoff}
            <br />
            Time: {b.time || "N/A"}
          </li>
        ))}
      </ul>
    </div>
  );
}
