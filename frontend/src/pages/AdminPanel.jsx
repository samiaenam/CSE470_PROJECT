
// import { useEffect, useState } from "react";
// import axios from "axios";

// const API_URL = "http://localhost:5000/api/admin/rides";

// const AdminPanel = () => {
//   const [rides, setRides] = useState([]);
//   const [newRide, setNewRide] = useState({
//     routeName: "",
//     pickupLocations: "",
//     dropoffLocations: "",
//     totalSeats: "",
//     times: "",
//     femaleOnly: false,
//   });

//   const [editRide, setEditRide] = useState(null);
//   const [pickupInput, setPickupInput] = useState("");
//   const [dropInput, setDropInput] = useState("");

//   // Attach token if present
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//   }, []);

//   const fetchRides = async () => {
//     try {
//       const res = await axios.get(API_URL);
//       setRides(res.data || []);
//     } catch (err) {
//       console.error("Error fetching rides:", err);
//     }
//   };

//   useEffect(() => {
//     fetchRides();
//   }, []);

//   const toArray = (csv) =>
//     csv
//       .split(",")
//       .map((s) => s.trim())
//       .filter(Boolean);

//   // Create ride
//   const handleCreateRide = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = {
//         routeName: newRide.routeName,
//         pickupLocations: toArray(newRide.pickupLocations),
//         dropoffLocations: toArray(newRide.dropoffLocations),
//         totalSeats: Number(newRide.totalSeats),
//         times: toArray(newRide.times),
//         femaleOnly: !!newRide.femaleOnly,
//       };

//       await axios.post(API_URL, payload);

//       setNewRide({
//         routeName: "",
//         pickupLocations: "",
//         dropoffLocations: "",
//         totalSeats: "",
//         times: "",
//         femaleOnly: false,
//       });

//       fetchRides();
//     } catch (err) {
//       console.error("Error creating ride:", err);
//       alert(err.response?.data?.message || "Failed to create ride");
//     }
//   };

//   // Delete ride
//   const handleDeleteRide = async (id) => {
//     if (!window.confirm("Delete this ride?")) return;
//     try {
//       await axios.delete(`${API_URL}/${id}`);
//       fetchRides();
//     } catch (err) {
//       console.error("Error deleting ride:", err);
//     }
//   };

//   // Enable editing
//   const handleEdit = (ride) => {
//     setEditRide({ ...ride });
//   };

//   // Save updated ride
//   const handleUpdateRide = async () => {
//     try {
//       const payload = {
//         routeName: editRide.routeName,
//         totalSeats: Number(editRide.totalSeats),
//         times: Array.isArray(editRide.times)
//           ? editRide.times
//           : toArray(editRide.times || ""),
//         pickupLocations: Array.isArray(editRide.pickupLocations)
//           ? editRide.pickupLocations
//           : toArray(editRide.pickupLocations || ""),
//         dropoffLocations: Array.isArray(editRide.dropoffLocations)
//           ? editRide.dropoffLocations
//           : toArray(editRide.dropoffLocations || ""),
//         femaleOnly: !!editRide.femaleOnly,
//       };

//       await axios.put(`${API_URL}/${editRide._id}`, payload);
//       setEditRide(null);
//       fetchRides();
//     } catch (err) {
//       console.error("Error updating ride:", err);
//       alert(err.response?.data?.message || "Failed to update ride");
//     }
//   };

//   // Add pickup location
//   const handleAddPickup = async (id) => {
//     if (!pickupInput.trim()) return;
//     try {
//       await axios.post(`${API_URL}/${id}/pickup`, { location: pickupInput.trim() });
//       setPickupInput("");
//       fetchRides();
//     } catch (err) {
//       console.error("Error adding pickup:", err);
//     }
//   };

//   // Remove pickup location
//   const handleRemovePickup = async (id, location) => {
//     try {
//       await axios.delete(`${API_URL}/${id}/pickup`, { data: { location } });
//       fetchRides();
//     } catch (err) {
//       console.error("Error removing pickup:", err);
//     }
//   };

//   // Add dropoff location
//   const handleAddDrop = async (id) => {
//     if (!dropInput.trim()) return;
//     try {
//       await axios.post(`${API_URL}/${id}/dropoff`, { location: dropInput.trim() });
//       setDropInput("");
//       fetchRides();
//     } catch (err) {
//       console.error("Error adding drop-off:", err);
//     }
//   };

