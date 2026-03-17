import { COOKIE_NAME, REFRESH_COOKIE_NAME } from "./auth/const.js";
import { getValidCookieDomain } from "./cookieUtils.js";
/**
 * Server-side proxy for token refresh.
 *
 * Since tokens are stored as httpOnly cookies on the app's domain,
 * the browser can't send them directly to HWS Auth (different origin).
 * This route reads the refresh token cookie, forwards it to HWS Auth,
 * and sets the new access token cookie on the app's domain.
 */
export async function handleRefreshToken(req, res) {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
    if (!refreshToken) {
        return res.status(401).json({ success: false, error: "No refresh token" });
    }
    const hwsAuthUrl = process.env.HWS_AUTH_URL || "http://localhost:3000";
    try {
        const response = await fetch(`${hwsAuthUrl}/api/auth/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: `${REFRESH_COOKIE_NAME}=${refreshToken}`,
            },
            body: JSON.stringify({ refreshToken }),
        });
        if (!response.ok) {
            return res.status(401).json({ success: false, error: "Refresh rejected by auth service" });
        }
        const data = (await response.json());
        const isProduction = process.env.NODE_ENV === "production";
        const cookieDomain = getValidCookieDomain(req);
        const cookieOpts = {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            path: "/",
            ...(cookieDomain ? { domain: cookieDomain } : {}),
        };
        const newAccessToken = data.accessToken ||
            data.access_token ||
            data.token;
        if (newAccessToken) {
            res.cookie(COOKIE_NAME, newAccessToken, {
                ...cookieOpts,
                maxAge: 15 * 60 * 1000,
            });
        }
        const newRefreshToken = data.refreshToken ||
            data.refresh_token;
        if (newRefreshToken) {
            res.cookie(REFRESH_COOKIE_NAME, newRefreshToken, {
                ...cookieOpts,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
        }
        return res.json({ success: true });
    }
    catch (err) {
        console.error("[RefreshToken] Error:", err.message);
        return res.status(500).json({ success: false, error: "Internal error during refresh" });
    }
}
