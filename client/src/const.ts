/**
 * HWS Auth URL - injected by Vite at build time via window.HWS_AUTH_URL
 */
export function getHwsAuthUrl(): string {
  return (typeof window !== "undefined" && (window as unknown as { HWS_AUTH_URL?: string }).HWS_AUTH_URL) || "http://localhost:3000";
}

/**
 * Builds the HWS Auth login URL with redirect back to the current app.
 */
export function getLoginUrl(): string {
  const hwsAuthUrl = getHwsAuthUrl();
  const redirect = typeof window !== "undefined" ? window.location.href : "";
  return `${hwsAuthUrl}/login?redirect=${encodeURIComponent(redirect)}`;
}
