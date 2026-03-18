/**
 * Variáveis de ambiente expostas ao client (browser).
 * Em produção (Railway): process.env vem do dashboard.
 * Em dev: Vite injeta via transformIndexHtml; server injeta ao servir HTML.
 *
 * Adicione aqui qualquer variável que o client precise.
 */
export function getClientEnv(): Record<string, string> {
  return {
    HWS_AUTH_URL: process.env.HWS_AUTH_URL || "http://localhost:3000",
    APP_URL: process.env.APP_URL || process.env.CLIENT_URL || "http://localhost:3002",
    // Adicione mais conforme necessário, ex:
    // ANALYTICS_ID: process.env.ANALYTICS_ID || "",
  };
}
