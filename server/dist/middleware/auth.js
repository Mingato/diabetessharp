import { query } from "../db/client.js";
export async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : req.cookies?.token ?? req.query?.token;
    if (!token) {
        next();
        return;
    }
    try {
        const base64 = token.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(Buffer.from(base64, "base64").toString("utf-8"));
        if (payload.email && payload.id) {
            const r = await query(`SELECT id, email, role FROM users WHERE id = $1 AND email = $2`, [payload.id, payload.email]);
            if (r.rows[0]) {
                req.user = r.rows[0];
            }
        }
    }
    catch {
        // ignore invalid token
    }
    next();
}
