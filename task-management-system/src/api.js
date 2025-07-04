import axios from "axios";

const API = axios.create({
  baseURL:import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api", //import.meta.env.VITE_API_BASE_URL ||
});

export default API;