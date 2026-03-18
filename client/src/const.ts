/** HWS_AUTH_URL injetado pelo server (prod) ou Vite (dev) — mesmo padrão do hws-ed-web-app */
export function getHwsAuthUrl(): string {
  return (window as any).HWS_AUTH_URL || "http://localhost:3000";
}

export function getAppUrl(): string {
  return typeof window !== "undefined" ? window.location.origin : "http://localhost:3002";
}

/**
 * Builds the HWS Auth login URL with redirect back to the current app.
 * Works when app is on same domain as auth (cookies shared) or different domain (token-in-URL fallback).
 */
export function getLoginUrl(): string {
  const hwsAuthUrl = getHwsAuthUrl();
  const redirect = typeof window !== "undefined" ? window.location.href : "";
  return `${hwsAuthUrl}/login?redirect=${encodeURIComponent(redirect)}`;
}
