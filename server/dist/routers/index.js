import { router } from "../trpc/trpc.js";
import { funnelRouter } from "./funnel.js";
import { cognitiveRouter } from "./cognitive.js";
import { affiliateRouter } from "./affiliate.js";
import { adminRouter } from "./admin.js";
import { authRouter } from "./auth.js";
import { supportRouter } from "./support.js";
export const appRouter = router({
    funnel: funnelRouter,
    cognitive: cognitiveRouter,
    affiliate: affiliateRouter,
    admin: adminRouter,
    auth: authRouter,
    support: supportRouter,
});
