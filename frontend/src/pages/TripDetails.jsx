// src/pages/TripDetails.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function TripDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [trip, setTrip] = useState(null);
  const [response, setResponse] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');

  const loadTrip = async () => {
    try {
      const res = await API.get(`/trips/${id}`);
      setTrip(res.data);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const submitResponse = async () => {
    if (!response) return alert('Choose accept or decline');
    try {
      await API.post(`/trips/${id}/respond`, { status: response, pickupLocation });
      alert('Response saved');
      loadTrip();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  useEffect(()=>{ loadTrip() }, []);

  if (!trip) return <div>Loading...</div>;

  const myInvite = trip.invited.find(i => i.user._id === user._id);

  return (
    <div>
      <h3>Trip to {trip.destination} on {trip.date}</h3>
      <p>Vehicle: {trip.vehicle.name} ({trip.vehicle.licensePlate})</p>
      <h5>Pickup Locations</h5>
      <ul>
        {trip.pickupLocations.map(pl => <li key={pl.user._id}>{pl.user.name}: {pl.location}</li>)}
      </ul>

      <h5>Invites</h5>
      <ul>
        {trip.invited.map(i => <li key={i.user._id}>{i.user.name}: {i.status}</li>)}
      </ul>

      {myInvite && myInvite.status === 'pending' && (
        <div className="mt-3">
          <label>Response:</label>
          <select className="form-select mb-2" value={response} onChange={e=>setResponse(e.target.value)}>
            <option value="">Select</option>
            <option value="accepted">Accept</option>
            <option value="declined">Decline</option>
          </select>
          {response === 'accepted' && (
            <input type="text" className="form-control mb-2" placeholder="Optional pickup location" value={pickupLocation} onChange={e=>setPickupLocation(e.target.value)} />
          )}
          <button className="btn btn-primary" onClick={submitResponse}>Submit</button>
        </div>
      )}
    </div>
  );
}
