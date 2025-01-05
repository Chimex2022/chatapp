import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://chatapp-production-d8dd.up.railway.app/",
  headers: {
    "Content-Type": "application/json",
  }
});
