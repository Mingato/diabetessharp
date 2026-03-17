import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  appType: "spa",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@server": path.resolve(__dirname, "../server/src"),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      "/trpc": { target: "http://localhost:4000", changeOrigin: true },
      "/api": { target: "http://localhost:4000", changeOrigin: true },
    },
  },
});
