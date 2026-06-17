
//updated axios.ts file
// this automatically injects JWT for admin routes
// Import axios library (HTTP client)
import axios from "axios";

//Creates a custom axios instance
//All requests automatically start with:  http://localhost:5000/api
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});


//Runs before every request
api.interceptors.request.use((config) => {
  //Reads JWT token saved after login
  const token = localStorage.getItem("token");
  //Automatically attaches: Authorization: Bearer <JWT_TOKEN>
  // Bearere Token required for admin only
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;