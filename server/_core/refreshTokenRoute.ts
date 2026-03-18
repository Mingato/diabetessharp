import type { Request, Response } from "express";
import { COOKIE_NAME, REFRESH_COOKIE_NAME } from "../../shared/const.js";
import { getValidCookieDomain } from "./cookieUtils.js";

/**
 * Server-side proxy for token refresh.
 *
 * Since tokens are stored as httpOnly cookies on the app's domain,
 * the browser can't send them directly to HWS Auth (different origin).
 * This route reads the refresh token cookie, forwards it to HWS Auth,
 * and sets the new access token cookie on the app's domain.
 *
 * Same pattern as hws-ed-web-app.
 */
export async function handleRefreshToken(req: Request, res: Response) {
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

    const data = (await response.json()) as Record<string, unknown>;

    const isProduction = process.env.NODE_ENV === "production";
    const cookieDomain = getValidCookieDomain(req);
    const cookieOpts = {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax" as const,
      path: "/",
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    };

    const newAccessToken =
      (data.accessToken as string) ||
      (data.access_token as string) ||
      (data.token as string);

    if (newAccessToken) {
      res.cookie(COOKIE_NAME, newAccessToken, {
        ...cookieOpts,
        maxAge: 15 * 60 * 1000,
      });
    }

    const newRefreshToken =
      (data.refreshToken as string) ||
      (data.refresh_token as string);

    if (newRefreshToken) {
      res.cookie(REFRESH_COOKIE_NAME, newRefreshToken, {
        ...cookieOpts,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }

    // Do NOT forward hws-auth's Set-Cookie headers: they target auth's domain.
    // When app is on a different domain, browser would reject them. We set our own cookies above.
    return res.json({ success: true });
  } catch (err) {
    console.error("[RefreshToken] Error:", (err as Error).message);
    return res.status(500).json({ success: false, error: "Internal error during refresh" });
  }
}
