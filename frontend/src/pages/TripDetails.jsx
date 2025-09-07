// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import API from "../services/api";

// export default function TripDetails() {
//   const { id } = useParams();
//   const [trip, setTrip] = useState(null);

//   useEffect(() => {
//     API.get(`/trips/${id}`)
//       .then(res => setTrip(res.data))
//       .catch(err => console.error(err));
//   }, [id]);

//   if (!trip) return <p>Loading...</p>;

//   return (
//     <div className="container mt-4">
//       <h2>Trip to {trip.destination}</h2>
//       <p><b>Date:</b> {trip.date}</p>
//       <p><b>Created By:</b> {trip.createdBy?.name}</p>

//       <h4>Vehicle</h4>
//       <p>
//         {trip.vehicle?.name} ({trip.vehicle?.licensePlate}) – Capacity: {trip.vehicle?.capacity}
//       </p>

//       <h4>Pickup Locations</h4>
//       <ul>
//         {trip.pickupLocations.map(p => (
//           <li key={p._id}>
//             {p.user?.name}: {p.location}
//           </li>
//         ))}
//       </ul>

//       <h4>Invited Friends</h4>
//       <ul>
//         {trip.invitedFriends.map(f => (
//           <li key={f._id}>
//             {f.friend?.name || "Unknown"} – {f.status}
//             {f.pickupLocation && ` (Pickup: ${f.pickupLocation})`}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";

export default function TripDetails() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);

  const loadTrip = async () => {
    try {
      const res = await API.get(`/trips/${id}`);
      setTrip(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Cannot load trip");
    }
  };

  useEffect(() => {
    loadTrip();
  }, [id]);

  if (!trip) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h2>Trip to {trip.destination}</h2>
      <p><b>Date:</b> {trip.date}</p>
      <p><b>Created By:</b> {trip.createdBy?.name}</p>

      <h4>Vehicle</h4>
      <p>
        {trip.vehicle?.name} ({trip.vehicle?.licensePlate}) – Seats: {trip.vehicle?.seats}
      </p>

      <h4>Pickup Locations</h4>
      <ul>
        {trip.pickupLocations.map((p, idx) => (
          <li key={idx}>
            {p.user?.name}: {p.location}
          </li>
        ))}
      </ul>

      <h4>Invited Friends</h4>
      <ul>
        {trip.invitedFriends.map((f, idx) => (
          <li key={idx}>
            {f.friend?.name || "Unknown"} – {f.status}
            {f.pickupLocation && ` (Pickup: ${f.pickupLocation})`}
          </li>
        ))}
      </ul>
    </div>
  );
}
