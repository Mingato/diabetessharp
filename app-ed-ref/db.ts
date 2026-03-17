import { and, eq, lte, gte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, funnelOrders } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

// ── Single-session security helpers ──────────────────────────────────────────

/** Store the active session token for a user (replaces any previous token) */
export async function updateUserSessionToken(openId: string, token: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ activeSessionToken: token }).where(eq(users.openId, openId));
}

/** Validate that the provided token matches the stored active session token */
export async function validateSessionToken(openId: string, token: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return true; // fail-open if DB unavailable
  const result = await db.select({ activeSessionToken: users.activeSessionToken })
    .from(users).where(eq(users.openId, openId)).limit(1);
  if (result.length === 0) return false;
  const stored = result[0].activeSessionToken;
  // If no token stored yet (legacy user), allow and let next login set it
  if (!stored) return true;
  return stored === token;
}

// ── Day 1 Upsell Recovery Email Helpers ─────────────────────────────────

/** Get paid orders that are 24-48h old, have at least one skipped upsell, and haven't received the Day 1 email */
export async function getOrdersNeedingDay1UpsellEmail() {
  const db = await getDb();
  if (!db) return [];
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
  return db.select()
    .from(funnelOrders)
    .where(
      and(
        eq(funnelOrders.status, "paid"),
        eq(funnelOrders.day1UpsellEmailSent, 0),
        // At least one upsell was NOT purchased
        sql`(${funnelOrders.upsell1Purchased} = 0 OR ${funnelOrders.upsell2Purchased} = 0 OR ${funnelOrders.upsell3Purchased} = 0)`,
        lte(funnelOrders.createdAt, oneDayAgo),
        gte(funnelOrders.createdAt, twoDaysAgo),
      )
    )
    .limit(100);
}

/** Mark a funnel order as having received the Day 1 upsell recovery email */
export async function markDay1UpsellEmailSent(orderId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(funnelOrders)
    .set({ day1UpsellEmailSent: 1 })
    .where(eq(funnelOrders.id, orderId));
}

// ── Day 3 Follow-Up Email Helpers ─────────────────────────────────────────────

/** Get funnel orders that are 3+ days old and haven't received the Day 3 email yet */
export async function getOrdersNeedingDay3Email() {
  const db = await getDb();
  if (!db) return [];
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  const fourDaysAgo = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000);
  // Orders created between 3 and 4 days ago that haven't been sent the Day 3 email
  return db.select()
    .from(funnelOrders)
    .where(
      and(
        eq(funnelOrders.day3EmailSent, 0),
        lte(funnelOrders.createdAt, threeDaysAgo),
        gte(funnelOrders.createdAt, fourDaysAgo)
      )
    )
    .limit(100);
}

/** Mark a funnel order as having received the Day 3 email */
export async function markDay3EmailSent(orderId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(funnelOrders)
    .set({ day3EmailSent: 1 })
    .where(eq(funnelOrders.id, orderId));
}
