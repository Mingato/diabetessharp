import express, { type Express } from "express";
import type { Request } from "express";
import type { Server } from "http";
import { createServer as createViteServer } from "vite";
import path from "node:path";
import fs from "node:fs";

const PROJECT_ROOT = path.resolve(import.meta.dirname, "..");

export async function setupVite(app: Express, _server: Server): Promise<void> {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
}

/** Resolve HWS_AUTH_URL com fallback por domínio (igual refreshTokenRoute) */
function getHwsAuthUrlForInject(req?: Request): string {
  const fromEnv = process.env.HWS_AUTH_URL?.trim();
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === "production" && req) {
    const host = req.get?.("x-forwarded-host") || req.get?.("host") || "";
    if (host && host.includes("helping-you-works-smarter.com")) {
      return "https://auth.helping-you-works-smarter.com";
    }
  }
  return "http://localhost:3000";
}

function injectRuntimeEnv(html: string, req?: Request): string {
  const hwsAuthUrl = getHwsAuthUrlForInject(req);
  const envScript = `<script>window.HWS_AUTH_URL='${hwsAuthUrl}';</script>`;
  return html.replace("</head>", `${envScript}</head>`);
}

export function serveStatic(app: Express): void {
  // In dev: PROJECT_ROOT = project root. In prod: PROJECT_ROOT = dist/ (server runs from dist/server/)
  const distPath = path.join(PROJECT_ROOT, "public");
  if (!fs.existsSync(distPath)) {
    console.warn("[Vite] dist/public not found. Run `npm run build` first.");
    return;
  }
  app.use(express.static(distPath, { index: false }));
  // SPA fallback: serve index.html for non-API routes, inject HWS_AUTH_URL
  app.get("*", (req, res) => {
    const indexPath = path.join(distPath, "index.html");
    const html = fs.readFileSync(indexPath, "utf-8");
    res.setHeader("Content-Type", "text/html");
    res.send(injectRuntimeEnv(html, req));
  });
}
