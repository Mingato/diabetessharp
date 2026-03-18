/**
 * RFC 6265 domain-value regex (same as jshttp/cookie).
 * Valid formats: "example.com", ".example.com", "sub.example.com"
 * Invalid: empty, URL with protocol, leading/trailing hyphen in labels, etc.
 */
const DOMAIN_VALUE_REGEXP =
  /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;

/**
 * Extracts root domain from hostname for cross-subdomain cookies.
 * e.g. "app.example.com" -> ".example.com"
 */
function extractRootDomain(hostname: string): string | undefined {
  const host = hostname.split(":")[0] || hostname;
  if (host === "localhost" || host === "127.0.0.1") return undefined;
  const parts = host.split(".");
  if (parts.length >= 3) {
    return "." + parts.slice(1).join(".");
  }
  if (parts.length === 2) return "." + host;
  return undefined;
}

/**
 * Returns a valid cookie domain for the app. Works when app is on same or different domain than hws-auth.
 *
 * Priority:
 * 1. COOKIE_DOMAIN env (explicit config for this app's domain)
 * 2. When not set: derive from request Host in production (cross-subdomain)
 * 3. undefined = host-only cookie (e.g. localhost, or single host)
 *
 * Note: Cookies are always set for the APP's domain (where the request lands).
 * hws-auth may be on a different domain; tokens arrive via URL and we set cookies here.
 */
export function getValidCookieDomain(req?: { hostname?: string }): string | undefined {
  const raw = process.env.COOKIE_DOMAIN;
  if (raw && typeof raw === "string") {
    const trimmed = raw.trim();
    if (trimmed && DOMAIN_VALUE_REGEXP.test(trimmed)) return trimmed;
    if (trimmed) {
      console.warn(
        `[Cookie] COOKIE_DOMAIN "${raw}" is invalid (RFC 6265). Use e.g. ".helping-you-works-smarter.com". Skipping.`
      );
    }
  }

  if (req?.hostname && process.env.NODE_ENV === "production") {
    return extractRootDomain(req.hostname);
  }
  return undefined;
}
