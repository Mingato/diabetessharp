import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { loadEnv } from "vite";

function vitePluginHwsAuthEnv() {
  return {
    name: "hws-auth-env",
    transformIndexHtml(html: string) {
      const hwsAuthUrl = process.env.HWS_AUTH_URL || "http://localhost:3000";
      const script = `<script>window.HWS_AUTH_URL=${JSON.stringify(hwsAuthUrl)};</script>`;
      return html.replace("</head>", `${script}</head>`);
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
