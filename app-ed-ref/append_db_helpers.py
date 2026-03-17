new_code = """
// ── Day 7 Results Email Helpers ───────────────────────────────────────────────
export async function getOrdersNeedingDay7Email() {
  const db = await getDb();
  if (!db) return [];
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000);
  return db.select()
    .from(funnelOrders)
    .where(
      and(
        eq(funnelOrders.status, "paid"),
        eq(funnelOrders.day7EmailSent, 0),
        lte(funnelOrders.createdAt, sevenDaysAgo),
        gte(funnelOrders.createdAt, eightDaysAgo)
      )
    )
    .limit(100);
}
export async function markDay7EmailSent(orderId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(funnelOrders)
    .set({ day7EmailSent: 1 })
    .where(eq(funnelOrders.id, orderId));
}

// ── Day 30 Progress Email Helpers ─────────────────────────────────────────────
export async function getOrdersNeedingDay30Email() {
  const db = await getDb();
  if (!db) return [];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const thirtyOneDaysAgo = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000);
  return db.select()
    .from(funnelOrders)
    .where(
      and(
        eq(funnelOrders.status, "paid"),
        eq(funnelOrders.day30EmailSent, 0),
        lte(funnelOrders.createdAt, thirtyDaysAgo),
        gte(funnelOrders.createdAt, thirtyOneDaysAgo)
      )
    )
    .limit(100);
}
export async function markDay30EmailSent(orderId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(funnelOrders)
    .set({ day30EmailSent: 1 })
    .where(eq(funnelOrders.id, orderId));
}

// ── Day 60 Re-engagement Email Helpers ───────────────────────────────────────
export async function getOrdersNeedingDay60Email() {
  const db = await getDb();
  if (!db) return [];
  const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
  const sixtyOneDaysAgo = new Date(Date.now() - 61 * 24 * 60 * 60 * 1000);
  return db.select()
    .from(funnelOrders)
    .where(
      and(
        eq(funnelOrders.status, "paid"),
        eq(funnelOrders.day60EmailSent, 0),
        lte(funnelOrders.createdAt, sixtyDaysAgo),
        gte(funnelOrders.createdAt, sixtyOneDaysAgo)
      )
    )
    .limit(100);
}
export async function markDay60EmailSent(orderId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(funnelOrders)
    .set({ day60EmailSent: 1 })
    .where(eq(funnelOrders.id, orderId));
}
"""

with open('/home/ubuntu/riseup-app/server/db.ts', 'a') as f:
    f.write(new_code)

print("Done")
