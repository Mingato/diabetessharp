/**
 * tools-router.ts
 * Admin tools: test order creation and Carpanda payment link management.
 * Kept in a separate router to avoid TypeScript inference limits on adminRouter.
 */
import { router, publicProcedure } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { TRPCError } from "@trpc/server";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";
import { funnelOrders, carpandaSettings } from "../drizzle/schema";
import { sendCredentialsEmail } from "./email";

const ADMIN_JWT_SECRET = process.env.JWT_SECRET + "_admin";

function verifyAdminToken(token: string): boolean {
  try {
    const payload = jwt.verify(token, ADMIN_JWT_SECRET) as { type: string };
    return payload.type === "admin";
  } catch {
    return false;
  }
}

// Re-use the adminProcedure pattern via a middleware on publicProcedure
import { protectedProcedure } from "./_core/trpc";

const adminGuard = publicProcedure.use(async ({ ctx, next }) => {
  const req = ctx.req as { headers: Record<string, string | string[] | undefined> };
  const token = req.headers["x-admin-token"] as string | undefined;
  if (token && verifyAdminToken(token)) {
    return next({ ctx });
  }
  // Also allow main-app OAuth admin
  const sessionUser = (ctx as any).user as { role?: string } | undefined;
  if (sessionUser?.role === "admin") return next({ ctx });
  throw new TRPCError({ code: "UNAUTHORIZED", message: "Admin access required" });
});

export const toolsRouter = router({
  // ── Create Test Order ──────────────────────────────────────────────────────
  createTestOrder: adminGuard
    .input(z.object({
      email: z.string().email(),
      firstName: z.string().min(1),
      lastName: z.string().default("Test"),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      const password = randomBytes(4).toString("hex"); // 8-char hex password
      const orderId = `TEST-${Date.now()}`;
      // Insert test order as paid
      const [result] = await db.insert(funnelOrders).values({
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        stripeSessionId: orderId, // store test order ID in stripeSessionId
        status: "paid",
        amountPaid: 0, // test order — no charge
        credentialsSent: 0,
        upsell1Purchased: 0,
        upsell2Purchased: 0,
        upsell3Purchased: 0,
      });
      const insertedId = (result as any).insertId as number;
      // Send credentials email immediately
      const appUrl = process.env.VITE_OAUTH_PORTAL_URL?.replace("/portal", "") || "https://vigronex.com";
      const sent = await sendCredentialsEmail(input.email, input.firstName, input.email, password, appUrl);
      if (sent) {
        await db.update(funnelOrders).set({ credentialsSent: 1 }).where(eq(funnelOrders.id, insertedId));
      }
      return { success: true, orderId, emailSent: sent, password };
    }),

  // ── Carpanda Settings ──────────────────────────────────────────────────────
  getCarpandaSettings: adminGuard
    .query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(carpandaSettings).orderBy(carpandaSettings.key);
    }),

  updateCarpandaLink: adminGuard
    .input(z.object({
      key: z.string(),
      url: z.string().min(1, "URL cannot be empty"),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.update(carpandaSettings)
        .set({ url: input.url })
        .where(eq(carpandaSettings.key, input.key));
      return { success: true };
    }),
});
