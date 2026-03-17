import { initTRPC, TRPCError } from "@trpc/server";
const t = initTRPC.context().create();
export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
    if (!ctx.user)
        throw new TRPCError({ code: "UNAUTHORIZED" });
    return next({ ctx: { ...ctx, user: ctx.user } });
});
export const adminProcedure = t.procedure.use(({ ctx, next }) => {
    if (!ctx.user || ctx.user.role !== "admin")
        throw new TRPCError({ code: "FORBIDDEN" });
    return next({ ctx: { ...ctx, user: ctx.user } });
});
