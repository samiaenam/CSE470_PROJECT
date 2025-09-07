// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Carpool
        </Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            {!user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}

            {user && (
              <>
                {/* User Links */}
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/rides">
                    Rides
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/my-bookings">
                    My Bookings
                  </Link>
                </li>

                {/* Trip Links */}
                <li className="nav-item">
                  <Link className="nav-link" to="/trips/create">
                    Create Trip
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/my-trips">
                    My Trips
                  </Link>
                </li>
                {/* <li className="nav-item">
                  <Link className="nav-link" to="/my-invites">
                    My Invites
                  </Link>
                </li> */}

                {/* Admin Links */}
                {(user.isAdmin || user.role === "admin") && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/trips">
                        Admin Trips
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/rides">
                        Admin Rides
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/vehicles">
                        Admin Vehicles
                      </Link>
                    </li>
                  </>
                )}

                <li className="nav-item">
                  <button
                    className="btn btn-sm btn-danger ms-2"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
