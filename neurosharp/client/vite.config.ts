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
      const envScript = `<script>window.HWS_AUTH_URL='${hwsAuthUrl}';</script>`;
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
  server: {
    port: 3000,
    open: true,
    proxy: {
      "/trpc": { target: "http://localhost:4000", changeOrigin: true },
      "/api": { target: "http://localhost:4000", changeOrigin: true },
    },
  },
};
});
