import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Spinner } from "react-bootstrap";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch user's bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/carpool/mybookings", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // 🔹 Cancel booking
  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await axios.post(
        `http://localhost:5000/api/carpool/cancel/${id}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("Booking cancelled ✅");
      fetchBookings(); // refresh list
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel ❌");
    }
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Carpool Bookings</h2>

      {bookings.length === 0 ? (
        <p>You don’t have any bookings yet.</p>
      ) : (
        bookings.map((b) => (
          <Card key={b._id} className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title>{b.ride?.routeName || "Ride"}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {new Date(b.date).toDateString()} at {b.time}
              </Card.Subtitle>
              <Card.Text>
                <strong>Pickup:</strong> {b.pickup} <br />
                <strong>Dropoff:</strong> {b.dropoff} <br />
                <strong>Status:</strong>{" "}
                <span
                  className={
                    b.status === "booked" ? "text-success" : "text-danger"
                  }
                >
                  {b.status}
                </span>
              </Card.Text>

              {b.status === "booked" && (
                <Button
                  variant="danger"
                  onClick={() => handleCancel(b._id)}
                >
                  Cancel Booking
                </Button>
              )}
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
}
