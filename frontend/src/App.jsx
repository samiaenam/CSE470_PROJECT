// App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import UpdateProfile from "./pages/UpdateProfile";
import AdminVehicles from "./pages/AdminVehicles";

// Ride pages
import RideList from "./pages/RideList";
import MyBookings from "./pages/MyBookings";
import AdminRides from "./pages/AdminRides";

// Trip pages
import CreateTrip from "./pages/CreateTrip";
import MyTrips from "./pages/MyTrips";
import AdminTrips from "./pages/AdminTrips";
import TripDetails from "./pages/TripDetails";

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User profile */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/update" element={<UpdateProfile />} />

          {/* Ride features */}
          <Route path="/rides" element={<RideList />} />
          <Route path="/my-bookings" element={<MyBookings />} />

          {/* Trip features */}
          <Route path="/trips/create" element={<CreateTrip />} />
          <Route path="/my-trips" element={<MyTrips />} />
          <Route path="/trips/:id" element={<TripDetails />} />

          {/* Admin pages */}
          <Route path="/admin/vehicles" element={<AdminVehicles />} />
          <Route path="/admin/rides" element={<AdminRides />} />
          <Route path="/admin/trips" element={<AdminTrips />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}