//   // Remove dropoff location
//   const handleRemoveDrop = async (id, location) => {
//     try {
//       await axios.delete(`${API_URL}/${id}/dropoff`, { data: { location } });
//       fetchRides();
//     } catch (err) {
//       console.error("Error removing drop-off:", err);
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h2>Admin Panel – Manage Rides</h2>

//       {/* Create ride form */}
//       <form className="mb-4" onSubmit={handleCreateRide}>
//         <h4>Create New Ride</h4>

//         <input
//           type="text"
//           placeholder="Route Name"
//           className="form-control mb-2"
//           value={newRide.routeName}
//           onChange={(e) => setNewRide({ ...newRide, routeName: e.target.value })}
//           required
//         />

//         <input
//           type="text"
//           placeholder="Pickup Locations (comma separated)"
//           className="form-control mb-2"
//           value={newRide.pickupLocations}
//           onChange={(e) => setNewRide({ ...newRide, pickupLocations: e.target.value })}
//           required
//         />

//         <input
//           type="text"
//           placeholder="Drop-off Locations (comma separated)"
//           className="form-control mb-2"
//           value={newRide.dropoffLocations}
//           onChange={(e) => setNewRide({ ...newRide, dropoffLocations: e.target.value })}
//           required
//         />

//         <input
//           type="number"
//           min="1"
//           placeholder="Total Seats"
//           className="form-control mb-2"
//           value={newRide.totalSeats}
//           onChange={(e) => setNewRide({ ...newRide, totalSeats: e.target.value })}
//           required
//         />

//         <input
//           type="text"
//           placeholder="Times (comma separated e.g. 07:00, 09:00)"
//           className="form-control mb-2"
//           value={newRide.times}
//           onChange={(e) => setNewRide({ ...newRide, times: e.target.value })}
//           required
//         />

//         <div className="form-check mb-3">
//           <input
//             className="form-check-input"
//             type="checkbox"
//             id="femaleOnly"
//             checked={newRide.femaleOnly}
//             onChange={(e) => setNewRide({ ...newRide, femaleOnly: e.target.checked })}
//           />
//           <label className="form-check-label" htmlFor="femaleOnly">
//             Female-only ride
//           </label>
//         </div>

//         <button type="submit" className="btn btn-primary">Create Ride</button>
//       </form>

//       {/* Rides list */}
//       <h4>All Rides</h4>
//       {rides.length === 0 ? (
//         <p>No rides available</p>
//       ) : (
//         <table className="table">
//           <thead>
//             <tr>
//               <th>Route</th>
//               <th>Pickup Locations</th>
//               <th>Drop-off Locations</th>
//               <th>Total Seats</th>
//               <th>Times</th>
//               <th>Female Only</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rides.map((ride) => (
//               <tr key={ride._id}>
//                 <td>
//                   {editRide && editRide._id === ride._id ? (
//                     <input
//                       value={editRide.routeName}
//                       onChange={(e) => setEditRide({ ...editRide, routeName: e.target.value })}
//                     />
//                   ) : (
//                     ride.routeName
//                   )}
//                 </td>

//                 {/* Pickup Locations */}
//                 <td style={{ maxWidth: 320 }}>
//                   <div className="mb-2">
//                     {(editRide && editRide._id === ride._id ? editRide.pickupLocations : ride.pickupLocations)
//                       .map((p, idx) => (
//                         <span key={idx} className="badge bg-secondary m-1">
//                           {p}{" "}
//                           <button
//                             className="btn btn-sm btn-light"
//                             type="button"
//                             onClick={() => handleRemovePickup(ride._id, p)}
//                           >
//                             ×
//                           </button>
//                         </span>
//                       ))}
//                   </div>
//                   <div className="d-flex gap-2">
//                     <input
//                       type="text"
//                       placeholder="Add pickup"
//                       className="form-control"
//                       value={pickupInput}
//                       onChange={(e) => setPickupInput(e.target.value)}
//                     />
//                     <button
//                       className="btn btn-sm btn-outline-primary"
//                       type="button"
//                       onClick={() => handleAddPickup(ride._id)}
//                     >
//                       Add
//                     </button>
//                   </div>
//                 </td>

