import { useState } from "react";
import api from "../api/axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token); // store JWT
      alert("Login successful!");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg p-6 rounded-xl w-80">
        <h1 className="text-xl font-bold mb-4">Login</h1>
        <input name="email" type="email" placeholder="Email" onChange={handleChange} className="border p-2 w-full mb-2" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="border p-2 w-full mb-4" />
        <button className="bg-green-500 text-white w-full py-2 rounded-lg">Login</button>
      </form>
    </div>
  );
}
