import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

/** Injeta HWS_AUTH_URL no client (mesmo padrão do hws-ed-web-app) */
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

export default defineConfig({
  plugins: [vitePluginHwsAuthEnv(), react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client/src"),
      "@server": path.resolve(import.meta.dirname, "server"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client/public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    host: true,
  },
});
