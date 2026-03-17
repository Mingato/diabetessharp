import type { Express, Request, Response } from "express";
import express from "express";
import Stripe from "stripe";
import { getDb } from "./db";
import { userProfiles, funnelOrders, quizCompletions } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-02-25.clover",
});

export function registerStripeWebhook(app: Express) {
  // MUST register raw body parser BEFORE express.json() for webhook signature verification
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req: Request, res: Response) => {
      const sig = req.headers["stripe-signature"];
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      let event: Stripe.Event;

      try {
        if (!sig || !webhookSecret) {
          console.warn("[Webhook] Missing signature or secret");
          return res.status(400).json({ error: "Missing signature" });
        }
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("[Webhook] Signature verification failed:", message);
        return res.status(400).json({ error: `Webhook error: ${message}` });
      }

      // Handle test events for webhook verification
      if (event.id.startsWith("evt_test_")) {
        console.log("[Webhook] Test event detected, returning verification response");
        return res.json({ verified: true });
      }

      console.log(`[Webhook] Event: ${event.type} | ID: ${event.id}`);

      try {
        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            // ── Subscription mode (existing subscription plans) ──
            const userId = session.metadata?.user_id
              ? parseInt(session.metadata.user_id)
              : null;
            const subscriptionId =
              typeof session.subscription === "string"
                ? session.subscription
                : (session.subscription as any)?.id ?? null;
            if (userId && subscriptionId) {
              const db = await getDb();
              if (db) {
                await db
                  .update(userProfiles)
                  .set({ subscriptionStatus: "active", subscriptionId })
                  .where(eq(userProfiles.userId, userId));
                console.log(`[Webhook] Activated subscription for user ${userId}`);
              }
            }
            // ── One-time payment mode (funnel checkout) ──
            const orderId = session.metadata?.order_id
              ? parseInt(session.metadata.order_id)
              : null;
            if (orderId && session.mode === "payment" && session.payment_status === "paid") {
              const db = await getDb();
              if (db) {
                const orders = await db.select().from(funnelOrders)
                  .where(eq(funnelOrders.id, orderId)).limit(1);
                const order = orders[0];
                if (order && order.status !== "paid") {
                  const { sendCredentialsEmail } = await import("./email");
                  const rawPassword = randomBytes(5).toString("hex");
                  const password = rawPassword.slice(0, 4).toUpperCase() + rawPassword.slice(4);
                  const appUrl = session.metadata?.app_url || "https://vigronex.com/app";
                  const sent = await sendCredentialsEmail(order.email, order.firstName, order.email, password, appUrl);
                  await db.update(funnelOrders)
                    .set({ status: "paid", credentialsSent: sent ? 1 : 0, generatedLogin: order.email })
                    .where(eq(funnelOrders.id, orderId));
                  if (order.quizSessionId) {
                    await db.update(quizCompletions)
                      .set({ converted: 1 })
                      .where(eq(quizCompletions.sessionId, order.quizSessionId));
                  }
                  console.log(`[Webhook] Fulfilled funnel order ${orderId} via webhook backup`);
                }
              }
            }
            break;
          }

          case "customer.subscription.updated": {
            const sub = event.data.object as Stripe.Subscription;
            const userId = sub.metadata?.user_id
              ? parseInt(sub.metadata.user_id)
              : null;
            const status =
              sub.status === "active" || sub.status === "trialing"
                ? "active"
                : sub.status === "canceled"
                  ? "cancelled"
                  : sub.status === "past_due"
                    ? "past_due"
                    : "free";

            if (userId) {
              const db = await getDb();
              if (db) {
                // current_period_end is on items in newer Stripe API
                const periodEnd = (sub as unknown as { current_period_end?: number }).current_period_end;
                const endsAt = periodEnd ? new Date(periodEnd * 1000) : null;
                await db
                  .update(userProfiles)
                  .set({
                    subscriptionStatus: status as
                      | "free"
                      | "active"
                      | "cancelled"
                      | "past_due",
                    subscriptionEndsAt: endsAt,
                  })
                  .where(eq(userProfiles.userId, userId));
                console.log(
                  `[Webhook] Updated subscription status to ${status} for user ${userId}`
                );
              }
            }
            break;
          }

          case "customer.subscription.deleted": {
            const sub = event.data.object as Stripe.Subscription;
            const userId = sub.metadata?.user_id
              ? parseInt(sub.metadata.user_id)
              : null;
            if (userId) {
              const db = await getDb();
              if (db) {
                await db
                  .update(userProfiles)
                  .set({ subscriptionStatus: "cancelled" })
                  .where(eq(userProfiles.userId, userId));
                console.log(
                  `[Webhook] Cancelled subscription for user ${userId}`
                );
              }
            }
            break;
          }

          case "invoice.payment_failed": {
            const invoice = event.data.object as Stripe.Invoice;
            // subscription field type varies by Stripe API version
            const invoiceAny = invoice as unknown as { subscription?: string | { id: string } | null };
            const sub =
              typeof invoiceAny.subscription === "string"
                ? invoiceAny.subscription
                : invoiceAny.subscription?.id ?? null;
            if (sub) {
              const db = await getDb();
              if (db) {
                await db
                  .update(userProfiles)
                  .set({ subscriptionStatus: "past_due" })
                  .where(eq(userProfiles.subscriptionId, sub));
                console.log(
                  `[Webhook] Marked subscription ${sub} as past_due`
                );
              }
            }
            break;
          }

          default:
            console.log(`[Webhook] Unhandled event type: ${event.type}`);
        }

        return res.json({ received: true });
      } catch (err) {
        console.error("[Webhook] Processing error:", err);
        return res.status(500).json({ error: "Internal processing error" });
      }
    }
  );
}
