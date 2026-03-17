/**
 * CartPanda URLs from environment variables.
 * Falls back to shared defaults when env vars are not set.
 */
import { CARPANDA_LINKS, type CarpandaLinkKey } from "shared";
import { ENV } from "./env.js";

function getUrl(key: CarpandaLinkKey): string {
  switch (key) {
    case "main":
      return ENV.carpandaMainUrl || CARPANDA_LINKS.main;
    case "mainDiscount":
      return ENV.carpandaMainDiscountUrl || ENV.carpandaMainUrl || CARPANDA_LINKS.mainDiscount;
    case "recipeBump":
      return ENV.carpandaRecipeBumpUrl || ENV.carpandaMainUrl || CARPANDA_LINKS.recipeBump;
    case "upsell1":
      return ENV.carpandaUpsell1Url || ENV.carpandaMainUrl || CARPANDA_LINKS.upsell1;
    case "upsell2":
      return ENV.carpandaUpsell2Url || ENV.carpandaMainUrl || CARPANDA_LINKS.upsell2;
    case "upsell3":
      return ENV.carpandaUpsell3Url || ENV.carpandaMainUrl || CARPANDA_LINKS.upsell3;
    default:
      return CARPANDA_LINKS[key];
  }
}

export function getCarpandaBaseUrl(linkKey: CarpandaLinkKey): string {
  return getUrl(linkKey);
}

export function getCarpandaLinks(): Record<CarpandaLinkKey, string> {
  return {
    main: getUrl("main"),
    mainDiscount: getUrl("mainDiscount"),
    recipeBump: getUrl("recipeBump"),
    upsell1: getUrl("upsell1"),
    upsell2: getUrl("upsell2"),
    upsell3: getUrl("upsell3"),
  };
}

export function buildCarpandaUrlFromEnv(
  linkKey: CarpandaLinkKey,
  orderId: number,
  email: string,
  firstName: string,
  bump = false
): string {
  const base = getUrl(linkKey);
  const params = new URLSearchParams({
    order: String(orderId),
    email,
    name: firstName,
    ...(bump ? { bump: "1" } : {}),
  });
  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}${params.toString()}`;
}
