import React, { useEffect, useState } from "react";
import axios from "axios";

export default function RentalPage() {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({
    vehicleId: "",
    destination: "",
    initiatorPickup: "",
    invites: [""],
  });

  useEffect(() => {
    const fetchVehicles = async () => {
      const res = await axios.get("http://localhost:5000/api/rental/vehicles", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      setVehicles(res.data);
    };
    fetchVehicles();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleInviteChange = (i, value) => {
    const updated = [...form.invites];
    updated[i] = value;
    setForm({ ...form, invites: updated });
  };

  const addInvite = () => {
    setForm({ ...form, invites: [...form.invites, ""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/rental",
        {
          ...form,
          invites: form.invites.map((phone) => ({ phone })),
        },
        { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
      );
      alert("Rental created successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to create rental");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create Rental</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Select Vehicle</label>
          <select
            className="form-select"
            name="vehicleId"
            value={form.vehicleId}
            onChange={handleChange}
            required
          >
            <option value="">Choose vehicle...</option>
            {vehicles.map((v) => (
              <option key={v._id} value={v._id}>
                {v.name} ({v.type}) - {v.seats} seats - ${v.rentPerHour}/hr
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Destination</label>
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
          <label className="form-label">Your Pickup Location</label>
          <input
            type="text"
            name="initiatorPickup"
            className="form-control"
            value={form.initiatorPickup}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Invite Friends (phone numbers)</label>
          {form.invites.map((invite, i) => (
            <input
              key={i}
              type="text"
              className="form-control mb-2"
              value={invite}
              onChange={(e) => handleInviteChange(i, e.target.value)}
              placeholder="Enter phone"
            />
          ))}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={addInvite}
          >
            + Add Invite
          </button>
        </div>

        <button type="submit" className="btn btn-primary">
          Create Rental
        </button>
      </form>
    </div>
  );
}
