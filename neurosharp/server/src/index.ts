import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers/index.js";
import { createContext } from "./trpc/context.js";
import { authMiddleware } from "./middleware/auth.js";
import { ENV } from "./env.js";
import path from "path";
import fs from "node:fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDistPath = path.join(__dirname, "../client-dist");

function getAllowedOrigins(): string[] {
  const base = [
    "https://neurosharp.com",
    "https://www.neurosharp.com",
    "http://manus.space",
    "http://localhost:3000",
    "http://localhost:3005",
    "http://127.0.0.1:3000",
    "http://localhost:4000",
    "http://127.0.0.1:4000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4001",
    "http://127.0.0.1:4001",
  ];
  if (ENV.appUrl && !base.includes(ENV.appUrl)) base.push(ENV.appUrl);
  for (const envVar of [ENV.corsExtraOrigins, ENV.allowedOrigins]) {
    if (envVar) {
      for (const o of envVar.split(",")) {
        const trimmed = o.trim();
        if (trimmed && !base.includes(trimmed)) base.push(trimmed);
      }
    }
  }
  return base;
}

const app = express();

app.use(helmet({
  contentSecurityPolicy: ENV.isProduction,
  crossOriginEmbedderPolicy: false,
}));

app.use(
  cors({
    origin: (origin, cb) => {
      const allowed = getAllowedOrigins();
      if (!origin || allowed.includes(origin)) cb(null, true);
      else cb(null, false);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "256kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

app.use(authMiddleware);

const webhookLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { error: "Too many requests" },
});
app.post(
  "/api/cartpanda-webhook",
  webhookLimiter,
  async (req, res) => {
    try {
      const orderId = Number(req.body?.orderId ?? req.body?.order_id ?? 0);
      if (!orderId || !Number.isInteger(orderId)) {
        res.status(400).json({ ok: false, error: "Missing or invalid orderId" });
        return;
      }
      const { confirmPayment } = await import("./services/confirmPayment.js");
      const result = await confirmPayment(orderId);
      res.status(200).json({ ok: result.ok });
    } catch (err) {
      console.error("Cartpanda webhook error:", err);
      res.status(500).json({ ok: false, error: "Internal error" });
    }
  }
);

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: "Too many requests" },
});
app.use("/trpc", generalLimiter);

const checkoutLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { error: "Too many checkout attempts" },
});
app.use("/trpc/funnel.createCarpandaOrder", checkoutLimiter);

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath, { index: false }));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
} else {
  console.warn("[NeuroSharp] client-dist not found. Run 'npm run build' first to serve the app.");
}

app.listen(ENV.port, () => {
  console.log(`NeuroSharp server running on http://localhost:${ENV.port}`);
});
