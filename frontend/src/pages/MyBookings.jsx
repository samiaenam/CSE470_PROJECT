// // import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Card, Button, Spinner, Alert } from "react-bootstrap";

// export default function MyBookings() {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchBookings = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const res = await axios.get("http://localhost:5000/api/carpool/mybookings", {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });
//       setBookings(res.data);
//     } catch (err) {
//       setError("Failed to fetch bookings. Please try again.");
//       console.error("Error fetching bookings:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   const handleCancel = async (id) => {
//     if (!window.confirm("Are you sure you want to cancel this booking?")) return;

//     try {
//       await axios.post(
//         `http://localhost:5000/api/carpool/cancel/${id}`,
//         {},
//         { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
//       );
//       setError("Booking cancelled ✅");
//       fetchBookings();
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to cancel ❌");
//     }
//   };

//   const handleRefresh = () => {
//     fetchBookings();
//   };

//   if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;

//   return (
//     <div className="container mt-4">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h2>My Carpool Bookings</h2>
//         <Button variant="secondary" onClick={handleRefresh}>Refresh</Button>
//       </div>

//       {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

//       {bookings.length === 0 ? (
//         <p>You don’t have any bookings yet.</p>
//       ) : (
//         bookings.map((b) => (
//           <Card key={b._id} className="mb-3 shadow-sm">
//             <Card.Body>
//               <Card.Title>{b.ride?.routeName || "Ride"}</Card.Title>
//               <Card.Subtitle className="mb-2 text-muted">
//                 {new Date(b.date).toDateString()} at {b.time}
//               </Card.Subtitle>
//               <Card.Text>
//                 <strong>Pickup:</strong> {b.pickup}<br />
//                 <strong>Dropoff:</strong> {b.dropoff}<br />
//                 <strong>Status:</strong>{" "}
//                 <span className={b.status === "booked" ? "text-success" : "text-danger"}>
//                   {b.status}
//                 </span>
//               </Card.Text>

//               {b.status === "booked" && (
//                 <Button variant="danger" onClick={() => handleCancel(b._id)}>
//                   Cancel Booking
//                 </Button>
//               )}
//             </Card.Body>
//           </Card>
//         ))
//       )}
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Spinner, Alert } from "react-bootstrap";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("http://localhost:5000/api/carpool/mybookings", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBookings(res.data);
    } catch (err) {
      setError("Failed to fetch bookings. Please try again.");
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await axios.post(
        `http://localhost:5000/api/carpool/cancel/${id}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setError("Booking cancelled ✅");
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel ❌");
    }
  };

  const handleRefresh = () => {
    fetchBookings();
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Carpool Bookings</h2>
        <Button variant="secondary" onClick={handleRefresh}>Refresh</Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

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
                <strong>Pickup:</strong> {b.pickup}<br />
                <strong>Dropoff:</strong> {b.dropoff}<br />
                <strong>Status:</strong>{" "}
                <span className={b.status === "booked" ? "text-success" : "text-danger"}>
                  {b.status}
                </span>
              </Card.Text>

              {b.status === "booked" && (
                <Button variant="danger" onClick={() => handleCancel(b._id)}>
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