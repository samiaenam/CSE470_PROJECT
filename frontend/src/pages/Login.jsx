import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { phone, password });
      login(res.data.token); // Pass only the token, AuthContext will decode and set user
      navigate('/'); // SPA navigation, no page reload
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="col-md-6 offset-md-3">
      <h3>Login</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={submit}>
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            className="form-control"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-primary">Login</button>
      </form>
    </div>
  );
}
