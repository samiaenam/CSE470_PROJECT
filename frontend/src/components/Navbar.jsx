// src/components/Navbar.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container">
        <Link to="/" className="navbar-brand">RideShare</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><Link className="nav-link" to="/">Vehicles</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/trips/create">Create Trip</Link></li>
            {user?.isAdmin && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/admin/vehicles">Admin Vehicles</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/admin/trips">Admin Trips</Link></li>
              </>
            )}
          </ul>
          <ul className="navbar-nav">
            {user ? (
              <>
                <li className="nav-item nav-link"><Link to="/profile">{user.name || user.phone}</Link></li>
                <li className="nav-item"><button className="btn btn-link nav-link" onClick={logout}>Logout</button></li>
              </>
            ) : (
              <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
