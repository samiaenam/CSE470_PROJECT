import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await API.get("/auth/profile");
        setUser(res.data);
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || err.message);
      }
    };
    loadProfile();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="col-md-6 offset-md-3">
      <h3>Profile</h3>
      <ul className="list-group mb-3">
        <li className="list-group-item"><strong>Name:</strong> {user.name}</li>
        <li className="list-group-item"><strong>Email:</strong> {user.email}</li>
        <li className="list-group-item"><strong>Phone:</strong> {user.phone}</li>
        <li className="list-group-item"><strong>Gender:</strong> {user.gender}</li>
        <li className="list-group-item"><strong>Role:</strong> {user.role}</li>
      </ul>

      <Link className="btn btn-primary" to="/profile/update">
        Update Profile
      </Link>
    </div>
  );
}
