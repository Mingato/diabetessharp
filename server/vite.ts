import express, { type Express } from "express";
import type { Server } from "http";
import path from "node:path";
import fs from "node:fs";

// process.cwd() = raiz do projeto (onde npm run dev/start é executado)
const PROJECT_ROOT = process.cwd();

export async function setupVite(app: Express, _server: Server): Promise<void> {
  // Import dinâmico — vite é devDependency, não disponível em produção
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
}

/**
 * Obtém HWS_AUTH_URL: env var, fallback por domínio conhecido, ou localhost.
 * Em produção no Railway, se HWS_AUTH_URL não estiver definida, derivamos do host.
 */
function getHwsAuthUrlForInjection(req?: express.Request): string {
  const fromEnv = process.env.HWS_AUTH_URL?.trim();
  if (fromEnv) return fromEnv;

  // Fallback em produção: domínio helping-you-works-smarter.com
  if (process.env.NODE_ENV === "production") {
    const host = req?.get?.("x-forwarded-host") || req?.get?.("host") || "";
    const appUrl = process.env.APP_URL || process.env.CLIENT_URL || "";
    const urlToCheck = host ? `https://${host}` : appUrl;
    if (urlToCheck.includes("helping-you-works-smarter.com")) {
      return "https://auth.helping-you-works-smarter.com";
    }
  }
  return "http://localhost:3000";
}

/**
 * Injeta HWS_AUTH_URL no HTML.
 */
function injectRuntimeEnv(html: string, req?: express.Request): string {
  const hwsAuthUrl = getHwsAuthUrlForInjection(req);
  const envScript = `<script>window.HWS_AUTH_URL='${hwsAuthUrl}';</script>`;
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
  app.get("*", (req, res) => {
    const indexPath = path.join(distPath, "index.html");
    const html = fs.readFileSync(indexPath, "utf-8");
    res.setHeader("Content-Type", "text/html");
    res.send(injectRuntimeEnv(html, req));
  });
}
