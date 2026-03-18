/**
 * Variáveis de ambiente expostas ao client (browser).
 * Em produção (Railway): process.env vem do dashboard.
 * Em dev: Vite injeta via transformIndexHtml; server injeta ao servir HTML.
 *
 * Quando req é passado, deriva APP_URL e HWS_AUTH_URL do Host da requisição
 * (mais confiável que env vars quando atrás de proxy).
 */
function getDefaultHwsAuthUrl(appUrl: string): string {
  if (!appUrl) return "http://localhost:3000";
  try {
    const url = new URL(appUrl);
    if (url.hostname.includes("helping-you-works-smarter.com")) {
      return "https://auth.helping-you-works-smarter.com";
    }
  } catch {
    /* ignore */
  }
  return "http://localhost:3000";
}

export function getClientEnv(req?: { get?: (name: string) => string | undefined }): Record<string, string> {
  let appUrl = process.env.APP_URL || process.env.CLIENT_URL || "";

  // Deriva do request quando disponível (funciona atrás de proxy com trust proxy)
  if (req?.get) {
    const host = req.get("host") || req.get("x-forwarded-host");
    const proto = req.get("x-forwarded-proto") || "https";
    if (host && process.env.NODE_ENV === "production") {
      const scheme = proto === "https" ? "https" : "http";
      appUrl = appUrl || `${scheme}://${host}`;
    }
  }

  const hwsAuthUrl = process.env.HWS_AUTH_URL || getDefaultHwsAuthUrl(appUrl);

  return {
    HWS_AUTH_URL: hwsAuthUrl,
    APP_URL: appUrl || "http://localhost:3002",
  };
}
