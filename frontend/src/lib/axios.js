import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://chatapp-backend-taupe.vercel.app/",
  withCredentials: true,
});
