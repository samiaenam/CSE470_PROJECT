import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCarpoolClick = () => {
    if (isLoggedIn) {
      navigate("/carpool");
    } else {
      navigate("/login");
    }
  };

  const handleRentalClick = () => {
    if (isLoggedIn) {
      navigate("/rentals");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="container text-center mt-5">
      <h1 className="display-4 fw-bold">Welcome to CarpoolApp 🚗</h1>
      <p className="lead text-muted">
        Share rides, book carpools, or rent vehicles easily.
      </p>
      <div className="mt-4">
        <button
          onClick={handleCarpoolClick}
          className="btn btn-primary btn-lg me-3"
        >
          Find Carpool
        </button>
        <button
          onClick={handleRentalClick}
          className="btn btn-success btn-lg"
        >
          Rent a Vehicle
        </button>
      </div>
    </div>
  );
};

export default Home;

