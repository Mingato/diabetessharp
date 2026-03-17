import { router, publicProcedure, protectedProcedure } from "../trpc/trpc.js";
import { COOKIE_NAME, REFRESH_COOKIE_NAME } from "../auth/const.js";
import { getValidCookieDomain } from "../cookieUtils.js";

function clearAuthCookies(res: { clearCookie: (name: string, opts?: object) => void }, req?: { hostname?: string }) {
  const cookieDomain = getValidCookieDomain(req);
  const opts = { path: "/", ...(cookieDomain ? { domain: cookieDomain } : {}) };
  res.clearCookie(COOKIE_NAME, opts);
  res.clearCookie(REFRESH_COOKIE_NAME, opts);
}

export const authRouter = router({
  logout: publicProcedure.mutation(({ ctx }) => {
    clearAuthCookies(ctx.res, ctx.req);
    return { ok: true };
  }),

  me: protectedProcedure.query(({ ctx }) => {
    return { user: ctx.user };
  }),
});
