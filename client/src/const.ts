/** Objeto de env injetado pelo server (prod) ou Vite (dev) */
declare global {
  interface Window {
    __ENV__?: Record<string, string>;
  }
}

export function getClientEnv(): Record<string, string> {
  return (typeof window !== "undefined" && window.__ENV__) || {};
}

export function getHwsAuthUrl(): string {
  return getClientEnv().HWS_AUTH_URL || (typeof window !== "undefined" && (window as { HWS_AUTH_URL?: string }).HWS_AUTH_URL) || "http://localhost:3000";
}

export function getAppUrl(): string {
  return getClientEnv().APP_URL || (typeof window !== "undefined" ? window.location.origin : "http://localhost:3002");
}

/**
 * Builds the HWS Auth login URL with redirect back to the current app.
 */
export function getLoginUrl(): string {
  const hwsAuthUrl = getHwsAuthUrl();
  const redirect = typeof window !== "undefined" ? window.location.href : "";
  return `${hwsAuthUrl}/login?redirect=${encodeURIComponent(redirect)}`;
}
