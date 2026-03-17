import { z } from "zod";
import { router, publicProcedure } from "../trpc/trpc.js";
import { query } from "../db/client.js";
export const supportRouter = router({
    submitMessage: publicProcedure
        .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        category: z.string(),
        subject: z.string().optional(),
        message: z.string().min(1),
        orderId: z.number().optional(),
    }))
        .mutation(async ({ input }) => {
        await query(`INSERT INTO support_messages (name, email, category, subject, message, "orderId")
         VALUES ($1, $2, $3, $4, $5, $6)`, [input.name, input.email, input.category, input.subject ?? "", input.message, input.orderId ?? null]);
        return { success: true };
    }),
});
