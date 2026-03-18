import express, { type Express } from "express";
import type { Server } from "http";
import { createServer as createViteServer } from "vite";
import path from "node:path";
import fs from "node:fs";
import { getClientEnv } from "./clientEnv.js";

// Em dev: server/; em prod: dist/server/ — subir 2 níveis para a raiz do projeto
const PROJECT_ROOT = path.resolve(import.meta.dirname, "..", "..");

export async function setupVite(app: Express, _server: Server): Promise<void> {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
}

function injectRuntimeEnv(html: string): string {
  const clientEnv = getClientEnv();
  const script = `<script>window.__ENV__=${JSON.stringify(clientEnv)};</script>`;
  let result = html.replace(/<script>window\.__ENV__=[^<]*<\/script>/, script);
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
  app.get("*", (_req, res) => {
    const indexPath = path.join(distPath, "index.html");
    const html = fs.readFileSync(indexPath, "utf-8");
    res.setHeader("Content-Type", "text/html");
    res.send(injectRuntimeEnv(html));
  });
}
