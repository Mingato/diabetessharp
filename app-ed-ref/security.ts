/**
 * Security hardening middleware for Vigronex
 * Implements: HTTP security headers, rate limiting, CORS lockdown,
 * bot detection, parameter pollution prevention, and request sanitization.
 */
import { Request, Response, NextFunction, Express } from "express";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import hpp from "hpp";

// ── Allowed origins (production + dev) ───────────────────────────────────────
const ALLOWED_ORIGINS = [
  "https://vigronex.com",
  "https://www.vigronex.com",
  "https://riseupapp-fb6hbkba.manus.space",
];
if (process.env.NODE_ENV === "development") {
  ALLOWED_ORIGINS.push("http://localhost:3000", "http://localhost:5173");
}

// ── CORS middleware ───────────────────────────────────────────────────────────
export function corsMiddleware(req: Request, res: Response, next: NextFunction) {
  const origin = req.headers.origin as string | undefined;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization,x-admin-token");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Vary", "Origin");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
}

// ── Helmet: HTTP security headers ────────────────────────────────────────────
export const helmetMiddleware = helmet({
  // Content Security Policy — blocks inline scripts from unknown origins
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",   // needed for Vite HMR in dev
        "'unsafe-eval'",     // needed for React dev tools
        "https://js.stripe.com",
        "https://www.googletagmanager.com",
        "https://connect.facebook.net",
        "https://static.ads-twitter.com",
        "https://analytics.tiktok.com",
      ],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "blob:", "https:", "http:"],
      connectSrc: [
        "'self'",
        "https://api.manus.im",
        "https://vigronex.com",
        "https://www.vigronex.com",
        "https://its-brazilian-llc.mycartpanda.com",
        "https://*.mycartpanda.com",
        "wss:",
        "ws:",
      ],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'", "https://its-brazilian-llc.mycartpanda.com", "https://*.mycartpanda.com"],
      upgradeInsecureRequests: [],
    },
  },
  // Prevent browsers from sniffing MIME types
  noSniff: true,
  // Prevent clickjacking
  frameguard: { action: "deny" },
  // Force HTTPS for 1 year
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  // Hide X-Powered-By header (don't reveal Express)
  hidePoweredBy: true,
  // XSS protection
  xssFilter: true,
  // Prevent IE from opening downloads in site context
  ieNoOpen: true,
  // Disable DNS prefetching
  dnsPrefetchControl: { allow: false },
  // Referrer policy
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  // Permissions policy
  permittedCrossDomainPolicies: { permittedPolicies: "none" },
});

// ── Rate limiters ─────────────────────────────────────────────────────────────

// General API: 200 req/15min per IP
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
  skip: (req) => req.path.startsWith("/api/oauth"), // OAuth needs to be free
});

// Auth endpoints: 10 attempts/15min per IP (brute force protection)
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many authentication attempts. Please wait 15 minutes." },
});

// Checkout: 20 attempts/hour per IP
export const checkoutRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many checkout attempts. Please try again later." },
});

// Contact form: 5 submissions/hour per IP
export const contactRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many messages sent. Please wait before sending another." },
});

// Admin login: 5 attempts/15min per IP
export const adminLoginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many admin login attempts. Account temporarily locked." },
});

// ── Bot / scraper detection ───────────────────────────────────────────────────
const BOT_UA_PATTERNS = [
  /curl/i, /wget/i, /python-requests/i, /scrapy/i, /httpclient/i,
  /go-http-client/i, /java\//i, /perl/i, /ruby/i, /php/i,
  /libwww/i, /lwp/i, /mechanize/i, /selenium/i, /phantomjs/i,
  /headless/i, /puppeteer/i, /playwright/i, /cypress/i,
  /bot/i, /crawl/i, /spider/i, /scrape/i, /fetch/i,
];

export function botProtection(req: Request, res: Response, next: NextFunction) {
  // Skip for API and static assets
  if (req.path.startsWith("/api/") || req.path.match(/\.(js|css|png|jpg|ico|svg|woff|woff2)$/)) {
    return next();
  }
  const ua = req.headers["user-agent"] || "";
  const isSuspiciousBot = BOT_UA_PATTERNS.some(p => p.test(ua)) && !ua.includes("Mozilla");
  if (isSuspiciousBot) {
    res.status(403).send("Forbidden");
    return;
  }
  next();
}

// ── Sensitive data header removal ─────────────────────────────────────────────
export function sanitizeResponseHeaders(req: Request, res: Response, next: NextFunction) {
  res.removeHeader("X-Powered-By");
  res.removeHeader("Server");
  // Add cache-control for API responses
  if (req.path.startsWith("/api/")) {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.setHeader("Pragma", "no-cache");
  }
  next();
}

// ── Register all security middleware ─────────────────────────────────────────
export function registerSecurityMiddleware(app: Express) {
  // Trust the first proxy (required for rate limiting behind reverse proxies/CDNs)
  app.set("trust proxy", 1);

  // 1. Remove identifying headers first
  app.use(sanitizeResponseHeaders);

  // 2. CORS
  app.use(corsMiddleware);

  // 3. Helmet security headers
  app.use(helmetMiddleware);

  // 4. HTTP Parameter Pollution prevention
  app.use(hpp());

  // 5. General rate limiting on all API routes
  app.use("/api/", generalRateLimit);

  // 6. Specific rate limits on sensitive endpoints
  app.use("/api/trpc/auth.login", authRateLimit);
  app.use("/api/trpc/auth.register", authRateLimit);
  app.use("/api/trpc/admin.login", adminLoginRateLimit);
  app.use("/api/trpc/checkout.createCarpandaOrder", checkoutRateLimit);
  app.use("/api/trpc/contact.submit", contactRateLimit);

  // 7. Bot protection on page routes
  app.use(botProtection);

  console.log("[Security] All security middleware registered");
}
