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

// Optionally, set up interceptors for request and response
axiosInstance.interceptors.response.use(
  (response) => response, // Successful response
  (error) => {
    // Handle errors globally
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);
