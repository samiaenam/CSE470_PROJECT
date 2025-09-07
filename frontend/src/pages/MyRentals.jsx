// // frontend/src/pages/MyRentals.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const MyRentals = () => {
//   const [rentals, setRentals] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Fetch rentals on load
//   useEffect(() => {
//     fetchRentals();
//   }, []);

//   const fetchRentals = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await axios.get("/api/rentals/my", {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });
//       setRentals(res.data);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to fetch rentals");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = async (id) => {
//     if (!window.confirm("Are you sure you want to cancel this rental?")) return;

//     try {
//       await axios.put(
//         `/api/rentals/${id}/cancel`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         }
//       );
//       alert("Rental cancelled");
//       fetchRentals();
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to cancel rental");
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h2>My Rentals</h2>
//       {loading && <p>Loading...</p>}
//       {error && <div className="alert alert-danger">{error}</div>}
//       {rentals.length === 0 && !loading && <p>No rentals found.</p>}

//       <div className="row">
//         {rentals.map((rental) => (
//           <div key={rental._id} className="col-md-6 mb-3">
//             <div className="card shadow-sm">
//               <div className="card-body">
//                 <h5 className="card-title">{rental.vehicle?.name}</h5>
//                 <p className="card-text">
//                   <strong>Destination:</strong> {rental.destination} <br />
//                   <strong>Status:</strong> {rental.status} <br />
//                   <strong>Vehicle Type:</strong> {rental.vehicle?.type} <br />
//                   <strong>Seats:</strong> {rental.vehicle?.seats} <br />
//                   <strong>Rate:</strong> ${rental.vehicle?.rentPerHour}/hour
//                 </p>

//                 <p className="card-text">
//                   <strong>Pickup Locations:</strong>
//                   <ul>
//                     {rental.pickupLocations.map((p, i) => (
//                       <li key={i}>
//                         {p.location} {p.confirmed ? "(confirmed)" : "(pending)"}
//                       </li>
//                     ))}
//                   </ul>
//                 </p>

//                 {rental.initiator?._id ===
//                   JSON.parse(localStorage.getItem("user"))._id &&
//                   rental.status === "open" && (
//                     <button
//                       className="btn btn-danger"
//                       onClick={() => handleCancel(rental._id)}
//                     >
//                       Cancel Rental
//                     </button>
//                   )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MyRentals;
import React, { useEffect, useState } from "react";
import axios from "axios";

const MyRentals = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/api/rental/my", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setRentals(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch rentals");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this rental?")) return;

    try {
      await axios.put(
        `/api/rental/${id}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Rental cancelled successfully");
      fetchRentals(); // Refresh rentals
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel rental");
    }
  };

  return (
    <div className="container mt-4">
      <h2>My Rentals</h2>
      {loading && <p>Loading...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {rentals.length === 0 && !loading && <p>No rentals found.</p>}

      <div className="row">
        {rentals.map((rental) => (
          <div key={rental._id} className="col-md-6 mb-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{rental.vehicle?.name}</h5>
                <p className="card-text">
                  <strong>Date:</strong> {new Date(rental.date).toLocaleDateString()} <br />
                  <strong>Destination:</strong> {rental.destination} <br />
                  <strong>Status:</strong> {rental.status} <br />
                  <strong>Vehicle Type:</strong> {rental.vehicle?.type} <br />
                  <strong>Seats:</strong> {rental.vehicle?.seats} <br />
                  <strong>Rate:</strong> ${rental.vehicle?.rentPerHour}/hour
                </p>
                <p className="card-text">
                  <strong>Pickup Locations:</strong>
                  <ul>
                    {rental.pickupLocations.map((p, i) => (
                      <li key={i}>
                        {p.location} {p.confirmed ? "(Confirmed)" : "(Pending)"}
                      </li>
                    ))}
                  </ul>
                </p>
                <p className="card-text">
                  <strong>Invites:</strong>
                  <ul>
                    {rental.invites.map((invite, i) => (
                      <li key={i}>
                        {invite.phone}: {invite.status}
                      </li>
                    ))}
                  </ul>
                </p>
                {rental.initiator?._id === JSON.parse(localStorage.getItem("user"))?._id &&
                  rental.status === "open" && (
                    <button
                      className="btn btn-danger"
                      onClick={() => handleCancel(rental._id)}
                    >
                      Cancel Rental
                    </button>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRentals;