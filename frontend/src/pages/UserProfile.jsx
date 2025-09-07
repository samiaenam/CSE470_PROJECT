// src/pages/UserProfile.jsx
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

export default function UserProfile() {
  const { user, token } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', gender: '', password: ''
  });

  useEffect(() => {
    if (user && token) {
      API.get('/auth/profile', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setForm({ ...res.data, password: '' }))
        .catch(err => console.error(err));
    }
  }, [user, token]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.put('/auth/profile', form, { headers: { Authorization: `Bearer ${token}` } });
      alert('Profile updated!');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  if (!user) return null;

  return (
    <div>
      <h3>My Profile</h3>
      <form onSubmit={submit}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <input type="password" placeholder="New Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <button type="submit" className="btn btn-primary mt-2">Update Profile</button>
      </form>
    </div>
  );
}
