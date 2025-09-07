import React, { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function AdminRides() {
  const { user } = useContext(AuthContext);
  const [rides, setRides] = useState([]);
  const [routeName, setRouteName] = useState("");
  const [times, setTimes] = useState("");
  const [seats, setSeats] = useState(10);
  const [femaleOnly, setFemaleOnly] = useState(false); // ✅ new

  const loadRides = async () => {
    const res = await API.get("/carpools");
    setRides(res.data);
  };

  const createRide = async (e) => {
    e.preventDefault();
    await API.post("/carpools", {
      routeName,
      times: times.split(",").map((t) => t.trim()),
      totalSeats: seats,
      femaleOnly, // ✅ send to backend
    });
    setRouteName("");
    setTimes("");
    setSeats(10);
    setFemaleOnly(false); // reset checkbox
    loadRides();
  };

  const deleteRide = async (id) => {
    if (!window.confirm("Delete this ride?")) return;
    await API.delete(`/carpools/${id}`);
    loadRides();
  };

  const addPickup = async (id) => {
    const location = prompt("Enter pickup location:");
    if (!location) return;
    await API.post(`/carpools/${id}/add-pickup`, { location });
    loadRides();
  };

  const removePickup = async (id, location) => {
    if (!window.confirm(`Remove pickup location "${location}"?`)) return;
    await API.post(`/carpools/${id}/remove-pickup`, { location });
    loadRides();
  };

  const addDropoff = async (id) => {
    const location = prompt("Enter dropoff location:");
    if (!location) return;
    await API.post(`/carpools/${id}/add-dropoff`, { location });
    loadRides();
  };

  const removeDropoff = async (id, location) => {
    if (!window.confirm(`Remove dropoff location "${location}"?`)) return;
    await API.post(`/carpools/${id}/remove-dropoff`, { location });
    loadRides();
  };

  useEffect(() => {
    loadRides();
  }, []);

  if (!user?.isAdmin && user?.role !== "admin") {
    return <div className="alert alert-danger">Admins only</div>;
  }

  return (
    <div>
      <h2>Manage Rides</h2>

      <form onSubmit={createRide} className="mb-3">
        <input
          className="form-control mb-2"
          placeholder="Route Name"
          value={routeName}
          onChange={(e) => setRouteName(e.target.value)}
        />
        <input
          className="form-control mb-2"
          placeholder="Times (comma separated, 24h format)"
          value={times}
          onChange={(e) => setTimes(e.target.value)}
        />
        <input
          type="number"
          className="form-control mb-2"
          placeholder="Total Seats"
          value={seats}
          onChange={(e) => setSeats(e.target.value)}
        />
        <div className="form-check mb-2">
          <input
            className="form-check-input"
            type="checkbox"
            checked={femaleOnly}
            onChange={(e) => setFemaleOnly(e.target.checked)}
            id="femaleOnlyCheck"
          />
          <label className="form-check-label" htmlFor="femaleOnlyCheck">
            Female Only Ride
          </label>
        </div>
        <button className="btn btn-primary">Create Ride</button>
      </form>

      <ul className="list-group">
        {rides.map((ride) => (
          <li key={ride._id} className="list-group-item">
            <b>{ride.routeName}</b> — {ride.totalSeats} seats
            {ride.femaleOnly && (
              <span className="badge bg-danger ms-2">Female Only</span>
            )}
            <br />
            Times: {ride.times.join(", ")}
            <br />
            Pickups:{" "}
            {ride.pickupLocations.map((p) => (
              <span key={p} className="badge bg-info text-dark me-1">
                {p}{" "}
                <button
                  className="btn btn-sm btn-outline-danger ms-1"
                  onClick={() => removePickup(ride._id, p)}
                >
                  &times;
                </button>
              </span>
            ))}
            <br />
            Dropoffs:{" "}
            {ride.dropoffLocations.map((d) => (
              <span key={d} className="badge bg-warning text-dark me-1">
                {d}{" "}
                <button
                  className="btn btn-sm btn-outline-danger ms-1"
                  onClick={() => removeDropoff(ride._id, d)}
                >
                  &times;
                </button>
              </span>
            ))}
            <div className="mt-2">
              <button
                className="btn btn-sm btn-warning me-2"
                onClick={() => addPickup(ride._id)}
              >
                + Pickup
              </button>
              <button
                className="btn btn-sm btn-warning me-2"
                onClick={() => addDropoff(ride._id)}
              >
                + Dropoff
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => deleteRide(ride._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
