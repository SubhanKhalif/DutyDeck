import axios from "axios";

// fallback to localhost:5000 if env variable is not defined
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

export default API;
