import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Carpool from "./pages/Carpool";
import MyBookings from "./pages/MyBookings";
import Rental from "./pages/Rental";
import MyRentals from "./pages/MyRentals";
import RentalInvite from "./pages/RentalInvite";



export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/carpool" element={<Carpool />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/rental" element={<Rental />} />
        <Route path="/my-rentals" element={<MyRentals />} />
        <Route path="/rental/invite/:rentalId/:phone" element={<RentalInvite />} />
        <Route path="/profile" element={<div>Profile Page</div>} />
        <Route path="/" element={<div className="p-6">Welcome to CarpoolApp 🚗</div>} />
      </Routes>
    </Router>
  );
}
