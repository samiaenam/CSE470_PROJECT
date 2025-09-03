// ./components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo / App Name */}
        <Link to="/" className="text-xl font-bold">
          CarpoolApp
        </Link>

        {/* Links */}
        <div className="flex gap-6">
          <Link to="/carpool" className="hover:underline">
            Carpool
          </Link>
          <Link to="/my-bookings" className="hover:underline">
            My Bookings
          </Link>
          <Link to="/profile" className="hover:underline">
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
}
