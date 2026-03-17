import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc/trpc.js";
import { query } from "../db/client.js";

export const affiliateRouter = router({
  getDashboard: protectedProcedure.query(async ({ ctx }) => {
    const clicks = await query<{ count: string }>(
      `SELECT COUNT(*) as count FROM affiliate_clicks ac
       JOIN affiliates a ON a.id = ac."affiliateId" WHERE a.email = $1`,
      [ctx.user.email]
    );
    const conv = await query<{ count: string }>(
      `SELECT COUNT(*) as count FROM affiliate_commissions ac
       JOIN affiliates a ON a.id = ac."affiliateId" WHERE a.email = $1`,
      [ctx.user.email]
    );
    const comm = await query<{ sum: string }>(
      `SELECT COALESCE(SUM("commissionAmount"), 0) as sum FROM affiliate_commissions ac
       JOIN affiliates a ON a.id = ac."affiliateId" WHERE a.email = $1`,
      [ctx.user.email]
    );
    const payouts = await query<{ amount: number; status: string; created_at: string }>(
      `SELECT amount, status, created_at FROM affiliate_payouts ap
       JOIN affiliates a ON a.id = ap."affiliateId" WHERE a.email = $1 ORDER BY created_at DESC LIMIT 10`,
      [ctx.user.email]
    );
    const aff = await query<{ code: string }>(`SELECT code FROM affiliates WHERE email = $1`, [
      ctx.user.email,
    ]);
    return {
      totalClicks: parseInt(clicks.rows[0]?.count ?? "0", 10),
      conversions: parseInt(conv.rows[0]?.count ?? "0", 10),
      commissionEarned: parseFloat(comm.rows[0]?.sum ?? "0"),
      payoutHistory: payouts.rows,
      code: aff.rows[0]?.code ?? "",
    };
  }),

  getReferralLink: protectedProcedure.query(async ({ ctx }) => {
    const aff = await query<{ code: string }>(`SELECT code FROM affiliates WHERE email = $1`, [
      ctx.user.email,
    ]);
    const code = aff.rows[0]?.code ?? "";
    const link = code ? `https://neurosharp.com/?ref=${code}` : "";
    return { link, code };
  }),

  getResources: protectedProcedure.query(async () => {
    return {
      trafficGuide: {
        tiktok: "Vídeos curtos, sons em tendência, desafios de memória.",
        meta: "Anúncios carousel, vídeos, lookalike audiences.",
        native: "Outbrain, Taboola, redes de anúncios nativos.",
        google: "Anúncios de busca (perda de memória, prevenção Alzheimer).",
      },
      swipeCopy: ["Templates de email pré-escritos", "Copy de anúncios", "Posts para redes sociais"],
      videoLibrary: ["Testimoniais", "Demos do produto", "Clips educacionais"],
      banners: ["300x250", "728x90", "970x250"],
    };
  }),

  trackClick: publicProcedure
    .input(z.object({ source: z.string(), ref: z.string() }))
    .mutation(async ({ input }) => {
      const aff = await query<{ id: number }>(`SELECT id FROM affiliates WHERE code = $1 AND status = 'active'`, [
        input.ref,
      ]);
      if (aff.rows[0]) {
        await query(
          `INSERT INTO affiliate_clicks ("affiliateId", source) VALUES ($1, $2)`,
          [aff.rows[0].id, input.source]
        );
      }
      return { success: true };
    }),
});
