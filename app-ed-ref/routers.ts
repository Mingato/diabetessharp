      .input(z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        riskLevel: z.string().optional(),
        quizSessionId: z.string().optional(),
        discountApplied: z.number().int().default(0),
        includeRecipeBump: z.boolean().default(false),
        origin: z.string(),
        refCode: z.string().optional(), // affiliate tracking code
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("DB unavailable");
        const basePrice = 2999; // $29.99 in cents
        const discount = input.discountApplied === 20 ? Math.round(basePrice * 0.2) : 0;
        const finalPrice = basePrice - discount;
        // Resolve affiliate by refCode
        let affiliateId: number | undefined;
        if (input.refCode) {
          const { affiliates: affiliatesTable } = await import("../drizzle/schema");
          const affRows = await db.select().from(affiliatesTable)
            .where(and(eq(affiliatesTable.code, input.refCode), eq(affiliatesTable.status, "active")))
            .limit(1);
          if (affRows.length > 0) affiliateId = affRows[0].id;
        }
        // Create pending order
        const [result] = await db.insert(funnelOrders).values({
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phone: input.phone,
          riskLevel: input.riskLevel,
          quizSessionId: input.quizSessionId,
          discountApplied: input.discountApplied,
          amountPaid: finalPrice,
          status: "pending",
          credentialsSent: 0,
          affiliateId: affiliateId ?? null,
          affiliateCode: input.refCode ?? null,
        });
        const orderId = (result as unknown as { insertId: number }).insertId;
        // Build Carpanda URL
        const linkKey = input.discountApplied === 20 ? "mainDiscount" : "main";
        const carpandaUrl = buildCarpandaUrl(linkKey, orderId, input.email, input.firstName, input.includeRecipeBump);
        return { orderId, url: carpandaUrl, includeRecipeBump: input.includeRecipeBump };
      }),

    // ── Carpanda: Confirm payment (called from success redirect page) ───────────
    confirmCarpandaPayment: publicProcedure
      .input(z.object({
        orderId: z.number().int(),
        origin: z.string(),
        includeRecipeBump: z.boolean().default(false),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("DB unavailable");
        const orders = await db.select().from(funnelOrders)
          .where(eq(funnelOrders.id, input.orderId)).limit(1);
        if (!orders.length) throw new Error("Order not found");
        const order = orders[0];
        // Idempotent: already fulfilled
        if (order.status === "paid" && order.credentialsSent === 1) {
          return { success: true, email: order.email, firstName: order.firstName, orderId: order.id, alreadyFulfilled: true };
        }
        const { sendCredentialsEmail } = await import("./email");
        const rawPassword = randomBytes(5).toString("hex");
        const password = rawPassword.slice(0, 4).toUpperCase() + rawPassword.slice(4);
        const appUrl = `${input.origin}/app`;
        const sent = await sendCredentialsEmail(order.email, order.firstName, order.email, password, appUrl);
        await db.update(funnelOrders)
          .set({
            status: "paid",
            credentialsSent: sent ? 1 : 0,
            generatedLogin: order.email,
            upsell3Purchased: input.includeRecipeBump ? 1 : 0,
          })
          .where(eq(funnelOrders.id, order.id));
        if (order.quizSessionId) {
          await db.update(quizCompletions)
            .set({ converted: 1 })
            .where(eq(quizCompletions.sessionId, order.quizSessionId));
        }
        return { success: true, email: order.email, firstName: order.firstName, orderId: order.id, alreadyFulfilled: false, recipeBumpIncluded: input.includeRecipeBump };
      }),

    // ── Carpanda: Get upsell Carpanda link ──────────────────────────────────────
    getCarpandaUpsellUrl: publicProcedure
      .input(z.object({
        orderId: z.number().int(),
        upsell: z.enum(["upsell1", "upsell2", "upsell3"]),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("DB unavailable");
        const orders = await db.select().from(funnelOrders)
          .where(eq(funnelOrders.id, input.orderId)).limit(1);
        if (!orders.length) throw new Error("Order not found");
        const order = orders[0];
        const url = buildCarpandaUrl(input.upsell, input.orderId, order.email, order.firstName);
        return { url };
      }),

    // ── Carpanda: Confirm upsell payment ────────────────────────────────────────
    confirmCarpandaUpsell: publicProcedure
      .input(z.object({
        orderId: z.number().int(),
        upsell: z.enum(["upsell1", "upsell2", "upsell3"]),
      }))
      .mutation(async ({ input }) => {