import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";


const BASE_URL = "https://chatapp-production-d8dd.up.railway.app/api";


export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      // Make API call to check authentication
      const res = await axiosInstance.get("/auth/check");
      
      // Update state with authenticated user
      set({ authUser: res.data });
  
      // Connect socket if authentication is successful
      get().connectSocket();
    } catch (error) {
      console.error("Error in checkAuth:", error.response?.data?.message || error.message);
      
      // Reset authenticated user to null on error
      set({ authUser: null });
    } finally {
      // Indicate that authentication check is complete
      set({ isCheckingAuth: false });
    }
  },
  
  signup: async (data) => {
    // Indicate signing-up process has started
    set({ isSigningUp: true });
  
    try {
      // Make API call to signup with the correct base URL
      const res = await axiosInstance.post("/auth/signup", data);
  
      // Update state with newly signed-up user
      set({ authUser: res.data });
  
      // Notify the user of successful account creation
      toast.success("Account created successfully");
  
      // Connect socket after successful signup
      get().connectSocket();
    } catch (error) {
      // Handle error gracefully
      let errorMessage = "An error occurred during signup"; // Default fallback message

      if (error?.response) {
        if (error.response.status === 500) {
          errorMessage = "Internal Server Error. Please try again later.";
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }
  
      // Display error message to the user
      toast.error(errorMessage);
  
      // Optionally, log the error for debugging (more detailed for developers)
      console.error("Error in signup:", errorMessage);
    } finally {
      // Indicate that signing-up process has ended
      set({ isSigningUp: false });
    }
  },
  
  

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));