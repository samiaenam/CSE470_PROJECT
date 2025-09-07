// // frontend/src/pages/InviteResponse.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";

// const InviteResponse = () => {
//   const { rentalId, phone } = useParams(); // from /rental/invite/:rentalId/:phone
//   const [rental, setRental] = useState(null);
//   const [pickup, setPickup] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   // Fetch rental details
//   useEffect(() => {
//     fetchRental();
//   }, []);

//   const fetchRental = async () => {
//     try {
//       const res = await axios.get(`/api/rentals/my`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });
//       // filter to find the rental by id
//       const found = res.data.find((r) => r._id === rentalId);
//       setRental(found || null);
//     } catch (err) {
//       setError("Could not load rental details");
//     }
//   };

//   const respond = async (status) => {
//     if (status === "accepted" && !pickup) {
//       alert("Please enter a pickup location");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       await axios.post(
//         "/api/rentals/respond",
//         {
//           rentalId,
//           phone,
//           status,
//           pickupLocation: pickup,
//         },
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         }
//       );

//       alert(`Invite ${status}`);
//       navigate("/my-rentals");
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to respond to invite");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!rental) return <p className="m-4">Loading rental details...</p>;

//   return (
//     <div className="container mt-4">
//       <h2>Rental Invitation</h2>
//       {error && <div className="alert alert-danger">{error}</div>}

//       <div className="card">
//         <div className="card-body">
//           <h5>{rental.vehicle?.name}</h5>
//           <p>
//             <strong>Destination:</strong> {rental.destination} <br />
//             <strong>Type:</strong> {rental.vehicle?.type} <br />
//             <strong>Seats:</strong> {rental.vehicle?.seats}
//           </p>

//           <div className="mb-3">
//             <label className="form-label">Pickup Location</label>
//             <input
//               type="text"
//               className="form-control"
//               placeholder="Enter pickup location"
//               value={pickup}
//               onChange={(e) => setPickup(e.target.value)}
//               disabled={loading}
//             />
//           </div>

//           <button
//             className="btn btn-success me-2"
//             onClick={() => respond("accepted")}
//             disabled={loading}
//           >
//             Accept
//           </button>
//           <button
//             className="btn btn-danger"
//             onClick={() => respond("declined")}
//             disabled={loading}
//           >
//             Decline
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InviteResponse;
import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const RespondInvite = () => {
  const { rentalId } = useParams(); // Assume rentalId is passed in URL
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("accepted");
  const [pickupLocation, setPickupLocation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post(
        "/api/rental/respond",
        {
          rentalId,
          phone,
          status,
          pickupLocation: status === "accepted" ? pickupLocation : undefined,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert(`Invite ${status} successfully!`);
      navigate("/my-rentals");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to respond to invite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Respond to Rental Invite</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <p>Loading...</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Your Phone Number</label>
          <input
            type="text"
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Response</label>
          <select
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="accepted">Accept</option>
            <option value="declined">Decline</option>
          </select>
        </div>
        {status === "accepted" && (
          <div className="mb-3">
            <label className="form-label">Your Pickup Location (Optional)</label>
            <input
              type="text"
              className="form-control"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              placeholder="Enter pickup location"
            />
          </div>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          Submit Response
        </button>
      </form>
    </div>
  );
};

export default RespondInvite;
