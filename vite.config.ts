import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

/** Injeta HWS_AUTH_URL no client (mesmo padrão do hws-ed-web-app) */
function vitePluginHwsAuthEnv() {
  return {
    name: "hws-auth-env",
    buildStart() {
      if (process.env.NODE_ENV === "production" && !process.env.HWS_AUTH_URL?.trim()) {
        throw new Error(
          "HWS_AUTH_URL deve estar definida no ambiente de build para deploy em produção. " +
            "Em deploy estático (sem server), o client usa o valor injetado no build. " +
            "Configure a variável antes de rodar 'npm run build'."
        );
      }
    },
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
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@server": path.resolve(import.meta.dirname, "server"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    sourcemap: false,
    minify: "esbuild",
    rollupOptions: {
      output: {
        entryFileNames: "assets/[hash].js",
        chunkFileNames: "assets/[hash].js",
        assetFileNames: "assets/[hash].[ext]",
        compact: true,
      },
    },
  },
  server: {
    host: true,
    allowedHosts: [
      ".helping-you-works-smarter.com",
      "localhost",
      "127.0.0.1",
    ],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
