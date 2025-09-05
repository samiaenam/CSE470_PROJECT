import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Form, Row, Col, Spinner } from "react-bootstrap";

export default function ManageRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    routeName: "",
    pickupLocations: "",
    dropoffLocations: "",
    totalSeats: "",
    times: "",
    femaleOnly: false,
  });

  // 🔹 Fetch rides
  const fetchRides = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/carpool/rides", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setRides(res.data);
    } catch (err) {
      console.error("Error fetching rides:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  // 🔹 Handle form change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // 🔹 Create new ride
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/carpool/rides",
        {
          ...formData,
          pickupLocations: formData.pickupLocations.split(",").map((s) => s.trim()),
          dropoffLocations: formData.dropoffLocations.split(",").map((s) => s.trim()),
          times: formData.times.split(",").map((s) => s.trim()),
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("Ride created ✅");
      setFormData({
        routeName: "",
        pickupLocations: "",
        dropoffLocations: "",
        totalSeats: "",
        times: "",
        femaleOnly: false,
      });
      fetchRides();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create ride ❌");
    }
  };

  // 🔹 Delete ride
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this ride?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/carpool/rides/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Ride deleted ❌");
      fetchRides();
    } catch (err) {
      alert("Error deleting ride");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manage Carpool Rides (Admin)</h2>

      {/* Ride Creation Form */}
      <Card className="mb-4 p-3 shadow-sm">
        <Form onSubmit={handleCreate}>
          <Row className="mb-2">
            <Col>
              <Form.Control
                type="text"
                name="routeName"
                placeholder="Route Name"
                value={formData.routeName}
                onChange={handleChange}
                required
              />
            </Col>
            <Col>
              <Form.Control
                type="number"
                name="totalSeats"
                placeholder="Total Seats"
                value={formData.totalSeats}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>

          <Form.Group className="mb-2">
            <Form.Control
              type="text"
              name="pickupLocations"
              placeholder="Pickup Locations (comma-separated)"
              value={formData.pickupLocations}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Control
              type="text"
              name="dropoffLocations"
              placeholder="Dropoff Locations (comma-separated)"
              value={formData.dropoffLocations}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Control
              type="text"
              name="times"
              placeholder="Ride Times (comma-separated, e.g. 07:00, 09:00)"
              value={formData.times}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Check
            type="checkbox"
            label="Female Only"
            name="femaleOnly"
            checked={formData.femaleOnly}
            onChange={handleChange}
          />

          <Button type="submit" className="mt-2">
            Create Ride
          </Button>
        </Form>
      </Card>

      {/* Ride List */}
      <h4>Existing Rides</h4>
      {loading ? (
        <Spinner animation="border" className="d-block mx-auto mt-3" />
      ) : rides.length === 0 ? (
        <p>No rides created yet.</p>
      ) : (
        rides.map((r) => (
          <Card key={r._id} className="mb-2 shadow-sm">
            <Card.Body>
              <Card.Title>{r.routeName}</Card.Title>
              <Card.Text>
                <strong>Seats:</strong> {r.totalSeats} <br />
                <strong>Pickup:</strong> {r.pickupLocations.join(", ")} <br />
                <strong>Dropoff:</strong> {r.dropoffLocations.join(", ")} <br />
                <strong>Times:</strong> {r.times.join(", ")} <br />
                {r.femaleOnly && <span className="badge bg-info">Female Only</span>}
              </Card.Text>
              <Button variant="danger" onClick={() => handleDelete(r._id)}>
                Delete
              </Button>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
}
