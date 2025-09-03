import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyRentals() {
  const [rentals, setRentals] = useState([]);

  const fetchRentals = async () => {
    const res = await axios.get("/api/rental/my", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setRentals(res.data);
  };

  const cancelRental = async (id) => {
    await axios.put(`/api/rental/${id}/cancel`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    fetchRentals();
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📋 My Rentals</h1>
      {rentals.length === 0 ? (
        <p>No rentals found</p>
      ) : (
        rentals.map((r) => (
          <div key={r._id} className="p-4 border rounded mb-4 bg-gray-50">
            <h2 className="text-xl font-semibold mb-2">{r.destination}</h2>
            <p>Vehicle: {r.vehicle?.name} ({r.vehicle?.model})</p>
            <p>Status: <span className="font-semibold">{r.status}</span></p>
            <p>Pickup Points:</p>
            <ul className="list-disc ml-6">
              {r.pickupLocations.map((p, i) => (
                <li key={i}>{p.location}</li>
              ))}
            </ul>
            <p>Invites:</p>
            <ul className="list-disc ml-6">
              {r.invites.map((inv, i) => (
                <li key={i}>
                  {inv.phone} - {inv.status}
                </li>
              ))}
            </ul>
            {r.status === "open" && (
              <button
                onClick={() => cancelRental(r._id)}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
              >
                Cancel Rental
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
