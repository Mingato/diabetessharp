import express, { type Express } from "express";
import type { Server } from "http";
import { createServer as createViteServer } from "vite";
import path from "node:path";
import fs from "node:fs";

// process.cwd() = raiz do projeto (onde npm run dev/start é executado)
const PROJECT_ROOT = process.cwd();

export async function setupVite(app: Express, _server: Server): Promise<void> {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
}

/**
 * Injeta HWS_AUTH_URL no HTML (mesmo padrão do hws-ed-web-app).
 * Sempre adiciona o script antes de </head> — o último valor prevalece.
 */
function injectRuntimeEnv(html: string): string {
  const hwsAuthUrl = process.env.HWS_AUTH_URL || "http://localhost:3000";
  const envScript = `<script>window.HWS_AUTH_URL=${JSON.stringify(hwsAuthUrl)};</script>`;
  return html.replace("</head>", `${envScript}</head>`);
}

export function serveStatic(app: Express): void {
  const distPath = path.join(PROJECT_ROOT, "dist", "public");
  if (!fs.existsSync(distPath)) {
    console.warn("[Vite] dist/public not found. Run `npm run build` first.");
    return;
  }
  app.use(express.static(distPath, { index: false }));
  // SPA fallback: serve index.html para rotas não-API, injeta HWS_AUTH_URL
  app.get("*", (_req, res) => {
    const indexPath = path.join(distPath, "index.html");
    const html = fs.readFileSync(indexPath, "utf-8");
    res.setHeader("Content-Type", "text/html");
    res.send(injectRuntimeEnv(html));
  });
}
