// src/pages/CreateTrip.jsx
import React, { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function CreateTrip() {
  const { user } = useContext(AuthContext);
  const [date, setDate] = useState('');
  const [destination, setDestination] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [invitedUsers, setInvitedUsers] = useState('');

  const loadVehicles = async () => {
    if (!date) return;
    try {
      const res = await API.get(`/trips/available-vehicles?date=${date}`);
      setAvailableVehicles(res.data);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!selectedVehicle || !date || !destination || !pickupLocation) return alert('All fields required');

    const invitedUserIds = invitedUsers.split(',').map(id => id.trim()).filter(Boolean);

    try {
      await API.post('/trips', {
        vehicleId: selectedVehicle,
        date,
        destination,
        pickupLocation,
        invitedUserIds
      });
      alert('Trip created');
      setDate('');
      setDestination('');
      setPickupLocation('');
      setSelectedVehicle('');
      setInvitedUsers('');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  useEffect(()=>{ loadVehicles() }, [date]);

  return (
    <div>
      <h3>Create Trip</h3>
      <form onSubmit={submit}>
        <div className="mb-2">
          <label>Date</label>
          <input type="date" className="form-control" value={date} onChange={e=>setDate(e.target.value)} />
        </div>
        <div className="mb-2">
          <label>Destination</label>
          <input type="text" className="form-control" value={destination} onChange={e=>setDestination(e.target.value)} />
        </div>
        <div className="mb-2">
          <label>Pickup Location</label>
          <input type="text" className="form-control" value={pickupLocation} onChange={e=>setPickupLocation(e.target.value)} />
        </div>
        <div className="mb-2">
          <label>Vehicle</label>
          <select className="form-select" value={selectedVehicle} onChange={e=>setSelectedVehicle(e.target.value)}>
            <option value="">Select Vehicle</option>
            {availableVehicles.map(v => <option key={v._id} value={v._id}>{v.name} - {v.licensePlate}</option>)}
          </select>
        </div>
        <div className="mb-2">
          <label>Invite Users (comma-separated user phones)</label>
          <input type="text" className="form-control" value={invitedUsers} onChange={e=>setInvitedUsers(e.target.value)} />
        </div>
        <button className="btn btn-primary">Create Trip</button>
      </form>
    </div>
  );
}

