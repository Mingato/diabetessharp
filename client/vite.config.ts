import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { loadEnv } from "vite";

function vitePluginHwsAuthEnv() {
  return {
    name: "hws-auth-env",
    transformIndexHtml(html: string) {
      // Load HWS_AUTH_URL at runtime from /api/config.js (server reads process.env)
      // so Railway/production env vars work instead of build-time only
      const envScript = `<script src="/api/config.js"></script>`;
      return html.replace("</head>", `${envScript}</head>`);
    },
  };
}

export default defineConfig(({ mode }) => {
  loadEnv(mode, path.resolve(__dirname, "../server"), "");
  return {
  appType: "spa",
  plugins: [react(), tailwindcss(), vitePluginHwsAuthEnv()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@server": path.resolve(__dirname, "../server/src"),
    },
  },
  build: {
    outDir: "../server/client-dist",
    emptyOutDir: true,
  },
  server: {
    port: 4001,
    strictPort: false,
    open: true,
    proxy: {
      "/trpc": { target: "http://localhost:3002", changeOrigin: true },
      "/api": { target: "http://localhost:3002", changeOrigin: true },
    },
  },
};
});
