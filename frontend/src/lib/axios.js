import axios from "axios";

export const axiosInstance = axios.create({
  BASE_URL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "https://chatapp-1-t4fn.onrender.com/api",
  withCredentials: true,
});
