import { router, publicProcedure } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomBytes, randomInt } from "crypto";
import { and, desc, eq, gte, isNotNull, isNull, lt, sql } from "drizzle-orm";
import {
  adminCredentials,
  adminAuditLog,
  emailVerificationTokens,
  passwordResetTokens,
  userSessions,
  users,
  userProfiles,
  userStats as userStatsTable,
  quizCompletions,
  contactMessages,
  funnelOrders,
  carpandaSettings,
} from "../drizzle/schema";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendCredentialsEmail,
  sendPaymentReminderEmail,
  sendCustomAdminEmail,
} from "./email";

const ADMIN_JWT_SECRET = process.env.JWT_SECRET + "_admin";
const ADMIN_JWT_EXPIRY = "8h";

// ── Admin JWT helpers ─────────────────────────────────────────────────────────
function signAdminToken(adminId: number, username: string): string {
  return jwt.sign({ adminId, username, type: "admin" }, ADMIN_JWT_SECRET, { expiresIn: ADMIN_JWT_EXPIRY });
}

function verifyAdminToken(token: string): { adminId: number; username: string } | null {
  try {
    const payload = jwt.verify(token, ADMIN_JWT_SECRET) as { adminId: number; username: string; type: string };
    if (payload.type !== "admin") return null;
    return { adminId: payload.adminId, username: payload.username };
  } catch {
    return null;
  }
}

// ── Admin-protected procedure ─────────────────────────────────────────────────
// Accepts either:
//   1. A valid x-admin-token JWT (from the separate admin login form)
//   2. A main-app OAuth session where ctx.user.role === 'admin'
const adminProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const req = ctx.req as { headers: Record<string, string | string[] | undefined> };
  const authHeader = req.headers["x-admin-token"] as string | undefined;

  // Path 1: dedicated admin JWT token
  if (authHeader) {
    const payload = verifyAdminToken(authHeader);
    if (payload) {
      return next({ ctx: { ...ctx, adminId: payload.adminId, adminUsername: payload.username } });
    }
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid or expired admin token" });
  }

  // Path 2: main-app OAuth session with role=admin
  const sessionUser = (ctx as any).user as { id: number; role: string; name: string } | undefined;
  if (sessionUser && sessionUser.role === "admin") {
    return next({ ctx: { ...ctx, adminId: sessionUser.id, adminUsername: sessionUser.name } });
  }

  throw new TRPCError({ code: "UNAUTHORIZED", message: "Admin token required" });
});

// ── Audit log helper ──────────────────────────────────────────────────────────
async function writeAuditLog(adminId: number, action: string, targetUserId?: number, details?: string, ip?: string) {
  const db = await getDb();
  if (!db) return;
  await db.insert(adminAuditLog).values({ adminId, action, targetUserId, details, ipAddress: ip });
}

// ── Credential generator ──────────────────────────────────────────────────────
function generateCredentials(): { login: string; password: string } {
  const adjectives = ["swift", "bold", "apex", "iron", "peak", "elite", "prime", "core"];
  const nouns = ["lion", "hawk", "wolf", "titan", "eagle", "bull", "bear", "fox"];
  const adj = adjectives[randomInt(adjectives.length)];
  const noun = nouns[randomInt(nouns.length)];
  const num = randomInt(100, 999);
  const login = `${adj}${noun}${num}`;
  const password = randomBytes(6).toString("base64url").slice(0, 10);
  return { login, password };
}

