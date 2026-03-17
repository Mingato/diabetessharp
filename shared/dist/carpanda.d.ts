/**
 * Cartpanda payment links for NeuroSharp funnel.
 * Main checkout: its-brazilian-llc.mycartpanda.com
 */
export type CarpandaLinkKey = "main" | "mainDiscount" | "recipeBump" | "upsell1" | "upsell2" | "upsell3";
export declare const CARPANDA_LINKS: Record<CarpandaLinkKey, string>;
export declare function buildCarpandaUrl(linkKey: CarpandaLinkKey, orderId: number, email: string, firstName: string, bump?: boolean): string;
//# sourceMappingURL=carpanda.d.ts.map