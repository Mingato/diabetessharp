/**
 * HWS Auth SDK — validates JWT tokens from hws-auth service.
 *
 * Flow:
 * - Auth comes from the JWT (access token in cookie or Bearer header)
 * - User is synced to local DB by email
 * - JWT is self-contained, validated with JWT_SECRET (must match HWS Auth)
 */
import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "./auth/const.js";
import { query } from "./db/client.js";
const JWT_ISSUER = process.env.JWT_ISSUER || "https://auth.hws.com";
function getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret)
        throw new Error("JWT_SECRET environment variable is required");
    return secret;
}
function extractToken(req) {
    const cookieToken = req.cookies?.[COOKIE_NAME];
    if (cookieToken)
        return cookieToken;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
        return authHeader.substring(7);
    }
    return null;
}
function mapRolesToRole(roles) {
    if (!roles || !Array.isArray(roles))
        return "user";
    if (roles.some((r) => r.includes("Admin") || r === "HWSAdmin.diabetessharp.All"))
        return "admin";
    if (roles.some((r) => r.includes("affiliate") || r.toLowerCase().includes("affiliate")))
        return "affiliate";
    return "user";
}
export async function authenticateRequest(req) {
    const token = extractToken(req);
    if (!token)
        throw new Error("No authentication token provided");
    let payload;
    try {
        payload = jwt.verify(token, getJwtSecret(), {
            issuer: JWT_ISSUER,
            algorithms: ["HS256"],
        });
    }
    catch (err) {
        throw new Error(`Token validation failed: ${err instanceof Error ? err.message : String(err)}`);
    }
    const email = payload.email;
    if (!email) {
        throw new Error("Invalid token payload: missing email");
    }
    const role = mapRolesToRole(payload.roles);
    // Sync user to local DB (upsert by email)
    try {
        await query(`INSERT INTO users (email, role) VALUES ($1, $2)
       ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role
       RETURNING id`, [email, role]);
    }
    catch (err) {
        console.warn("[Auth] User sync failed:", err.message);
    }
    const r = await query(`SELECT id, email, role FROM users WHERE email = $1`, [email]);
    const user = r.rows[0];
    if (!user) {
        throw new Error("User not found. Try logging in again.");
    }
    return user;
}
