/**
 * CSRF protection and honeypot validation middleware
 *
 * Strategy:
 * - State-changing API calls (POST/PUT/DELETE) require a CSRF token
 * - CSRF token is generated per-session and stored in a signed cookie
 * - Token is sent in the x-csrf-token header by the frontend
 * - Honeypot: form submissions with a filled "website" field are silently rejected
 */
import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

const CSRF_COOKIE = "_vgx_csrf";
const CSRF_HEADER = "x-csrf-token";
const CSRF_SECRET = process.env.JWT_SECRET || "vigronex-csrf-secret-2026";

// ── Token generation ──────────────────────────────────────────────────────────
export function generateCsrfToken(): string {
  const random = crypto.randomBytes(32).toString("hex");
  const timestamp = Date.now().toString(36);
  const signature = crypto
    .createHmac("sha256", CSRF_SECRET)
    .update(`${random}:${timestamp}`)
    .digest("hex")
    .slice(0, 16);
  return `${random}.${timestamp}.${signature}`;
}

export function validateCsrfToken(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const [random, timestamp, signature] = parts;
    // Token expires after 24 hours
    const age = Date.now() - parseInt(timestamp, 36);
    if (age > 24 * 60 * 60 * 1000) return false;
    const expected = crypto
      .createHmac("sha256", CSRF_SECRET)
      .update(`${random}:${timestamp}`)
      .digest("hex")
      .slice(0, 16);
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

// ── CSRF endpoint: GET /api/csrf-token ────────────────────────────────────────
export function csrfTokenHandler(req: Request, res: Response) {
  const token = generateCsrfToken();
  // Store in httpOnly cookie as backup
  res.cookie(CSRF_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.json({ token });
}

// ── CSRF validation middleware (for sensitive POST routes) ────────────────────
export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  // Only validate state-changing methods
  if (!["POST", "PUT", "DELETE", "PATCH"].includes(req.method)) {
    return next();
  }

  // Skip for Stripe webhooks (they use their own signature verification)
  if (req.path === "/api/stripe/webhook") {
    return next();
  }

  // Skip for OAuth callbacks
  if (req.path.startsWith("/api/oauth")) {
    return next();
  }

  // In development, skip CSRF to avoid breaking hot reload
  if (process.env.NODE_ENV === "development") {
    return next();
  }

  const headerToken = req.headers[CSRF_HEADER] as string | undefined;
  const cookieToken = req.cookies?.[CSRF_COOKIE];

  if (!headerToken || !cookieToken) {
    res.status(403).json({ error: "CSRF token missing" });
    return;
  }

  if (headerToken !== cookieToken || !validateCsrfToken(headerToken)) {
    res.status(403).json({ error: "Invalid CSRF token" });
    return;
  }

  next();
}

// ── Honeypot validation (for contact/checkout forms) ─────────────────────────
export function honeypotCheck(req: Request, res: Response, next: NextFunction) {
  const body = req.body as Record<string, unknown>;
  // If the hidden "website" or "company" field is filled, it's a bot
  if (body?.website || body?.company || body?._hp) {
    // Silently accept but don't process (don't alert the bot)
    res.json({ success: true, id: "bot-" + Date.now() });
    return;
  }
  next();
}
