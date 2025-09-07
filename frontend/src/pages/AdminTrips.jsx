// src/pages/AdminTrips.jsx
import React, { useState, useEffect } from 'react';
import API from '../services/api';

export default function AdminTrips() {
  const [trips, setTrips] = useState([]);

  const load = async () => {
    try {
      const res = await API.get('/trips'); // backend endpoint should return all trips for admin
      setTrips(res.data);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => { load() }, []);

  return (
    <div>
      <h3>All Trips (Admin)</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Destination</th>
            <th>Date</th>
            <th>Vehicle</th>
            <th>Creator</th>
            <th>Invites</th>
          </tr>
        </thead>
        <tbody>
          {trips.map(t => (
            <tr key={t._id}>
              <td>{t.destination}</td>
              <td>{t.date}</td>
              <td>{t.vehicle.name} ({t.vehicle.licensePlate})</td>
              <td>{t.creator.name}</td>
              <td>
                {t.invited.map(i => `${i.user.name} (${i.status})`).join(', ')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
