// src/pages/MyRentals.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyRentals() {
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/rental/my", {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        });
        setRentals(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRentals();
  }, []);

  const cancelRental = async (id) => {
    if (!window.confirm("Cancel this rental?")) return;
    try {
      await axios.put(
        `http://localhost:5000/api/rental/${id}/cancel`,
        {},
        { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
      );
      alert("Rental cancelled");
      setRentals(rentals.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error cancelling rental");
    }
  };

  return (
    <div className="container mt-5">
      <h2>My Rentals</h2>
      {rentals.length === 0 ? (
        <p>No rentals found</p>
      ) : (
        <div className="list-group">
          {rentals.map((r) => (
            <div key={r._id} className="list-group-item">
              <h5>
                {r.vehicle?.name} → {r.destination}
              </h5>
              <p>
                Initiator: {r.initiator?.name} ({r.initiator?.email})
              </p>
              <p>Status: {r.status}</p>
              {r.initiator?._id === localStorage.getItem("userId") && (
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => cancelRental(r._id)}
                >
                  Cancel Rental
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
