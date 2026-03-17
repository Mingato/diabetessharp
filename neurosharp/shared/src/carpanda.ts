/**
 * Cartpanda payment links for NeuroSharp funnel.
 * Main checkout: its-brazilian-llc.mycartpanda.com
 */

export type CarpandaLinkKey =
  | "main"
  | "mainDiscount"
  | "recipeBump"
  | "upsell1"
  | "upsell2"
  | "upsell3";

export const CARPANDA_LINKS: Record<CarpandaLinkKey, string> = {
  main: "https://its-brazilian-llc.mycartpanda.com/checkout/208723849:1",
  mainDiscount: "https://its-brazilian-llc.mycartpanda.com/checkout/208723849:1",
  recipeBump: "https://its-brazilian-llc.mycartpanda.com/checkout/208723849:1",
  upsell1: "https://its-brazilian-llc.mycartpanda.com/checkout/208723849:1",
  upsell2: "https://its-brazilian-llc.mycartpanda.com/checkout/208723849:1",
  upsell3: "https://its-brazilian-llc.mycartpanda.com/checkout/208723849:1",
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
