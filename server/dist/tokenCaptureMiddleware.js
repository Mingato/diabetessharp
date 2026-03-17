import { COOKIE_NAME, REFRESH_COOKIE_NAME } from "./auth/const.js";
import { getValidCookieDomain } from "./cookieUtils.js";
/**
 * Middleware that captures tokens from URL query params after HWS Auth login redirect.
 *
 * Flow:
 * 1. HWS Auth redirects back with ?token=...&refresh=...
 * 2. This middleware sets httpOnly cookies from those params
 * 3. Redirects to the clean URL (without tokens)
 * 4. On the next request the cookies are present and tRPC auth works normally
 */
export function tokenCaptureMiddleware(req, res, next) {
    const tokenParam = req.query.token;
    if (!tokenParam) {
        next();
        return;
    }
    console.log("[TokenCapture] Token found in URL, setting cookies...");
    const isProduction = process.env.NODE_ENV === "production";
    const cookieDomain = getValidCookieDomain(req);
    const cookieOpts = {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        ...(cookieDomain ? { domain: cookieDomain } : {}),
    };
    res.cookie(COOKIE_NAME, tokenParam, {
        ...cookieOpts,
        maxAge: 15 * 60 * 1000, // 15 minutes
    });
    const refreshParam = req.query.refresh;
    if (refreshParam) {
        res.cookie(REFRESH_COOKIE_NAME, refreshParam, {
            ...cookieOpts,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
    }
    const cleanUrl = removeTokensFromUrl(req.originalUrl);
    res.redirect(cleanUrl);
}
function removeTokensFromUrl(url) {
    try {
        const [pathname, search] = url.split("?");
        if (!search)
            return pathname || "/";
        const params = new URLSearchParams(search);
        params.delete("token");
        params.delete("refresh");
        const remaining = params.toString();
        return pathname + (remaining ? `?${remaining}` : "");
    }
    catch {
        return url;
    }
}
