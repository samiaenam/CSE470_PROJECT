// frontend/src/pages/AvailableVehicles.jsx
import React, { useState } from "react";
import axios from "axios";

const AvailableVehicles = () => {
  const [date, setDate] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchVehicles = async () => {
    if (!date) {
      setError("Please select a date first");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await axios.get(`/api/rentals/vehicles?date=${date}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setVehicles(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch vehicles");
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (vehicleId) => {
    const destination = prompt("Enter destination:");
    const pickup = prompt("Enter your pickup location:");

    if (!destination || !pickup) return alert("Booking cancelled.");

    try {
      const res = await axios.post(
        "/api/rentals",
        {
          vehicleId,
          destination,
          initiatorPickup: pickup,
          date,
          invites: [], // you can later add invite phone numbers
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Rental created successfully!");
      console.log(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Find Available Vehicles</h2>

      {/* Date Picker */}
      <div className="mb-3 d-flex gap-2">
        <input
          type="date"
          className="form-control"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button className="btn btn-primary" onClick={fetchVehicles}>
          Search
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <p>Loading vehicles...</p>}

      {/* Vehicles List */}
      <div className="row">
        {vehicles.length === 0 && !loading && (
          <p>No vehicles available for this date</p>
        )}
        {vehicles.map((vehicle) => (
          <div key={vehicle._id} className="col-md-4 mb-3">
            <div className="card h-100 shadow-sm">
              <img
                src={vehicle.image}
                className="card-img-top"
                alt={vehicle.name}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title">{vehicle.name}</h5>
                <p className="card-text">
                  <strong>Type:</strong> {vehicle.type} <br />
                  <strong>Seats:</strong> {vehicle.seats} <br />
                  <strong>Rate:</strong> ${vehicle.rentPerHour}/hour
                </p>
                <button
                  className="btn btn-success"
                  onClick={() => handleBook(vehicle._id)}
                >
                  Book Rental
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableVehicles;
