import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

function vitePluginClientEnv() {
  return {
    name: "client-env",
    transformIndexHtml(html: string) {
      const clientEnv = {
        HWS_AUTH_URL: process.env.HWS_AUTH_URL || "http://localhost:3000",
        APP_URL: process.env.APP_URL || process.env.CLIENT_URL || "http://localhost:3002",
      };
      const script = `<script>window.__ENV__=${JSON.stringify(clientEnv)};</script>`;
      html = html.replace(/<script>window\.__ENV__=[^<]*<\/script>/, script);
      if (!html.includes("window.__ENV__")) html = html.replace("</head>", `${script}</head>`);
      return html;
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), vitePluginClientEnv()],
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
