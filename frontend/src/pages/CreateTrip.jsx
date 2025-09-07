import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function CreateTrip() {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({
    vehicleId: "",
    date: "",
    destination: "",
    pickupLocation: "",
    invitedPhones: "",
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (form.date) {
      API.get(`/trips/available-vehicles?date=${form.date}`)
        .then(res => setVehicles(res.data))
        .catch(err => console.error(err));
    }
  }, [form.date]);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        invitedPhones: form.invitedPhones
          ? form.invitedPhones.split(",").map(p => p.trim())
          : [],
      };
      const res = await API.post("/trips", payload);
      setMessage("Trip created successfully!");
      console.log(res.data);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error creating trip");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create Trip</h2>
      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Date</label>
          <input
            type="date"
            name="date"
            className="form-control"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Destination</label>
          <input
            type="text"
            name="destination"
            className="form-control"
            value={form.destination}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Pickup Location</label>
          <input
            type="text"
            name="pickupLocation"
            className="form-control"
            value={form.pickupLocation}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Vehicle</label>
          <select
            name="vehicleId"
            className="form-control"
            value={form.vehicleId}
            onChange={handleChange}
            required
          >
            <option value="">Select vehicle</option>
            {vehicles.map(v => (
              <option key={v._id} value={v._id}>
                {v.name} ({v.licensePlate})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Invite Friends (comma-separated phone numbers)</label>
          <input
            type="text"
            name="invitedPhones"
            className="form-control"
            value={form.invitedPhones}
            onChange={handleChange}
          />
        </div>

        <button className="btn btn-primary" type="submit">
          Create Trip
        </button>
      </form>
    </div>
  );
}
