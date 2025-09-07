import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Form, Spinner } from "react-bootstrap";

export default function AdminRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    routeName: "",
    pickupLocations: "",
    dropoffLocations: "",
    times: "",
    totalSeats: 0,
    femaleOnly: false,
  });

  const token = localStorage.getItem("token");

  const fetchRides = async () => {
    try {
      const res = await axios.get("/api/carpools", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRides(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const createRide = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "/api/carpools",
        {
          ...form,
          pickupLocations: form.pickupLocations.split(","),
          dropoffLocations: form.dropoffLocations.split(","),
          times: form.times.split(","),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRides();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteRide = async (id) => {
    try {
      await axios.delete(`/api/carpools/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRides();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div className="container mt-4">
      <h2>Manage Rides</h2>
      <Form onSubmit={createRide} className="mb-4">
        <Form.Control
          placeholder="Route Name"
          value={form.routeName}
          onChange={(e) => setForm({ ...form, routeName: e.target.value })}
          className="mb-2"
        />
        <Form.Control
          placeholder="Pickup Locations (comma separated)"
          value={form.pickupLocations}
          onChange={(e) => setForm({ ...form, pickupLocations: e.target.value })}
          className="mb-2"
        />
        <Form.Control
          placeholder="Dropoff Locations (comma separated)"
          value={form.dropoffLocations}
          onChange={(e) =>
            setForm({ ...form, dropoffLocations: e.target.value })
          }
          className="mb-2"
        />
        <Form.Control
          placeholder="Times (comma separated, HH:mm)"
          value={form.times}
          onChange={(e) => setForm({ ...form, times: e.target.value })}
          className="mb-2"
        />
        <Form.Control
          type="number"
          placeholder="Total Seats"
          value={form.totalSeats}
          onChange={(e) =>
            setForm({ ...form, totalSeats: Number(e.target.value) })
          }
          className="mb-2"
        />
        <Form.Check
          type="checkbox"
          label="Female Only"
          checked={form.femaleOnly}
          onChange={(e) => setForm({ ...form, femaleOnly: e.target.checked })}
          className="mb-2"
        />
        <Button type="submit">Create Ride</Button>
      </Form>

      <div className="row">
        {rides.map((ride) => (
          <div className="col-md-4 mb-3" key={ride._id}>
            <Card>
              <Card.Body>
                <Card.Title>{ride.routeName}</Card.Title>
                <Card.Text>
                  Seats: {ride.totalSeats} <br />
                  Pickup: {ride.pickupLocations.join(", ")} <br />
                  Dropoff: {ride.dropoffLocations.join(", ")} <br />
                  Times: {ride.times.join(", ")} <br />
                  {ride.femaleOnly && "Female Only Ride"}
                </Card.Text>
                <Button
                  variant="danger"
                  onClick={() => deleteRide(ride._id)}
                  size="sm"
                >
                  Delete
                </Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
