import axios from "axios";

const API = axios.create({
  baseURL: "https://dutydeck-1.onrender.com/api", //import.meta.env.VITE_API_BASE_URL ||
});

export default API;
