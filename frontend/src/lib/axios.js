import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://chatapp-1-t4fn.onrender.com/api",
  withCredentials: true,
});
