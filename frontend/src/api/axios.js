import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // your backend base
  withCredentials: true, // if you are using cookies for auth
});

export default api;
