import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Rental() {
  const [vehicles, setVehicles] = useState([]);
  const [vehicleId, setVehicleId] = useState("");
  const [destination, setDestination] = useState("");
  const [pickup, setPickup] = useState("");
  const [invitePhone, setInvitePhone] = useState("");
  const [invites, setInvites] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // fetch available vehicles
    axios.get("/api/rental/vehicles").then((res) => setVehicles(res.data));
  }, []);

  const addInvite = () => {
    if (invitePhone.trim()) {
      setInvites([...invites, { phone: invitePhone }]);
      setInvitePhone("");
    }
  };

  const createRental = async () => {
    try {
      const res = await axios.post("/api/rental", {
        vehicleId,
        destination,
        initiatorPickup: pickup,
        invites,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      setMessage("Rental created successfully!");
      setDestination("");
      setPickup("");
      setVehicleId("");
      setInvites([]);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error creating rental");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🚗 Create Rental Trip</h1>

      {message && <div className="mb-4 text-blue-600">{message}</div>}

      {/* Select Vehicle */}
      <label className="block mb-2 font-semibold">Select Vehicle</label>
      <select
        className="w-full p-2 border rounded mb-4"
        value={vehicleId}
        onChange={(e) => setVehicleId(e.target.value)}
      >
        <option value="">-- Select a vehicle --</option>
        {vehicles.map((v) => (
          <option key={v._id} value={v._id}>
            {v.name} - {v.model}
          </option>
        ))}
      </select>

      {/* Show selected vehicle picture */}
      {vehicleId && (
        <div className="mb-4">
          <img
            src={vehicles.find((v) => v._id === vehicleId)?.imageUrl}
            alt="Selected Vehicle"
            className="w-64 rounded shadow"
          />
        </div>
      )}

      {/* Destination */}
      <input
        type="text"
        placeholder="Enter Destination"
        className="w-full p-2 border rounded mb-4"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />

      {/* Pickup */}
      <input
        type="text"
        placeholder="Enter Your Pickup Location"
        className="w-full p-2 border rounded mb-4"
        value={pickup}
        onChange={(e) => setPickup(e.target.value)}
      />

      {/* Invite Friends */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Invite Friends</label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter phone number"
            className="flex-1 p-2 border rounded"
            value={invitePhone}
            onChange={(e) => setInvitePhone(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-green-600 text-white rounded"
            onClick={addInvite}
          >
            Add
          </button>
        </div>
        <ul className="mt-2">
          {invites.map((inv, i) => (
            <li key={i} className="text-gray-700">📱 {inv.phone}</li>
          ))}
        </ul>
      </div>

      {/* Submit */}
      <button
        onClick={createRental}
        className="px-6 py-2 bg-blue-600 text-white rounded shadow"
      >
        Create Rental
      </button>
    </div>
  );
}
