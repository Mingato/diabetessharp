import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";
const ACCESS_EXPIRY = "15m";
const REFRESH_EXPIRY = "7d";
export function signAccessToken(user) {
    return jwt.sign({ sub: user.id, email: user.email, type: "access" }, JWT_SECRET, { expiresIn: ACCESS_EXPIRY });
}
export function signRefreshToken(user) {
    return jwt.sign({ sub: user.id, email: user.email, type: "refresh" }, JWT_SECRET, { expiresIn: REFRESH_EXPIRY });
}
export function verifyAccessToken(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.type !== "access")
            return null;
        return decoded;
    }
    catch {
        return null;
    }
}
export function verifyRefreshToken(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.type !== "refresh")
            return null;
        return decoded;
    }
    catch {
        return null;
    }
}
