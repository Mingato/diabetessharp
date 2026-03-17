import { z } from "zod";
import bcrypt from "bcryptjs";
import { router, publicProcedure, protectedProcedure } from "../trpc/trpc.js";
import { query } from "../db/client.js";

function encodeToken(payload: { id: number; email: string }): string {
  return Buffer.from(JSON.stringify(payload), "utf-8").toString("base64url");
}

export const authRouter = router({
  login: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async ({ input }) => {
      const r = await query<{ id: number; email: string; role: string; password_hash: string }>(
        `SELECT id, email, role, password_hash FROM users WHERE email = $1`,
        [input.email]
      );
      const user = r.rows[0];
      if (!user || !user.password_hash) return { ok: false as const, error: "Invalid credentials" };
      const match = await bcrypt.compare(input.password, user.password_hash);
      if (!match) return { ok: false as const, error: "Invalid credentials" };
      const token = encodeToken({ id: user.id, email: user.email });
      return {
        ok: true as const,
        token,
        user: { id: user.id, email: user.email, role: user.role },
      };
    }),

  me: protectedProcedure.query(({ ctx }) => {
    return { user: ctx.user };
  }),
});
