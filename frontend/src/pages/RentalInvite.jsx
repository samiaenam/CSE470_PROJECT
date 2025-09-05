// src/pages/RentalInvite.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function RentalInvite() {
  const { rentalId, phone } = useParams();
  const navigate = useNavigate();
  const [pickupLocation, setPickupLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const respond = async (status) => {
    try {
      setLoading(true);
      await axios.post(
        "http://localhost:5000/api/rental/respond",
        { rentalId, phone, status, pickupLocation },
        { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
      );
      alert(`You have ${status} the invite`);
      navigate("/my-rentals");
    } catch (err) {
      console.error(err);
      alert("Error responding to invite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Rental Invite</h2>
      <p>
        You were invited to join rental <b>{rentalId}</b> with phone{" "}
        <b>{phone}</b>.
      </p>

      <div className="mb-3">
        <label className="form-label">Pickup Location (if accepting)</label>
        <input
          type="text"
          className="form-control"
          value={pickupLocation}
          onChange={(e) => setPickupLocation(e.target.value)}
        />
      </div>

      <button
        className="btn btn-success me-2"
        disabled={loading}
        onClick={() => respond("accepted")}
      >
        Accept
      </button>
      <button
        className="btn btn-danger"
        disabled={loading}
        onClick={() => respond("declined")}
      >
        Decline
      </button>
    </div>
  );
}
