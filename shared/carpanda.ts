/**
 * Cartpanda payment links for DiabetesSharp funnel.
 * URLs can be overridden via env: CARPANDA_MAIN_URL, CARPANDA_UPSELL1_URL, etc.
 */

export type CarpandaLinkKey =
  | "main"
  | "mainDiscount"
  | "recipeBump"
  | "upsell1"
  | "upsell2"
  | "upsell3";

function getLink(key: CarpandaLinkKey): string {
  const envMap: Record<CarpandaLinkKey, string | undefined> = {
    main: process.env.CARPANDA_MAIN_URL,
    mainDiscount: process.env.CARPANDA_MAIN_DISCOUNT_URL,
    recipeBump: process.env.CARPANDA_RECIPE_BUMP_URL,
    upsell1: process.env.CARPANDA_UPSELL1_URL,
    upsell2: process.env.CARPANDA_UPSELL2_URL,
    upsell3: process.env.CARPANDA_UPSELL3_URL,
  };
  const env = envMap[key];
  if (env) return env;
  const defaults: Record<CarpandaLinkKey, string> = {
    main: "https://its-brazilian-llc.mycartpanda.com/checkout/208723849:1",
    mainDiscount: "https://its-brazilian-llc.mycartpanda.com/checkout/208723849:1",
    recipeBump: "https://its-brazilian-llc.mycartpanda.com/checkout/208723849:1",
    upsell1: "https://its-brazilian-llc.mycartpanda.com/checkout/208723849:1",
    upsell2: "https://its-brazilian-llc.mycartpanda.com/checkout/208723849:1",
    upsell3: "https://its-brazilian-llc.mycartpanda.com/checkout/208723849:1",
  };
  return defaults[key];
}

export const CARPANDA_LINKS: Record<CarpandaLinkKey, string> = {
  main: getLink("main"),
  mainDiscount: getLink("mainDiscount"),
  recipeBump: getLink("recipeBump"),
  upsell1: getLink("upsell1"),
  upsell2: getLink("upsell2"),
  upsell3: getLink("upsell3"),
};

export function buildCarpandaUrl(
  linkKey: CarpandaLinkKey,
  orderId: number,
  email: string,
  firstName: string,
  bump = false
): string {
  const base = CARPANDA_LINKS[linkKey];
  const params = new URLSearchParams({
    order: String(orderId),
    email,
    name: firstName,
    ...(bump ? { bump: "1" } : {}),
  });
  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}${params.toString()}`;
}
