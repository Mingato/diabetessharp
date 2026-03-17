import { z } from "zod";
import { router, adminProcedure } from "../trpc/trpc.js";
import { query } from "../db/client.js";
import { confirmPayment } from "../services/confirmPayment.js";

export const adminRouter = router({
  getOrders: adminProcedure.query(async () => {
    const r = await query(
      `SELECT id, "firstName", "lastName", email, "cognitiveProfile", status, "amountPaid", "cognitiveRiskScore", created_at
       FROM funnel_orders ORDER BY created_at DESC LIMIT 200`
    );
    return { orders: r.rows };
  }),

  getAffiliateStats: adminProcedure.query(async () => {
    const aff = await query(
      `SELECT id, name, email, code, tier, "totalCommissionEarned", status FROM affiliates`
    );
    const comm = await query<{ sum: string }>(
      `SELECT COALESCE(SUM("commissionAmount"), 0) as sum FROM affiliate_commissions`
    );
    const top = await query(
      `SELECT a.name, a.code, COUNT(ac.id) as conversions, SUM(ac."commissionAmount") as total
       FROM affiliates a LEFT JOIN affiliate_commissions ac ON a.id = ac."affiliateId"
       GROUP BY a.id ORDER BY total DESC NULLS LAST LIMIT 10`
    );
    return {
      affiliates: aff.rows,
      totalCommissions: parseFloat(comm.rows[0]?.sum ?? "0"),
      topPerformers: top.rows,
    };
  }),

  createTestOrder: adminProcedure
    .input(
      z.object({
        email: z.string().email(),
        firstName: z.string(),
        lastName: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const order = await query<{ id: number }>(
        `INSERT INTO funnel_orders ("firstName", "lastName", email, status, "amountPaid") VALUES ($1, $2, $3, 'pending', 2999) RETURNING id`,
        [input.firstName, input.lastName, input.email]
      );
      const orderId = order.rows[0].id;
      const result = await confirmPayment(orderId);
      return {
        orderId,
        credentials: {
          email: result.login ?? `neurosharp_${orderId}`,
          password: result.password ?? "",
        },
      };
    }),

  updateCarpandaLinks: adminProcedure
    .input(
      z.object({
        main: z.string().optional(),
        mainDiscount: z.string().optional(),
        recipeBump: z.string().optional(),
        upsell1: z.string().optional(),
        upsell2: z.string().optional(),
        upsell3: z.string().optional(),
      })
    )
    .mutation(async () => {
      return { success: true };
    }),

  getSupportTickets: adminProcedure.query(async () => {
    const r = await query(
      `SELECT id, name, email, category, subject, message, "orderId", status, created_at
       FROM support_messages ORDER BY created_at DESC LIMIT 500`
    );
    return { tickets: r.rows };
  }),

  updateSupportStatus: adminProcedure
    .input(z.object({ id: z.number(), status: z.enum(["open", "replied", "resolved"]) }))
    .mutation(async ({ input }) => {
      await query(`UPDATE support_messages SET status = $1 WHERE id = $2`, [input.status, input.id]);
      return { success: true };
    }),

  createAffiliate: adminProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(8),
        code: z.string().min(2),
      })
    )
    .mutation(async ({ input }) => {
      const bcrypt = await import("bcryptjs");
      const hash = await bcrypt.default.hash(input.password, 10);
      await query(
        `INSERT INTO users (email, password_hash, role) VALUES ($1, $2, 'affiliate') ON CONFLICT (email) DO NOTHING`,
        [input.email, hash]
      );
      await query(
        `INSERT INTO affiliates (name, email, code, status) VALUES ($1, $2, $3, 'active')
         ON CONFLICT (email) DO NOTHING`,
        [input.name, input.email, input.code]
      );
      return { success: true };
    }),
});
