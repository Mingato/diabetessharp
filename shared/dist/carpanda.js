"use strict";
/**
 * Cartpanda payment links for NeuroSharp funnel.
 * Main checkout: its-brazilian-llc.mycartpanda.com
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CARPANDA_LINKS = void 0;
exports.buildCarpandaUrl = buildCarpandaUrl;
exports.CARPANDA_LINKS = {
    main: "https://its-brazilian-llc.mycartpanda.com/checkout/208757547:1",
    mainDiscount: "https://its-brazilian-llc.mycartpanda.com/checkout/208757547:1",
    recipeBump: "https://its-brazilian-llc.mycartpanda.com/checkout/208757547:1",
    upsell1: "https://its-brazilian-llc.mycartpanda.com/checkout/208757547:1",
    upsell2: "https://its-brazilian-llc.mycartpanda.com/checkout/208757547:1",
    upsell3: "https://its-brazilian-llc.mycartpanda.com/checkout/208757547:1",
};
function buildCarpandaUrl(linkKey, orderId, email, firstName, bump = false) {
    const base = exports.CARPANDA_LINKS[linkKey];
    const params = new URLSearchParams({
        order: String(orderId),
        email,
        name: firstName,
        ...(bump ? { bump: "1" } : {}),
    });
    const separator = base.includes("?") ? "&" : "?";
    return `${base}${separator}${params.toString()}`;
}
