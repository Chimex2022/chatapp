import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "https://chatapp-production-d8dd.up.railway.app/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  // Check if the user is authenticated
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.error("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Signup function
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Signup successful!");
      get().connectSocket();
    } catch (error) {
      console.error("Error in signup:", error);
      toast.error("Signup failed!");
    } finally {
      set({ isSigningUp: false });
    }
  },

  // Login function
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Login successful!");
      get().connectSocket();
    } catch (error) {
      console.error("Error in login:", error);
      toast.error("Login failed!");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // Logout function
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully!");
      get().disconnectSocket();
    } catch (error) {
      console.error("Error in logout:", error);
      toast.error("Logout failed!");
    }
  },

  // Update user profile
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error in updateProfile:", error);
      toast.error("Profile update failed!");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // Connect to socket server
  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser || socket) return;

    const newSocket = io(BASE_URL, {
      query: { userId: authUser._id },
    });

    newSocket.on("connect", () => {
      console.log("Socket connected!");
    });

    newSocket.on("onlineUsers", (users) => {
      set({ onlineUsers: users });
    });

    set({ socket: newSocket });
  },

  // Disconnect socket server
  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, onlineUsers: [] });
    }
  },
}));
