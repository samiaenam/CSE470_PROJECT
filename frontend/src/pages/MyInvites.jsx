// import React, { useEffect, useState } from "react";
// import API from "../services/api";

// export default function MyInvites() {
//   const [invites, setInvites] = useState([]);

//   const loadInvites = async () => {
//     try {
//       const res = await API.get("/trips/my-invites");
//       setInvites(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const respond = async (tripId, status) => {
//     let pickupLocation = "";
//     if (status === "accepted") {
//       pickupLocation = prompt("Enter your pickup location:");
//     }
//     try {
//       await API.post(`/trips/${tripId}/respond`, { status, pickupLocation });
//       loadInvites();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     loadInvites();
//   }, []);

//   return (
//     <div className="container mt-4">
//       <h2>My Invites</h2>
//       <ul className="list-group">
//         {invites.map(invite => (
//           <li key={invite._id} className="list-group-item">
//             <b>{invite.trip.destination}</b> on {invite.trip.date}
//             <br />
//             Status: {invite.status}
//             <div className="mt-2">
//               <button
//                 className="btn btn-success btn-sm me-2"
//                 onClick={() => respond(invite.trip._id, "accepted")}
//               >
//                 Accept
//               </button>
//               <button
//                 className="btn btn-danger btn-sm"
//                 onClick={() => respond(invite.trip._id, "declined")}
//               >
//                 Decline
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
