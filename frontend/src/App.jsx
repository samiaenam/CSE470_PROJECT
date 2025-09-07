import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext'; // <--- import AuthContext here
import Navbar from './components/Navbar';

import Login from './pages/Login';
import VehiclesList from './pages/VehiclesList';
import AdminVehicles from './pages/AdminVehicles';
import CreateTrip from './pages/CreateTrip';
import TripDetails from './pages/TripDetails';
import AdminTrips from './pages/AdminTrips';
import UserProfile from './pages/UserProfile';
import AdminRoute from './components/AdminRoute';

function RequireAuth({ children }) {
  const { user } = React.useContext(AuthContext); // <--- use imported AuthContext
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <div className="container mt-5">
        <Routes>
          <Route path="/" element={<VehiclesList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<RequireAuth><UserProfile /></RequireAuth>} />
          <Route path="/trips/create" element={<RequireAuth><CreateTrip /></RequireAuth>} />
          <Route path="/trips/:id" element={<RequireAuth><TripDetails /></RequireAuth>} />
          <Route path="/admin/vehicles" element={<AdminRoute><AdminVehicles /></AdminRoute>} />
          <Route path="/admin/trips" element={<AdminRoute><AdminTrips /></AdminRoute>} />
        </Routes>
      </div>
    </AuthProvider>
  );
}
