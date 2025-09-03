import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function RentalInvite() {
  const { rentalId, phone } = useParams();
  const navigate = useNavigate();
  const [rental, setRental] = useState(null);
  const [pickup, setPickup] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchRental = async () => {
      try {
        const res = await axios.get(`/api/rental/${rentalId}`);
        setRental(res.data);
        setLoading(false);
      } catch (err) {
        setMessage("Rental not found");
        setLoading(false);
      }
    };
    fetchRental();
  }, [rentalId]);

  const respondInvite = async (status) => {
    try {
      await axios.put(`/api/rental/${rentalId}/respond`, {
        phone,
        status,
        pickupLocation: pickup || undefined,
      });
      setMessage(`You have ${status} the invite.`);
      setTimeout(() => navigate("/my-rentals"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error updating response");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  if (!rental) return <div className="p-6">{message}</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🚗 Trip Invitation</h1>

      {message && <div className="mb-4 text-blue-600">{message}</div>}

      <div className="p-4 border rounded bg-gray-50 mb-4">
        <h2 className="text-xl font-semibold mb-2">{rental.destination}</h2>
        <p>Vehicle: {rental.vehicle?.name} ({rental.vehicle?.model})</p>
        <p>Initiator Pickup: {rental.initiatorPickup}</p>
        <p>Status: {rental.status}</p>
      </div>

      <label className="block mb-2 font-semibold">Your Pickup Location (optional)</label>
      <input
        type="text"
        className="w-full p-2 border rounded mb-4"
        placeholder="Enter pickup point"
        value={pickup}
        onChange={(e) => setPickup(e.target.value)}
      />

      <div className="flex gap-4">
        <button
          onClick={() => respondInvite("accepted")}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Accept
        </button>
        <button
          onClick={() => respondInvite("declined")}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
