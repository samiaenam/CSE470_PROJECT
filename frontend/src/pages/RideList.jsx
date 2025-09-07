import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function RideList() {
  const [rides, setRides] = useState([]);
  const [message, setMessage] = useState(null);
  const [selectedRide, setSelectedRide] = useState(null);
  const [selectedPickup, setSelectedPickup] = useState("");
  const [selectedDropoff, setSelectedDropoff] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const loadRides = async () => {
    const res = await API.get("/carpools");
    setRides(res.data);
  };

  const openBookingForm = (ride) => {
    setSelectedRide(ride);
    setSelectedPickup("");
    setSelectedDropoff("");
    setSelectedTime("");
    setMessage(null);
  };

  const bookRide = async () => {
    if (!selectedPickup || !selectedDropoff || !selectedTime) {
      setMessage("Please select pickup, dropoff, and time");
      return;
    }

    try {
      const res = await API.post("/carpools/book", {
        rideId: selectedRide._id,
        pickup: selectedPickup,
        dropoff: selectedDropoff,
        time: selectedTime,
      });
      setMessage(res.data.message);
      setSelectedRide(null);
      loadRides(); // refresh ride info
    } catch (err) {
      setMessage(err.response?.data?.message || "Booking failed");
    }
  };

  useEffect(() => {
    loadRides();
  }, []);

  return (
    <div>
      <h2>Available Rides</h2>
      {message && <div className="alert alert-info">{message}</div>}

      <ul className="list-group">
        {rides.map((ride) => (
          <li key={ride._id} className="list-group-item mb-2">
            <b>{ride.routeName}</b> — {ride.totalSeats} seats
            <br />
            Times: {ride.times.join(", ")}
            <br />
            Pickups: {ride.pickupLocations.join(", ")}
            <br />
            Dropoffs: {ride.dropoffLocations.join(", ")}
            <br />
            {ride.femaleOnly && (
              <span className="badge bg-danger mt-1">Female Only</span>
            )}
            <div className="mt-2">
              {selectedRide?._id === ride._id ? (
                <div>
                  <select
                    className="form-select mb-2"
                    value={selectedPickup}
                    onChange={(e) => setSelectedPickup(e.target.value)}
                  >
                    <option value="">Select Pickup</option>
                    {ride.pickupLocations.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>

                  <select
                    className="form-select mb-2"
                    value={selectedDropoff}
                    onChange={(e) => setSelectedDropoff(e.target.value)}
                  >
                    <option value="">Select Dropoff</option>
                    {ride.dropoffLocations.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>

                  <select
                    className="form-select mb-2"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  >
                    <option value="">Select Time</option>
                    {ride.times.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>

                  <button
                    className="btn btn-sm btn-success me-2"
                    onClick={bookRide}
                  >
                    Confirm Booking
                  </button>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => setSelectedRide(null)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => openBookingForm(ride)}
                >
                  Book Ride
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
