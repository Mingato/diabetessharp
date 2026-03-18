/**
 * Centralized environment configuration.
 * Aligns with hws-ed-web-app env vars for consistency.
 */

export const ENV = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 4000,
  appUrl: process.env.APP_URL || process.env.CLIENT_URL || "http://localhost:3000",
  corsExtraOrigins: process.env.CORS_EXTRA_ORIGINS?.trim() || "",
  allowedOrigins: process.env.ALLOWED_ORIGINS?.trim() || "",
  databaseUrl: process.env.DATABASE_URL || "postgresql://localhost:5432/neurosharp",
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-in-production",
  jwtIssuer: process.env.JWT_ISSUER || "https://auth.hws.com",
  hwsAuthUrl: process.env.HWS_AUTH_URL || "http://localhost:3000",
  allowedRoles: process.env.ALLOWED_ROLES?.trim()
    ? process.env.ALLOWED_ROLES.split(",").map((r) => r.trim())
    : [] as string[],
  resendApiKey: process.env.RESEND_API_KEY || "",
  emailFrom: process.env.EMAIL_FROM || "NeuroSharp <noreply@neurosharp.com>",
  cookieDomain: process.env.COOKIE_DOMAIN?.trim() || undefined,
  carpandaMainUrl: process.env.CARPANDA_MAIN_URL?.trim() || "",
  carpandaMainDiscountUrl: process.env.CARPANDA_MAIN_DISCOUNT_URL?.trim() || "",
  carpandaRecipeBumpUrl: process.env.CARPANDA_RECIPE_BUMP_URL?.trim() || "",
  carpandaUpsell1Url: process.env.CARPANDA_UPSELL1_URL?.trim() || "",
  carpandaUpsell2Url: process.env.CARPANDA_UPSELL2_URL?.trim() || "",
  carpandaUpsell3Url: process.env.CARPANDA_UPSELL3_URL?.trim() || "",
  hwsFilesUrl: process.env.HWS_FILES_URL || "",
  storagePath: process.env.STORAGE_PATH || "./uploads",
  isProduction: process.env.NODE_ENV === "production",
} as const;