// ── Admin Router ──────────────────────────────────────────────────────────────
export const adminRouter = router({
  // ── Auth ──────────────────────────────────────────────────────────────────
  login: publicProcedure
    .input(z.object({ username: z.string(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const [admin] = await db.select().from(adminCredentials).where(eq(adminCredentials.username, input.username)).limit(1);
      if (!admin) throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
      const valid = await bcrypt.compare(input.password, admin.passwordHash);
      if (!valid) throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
      await db.update(adminCredentials).set({ lastLoginAt: new Date() }).where(eq(adminCredentials.id, admin.id));
      const token = signAdminToken(admin.id, admin.username);
      const req = ctx.req as { ip?: string };
      await writeAuditLog(admin.id, "admin_login", undefined, undefined, req?.ip);
      return { token, username: admin.username, role: admin.role };
    }),

  me: adminProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    const [admin] = await db.select({ id: adminCredentials.id, username: adminCredentials.username, role: adminCredentials.role, lastLoginAt: adminCredentials.lastLoginAt })
      .from(adminCredentials).where(eq(adminCredentials.id, ctx.adminId)).limit(1);
    return admin ?? null;
  }),

  // ── Dashboard Stats ────────────────────────────────────────────────────────
  getStats: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [totalUsersRow] = await db.select({ count: sql<number>`count(*)` }).from(users);
      const [paidUsersRow] = await db.select({ count: sql<number>`count(*)` }).from(userProfiles).where(isNotNull(userProfiles.subscriptionId));
    const [newTodayRow] = await db.select({ count: sql<number>`count(*)` }).from(users).where(gte(users.createdAt, today));
    const [newWeekRow] = await db.select({ count: sql<number>`count(*)` }).from(users).where(gte(users.createdAt, sevenDaysAgo));
    const [activeMonthRow] = await db.select({ count: sql<number>`count(distinct user_id)` }).from(userSessions).where(gte(userSessions.sessionStart, thirtyDaysAgo));
    const [avgSessionRow] = await db.select({ avg: sql<number>`avg(duration_seconds)` }).from(userSessions).where(isNotNull(userSessions.durationSeconds));

    const totalUsers = Number(totalUsersRow?.count ?? 0);
    const paidUsers = Number(paidUsersRow?.count ?? 0);
    const freeUsers = totalUsers - paidUsers;
    const conversionRate = totalUsers > 0 ? Math.round((paidUsers / totalUsers) * 100) : 0;

    // Daily signups for last 30 days — use Drizzle ORM to avoid column name / serialization issues
    const allRecentUsers = await db
      .select({ createdAt: users.createdAt })
      .from(users)
      .where(gte(users.createdAt, thirtyDaysAgo));

    // Group by date in JS to avoid raw SQL column name issues
    const signupsByDate: Record<string, number> = {};
    for (const u of allRecentUsers) {
      const d = new Date(u.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      signupsByDate[key] = (signupsByDate[key] ?? 0) + 1;
    }
    const dailySignups = Object.entries(signupsByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      totalUsers,
      paidUsers,
      freeUsers,
      conversionRate,
      newToday: Number(newTodayRow?.count ?? 0),
      newThisWeek: Number(newWeekRow?.count ?? 0),
      activeLastMonth: Number(activeMonthRow?.count ?? 0),
      avgSessionSeconds: Math.round(Number(avgSessionRow?.avg ?? 0)),
      dailySignups,
    };
  }),

  // ── User List ──────────────────────────────────────────────────────────────
  getUsers: adminProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(20),
      search: z.string().optional(),
      filter: z.enum(["all", "paid", "free", "active"]).default("all"),
      sortBy: z.enum(["createdAt", "lastSignedIn", "name"]).default("createdAt"),
      sortDir: z.enum(["asc", "desc"]).default("desc"),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const offset = (input.page - 1) * input.limit;
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      // Build base query with join to userProfiles
      let query = db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          createdAt: users.createdAt,
          lastSignedIn: users.lastSignedIn,
          subscriptionId: userProfiles.subscriptionId,
          subscriptionStatus: userProfiles.subscriptionStatus,
          programDay: userProfiles.programDay,
          preferredLanguage: users.preferredLanguage,
        })
        .from(users)
        .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
        .$dynamic();

      // Apply filter
      if (input.filter === "paid") {
        query = query.where(isNotNull(userProfiles.subscriptionId)) as typeof query;
      } else if (input.filter === "free") {
        query = query.where(isNull(userProfiles.subscriptionId)) as typeof query;
      } else if (input.filter === "active") {
        query = query.where(gte(users.lastSignedIn, sevenDaysAgo)) as typeof query;
      }

      const allRows = await query;

      // Apply search filter in JS (for simplicity)
      const filtered = input.search
        ? allRows.filter(u =>
            (u.name ?? "").toLowerCase().includes(input.search!.toLowerCase()) ||
            (u.email ?? "").toLowerCase().includes(input.search!.toLowerCase())
          )
        : allRows;

      // Sort
      filtered.sort((a, b) => {
        const aVal = a[input.sortBy] ?? new Date(0);
        const bVal = b[input.sortBy] ?? new Date(0);
        const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return input.sortDir === "desc" ? -cmp : cmp;
      });

      const total = filtered.length;
      const paginated = filtered.slice(offset, offset + input.limit);

      return { users: paginated, total, page: input.page, limit: input.limit };
    }),

  // ── User Detail ────────────────────────────────────────────────────────────
  getUserDetail: adminProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const [user] = await db.select().from(users).where(eq(users.id, input.userId)).limit(1);
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, input.userId)).limit(1);
      const [userStats] = await db.select().from(userStatsTable).where(eq(userStatsTable.userId, input.userId)).limit(1);

      // Session stats
      const sessions = await db.select().from(userSessions).where(eq(userSessions.userId, input.userId)).orderBy(desc(userSessions.sessionStart)).limit(20);
      const [sessionStats] = await db.select({
        totalSessions: sql<number>`count(*)`,
        totalSeconds: sql<number>`sum(duration_seconds)`,
        avgSeconds: sql<number>`avg(duration_seconds)`,
      }).from(userSessions).where(and(eq(userSessions.userId, input.userId), isNotNull(userSessions.durationSeconds)));

      return {
        user,
        profile: profile ?? null,
        userStats: userStats ?? null,
        sessions,
        sessionStats: {
          totalSessions: Number(sessionStats?.totalSessions ?? 0),
          totalSeconds: Number(sessionStats?.totalSeconds ?? 0),
          avgSeconds: Math.round(Number(sessionStats?.avgSeconds ?? 0)),
        },
      };
    }),

  // ── Generate Credentials ───────────────────────────────────────────────────
  generateCredentials: adminProcedure
    .input(z.object({ userId: z.number().optional() }))
    .mutation(async ({ ctx }) => {
      const creds = generateCredentials();
      await writeAuditLog(ctx.adminId, "generate_credentials", ctx.adminId, `Generated credentials: ${creds.login}`);
      return creds;
    }),

  // ── Send Credentials Email ─────────────────────────────────────────────────
  sendCredentials: adminProcedure
    .input(z.object({
      userId: z.number(),
      login: z.string(),
      password: z.string(),
      appUrl: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const [user] = await db.select().from(users).where(eq(users.id, input.userId)).limit(1);
      if (!user || !user.email) throw new TRPCError({ code: "BAD_REQUEST", message: "User has no email" });
      const ok = await sendCredentialsEmail(user.email, user.name ?? "", input.login, input.password, input.appUrl);
      await writeAuditLog(ctx.adminId, "send_credentials", input.userId, `Sent credentials to ${user.email}`);
      return { success: ok };
    }),

  // ── Send Payment Reminder ──────────────────────────────────────────────────
  sendPaymentReminder: adminProcedure
    .input(z.object({ userId: z.number(), checkoutUrl: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const [user] = await db.select().from(users).where(eq(users.id, input.userId)).limit(1);
      if (!user || !user.email) throw new TRPCError({ code: "BAD_REQUEST", message: "User has no email" });
      const ok = await sendPaymentReminderEmail(user.email, user.name ?? "", input.checkoutUrl);
      await writeAuditLog(ctx.adminId, "send_payment_reminder", input.userId, `Sent payment reminder to ${user.email}`);
      return { success: ok };
    }),

  // ── Bulk Payment Reminders (all unpaid users) ──────────────────────────────
  sendBulkPaymentReminders: adminProcedure
    .input(z.object({ checkoutUrl: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Get all users without a subscription
      const unpaidProfiles = await db.select({ userId: userProfiles.userId })
        .from(userProfiles).where(isNull(userProfiles.subscriptionId));
      const unpaidUserIds = unpaidProfiles.map(p => p.userId);

      // Also get users with no profile at all
      const allUsers = await db.select({ id: users.id, email: users.email, name: users.name }).from(users);
      const profileUserIds = new Set((await db.select({ userId: userProfiles.userId }).from(userProfiles)).map(p => p.userId));

      let sent = 0;
      for (const user of allUsers) {
        if (!user.email) continue;
        const isPaid = profileUserIds.has(user.id) && !unpaidUserIds.includes(user.id);
        if (isPaid) continue;
        const ok = await sendPaymentReminderEmail(user.email, user.name ?? "", input.checkoutUrl);
        if (ok) sent++;
      }

      await writeAuditLog(ctx.adminId, "bulk_payment_reminder", undefined, `Sent to ${sent} unpaid users`);
      return { sent };
    }),

  // ── Send Custom Email ──────────────────────────────────────────────────────
  sendCustomEmail: adminProcedure
    .input(z.object({
      userId: z.number(),
      subject: z.string(),
      body: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const [user] = await db.select().from(users).where(eq(users.id, input.userId)).limit(1);
      if (!user || !user.email) throw new TRPCError({ code: "BAD_REQUEST", message: "User has no email" });
      const ok = await sendCustomAdminEmail(user.email, input.subject, `<h1>${input.subject}</h1><p>${input.body.replace(/\n/g, "<br>")}</p>`);
      await writeAuditLog(ctx.adminId, "send_custom_email", input.userId, `Subject: ${input.subject}`);
      return { success: ok };
    }),

  // ── Audit Log ─────────────────────────────────────────────────────────────
  getAuditLog: adminProcedure
    .input(z.object({ page: z.number().default(1), limit: z.number().default(50) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const offset = (input.page - 1) * input.limit;
      const logs = await db.select().from(adminAuditLog).orderBy(desc(adminAuditLog.createdAt)).limit(input.limit).offset(offset);
      const [countRow] = await db.select({ count: sql<number>`count(*)` }).from(adminAuditLog);
      return { logs, total: Number(countRow?.count ?? 0) };
    }),

  // ── Password Reset (admin-triggered) ──────────────────────────────────────
  triggerPasswordReset: adminProcedure
    .input(z.object({ userId: z.number(), origin: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const [user] = await db.select().from(users).where(eq(users.id, input.userId)).limit(1);
      if (!user || !user.email) throw new TRPCError({ code: "BAD_REQUEST", message: "User has no email" });

      const token = randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await db.insert(passwordResetTokens).values({ userId: input.userId, token, expiresAt });
      const resetUrl = `${input.origin}/reset-password?token=${token}`;
      const ok = await sendPasswordResetEmail(user.email, user.name ?? "", resetUrl);
      await writeAuditLog(ctx.adminId, "trigger_password_reset", input.userId, `Sent reset to ${user.email}`);
      return { success: ok };
    }),

  // ── Session tracking (called from frontend) ───────────────────────────────
  startSession: publicProcedure
    .input(z.object({ userId: z.number(), deviceType: z.string().optional() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { sessionId: null };
      const [result] = await db.insert(userSessions).values({
        userId: input.userId,
        deviceType: input.deviceType ?? "web",
      });
      return { sessionId: (result as { insertId: number }).insertId };
    }),

  endSession: publicProcedure
    .input(z.object({ sessionId: z.number(), durationSeconds: z.number(), pagesVisited: z.number().optional() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return;
      await db.update(userSessions).set({
        sessionEnd: new Date(),
        durationSeconds: input.durationSeconds,
        pagesVisited: input.pagesVisited ?? 1,
      }).where(eq(userSessions.id, input.sessionId));
    }),

  // ── Change Admin Password ─────────────────────────────────────────────────
  changeAdminPassword: adminProcedure
    .input(z.object({
      currentPassword: z.string().min(1),
      newPassword: z.string().min(8),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const [admin] = await db.select().from(adminCredentials).where(eq(adminCredentials.id, ctx.adminId)).limit(1);
      if (!admin) throw new TRPCError({ code: "NOT_FOUND" });
      const valid = await bcrypt.compare(input.currentPassword, admin.passwordHash);
      if (!valid) throw new TRPCError({ code: "UNAUTHORIZED", message: "Current password is incorrect" });
      const newHash = await bcrypt.hash(input.newPassword, 12);
      await db.update(adminCredentials).set({ passwordHash: newHash }).where(eq(adminCredentials.id, ctx.adminId));
      await writeAuditLog(ctx.adminId, "change_password", ctx.adminId, "Admin changed their password");
      return { success: true };
    }),

  // ── Bulk Payment Reminder ─────────────────────────────────────────────────
  bulkPaymentReminder: adminProcedure
    .input(z.object({ checkoutUrl: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      // Get all free users with an email address
      const freeUsers = await db.select({ id: users.id, email: users.email, name: users.name })
        .from(users)
        .leftJoin(userProfiles, eq(userProfiles.userId, users.id))
        .where(and(
          isNull(userProfiles.subscriptionId),
          isNotNull(users.email),
        ));
      let sent = 0;
      let failed = 0;
      for (const user of freeUsers) {
        if (!user.email) continue;
        const ok = await sendPaymentReminderEmail(user.email, user.name ?? "", input.checkoutUrl);
        if (ok) sent++; else failed++;
      }
      await writeAuditLog(ctx.adminId, "bulk_payment_reminder", ctx.adminId, `Sent to ${sent} users, ${failed} failed`);
      return { sent, failed, total: freeUsers.length };
    }),

  // ── User Notes (CRM) ─────────────────────────────────────────────────────
  getUserNote: adminProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { note: "" };
      const [row] = await db.execute(sql`SELECT admin_note FROM users WHERE id = ${input.userId} LIMIT 1`) as unknown as [{ admin_note: string | null }[]];
      return { note: row?.[0]?.admin_note ?? "" };
    }),

  saveUserNote: adminProcedure
    .input(z.object({ userId: z.number(), note: z.string().max(2000) }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.execute(sql`UPDATE users SET admin_note = ${input.note} WHERE id = ${input.userId}`);
      await writeAuditLog(ctx.adminId, "save_user_note", input.userId, `Updated note for user ${input.userId}`);
      return { success: true };
    }),
  getQuizStats: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    const all = await db.select().from(quizCompletions).orderBy(desc(quizCompletions.createdAt));
    const total = all.length;
    const converted = all.filter(q => q.converted === 1).length;
    const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0;
    const byRisk = all.reduce((acc, q) => {
      acc[q.riskLevel] = (acc[q.riskLevel] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    // Last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recent = all.filter(q => new Date(q.createdAt) >= thirtyDaysAgo).length;
    return { total, converted, conversionRate, byRisk, recent };
  }),

  // ── Support Tickets ───────────────────────────────────────────────────────────────────
  getSupportTickets: adminProcedure
    .input(z.object({
      status: z.enum(["all", "open", "replied", "resolved"]).default("all"),
      category: z.string().optional(),
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(20),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { tickets: [], total: 0 };
      const offset = (input.page - 1) * input.limit;
      const conditions = [];
      if (input.status !== "all") conditions.push(eq(contactMessages.status, input.status as "open" | "replied" | "resolved"));
      if (input.category) conditions.push(eq(contactMessages.category, input.category));
      const where = conditions.length > 0 ? and(...conditions) : undefined;
      const [tickets, countResult] = await Promise.all([
        db.select().from(contactMessages)
          .where(where)
          .orderBy(desc(contactMessages.createdAt))
          .limit(input.limit)
          .offset(offset),
        db.select({ count: sql<number>`count(*)` }).from(contactMessages).where(where),
      ]);
      return { tickets, total: Number(countResult[0]?.count ?? 0) };
    }),

  getSupportTicket: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const [ticket] = await db.select().from(contactMessages).where(eq(contactMessages.id, input.id)).limit(1);
      return ticket ?? null;
    }),

  updateTicketStatus: adminProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["open", "replied", "resolved"]),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { success: false };
      await db.update(contactMessages).set({ status: input.status }).where(eq(contactMessages.id, input.id));
      return { success: true };
    }),

  replyToTicket: adminProcedure
    .input(z.object({
      id: z.number(),
      replyMessage: z.string().min(1).max(10000),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { success: false };
      const [ticket] = await db.select().from(contactMessages).where(eq(contactMessages.id, input.id)).limit(1);
      if (!ticket) throw new TRPCError({ code: "NOT_FOUND", message: "Ticket not found" });
      try {
        await sendCustomAdminEmail(
          ticket.email,
          `Re: ${ticket.subject} [Ticket #${String(ticket.id).padStart(5, "0")}]`,
          `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;"><div style="background:#1a1a2e;padding:24px;border-radius:12px;"><h2 style="color:#f59e0b;margin:0 0 8px;">Vigronex Support</h2><p style="color:#9ca3af;font-size:13px;margin:0 0 20px;">Ticket #${String(ticket.id).padStart(5, "0")}</p><p style="color:#e5e7eb;margin:0 0 16px;">Hi ${ticket.name},</p><div style="background:#111827;border-radius:8px;padding:16px;margin:0 0 16px;"><p style="color:#e5e7eb;white-space:pre-wrap;margin:0;">${input.replyMessage.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p></div><p style="color:#6b7280;font-size:12px;margin:0;">Vigronex Support Team &middot; support@vigronex.com</p></div></div>`
        );
      } catch (e) {
        console.error("[Support] Failed to send reply email:", e);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to send reply email" });
      }
      await db.update(contactMessages).set({ status: "replied" }).where(eq(contactMessages.id, input.id));
      return { success: true };
    }),

  getSupportStats: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { open: 0, replied: 0, resolved: 0, total: 0 };
    const rows = await db.select({ status: contactMessages.status, count: sql<number>`count(*)` })
      .from(contactMessages)
      .groupBy(contactMessages.status);
    const stats = { open: 0, replied: 0, resolved: 0, total: 0 };
    for (const r of rows) {
      const c = Number(r.count);
      stats[r.status as keyof typeof stats] = c;
      stats.total += c;
    }
    return stats;
  }),
});

// ── User-facing auth procedures (password reset, email verification) ──────────
export const authExtRouter = router({
  // Request password reset (user-initiated)
  requestPasswordReset: publicProcedure
    .input(z.object({ email: z.string().email(), origin: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { sent: true }; // Always return true to prevent email enumeration
      const [user] = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
      if (!user) return { sent: true }; // Silent fail

      const token = randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
      await db.insert(passwordResetTokens).values({ userId: user.id, token, expiresAt });
      const resetUrl = `${input.origin}/reset-password?token=${token}`;
      await sendPasswordResetEmail(input.email, user.name ?? "", resetUrl);
      return { sent: true };
    }),

  // Validate reset token
  validateResetToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { valid: false };
      const [row] = await db.select().from(passwordResetTokens)
        .where(and(eq(passwordResetTokens.token, input.token), eq(passwordResetTokens.used, false)))
        .limit(1);
      if (!row) return { valid: false };
      if (row.expiresAt < new Date()) return { valid: false, expired: true };
      return { valid: true };
    }),

  // Reset password with token
  resetPassword: publicProcedure
    .input(z.object({ token: z.string(), newPassword: z.string().min(8) }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const [row] = await db.select().from(passwordResetTokens)
        .where(and(eq(passwordResetTokens.token, input.token), eq(passwordResetTokens.used, false)))
        .limit(1);
      if (!row || row.expiresAt < new Date()) throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid or expired token" });

      // Hash the new password and store it (for credential-based users)
      const hash = await bcrypt.hash(input.newPassword, 12);
      // Store the hash in a way that the credential-based login can use it
      // We'll store it in userProfiles as a custom field or in a separate table
      // For now, mark the token as used and update the user's password in admin_credentials if they have one
      await db.update(passwordResetTokens).set({ used: true }).where(eq(passwordResetTokens.id, row.id));

      // Check if user has admin credentials (credential-based login)
      const [user] = await db.select().from(users).where(eq(users.id, row.userId)).limit(1);
      if (user?.loginMethod === "credentials") {
        // Update password in a credentials table — for now store hash in userProfiles.customData
        // We'll use the admin_credentials table for this pattern
        await db.execute(sql`UPDATE admin_credentials SET password_hash = ${hash} WHERE username = ${user.email}`);
      }

      return { success: true };
    }),

  // Send verification code
  sendVerificationCode: publicProcedure
    .input(z.object({ userId: z.number(), email: z.string().email(), name: z.string().optional() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { sent: false };

      // Invalidate old tokens
      await db.execute(sql`UPDATE email_verification_tokens SET verified = 1 WHERE user_id = ${input.userId} AND verified = 0`);

      const code = String(randomInt(100000, 999999));
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min
      await db.insert(emailVerificationTokens).values({ userId: input.userId, token: code, expiresAt });
      const ok = await sendVerificationEmail(input.email, input.name ?? "", code);
      return { sent: ok };
    }),

  // Verify the code
  verifyEmailCode: publicProcedure
    .input(z.object({ userId: z.number(), code: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const [row] = await db.select().from(emailVerificationTokens)
        .where(and(
          eq(emailVerificationTokens.userId, input.userId),
          eq(emailVerificationTokens.token, input.code),
          eq(emailVerificationTokens.verified, false),
        ))
        .limit(1);
      if (!row) throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid code" });
      if (row.expiresAt < new Date()) throw new TRPCError({ code: "BAD_REQUEST", message: "Code expired" });
      await db.update(emailVerificationTokens).set({ verified: true }).where(eq(emailVerificationTokens.id, row.id));
      return { verified: true };
    }),

  // Check if user's email is verified
  getVerificationStatus: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { verified: false };
      const [row] = await db.select().from(emailVerificationTokens)
        .where(and(eq(emailVerificationTokens.userId, input.userId), eq(emailVerificationTokens.verified, true)))
        .limit(1);
      return { verified: !!row };
    }),

  // ── Test Order ────────────────────────────────────────────────────────────
  createTestOrder: adminProcedure
    .input(z.object({
      email: z.string().email(),
      firstName: z.string().min(1),
      lastName: z.string().default('Test'),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'DB unavailable' });
      const password = randomBytes(4).toString('hex'); // 8-char hex password
      const orderId = `TEST-${Date.now()}`;
      // Insert test order as paid
      const [result] = await db.insert(funnelOrders).values({
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        stripeSessionId: orderId, // reuse stripeSessionId to store test order ID
        status: 'paid',
        amountPaid: 0, // test order, no charge
        credentialsSent: 0,
        upsell1Purchased: 0,
        upsell2Purchased: 0,
        upsell3Purchased: 0,
      });
      const insertedId = (result as any).insertId as number;
      // Send credentials email immediately
      const appUrl = process.env.VITE_OAUTH_PORTAL_URL?.replace('/portal', '') || 'https://vigronex.com';
      const sent = await sendCredentialsEmail(input.email, input.firstName, input.email, password, appUrl);
      if (sent) {
        await db.update(funnelOrders).set({ credentialsSent: 1 }).where(eq(funnelOrders.id, insertedId));
      }
      return { success: true, orderId, emailSent: sent, password };
    }),

  // ── Carpanda Settings ────────────────────────────────────────────────────
  getCarpandaSettings: adminProcedure
    .query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(carpandaSettings).orderBy(carpandaSettings.key);
    }),

  updateCarpandaLink: adminProcedure
    .input(z.object({
      key: z.string(),
      url: z.string().min(1, 'URL cannot be empty'),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      await db.update(carpandaSettings)
        .set({ url: input.url })
        .where(eq(carpandaSettings.key, input.key));
      return { success: true };
    }),
});
