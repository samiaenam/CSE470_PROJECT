import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function MyTrips() {
  const [trips, setTrips] = useState({ createdTrips: [], invitedTrips: [] });
  const [loading, setLoading] = useState(true);

  const loadTrips = async () => {
    try {
      const res = await API.get("/trips/my-trips"); // backend returns created + invited
      setTrips(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const respondToInvite = async (tripId, status) => {
    let pickupLocation = "";
    if (status === "accepted") {
      pickupLocation = prompt("Enter your pickup location (optional):");
    }

    try {
      await API.post(`/trips/${tripId}/respond`, { status, pickupLocation });
      loadTrips();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error responding to invite");
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h2>My Trips</h2>

      {/* Created Trips */}
      <h4>Trips I Created</h4>
      {trips.createdTrips.length === 0 ? (
        <p>You haven’t created any trips yet.</p>
      ) : (
        <ul className="list-group mb-4">
          {trips.createdTrips.map((t) => (
            <li key={t._id} className="list-group-item">
              <b>{t.destination}</b> on {t.date} <br />
              Vehicle: {t.vehicle?.name} ({t.vehicle?.licensePlate}) <br />
              <Link to={`/trips/${t._id}`} className="btn btn-sm btn-primary mt-2">
                View Details
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Invited Trips */}
      <h4>Trips I'm Invited To</h4>
      {trips.invitedTrips.length === 0 ? (
        <p>No pending invites.</p>
      ) : (
        <ul className="list-group">
          {trips.invitedTrips.map((t) => (
            <li key={t._id} className="list-group-item">
              <b>{t.trip.destination}</b> on {t.trip.date} <br />
              Status: {t.status} <br />
              Vehicle: {t.trip.vehicle?.name} ({t.trip.vehicle?.licensePlate}) <br />
              <Link to={`/trips/${t._id}`} className="btn btn-sm btn-primary mt-2 me-2">
                View Details
              </Link>

              {/* Only show accept/decline if pending */}
              {t.status === "pending" && (
                <>
                  <button
                    className="btn btn-success btn-sm me-2 mt-2"
                    onClick={() => respondToInvite(t._id, "accepted")}
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-danger btn-sm mt-2"
                    onClick={() => respondToInvite(t._id, "declined")}
                  >
                    Decline
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
