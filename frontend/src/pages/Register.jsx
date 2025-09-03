import { useState } from "react";
import api from "../api/axios";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", gender: "male" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      alert("Registration successful!");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg p-6 rounded-xl w-80">
        <h1 className="text-xl font-bold mb-4">Register</h1>
        <input name="name" placeholder="Name" onChange={handleChange} className="border p-2 w-full mb-2" />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} className="border p-2 w-full mb-2" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="border p-2 w-full mb-2" />
        <select name="gender" onChange={handleChange} className="border p-2 w-full mb-4">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <button className="bg-blue-500 text-white w-full py-2 rounded-lg">Register</button>
      </form>
    </div>
  );
}
