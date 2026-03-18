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
 * Obtém HWS_AUTH_URL: env var ou fallback derivado do request (produção).
 * Em Docker/Nixpacks, a env pode não estar disponível no runtime — derivamos do Host.
 */
function getHwsAuthUrlForInjection(req?: { get?: (name: string) => string | undefined }): string {
  const fromEnv = process.env.HWS_AUTH_URL;
  if (fromEnv?.trim()) return fromEnv.trim();

  // Fallback em produção: deriva do request (trust proxy) ou APP_URL
  if (process.env.NODE_ENV === "production") {
    let appUrl = process.env.APP_URL || process.env.CLIENT_URL || "";
    if (req?.get) {
      const host = req.get("host") || req.get("x-forwarded-host");
      const proto = req.get("x-forwarded-proto") || "https";
      if (host) appUrl = appUrl || `${proto === "https" ? "https" : "http"}://${host}`;
    }
    if (appUrl) {
      try {
        const url = new URL(appUrl);
        if (url.hostname.includes("helping-you-works-smarter.com")) {
          return "https://auth.helping-you-works-smarter.com";
        }
      } catch {
        /* ignore */
      }
    }
  }
  return "http://localhost:3000";
}

/**
 * Injeta HWS_AUTH_URL no HTML (mesmo padrão do hws-ed-web-app).
 * Sempre adiciona o script antes de </head> — o último valor prevalece.
 */
function injectRuntimeEnv(html: string, req?: { get?: (name: string) => string | undefined }): string {
  const hwsAuthUrl = getHwsAuthUrlForInjection(req);
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
  // SPA fallback: serve index.html para rotas não-API, injeta HWS_AUTH_URL (usa req para fallback)
  app.get("*", (req, res) => {
    const indexPath = path.join(distPath, "index.html");
    const html = fs.readFileSync(indexPath, "utf-8");
    res.setHeader("Content-Type", "text/html");
    // Evita cache do HTML — garante que o usuário receba sempre o valor injetado atual
    res.send(injectRuntimeEnv(html, req));
  });
}
