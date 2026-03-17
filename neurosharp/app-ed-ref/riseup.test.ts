import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database
vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue(null),
}));

// Mock seed functions
vi.mock("./seed", () => ({
  seedExercises: vi.fn().mockResolvedValue(undefined),
  seedBadges: vi.fn().mockResolvedValue(undefined),
  seedArticles: vi.fn().mockResolvedValue(undefined),
  generateDailyTasks: vi.fn().mockResolvedValue(undefined),
  updateStreak: vi.fn().mockResolvedValue(undefined),
  checkAndAwardBadges: vi.fn().mockResolvedValue(undefined),
}));

// Mock LLM
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [{ message: { content: "Dr. Apex response" } }],
  }),
}));

function createAuthContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("auth router", () => {
  it("me returns null for unauthenticated user", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });

  it("me returns user for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).not.toBeNull();
    expect(result?.name).toBe("Test User");
  });

  it("logout clears session cookie", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result.success).toBe(true);
  });
});

describe("profile router", () => {
  it("get returns null when db is unavailable", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.profile.get();
    expect(result).toBeNull();
  });

  it("saveOnboarding throws when db is unavailable", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.profile.saveOnboarding({
        edSeverity: "moderate",
        primaryGoal: "improve_performance",
      })
    ).rejects.toThrow("Database unavailable");
  });
});

describe("checkin router", () => {
  it("getToday returns null when db is unavailable", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.checkin.getToday();
    expect(result).toBeNull();
  });

  it("getHistory returns empty array when db is unavailable", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.checkin.getHistory({ limit: 10 });
    expect(result).toEqual([]);
  });

  it("submit validates score range", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.checkin.submit({
        energyLevel: 11, // invalid: max is 10
        moodScore: 5,
        sleepQuality: 5,
        libidoScore: 5,
        erectionQuality: 5,
      })
    ).rejects.toThrow();
  });
});

describe("exercises router", () => {
  it("list returns empty array when db is unavailable", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.exercises.list({});
    expect(result).toEqual([]);
  });
});

describe("gamification router", () => {
  it("getStats returns null when db is unavailable", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.gamification.getStats();
    expect(result).toBeNull();
  });

  it("getBadges returns empty arrays when db is unavailable", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.gamification.getBadges();
    expect(result.all).toEqual([]);
    expect(result.earned).toEqual([]);
    expect(result.earnedIds).toEqual([]);
  });
});

describe("subscription router", () => {
  it("getStatus returns free when db is unavailable", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.subscription.getStatus();
    expect(result.status).toBe("free");
  });
});

describe("content router", () => {
  it("getArticles returns empty array when db is unavailable", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.content.getArticles({});
    expect(result).toEqual([]);
  });
});

describe("chat router", () => {
  it("getHistory returns empty array when db is unavailable", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.chat.getHistory();
    expect(result).toEqual([]);
  });

  it("sendMessage throws when db is unavailable", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.chat.sendMessage({ message: "Hello Dr. Apex" })
    ).rejects.toThrow("Database unavailable");
  });

  it("sendMessage validates message length", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.chat.sendMessage({ message: "" })
    ).rejects.toThrow();
  });
});
