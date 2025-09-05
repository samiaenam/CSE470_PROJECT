import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Form, Spinner } from "react-bootstrap";

export default function Carpool() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // default today
  const [selectedOptions, setSelectedOptions] = useState({}); // { rideId: { time, pickup, dropoff } }

  // 🔹 Fetch available rides when date changes
  useEffect(() => {
    const fetchRides = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/carpool/available?date=${date}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        setRides(res.data);
      } catch (err) {
        console.error("Error fetching rides:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRides();
  }, [date]);

  // 🔹 Handle form input for each ride
  const handleChange = (rideId, field, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [rideId]: { ...prev[rideId], [field]: value },
    }));
  };

  // 🔹 Book a seat
  const handleBook = async (rideId) => {
    const options = selectedOptions[rideId];
    if (!options?.time || !options?.pickup || !options?.dropoff) {
      alert("Please select time, pickup, and dropoff before booking!");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/carpool/book",
        {
          rideId,
          date,
          time: options.time,
          pickup: options.pickup,
          dropoff: options.dropoff,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("Seat booked successfully ✅");

      // refresh list
      const updated = rides.map((r) =>
        r.ride._id === rideId
          ? { ...r, availableSeats: r.availableSeats - 1 }
          : r
      );
      setRides(updated);
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed ❌");
    }
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Available Carpool Rides</h2>

      {/* Date Picker */}
      <Form.Group className="mb-4">
        <Form.Label>Select Date</Form.Label>
        <Form.Control
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </Form.Group>

      {rides.length === 0 ? (
        <p>No rides available for this date.</p>
      ) : (
        rides.map(({ ride, availableSeats }) => (
          <Card key={ride._id} className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title>{ride.routeName}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {ride.femaleOnly ? "Female Only 🚺" : "Regular 🚗"}
              </Card.Subtitle>
              <Card.Text>
                <strong>Seats Left:</strong> {availableSeats} / {ride.totalSeats}
              </Card.Text>

              {/* If ride is restricted */}
              {ride.restricted ? (
                <p className="text-danger">
                  🚫 This ride is restricted to female passengers only
                </p>
              ) : (
                <>
                  {/* Select time */}
                  <Form.Group className="mb-2">
                    <Form.Label>Time</Form.Label>
                    <Form.Select
                      value={selectedOptions[ride._id]?.time || ""}
                      onChange={(e) =>
                        handleChange(ride._id, "time", e.target.value)
                      }
                    >
                      <option value="">Select time</option>
                      {ride.times.map((t, i) => (
                        <option key={i} value={t}>
                          {t}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  {/* Select pickup */}
                  <Form.Group className="mb-2">
                    <Form.Label>Pickup</Form.Label>
                    <Form.Select
                      value={selectedOptions[ride._id]?.pickup || ""}
                      onChange={(e) =>
                        handleChange(ride._id, "pickup", e.target.value)
                      }
                    >
                      <option value="">Select pickup</option>
                      {ride.pickupLocations.map((p, i) => (
                        <option key={i} value={p}>
                          {p}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  {/* Select dropoff */}
                  <Form.Group className="mb-2">
                    <Form.Label>Dropoff</Form.Label>
                    <Form.Select
                      value={selectedOptions[ride._id]?.dropoff || ""}
                      onChange={(e) =>
                        handleChange(ride._id, "dropoff", e.target.value)
                      }
                    >
                      <option value="">Select dropoff</option>
                      {ride.dropoffLocations.map((d, i) => (
                        <option key={i} value={d}>
                          {d}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Button
                    className="mt-2"
                    disabled={availableSeats <= 0}
                    onClick={() => handleBook(ride._id)}
                  >
                    {availableSeats > 0 ? "Book Seat" : "Full"}
                  </Button>
                </>
              )}
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
}
