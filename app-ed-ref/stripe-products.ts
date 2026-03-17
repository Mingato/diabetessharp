/**
 * Vigronex Stripe Products & Prices
 * Centralized product/price definitions for the subscription plans.
 */

export const RISEUP_PRODUCTS = {
  monthly: {
    name: "Vigronex Premium — Monthly",
    description: "Full access to the 90-day Vigronex male performance program",
    priceUsd: 2999, // $29.99 in cents
    interval: "month" as const,
    trialDays: 7,
  },
  annual: {
    name: "Vigronex Premium — Annual",
    description: "Full access to the 90-day Vigronex male performance program (best value)",
    priceUsd: 19900, // $199.00 in cents — saves ~$160/year
    interval: "year" as const,
    trialDays: 7,
  },
} as const;

export type PlanKey = keyof typeof RISEUP_PRODUCTS;

/**
 * Funnel one-time products
 */
export const FUNNEL_PRODUCTS = {
  main: {
    name: "Vigronex 90-Day Recovery Program",
    description: "Complete 90-day male performance recovery protocol with exercises, nutrition, and AI coaching",
    priceUsd: 2999, // $29.99
    discountPriceUsd: 2399, // $23.99 with 20% off
  },
  upsell1: {
    name: "Dr. Apex 24h \u2014 Personal Medical AI",
    description: "Unlimited 24/7 access to your personal AI doctor specialized in male sexual health",
    priceUsd: 1499, // $14.99
  },
  upsell2: {
    name: "Sofia \u2014 Fantasy & Intimacy Assistant",
    description: "Personal AI intimacy coach who understands your deepest desires and guides your relationship",
    priceUsd: 1699, // $16.99
  },
  upsell3: {
    name: "Testosterone Boost Recipe Bible",
    description: "87 science-backed high-testosterone recipes to naturally maximize your hormone levels",
    priceUsd: 999, // $9.99
  },
} as const;
export type UpsellKey = "upsell1" | "upsell2" | "upsell3";