//                 {/* Dropoff Locations */}
//                 <td style={{ maxWidth: 320 }}>
//                   <div className="mb-2">
//                     {(editRide && editRide._id === ride._id ? editRide.dropoffLocations : ride.dropoffLocations)
//                       .map((d, idx) => (
//                         <span key={idx} className="badge bg-info m-1">
//                           {d}{" "}
//                           <button
//                             className="btn btn-sm btn-light"
//                             type="button"
//                             onClick={() => handleRemoveDrop(ride._id, d)}
//                           >
//                             ×
//                           </button>
//                         </span>
//                       ))}
//                   </div>
//                   <div className="d-flex gap-2">
//                     <input
//                       type="text"
//                       placeholder="Add drop"
//                       className="form-control"
//                       value={dropInput}
//                       onChange={(e) => setDropInput(e.target.value)}
//                     />
//                     <button
//                       className="btn btn-sm btn-outline-primary"
//                       type="button"
//                       onClick={() => handleAddDrop(ride._id)}
//                     >
//                       Add
//                     </button>
//                   </div>
//                 </td>

//                 {/* Seats */}
//                 <td>
//                   {editRide && editRide._id === ride._id ? (
//                     <input
//                       type="number"
//                       min="1"
//                       value={editRide.totalSeats}
//                       onChange={(e) => setEditRide({ ...editRide, totalSeats: e.target.value })}
//                     />
//                   ) : (
//                     ride.totalSeats
//                   )}
//                 </td>

//                 {/* Times */}
//                 <td style={{ maxWidth: 220 }}>
//                   {editRide && editRide._id === ride._id ? (
//                     <input
//                       value={Array.isArray(editRide.times) ? editRide.times.join(", ") : editRide.times}
//                       onChange={(e) => setEditRide({ ...editRide, times: e.target.value })}
//                     />
//                   ) : (
//                     (ride.times || []).join(", ")
//                   )}
//                 </td>

//                 {/* Female Only */}
//                 <td>
//                   {editRide && editRide._id === ride._id ? (
//                     <input
//                       type="checkbox"
//                       checked={!!editRide.femaleOnly}
//                       onChange={(e) => setEditRide({ ...editRide, femaleOnly: e.target.checked })}
//                     />
//                   ) : ride.femaleOnly ? "Yes" : "No"}
//                 </td>

//                 {/* Actions */}
//                 <td>
//                   {editRide && editRide._id === ride._id ? (
//                     <>
//                       <button className="btn btn-success btn-sm me-2" onClick={handleUpdateRide}>
//                         Save
//                       </button>
//                       <button className="btn btn-secondary btn-sm" onClick={() => setEditRide(null)}>
//                         Cancel
//                       </button>
//                     </>
//                   ) : (
//                     <>
//                       <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(ride)}>
//                         Edit
//                       </button>
//                       <button className="btn btn-danger btn-sm" onClick={() => handleDeleteRide(ride._id)}>
//                         Delete
//                       </button>
//                     </>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default AdminPanel;
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/admin/rides";

