import express, { type Express } from "express";
import type { Server } from "http";
import { createServer as createViteServer } from "vite";
import path from "node:path";
import fs from "node:fs";
import { getClientEnv } from "./clientEnv.js";

// process.cwd() = raiz do projeto (onde npm run dev/start é executado)
const PROJECT_ROOT = process.cwd();

export async function setupVite(app: Express, _server: Server): Promise<void> {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
}

function injectRuntimeEnv(html: string, req?: { get?: (name: string) => string | undefined }): string {
  const clientEnv = getClientEnv(req);
  const script = `<script>window.__ENV__=${JSON.stringify(clientEnv)};</script>`;
  // Regex mais permissivo: aceita quebras de linha e formatações do build
  let result = html.replace(/<script>window\.__ENV__=[\s\S]*?<\/script>/i, script);
  if (!result.includes("window.__ENV__")) {
    result = result.replace("</head>", `${script}</head>`);
  }
  return result;
}

export function serveStatic(app: Express): void {
  const distPath = path.join(PROJECT_ROOT, "dist", "public");
  if (!fs.existsSync(distPath)) {
    console.warn("[Vite] dist/public not found. Run `npm run build` first.");
    return;
  }
  app.use(express.static(distPath, { index: false }));
  app.get("*", (req, res) => {
    const indexPath = path.join(distPath, "index.html");
    const html = fs.readFileSync(indexPath, "utf-8");
    res.setHeader("Content-Type", "text/html");
    res.send(injectRuntimeEnv(html, req));
  });
}
