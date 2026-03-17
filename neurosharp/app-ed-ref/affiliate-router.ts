/**
 * affiliate-router.ts
 * Full affiliate program backend: registration, auth, tracking, commissions, payouts.
 * Public procedures: register, login, trackClick, getPublicStats
 * Protected (affiliate JWT): dashboard, profile update
 * Admin procedures: list, approve/suspend, set commission, mark payout
 */
import { router, publicProcedure } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { TRPCError } from "@trpc/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { eq, desc, and, sql } from "drizzle-orm";
import {
  affiliates,
  affiliateClicks,
  affiliateCommissions,
  affiliatePayouts,
  funnelOrders,
} from "../drizzle/schema";

const AFFILIATE_JWT_SECRET = (process.env.JWT_SECRET || "secret") + "_affiliate";
const ADMIN_JWT_SECRET = (process.env.JWT_SECRET || "secret") + "_admin";

// ── Helpers ──────────────────────────────────────────────────────────────────

function generateAffiliateCode(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 20);
  const suffix = randomBytes(3).toString("hex"); // 6 chars
  return `${slug}-${suffix}`;
}

function signAffiliateToken(affiliateId: number, email: string): string {
  return jwt.sign({ affiliateId, email, type: "affiliate" }, AFFILIATE_JWT_SECRET, { expiresIn: "30d" });
}

function verifyAffiliateToken(token: string): { affiliateId: number; email: string } | null {
  try {
    const payload = jwt.verify(token, AFFILIATE_JWT_SECRET) as { affiliateId: number; email: string; type: string };
    if (payload.type !== "affiliate") return null;
    return { affiliateId: payload.affiliateId, email: payload.email };
  } catch {
    return null;
  }
}

function verifyAdminToken(token: string): boolean {
  try {
    const payload = jwt.verify(token, ADMIN_JWT_SECRET) as { type: string };
    return payload.type === "admin";
  } catch {
    return false;
  }
}

// Middleware: require affiliate JWT
const affiliateProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const req = ctx.req as { headers: Record<string, string | string[] | undefined> };
  const token = req.headers["x-affiliate-token"] as string | undefined;
  if (!token) throw new TRPCError({ code: "UNAUTHORIZED", message: "Affiliate token required" });
  const payload = verifyAffiliateToken(token);
  if (!payload) throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid or expired affiliate token" });
  return next({ ctx: { ...ctx, affiliateId: payload.affiliateId } });
});

// Middleware: require admin JWT
const adminProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const req = ctx.req as { headers: Record<string, string | string[] | undefined> };
  const token = req.headers["x-admin-token"] as string | undefined;
  if (token && verifyAdminToken(token)) return next({ ctx });
  const sessionUser = (ctx as any).user as { role?: string } | undefined;
  if (sessionUser?.role === "admin") return next({ ctx });
  throw new TRPCError({ code: "UNAUTHORIZED", message: "Admin access required" });
});

// ── Router ────────────────────────────────────────────────────────────────────

