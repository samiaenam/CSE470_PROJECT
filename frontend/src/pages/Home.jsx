// import React from "react";
// import { Link } from "react-router-dom";

// export default function Home() {
//   return (
//     <div className="container text-center mt-5">
//       <h1 className="mb-4">Welcome to CarpoolApp 🚗</h1>
//       <p className="lead mb-5">
//         Plan trips, share rides, rent vehicles, and travel smarter with friends.
//       </p>

//       <div className="d-flex justify-content-center gap-3">
//         <Link to="/carpool" className="btn btn-primary btn-lg">
//           Find a Carpool
//         </Link>
//         <Link to="/rental" className="btn btn-success btn-lg">
//           Rent a Vehicle
//         </Link>
//       </div>
//     </div>
//   );
// }
// src/pages/Home.jsx
import React from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <Container className="text-center mt-5">
      <h1>Welcome to CarpoolApp 🚗</h1>
      <p className="lead mt-3">
        Share rides, book carpools, or rent vehicles easily.
      </p>
      <div className="mt-4">
        <Button as={Link} to="/carpool" variant="primary" className="me-3">
          Find Carpool
        </Button>
        <Button as={Link} to="/rental" variant="success">
          Rent a Vehicle
        </Button>
      </div>
    </Container>
  );
}
