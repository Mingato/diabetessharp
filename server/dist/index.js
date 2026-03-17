import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers/index.js";
import { createContext } from "./trpc/context.js";
import { authMiddleware } from "./middleware/auth.js";
import { tokenCaptureMiddleware } from "./tokenCaptureMiddleware.js";
import { handleRefreshToken } from "./refreshTokenRoute.js";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 4000;
const app = express();
app.use(helmet({
    contentSecurityPolicy: process.env.NODE_ENV === "production",
    crossOriginEmbedderPolicy: false,
}));
const allowedOrigins = [
    "https://neurosharp.com",
    "https://www.neurosharp.com",
    "http://manus.space",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:4001",
    "http://127.0.0.1:4001",
    "http://localhost:4002",
    "http://127.0.0.1:4002",
    "http://localhost:4003",
    "http://127.0.0.1:4003",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3002",
    "http://127.0.0.1:3002",
];
app.use(cors({
    origin: (origin, cb) => {
        if (!origin || allowedOrigins.includes(origin))
            cb(null, true);
        else
            cb(null, false);
    },
    credentials: true,
}));
app.use(express.json({ limit: "256kb" }));
app.use(cookieParser());
// Capture tokens from URL after HWS Auth login redirect (?token=...&refresh=...)
app.use(tokenCaptureMiddleware);
app.use(authMiddleware);
app.post("/api/auth/refresh", async (req, res) => {
    await handleRefreshToken(req, res);
});
const webhookLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    message: { error: "Too many requests" },
});
app.post("/api/cartpanda-webhook", webhookLimiter, async (req, res) => {
    try {
        const orderId = Number(req.body?.orderId ?? req.body?.order_id ?? 0);
        if (!orderId || !Number.isInteger(orderId)) {
            res.status(400).json({ ok: false, error: "Missing or invalid orderId" });
            return;
        }
        const { confirmPayment } = await import("./services/confirmPayment.js");
        const result = await confirmPayment(orderId);
        res.status(200).json({ ok: result.ok });
    }
    catch (err) {
        console.error("Cartpanda webhook error:", err);
        res.status(500).json({ ok: false, error: "Internal error" });
    }
});
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
app.use("/trpc", createExpressMiddleware({
    router: appRouter,
    createContext,
}));
// Serve client build (client/dist)
const clientPath = path.join(__dirname, "../../client/dist");
app.use(express.static(clientPath));
app.get("*", (_req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
});
app.listen(PORT, () => {
    console.log(`NeuroSharp server running on http://localhost:${PORT}`);
});
