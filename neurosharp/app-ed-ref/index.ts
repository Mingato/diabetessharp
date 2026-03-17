import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { registerStripeWebhook } from "../stripe-webhook";
import { photoRouter } from "../photo-upload";
import { registerSecurityMiddleware } from "../security";
import { csrfTokenHandler } from "../csrf";
import { sendDailyCheckinReminders, sendExerciseReminders, sendRomanceReminders, sendWeeklyChallengeNotifications, sendMealReminders } from "../push-notifications";
import { getOrdersNeedingDay3Email, markDay3EmailSent, getOrdersNeedingDay1UpsellEmail, markDay1UpsellEmailSent, getOrdersNeedingDay7Email, markDay7EmailSent, getOrdersNeedingDay30Email, markDay30EmailSent, getOrdersNeedingDay60Email, markDay60EmailSent } from "../db";
import { sendDay3FollowUpEmail, sendDay1UpsellRecoveryEmail, sendDay7ResultsEmail, sendDay30ProgressEmail, sendDay60ReengagementEmail } from "../email";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Security hardening — must be registered before body parsers and routes
  registerSecurityMiddleware(app);
  // Register Stripe webhook BEFORE json body parser (needs raw body for signature verification)
  registerStripeWebhook(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // CSRF token endpoint
  app.get("/api/csrf-token", csrfTokenHandler);
  // Progress photo upload routes
  app.use("/api/photos", photoRouter);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });

  // ── Scheduled push notifications ─────────────────────────────────────────
  // Run every hour and check if it's time to send notifications
  setInterval(async () => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();

    // Daily check-in reminder at 9:00 AM
    if (hour === 9 && minute < 5) {
      const sent = await sendDailyCheckinReminders();
      if (sent > 0) console.log(`[Push] Sent ${sent} check-in reminders`);
    }

    // Exercise reminder at 7:00 AM
    if (hour === 7 && minute < 5) {
      const sent = await sendExerciseReminders();
      if (sent > 0) console.log(`[Push] Sent ${sent} exercise reminders`);
    }

    // Romance tip at 8:00 PM
    if (hour === 20 && minute < 5) {
      const sent = await sendRomanceReminders();
      if (sent > 0) console.log(`[Push] Sent ${sent} romance reminders`);
    }

    // Weekly challenge notification every Monday at 9:00 AM
    const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon
    if (dayOfWeek === 1 && hour === 9 && minute < 5) {
      const sent = await sendWeeklyChallengeNotifications();
      if (sent > 0) console.log(`[Push] Sent ${sent} weekly challenge notifications`);
    }

    // Meal reminders — checked every 5 min, fires when current time matches user's saved reminder time
    const mealSent = await sendMealReminders();
    if (mealSent > 0) console.log(`[Push] Sent ${mealSent} meal reminders`);

    // Day 1 upsell recovery emails — run once per hour for orders 24-48h old with skipped upsells
    if (minute < 5) {
      try {
        const day1Orders = await getOrdersNeedingDay1UpsellEmail();
        for (const order of day1Orders) {
          const skipped = {
            upsell1: order.upsell1Purchased === 0,
            upsell2: order.upsell2Purchased === 0,
            upsell3: order.upsell3Purchased === 0,
          };
          const origin = process.env.VITE_OAUTH_PORTAL_URL?.replace('/portal', '') || 'https://vigronex.com';
          const sent = await sendDay1UpsellRecoveryEmail(
            order.email,
            order.firstName,
            order.id,
            skipped,
            origin
          );
          if (sent) {
            await markDay1UpsellEmailSent(order.id);
            console.log(`[Email] Sent Day 1 upsell recovery to ${order.email}`);
          }
        }
        if (day1Orders.length > 0) console.log(`[Email] Processed ${day1Orders.length} Day 1 upsell recovery emails`);
      } catch (err) {
        console.error("[Email] Day 1 upsell recovery job failed:", err);
      }
    }

    // Day 3 follow-up emails — checked every 5 min, fires for orders 3 days old
    if (minute < 5) { // run once per hour to avoid duplicate sends
      try {
        const orders = await getOrdersNeedingDay3Email();
        for (const order of orders) {
          const fullName = `${order.firstName} ${order.lastName}`.trim();
          const sent = await sendDay3FollowUpEmail(order.email, fullName);
          if (sent) {
            await markDay3EmailSent(order.id);
            console.log(`[Email] Sent Day 3 follow-up to ${order.email}`);
          }
        }
        if (orders.length > 0) console.log(`[Email] Processed ${orders.length} Day 3 follow-up emails`);
      } catch (err) {
        console.error("[Email] Day 3 follow-up job failed:", err);
      }
    }

    // Day 7 results tip emails — for paid orders exactly 7 days old
    if (minute < 5) {
      try {
        const appUrl = process.env.VITE_OAUTH_PORTAL_URL?.replace('/portal', '') || 'https://vigronex.com';
        const day7Orders = await getOrdersNeedingDay7Email();
        for (const order of day7Orders) {
          const sent = await sendDay7ResultsEmail(order.email, order.firstName, appUrl);
          if (sent) {
            await markDay7EmailSent(order.id);
            console.log(`[Email] Sent Day 7 results tip to ${order.email}`);
          }
        }
        if (day7Orders.length > 0) console.log(`[Email] Processed ${day7Orders.length} Day 7 results emails`);
      } catch (err) {
        console.error("[Email] Day 7 results job failed:", err);
      }
    }

    // Day 30 progress milestone emails — for paid orders exactly 30 days old
    if (minute < 5) {
      try {
        const appUrl = process.env.VITE_OAUTH_PORTAL_URL?.replace('/portal', '') || 'https://vigronex.com';
        const day30Orders = await getOrdersNeedingDay30Email();
        for (const order of day30Orders) {
          const sent = await sendDay30ProgressEmail(order.email, order.firstName, appUrl);
          if (sent) {
            await markDay30EmailSent(order.id);
            console.log(`[Email] Sent Day 30 progress milestone to ${order.email}`);
          }
        }
        if (day30Orders.length > 0) console.log(`[Email] Processed ${day30Orders.length} Day 30 progress emails`);
      } catch (err) {
        console.error("[Email] Day 30 progress job failed:", err);
      }
    }

    // Day 60 re-engagement emails — for paid orders exactly 60 days old
    if (minute < 5) {
      try {
        const appUrl = process.env.VITE_OAUTH_PORTAL_URL?.replace('/portal', '') || 'https://vigronex.com';
        const day60Orders = await getOrdersNeedingDay60Email();
        for (const order of day60Orders) {
          const sent = await sendDay60ReengagementEmail(order.email, order.firstName, appUrl);
          if (sent) {
            await markDay60EmailSent(order.id);
            console.log(`[Email] Sent Day 60 re-engagement to ${order.email}`);
          }
        }
        if (day60Orders.length > 0) console.log(`[Email] Processed ${day60Orders.length} Day 60 re-engagement emails`);
      } catch (err) {
        console.error("[Email] Day 60 re-engagement job failed:", err);
      }
    }
  }, 5 * 60 * 1000); // check every 5 minutes
}

startServer().catch(console.error);
