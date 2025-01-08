import axios from "axios";

// Configure API domain based on environment
const API_DOMAIN = "https://chatapp-production-d8dd.up.railway.app";

// Create Axios instance with default configurations
export const axiosInstance = axios.create({
  baseURL: API_DOMAIN,
  headers: {
    "Content-Type": "application/json",
  },
});


