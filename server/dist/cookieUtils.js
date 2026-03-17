const DOMAIN_VALUE_REGEXP = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
function extractRootDomain(hostname) {
    const host = hostname.split(":")[0] || hostname;
    if (host === "localhost" || host === "127.0.0.1")
        return undefined;
    const parts = host.split(".");
    if (parts.length >= 3)
        return "." + parts.slice(1).join(".");
    if (parts.length === 2)
        return "." + host;
    return undefined;
}
export function getValidCookieDomain(req) {
    const raw = process.env.COOKIE_DOMAIN;
    if (raw && typeof raw === "string") {
        const trimmed = raw.trim();
        if (trimmed && DOMAIN_VALUE_REGEXP.test(trimmed))
            return trimmed;
    }
    if (req?.hostname && process.env.NODE_ENV === "production") {
        return extractRootDomain(req.hostname);
    }
    return undefined;
}