export const affiliateRouter = router({

  // ── Public: Affiliate Registration ────────────────────────────────────────
  register: publicProcedure
    .input(z.object({
      name: z.string().min(2).max(100),
      email: z.string().email(),
      password: z.string().min(8),
      paypalEmail: z.string().email().optional(),
      trafficSource: z.string().optional(), // meta, tiktok, google, native, other
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      // Check if email already exists
      const existing = await db.select({ id: affiliates.id }).from(affiliates).where(eq(affiliates.email, input.email)).limit(1);
      if (existing.length > 0) throw new TRPCError({ code: "CONFLICT", message: "Email already registered" });
      const passwordHash = await bcrypt.hash(input.password, 12);
      const code = generateAffiliateCode(input.name);
      await db.insert(affiliates).values({
        name: input.name,
        email: input.email,
        passwordHash,
        code,
        status: "pending", // admin must approve
        commissionRate: 40,
        paypalEmail: input.paypalEmail,
        adminNotes: input.trafficSource ? `Traffic source: ${input.trafficSource}` : undefined,
      });
      return { success: true, message: "Application submitted! You will receive an email once approved." };
    }),

  // ── Public: Affiliate Login ────────────────────────────────────────────────
  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const [affiliate] = await db.select().from(affiliates).where(eq(affiliates.email, input.email)).limit(1);
      if (!affiliate) throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });
      const valid = await bcrypt.compare(input.password, affiliate.passwordHash);
      if (!valid) throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });
      if (affiliate.status === "pending") throw new TRPCError({ code: "FORBIDDEN", message: "Your account is pending approval. We'll notify you by email." });
      if (affiliate.status === "suspended") throw new TRPCError({ code: "FORBIDDEN", message: "Your account has been suspended. Contact support." });
      // Update last login
      await db.update(affiliates).set({ lastLoginAt: new Date() }).where(eq(affiliates.id, affiliate.id));
      const token = signAffiliateToken(affiliate.id, affiliate.email);
      return {
        token,
        affiliate: {
          id: affiliate.id,
          name: affiliate.name,
          email: affiliate.email,
          code: affiliate.code,
          commissionRate: affiliate.commissionRate,
          totalClicks: affiliate.totalClicks,
          totalSales: affiliate.totalSales,
          totalEarnings: affiliate.totalEarnings,
          totalPaid: affiliate.totalPaid,
          paypalEmail: affiliate.paypalEmail,
        },
      };
    }),

  // ── Public: Track Click ────────────────────────────────────────────────────
  trackClick: publicProcedure
    .input(z.object({
      code: z.string(),
      landingPage: z.string().optional(),
      referer: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return { sessionToken: null };
      const [affiliate] = await db.select({ id: affiliates.id, status: affiliates.status })
        .from(affiliates).where(eq(affiliates.code, input.code)).limit(1);
      if (!affiliate || affiliate.status !== "active") return { sessionToken: null };
      const sessionToken = randomBytes(16).toString("hex");
      const req = ctx.req as { headers: Record<string, string | string[] | undefined>; ip?: string };
      const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip || "unknown";
      const userAgent = (req.headers["user-agent"] as string)?.slice(0, 500) || "";
      const [result] = await db.insert(affiliateClicks).values({
        affiliateId: affiliate.id,
        ip,
        userAgent,
        referer: input.referer?.slice(0, 500),
        landingPage: input.landingPage || "/",
        sessionToken,
      });
      // Increment click counter
      await db.update(affiliates).set({ totalClicks: sql`total_clicks + 1` }).where(eq(affiliates.id, affiliate.id));
      return { sessionToken, clickId: (result as any).insertId };
    }),

  // ── Protected (Affiliate): Dashboard ──────────────────────────────────────
  dashboard: affiliateProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const affiliateId = (ctx as any).affiliateId as number;
      const [affiliate] = await db.select().from(affiliates).where(eq(affiliates.id, affiliateId)).limit(1);
      if (!affiliate) throw new TRPCError({ code: "NOT_FOUND" });
      // Recent commissions
      const commissions = await db.select().from(affiliateCommissions)
        .where(eq(affiliateCommissions.affiliateId, affiliateId))
        .orderBy(desc(affiliateCommissions.createdAt))
        .limit(20);
      // Recent payouts
      const payouts = await db.select().from(affiliatePayouts)
        .where(eq(affiliatePayouts.affiliateId, affiliateId))
        .orderBy(desc(affiliatePayouts.createdAt))
        .limit(10);
      // Pending balance
      const pendingCommissions = commissions.filter(c => c.status === "pending" || c.status === "approved");
      const pendingBalance = pendingCommissions.reduce((sum, c) => sum + c.commissionAmount, 0);
      return {
        affiliate: {
          id: affiliate.id,
          name: affiliate.name,
          email: affiliate.email,
          code: affiliate.code,
          commissionRate: affiliate.commissionRate,
          totalClicks: affiliate.totalClicks,
          totalSales: affiliate.totalSales,
          totalEarnings: affiliate.totalEarnings,
          totalPaid: affiliate.totalPaid,
          paypalEmail: affiliate.paypalEmail,
          paymentMethod: affiliate.paymentMethod,
        },
        pendingBalance,
        commissions,
        payouts,
      };
    }),

  // ── Protected (Affiliate): Update Profile ─────────────────────────────────
  updateProfile: affiliateProcedure
    .input(z.object({
      paypalEmail: z.string().email().optional(),
      paymentMethod: z.enum(["paypal", "bank", "crypto"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const affiliateId = (ctx as any).affiliateId as number;
      await db.update(affiliates).set(input).where(eq(affiliates.id, affiliateId));
      return { success: true };
    }),

  // ── Admin: List Affiliates ─────────────────────────────────────────────────
  adminList: adminProcedure
    .input(z.object({
      status: z.enum(["all", "pending", "active", "suspended"]).default("all"),
      page: z.number().default(1),
      limit: z.number().default(20),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { affiliates: [], total: 0 };
      const offset = (input.page - 1) * input.limit;
      let query = db.select().from(affiliates).orderBy(desc(affiliates.createdAt));
      const all = await query;
      const filtered = input.status === "all" ? all : all.filter(a => a.status === input.status);
      const paginated = filtered.slice(offset, offset + input.limit);
      return {
        affiliates: paginated.map(a => ({
          ...a,
          passwordHash: undefined, // never expose
        })),
        total: filtered.length,
      };
    }),

  // ── Admin: Get Affiliate Detail ────────────────────────────────────────────
  adminGetAffiliate: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const [affiliate] = await db.select().from(affiliates).where(eq(affiliates.id, input.id)).limit(1);
      if (!affiliate) throw new TRPCError({ code: "NOT_FOUND" });
      const commissions = await db.select().from(affiliateCommissions)
        .where(eq(affiliateCommissions.affiliateId, input.id))
        .orderBy(desc(affiliateCommissions.createdAt))
        .limit(50);
      const payouts = await db.select().from(affiliatePayouts)
        .where(eq(affiliatePayouts.affiliateId, input.id))
        .orderBy(desc(affiliatePayouts.createdAt));
      const recentClicks = await db.select().from(affiliateClicks)
        .where(eq(affiliateClicks.affiliateId, input.id))
        .orderBy(desc(affiliateClicks.createdAt))
        .limit(20);
      return { affiliate: { ...affiliate, passwordHash: undefined }, commissions, payouts, recentClicks };
    }),

  // ── Admin: Approve / Suspend Affiliate ────────────────────────────────────
  adminUpdateStatus: adminProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["active", "suspended", "pending"]),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.update(affiliates)
        .set({ status: input.status, adminNotes: input.notes })
        .where(eq(affiliates.id, input.id));
      return { success: true };
    }),

  // ── Admin: Set Commission Rate ─────────────────────────────────────────────
  adminSetCommission: adminProcedure
    .input(z.object({
      id: z.number(),
      commissionRate: z.number().min(1).max(80),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.update(affiliates)
        .set({ commissionRate: input.commissionRate })
        .where(eq(affiliates.id, input.id));
      return { success: true };
    }),

  // ── Admin: Approve Commission ──────────────────────────────────────────────
  adminApproveCommission: adminProcedure
    .input(z.object({ commissionId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.update(affiliateCommissions)
        .set({ status: "approved" })
        .where(eq(affiliateCommissions.id, input.commissionId));
      return { success: true };
    }),

  // ── Admin: Mark Payout Sent ────────────────────────────────────────────────
  adminMarkPayout: adminProcedure
    .input(z.object({
      affiliateId: z.number(),
      amount: z.number(), // in cents
      method: z.string(),
      reference: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const batchId = `PAY-${Date.now()}-${randomBytes(3).toString("hex")}`;
      // Insert payout record
      await db.insert(affiliatePayouts).values({
        affiliateId: input.affiliateId,
        batchId,
        amount: input.amount,
        method: input.method,
        reference: input.reference,
        notes: input.notes,
        status: "sent",
      });
      // Mark all approved commissions as paid
      await db.update(affiliateCommissions)
        .set({ status: "paid", paidAt: new Date(), payoutBatchId: batchId })
        .where(and(
          eq(affiliateCommissions.affiliateId, input.affiliateId),
          eq(affiliateCommissions.status, "approved"),
        ));
      // Update affiliate totals
      await db.update(affiliates)
        .set({ totalPaid: sql`total_paid + ${input.amount}` })
        .where(eq(affiliates.id, input.affiliateId));
      return { success: true, batchId };
    }),

  // ── Admin: Stats Overview ──────────────────────────────────────────────────
  adminStats: adminProcedure
    .query(async () => {
      const db = await getDb();
      if (!db) return { total: 0, active: 0, pending: 0, totalCommissions: 0, pendingPayout: 0 };
      const all = await db.select({
        status: affiliates.status,
        totalEarnings: affiliates.totalEarnings,
        totalPaid: affiliates.totalPaid,
      }).from(affiliates);
      const total = all.length;
      const active = all.filter(a => a.status === "active").length;
      const pending = all.filter(a => a.status === "pending").length;
      const totalCommissions = all.reduce((s, a) => s + (a.totalEarnings || 0), 0);
      const pendingPayout = all.reduce((s, a) => s + ((a.totalEarnings || 0) - (a.totalPaid || 0)), 0);
      return { total, active, pending, totalCommissions, pendingPayout };
    }),
});

// ── Exported helper: record a commission when an order is confirmed ───────────
export async function recordAffiliateCommission(params: {
  affiliateCode: string;
  affiliateClickId: number | null;
  orderId: number;
  productType: string;
  saleAmount: number; // cents
}) {
  try {
    const db = await getDb();
    if (!db) return;
    const [affiliate] = await db.select({ id: affiliates.id, commissionRate: affiliates.commissionRate })
      .from(affiliates)
      .where(and(eq(affiliates.code, params.affiliateCode), eq(affiliates.status, "active")))
      .limit(1);
    if (!affiliate) return;
    const commissionAmount = Math.round(params.saleAmount * affiliate.commissionRate / 100);
    await db.insert(affiliateCommissions).values({
      affiliateId: affiliate.id,
      orderId: params.orderId,
      clickId: params.affiliateClickId,
      productType: params.productType,
      saleAmount: params.saleAmount,
      commissionRate: affiliate.commissionRate,
      commissionAmount,
      status: "pending",
    });
    // Update affiliate stats
    await db.update(affiliates).set({
      totalSales: sql`total_sales + 1`,
      totalEarnings: sql`total_earnings + ${commissionAmount}`,
    }).where(eq(affiliates.id, affiliate.id));
    // Mark click as converted
    if (params.affiliateClickId) {
      await db.update(affiliateClicks)
        .set({ converted: 1 })
        .where(eq(affiliateClicks.id, params.affiliateClickId));
    }
  } catch (err) {
    console.error("[Affiliate] Failed to record commission:", err);
  }
}
