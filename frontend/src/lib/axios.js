import axios from "axios";

const API_DOMAIN = import.meta.env.MODE === "development" ? "http://localhost:5001" : "https://chatapp-production-d8dd.up.railway.app";

export const axiosInstance = axios.create({
  baseURL: API_DOMAIN,
  headers: {
    "Content-Type": "application/json",
  }
});
