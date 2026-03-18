import "dotenv/config";
import { createServer } from "http";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers/index.js";
import { createContext } from "./trpc/context.js";
import { authMiddleware } from "./middleware/auth.js";
import { tokenCaptureMiddleware } from "./_core/tokenCaptureMiddleware.js";
import { handleRefreshToken } from "./_core/refreshTokenRoute.js";
import { serveStatic, setupVite } from "./vite.js";

async function start() {
const app = express();

// Necessário quando atrás de proxy (Railway, etc.) para req.hostname e cookies corretos
app.set("trust proxy", 1);

app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === "production",
  crossOriginEmbedderPolicy: false,
}));

const allowedOrigins = [
  ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL] : []),
  ...(process.env.APP_URL ? [process.env.APP_URL] : []),
  "https://diabetessharp.helping-you-works-smarter.com",
  "http://diabetessharp.helping-you-works-smarter.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:4001",
  "http://127.0.0.1:4001",
  "http://localhost:4002",
  "http://127.0.0.1:4002",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3002",
  "http://127.0.0.1:3002",
];
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) cb(null, true);
      else cb(null, false);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "256kb" }));
app.use(cookieParser());
app.use(tokenCaptureMiddleware);

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    ts: new Date().toISOString(),
    authConfigured: !!process.env.HWS_AUTH_URL,
  });
});

app.use(authMiddleware);

app.post("/api/auth/refresh", async (req, res) => {
  await handleRefreshToken(req, res);
});

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
app.use("/api/trpc", generalLimiter);

const checkoutLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { error: "Too many checkout attempts" },
});
app.use("/api/trpc/funnel.createCarpandaOrder", checkoutLimiter);

app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

const server = createServer(app);
const PORT = Number(process.env.PORT) || 3002;

if (process.env.NODE_ENV === "development") {
  await setupVite(app, server);
} else {
  serveStatic(app);
}

server.listen(PORT, () => {
  console.log(`DiabetesSharp server running on http://localhost:${PORT}/ [${process.env.NODE_ENV ?? "development"}]`);
  if (process.env.NODE_ENV === "production") {
    const authUrl = process.env.HWS_AUTH_URL;
    console.log(`[Auth] HWS_AUTH_URL: ${authUrl ? "✓ configurada" : "✗ NÃO DEFINIDA (redirect usará localhost)"}`);
  }
});
}
start().catch(console.error);
