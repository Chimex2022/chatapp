import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(() => {
  const isProduction = import.meta.env.MODE === "production";

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: isProduction
            ? "https://chatapp-production-d8dd.up.railway.app"
            : "http://localhost:5000",
          changeOrigin: true, // Ensures proper CORS handling
          secure: true, // Use HTTPS if Railway URL supports it
        },
      },
    },
  };
});
