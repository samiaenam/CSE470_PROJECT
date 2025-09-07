// src/pages/AdminTrips.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function AdminTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTrips = async () => {
    try {
      const res = await API.get("/trips/admin/all");
      setTrips(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h2>All Trips (Admin)</h2>
      {trips.length === 0 ? (
        <p>No trips found.</p>
      ) : (
        <ul className="list-group">
          {trips.map((t) => (
            <li key={t._id} className="list-group-item">
              <b>{t.destination}</b> on {t.date}
              <br />
              Created By: {t.createdBy?.name}
              <br />
              Vehicle: {t.vehicle?.name} ({t.vehicle?.licensePlate})
              <div className="mt-2">
                <Link to={`/trips/${t._id}`} className="btn btn-sm btn-primary">
                  View Details
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
