/**
 * Cartpanda Payment Links — Vigronex Funnel
 *
 * SUCCESS REDIRECT (configure in Cartpanda for each product):
 *   Main product:  https://vigronex.com/checkout/success?order={ORDER_ID}
 *   Upsell 1:      https://vigronex.com/checkout/upsell-success?order={ORDER_ID}&upsell=upsell1
 *   Upsell 2:      https://vigronex.com/checkout/upsell-success?order={ORDER_ID}&upsell=upsell2
 *   Upsell 3:      https://vigronex.com/checkout/upsell-success?order={ORDER_ID}&upsell=upsell3
 *
 * SKIP / DECLINE REDIRECT (configure in Cartpanda for each upsell):
 *   Upsell 1 skip: https://vigronex.com/checkout/upsell-skip?order={ORDER_ID}&upsell=upsell1
 *   Upsell 2 skip: https://vigronex.com/checkout/upsell-skip?order={ORDER_ID}&upsell=upsell2
 *   Upsell 3 skip: https://vigronex.com/checkout/upsell-skip?order={ORDER_ID}&upsell=upsell3
 */

export const CARPANDA_LINKS = {
  /**
   * PRODUTO 1 — Vigronex 90-Day Recovery Program
   * Valor: $29.99
   */
  main: "https://its-brazilian-llc.mycartpanda.com/checkout/208661749:1",

  /**
   * PRODUTO 1 (com desconto) — Vigronex 90-Day Recovery Program
   * Valor: $23.99 (20% off)
   * Usando o mesmo link principal — desconto aplicado via cupom ou param
   */
  mainDiscount: "https://its-brazilian-llc.mycartpanda.com/checkout/208661749:1",

  /**
   * ORDER BUMP — Testosterone Boost Recipe Bible
   * Valor: $9.99
   */
  recipeBump: "https://its-brazilian-llc.mycartpanda.com/checkout/208661751:1",

  /**
   * UPSELL 1 — Dr. Apex 24h Personal Medical AI
   * Valor: $14.99
   */
  upsell1: "https://its-brazilian-llc.mycartpanda.com/checkout/208661763:1",

  /**
   * UPSELL 2 — Sofia Fantasy & Intimacy Assistant
   * Valor: $16.99
   */
  upsell2: "https://its-brazilian-llc.mycartpanda.com/checkout/208661764:1",

  /**
   * UPSELL 3 — Testosterone Boost Recipe Bible (fallback se não comprou o bump)
   * Valor: $9.99
   */
  upsell3: "https://its-brazilian-llc.mycartpanda.com/checkout/208661751:1",
} as const;

export type CarpandaLinkKey = keyof typeof CARPANDA_LINKS;

/**
 * Build a Cartpanda payment URL with order tracking params
 * @param linkKey - which product link to use
 * @param orderId - internal order ID for tracking
 * @param email - customer email
 * @param firstName - customer first name
 * @param bump - whether recipe bump is included (for main product)
 */
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
  // Append params — handle if base URL already has query string
  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}${params.toString()}`;
}