const AdminPanel = () => {
  const [rides, setRides] = useState([]);
  const [newRide, setNewRide] = useState({
    routeName: "",
    pickupLocations: "",
    dropoffLocations: "",
    totalSeats: "",
    times: "",
    femaleOnly: false,
  });
  const [editRide, setEditRide] = useState(null);
  const [pickupInput, setPickupInput] = useState("");
  const [dropInput, setDropInput] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      const res = await axios.get(API_URL);
      setRides(res.data || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch rides. Please try again.");
      console.error("Error fetching rides:", err);
    }
  };

  const toArray = (csv) =>
    csv.split(",").map((s) => s.trim()).filter(Boolean);

  const handleCreateRide = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        routeName: newRide.routeName.trim(),
        pickupLocations: toArray(newRide.pickupLocations),
        dropoffLocations: toArray(newRide.dropoffLocations),
        totalSeats: Number(newRide.totalSeats),
        times: toArray(newRide.times),
        femaleOnly: !!newRide.femaleOnly,
      };

      if (!payload.routeName || payload.pickupLocations.length === 0 || payload.dropoffLocations.length === 0 ||
          isNaN(payload.totalSeats) || payload.totalSeats <= 0 || payload.times.length === 0) {
        setError("All fields are required and must be valid.");
        return;
      }

      await axios.post(API_URL, payload);
      setNewRide({
        routeName: "",
        pickupLocations: "",
        dropoffLocations: "",
        totalSeats: "",
        times: "",
        femaleOnly: false,
      });
      fetchRides();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create ride");
      console.error("Error creating ride:", err);
    }
  };

  const handleDeleteRide = async (id) => {
    if (!window.confirm("Delete this ride?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchRides();
    } catch (err) {
      setError("Failed to delete ride");
      console.error("Error deleting ride:", err);
    }
  };

  const handleEdit = (ride) => {
    setEditRide({ ...ride, times: ride.times.join(", "), pickupLocations: ride.pickupLocations.join(", "), dropoffLocations: ride.dropoffLocations.join(", ") });
  };

  const handleUpdateRide = async () => {
    try {
      const payload = {
        routeName: editRide.routeName.trim(),
        totalSeats: Number(editRide.totalSeats),
        times: toArray(editRide.times),
        pickupLocations: toArray(editRide.pickupLocations),
        dropoffLocations: toArray(editRide.dropoffLocations),
        femaleOnly: !!editRide.femaleOnly,
      };

      if (!payload.routeName || payload.pickupLocations.length === 0 || payload.dropoffLocations.length === 0 ||
          isNaN(payload.totalSeats) || payload.totalSeats <= 0 || payload.times.length === 0) {
        setError("All fields are required and must be valid.");
        return;
      }

      await axios.put(`${API_URL}/${editRide._id}`, payload);
      setEditRide(null);
      fetchRides();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update ride");
      console.error("Error updating ride:", err);
    }
  };

  const handleAddPickup = async (id) => {
    if (!pickupInput.trim()) return;
    try {
      await axios.post(`${API_URL}/${id}/pickup`, { location: pickupInput.trim() });
      setPickupInput("");
      fetchRides();
    } catch (err) {
      setError("Failed to add pickup location");
      console.error("Error adding pickup:", err);
    }
  };

  const handleRemovePickup = async (id, location) => {
    try {
      await axios.delete(`${API_URL}/${id}/pickup`, { data: { location } });
      fetchRides();
    } catch (err) {
      setError("Failed to remove pickup location");
      console.error("Error removing pickup:", err);
    }
  };

  const handleAddDrop = async (id) => {
    if (!dropInput.trim()) return;
    try {
      await axios.post(`${API_URL}/${id}/dropoff`, { location: dropInput.trim() });
      setDropInput("");
      fetchRides();
    } catch (err) {
      setError("Failed to add drop-off location");
      console.error("Error adding drop-off:", err);
    }
  };

  const handleRemoveDrop = async (id, location) => {
    try {
      await axios.delete(`${API_URL}/${id}/dropoff`, { data: { location } });
      fetchRides();
    } catch (err) {
      setError("Failed to remove drop-off location");
      console.error("Error removing drop-off:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Admin Panel – Manage Rides</h2>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

      <form className="mb-4" onSubmit={handleCreateRide}>
        <h4>Create New Ride</h4>
        <div className="row g-2">
          <div className="col-md-6">
            <input
              type="text"
              placeholder="Route Name"
              className="form-control mb-2"
              value={newRide.routeName}
              onChange={(e) => setNewRide({ ...newRide, routeName: e.target.value })}
              required
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              placeholder="Pickup Locations (comma separated)"
              className="form-control mb-2"
              value={newRide.pickupLocations}
              onChange={(e) => setNewRide({ ...newRide, pickupLocations: e.target.value })}
              required
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              placeholder="Drop-off Locations (comma separated)"
              className="form-control mb-2"
              value={newRide.dropoffLocations}
              onChange={(e) => setNewRide({ ...newRide, dropoffLocations: e.target.value })}
              required
            />
          </div>
          <div className="col-md-6">
            <input
              type="number"
              min="1"
              placeholder="Total Seats"
              className="form-control mb-2"
              value={newRide.totalSeats}
              onChange={(e) => setNewRide({ ...newRide, totalSeats: e.target.value })}
              required
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              placeholder="Times (comma separated e.g. 07:00, 09:00)"
              className="form-control mb-2"
              value={newRide.times}
              onChange={(e) => setNewRide({ ...newRide, times: e.target.value })}
              required
            />
          </div>
          <div className="col-md-6">
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="femaleOnly"
                checked={newRide.femaleOnly}
                onChange={(e) => setNewRide({ ...newRide, femaleOnly: e.target.checked })}
              />
              <label className="form-check-label" htmlFor="femaleOnly">Female-only ride</label>
            </div>
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary">Create Ride</button>
          </div>
        </div>
      </form>

      <h4>All Rides</h4>
      {rides.length === 0 ? (
        <p>No rides available</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Route</th>
              <th>Pickup Locations</th>
              <th>Drop-off Locations</th>
              <th>Total Seats</th>
              <th>Times</th>
              <th>Female Only</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rides.map((ride) => (
              <tr key={ride._id}>
                <td>
                  {editRide && editRide._id === ride._id ? (
                    <input
                      value={editRide.routeName}
                      onChange={(e) => setEditRide({ ...editRide, routeName: e.target.value })}
                      className="form-control"
                    />
                  ) : (
                    ride.routeName
                  )}
                </td>
                <td style={{ maxWidth: 320 }}>
                  <div className="mb-2">
                    {(editRide && editRide._id === ride._id ? editRide.pickupLocations.split(", ") : ride.pickupLocations)
                      .map((p, idx) => (
                        <span key={idx} className="badge bg-secondary m-1">
                          {p}{" "}
                          <button
                            className="btn btn-sm btn-light"
                            type="button"
                            onClick={() => handleRemovePickup(ride._id, p)}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                  </div>
                  <div className="d-flex gap-2">
                    <input
                      type="text"
                      placeholder="Add pickup"
                      className="form-control"
                      value={pickupInput}
                      onChange={(e) => setPickupInput(e.target.value)}
                    />
                    <button
                      className="btn btn-sm btn-outline-primary"
                      type="button"
                      onClick={() => handleAddPickup(ride._id)}
                    >
                      Add
                    </button>
                  </div>
                </td>
                <td style={{ maxWidth: 320 }}>
                  <div className="mb-2">
                    {(editRide && editRide._id === ride._id ? editRide.dropoffLocations.split(", ") : ride.dropoffLocations)
                      .map((d, idx) => (
                        <span key={idx} className="badge bg-info m-1">
                          {d}{" "}
                          <button
                            className="btn btn-sm btn-light"
                            type="button"
                            onClick={() => handleRemoveDrop(ride._id, d)}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                  </div>
                  <div className="d-flex gap-2">
                    <input
                      type="text"
                      placeholder="Add drop"
                      className="form-control"
                      value={dropInput}
                      onChange={(e) => setDropInput(e.target.value)}
                    />
                    <button
                      className="btn btn-sm btn-outline-primary"
                      type="button"
                      onClick={() => handleAddDrop(ride._id)}
                    >
                      Add
                    </button>
                  </div>
                </td>
                <td>
                  {editRide && editRide._id === ride._id ? (
                    <input
                      type="number"
                      min="1"
                      value={editRide.totalSeats}
                      onChange={(e) => setEditRide({ ...editRide, totalSeats: e.target.value })}
                      className="form-control"
                    />
                  ) : (
                    ride.totalSeats
                  )}
                </td>
                <td style={{ maxWidth: 220 }}>
                  {editRide && editRide._id === ride._id ? (
                    <input
                      value={editRide.times}
                      onChange={(e) => setEditRide({ ...editRide, times: e.target.value })}
                      className="form-control"
                    />
                  ) : (
                    (ride.times || []).join(", ")
                  )}
                </td>
                <td>
                  {editRide && editRide._id === ride._id ? (
                    <input
                      type="checkbox"
                      checked={!!editRide.femaleOnly}
                      onChange={(e) => setEditRide({ ...editRide, femaleOnly: e.target.checked })}
                    />
                  ) : ride.femaleOnly ? "Yes" : "No"}
                </td>
                <td>
                  {editRide && editRide._id === ride._id ? (
                    <>
                      <button className="btn btn-success btn-sm me-2" onClick={handleUpdateRide}>
                        Save
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => setEditRide(null)}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(ride)}>
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteRide(ride._id)}>
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPanel;