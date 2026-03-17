import {
  bigint,
  boolean,
  float,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  preferredLanguage: varchar("preferred_language", { length: 10 }).default("en"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  activeSessionToken: varchar("active_session_token", { length: 512 }),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// User health profile created during onboarding
export const userProfiles = mysqlTable("user_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  age: int("age"),
  edSeverity: mysqlEnum("edSeverity", ["mild", "moderate", "severe"]),
  // Lifestyle factors
  smokingStatus: mysqlEnum("smokingStatus", ["never", "former", "current"]),
  alcoholUse: mysqlEnum("alcoholUse", ["none", "light", "moderate", "heavy"]),
  exerciseFrequency: mysqlEnum("exerciseFrequency", ["none", "1-2x", "3-4x", "5+"]),
  sleepHours: float("sleepHours"),
  stressLevel: int("stressLevel"), // 1-10
  // Health conditions (stored as JSON array of strings)
  healthConditions: json("healthConditions").$type<string[]>(),
  medications: json("medications").$type<string[]>(),
  supplements: json("supplements").$type<string[]>(),
  // Goals
  primaryGoal: varchar("primaryGoal", { length: 128 }),
  motivations: json("motivations").$type<string[]>(),
  // Program
  programStartDate: timestamp("programStartDate"),
  programDay: int("programDay").default(1),
  onboardingCompleted: boolean("onboardingCompleted").default(false),
  subscriptionStatus: mysqlEnum("subscriptionStatus", ["free", "active", "cancelled", "past_due"]).default("free"),
  subscriptionId: varchar("subscriptionId", { length: 128 }),
  subscriptionEndsAt: timestamp("subscriptionEndsAt"),
  // Nutrition
  dailyCalorieGoal: int("daily_calorie_goal").default(2200),
  // Meal reminders (JSON: { breakfast: "08:00", lunch: "12:30", dinner: "19:00", enabled: true })
  mealReminders: json("meal_reminders").$type<{ breakfast?: string; lunch?: string; dinner?: string; enabled: boolean }>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;

// Daily check-ins with performance score
export const dailyCheckins = mysqlTable("daily_checkins", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  programDay: int("programDay").notNull(),
  performanceScore: int("performanceScore"), // 0-100
  // Sub-scores
  energyLevel: int("energyLevel"), // 1-10
  moodScore: int("moodScore"), // 1-10
  sleepQuality: int("sleepQuality"), // 1-10
  libidoScore: int("libidoScore"), // 1-10
  erectionQuality: int("erectionQuality"), // 1-10
  notes: text("notes"),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DailyCheckin = typeof dailyCheckins.$inferSelect;
export type InsertDailyCheckin = typeof dailyCheckins.$inferInsert;

// Exercise definitions
export const exercises = mysqlTable("exercises", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  category: mysqlEnum("category", ["kegel", "breathwork", "cold_therapy", "cardio", "strength", "mindfulness"]).notNull(),
  difficulty: mysqlEnum("difficulty", ["beginner", "intermediate", "advanced"]).notNull(),
  durationSeconds: int("durationSeconds"),
  reps: int("reps"),
  sets: int("sets"),
  description: text("description"),
  instructions: json("instructions").$type<string[]>(),
  benefits: json("benefits").$type<string[]>(),
  videoUrl: varchar("videoUrl", { length: 512 }),
  imageUrl: varchar("imageUrl", { length: 512 }),
  programWeek: int("programWeek"), // which week this exercise is introduced
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = typeof exercises.$inferInsert;

// User exercise sessions
export const userExerciseSessions = mysqlTable("user_exercise_sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  exerciseId: int("exerciseId").notNull(),
  programDay: int("programDay").notNull(),
  completedReps: int("completedReps"),
  completedSets: int("completedSets"),
  durationSeconds: int("durationSeconds"),
  difficulty: mysqlEnum("difficulty", ["too_easy", "just_right", "too_hard"]),
  notes: text("notes"),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
});

export type UserExerciseSession = typeof userExerciseSessions.$inferSelect;

// Daily program tasks (generated per user per day)
export const dailyTasks = mysqlTable("daily_tasks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  programDay: int("programDay").notNull(),
  exerciseId: int("exerciseId"),
  taskType: mysqlEnum("taskType", ["exercise", "checkin", "education", "mindset"]).notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  isCompleted: boolean("isCompleted").default(false),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DailyTask = typeof dailyTasks.$inferSelect;

// Badges and achievements
export const badges = mysqlTable("badges", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 64 }).notNull(), // lucide icon name
  category: mysqlEnum("category", ["streak", "exercise", "checkin", "milestone", "score"]).notNull(),
  requirement: int("requirement").notNull(), // numeric threshold to unlock
  xpReward: int("xpReward").default(50),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Badge = typeof badges.$inferSelect;

// User earned badges
export const userBadges = mysqlTable("user_badges", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  badgeId: int("badgeId").notNull(),
  earnedAt: timestamp("earnedAt").defaultNow().notNull(),
});

export type UserBadge = typeof userBadges.$inferSelect;

// User gamification stats
export const userStats = mysqlTable("user_stats", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  totalXp: int("totalXp").default(0),
  currentStreak: int("currentStreak").default(0),
  longestStreak: int("longestStreak").default(0),
  totalExercisesCompleted: int("totalExercisesCompleted").default(0),
  totalCheckinsCompleted: int("totalCheckinsCompleted").default(0),
  lastActivityDate: timestamp("lastActivityDate"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserStats = typeof userStats.$inferSelect;

// AI Chat messages (Dr. Apex)
export const chatMessages = mysqlTable("chat_messages", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

// Educational articles
export const articles = mysqlTable("articles", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  slug: varchar("slug", { length: 256 }).notNull().unique(),
  category: mysqlEnum("category", ["causes", "treatments", "lifestyle", "nutrition", "mindset", "science"]).notNull(),
  summary: text("summary"),
  content: text("content").notNull(),
  readTimeMinutes: int("readTimeMinutes").default(5),
  isPremium: boolean("isPremium").default(false),
  programWeek: int("programWeek"), // when this article is recommended
  imageUrl: varchar("imageUrl", { length: 512 }),
  isPublished: boolean("isPublished").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Article = typeof articles.$inferSelect;

// Push notification subscriptions
export const pushSubscriptions = mysqlTable("push_subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  endpoint: text("endpoint").notNull(),
  p256dh: text("p256dh").notNull(),
  auth: text("auth").notNull(),
  notifyCheckin: boolean("notifyCheckin").default(true),
  notifyExercise: boolean("notifyExercise").default(true),
  notifyMilestone: boolean("notifyMilestone").default(true),
  checkinTime: varchar("checkinTime", { length: 5 }).default("08:00"),
  exerciseTime: varchar("exerciseTime", { length: 5 }).default("07:00"),
  dndEnabled: boolean("dndEnabled").default(false),
  dndStart: varchar("dndStart", { length: 5 }).default("22:00"),
  dndEnd: varchar("dndEnd", { length: 5 }).default("07:00"),
  // Meal reminders
  notifyMeals: boolean("notifyMeals").default(false),
  breakfastTime: varchar("breakfastTime", { length: 5 }).default("08:00"),
  lunchTime: varchar("lunchTime", { length: 5 }).default("12:30"),
  dinnerTime: varchar("dinnerTime", { length: 5 }).default("19:00"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PushSubscription = typeof pushSubscriptions.$inferSelect;
export type InsertPushSubscription = typeof pushSubscriptions.$inferInsert;

// User article reads
export const userArticleReads = mysqlTable("user_article_reads", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  articleId: int("articleId").notNull(),
  readAt: timestamp("readAt").defaultNow().notNull(),
});

// Performance recipes
export const recipes = mysqlTable("recipes", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  category: mysqlEnum("category", ["breakfast", "lunch", "dinner", "snack", "smoothie", "supplement"]).notNull(),
  description: text("description"),
  prepTimeMinutes: int("prepTimeMinutes").default(10),
  calories: int("calories"),
  protein: int("protein"),
  carbs: int("carbs"),
  fat: int("fat"),
  ingredients: json("ingredients").$type<string[]>(),
  instructions: json("instructions").$type<string[]>(),
  ingredientBenefits: json("ingredientBenefits").$type<Record<string, string>>(),
  performanceScore: int("performanceScore").default(0),
  imageUrl: varchar("imageUrl", { length: 500 }),
  programWeek: int("programWeek").default(1),
  tags: json("tags").$type<string[]>(),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Recipe = typeof recipes.$inferSelect;
export type InsertRecipe = typeof recipes.$inferInsert;

// User meal logs (with photo calorie analysis)
export const mealLogs = mysqlTable("meal_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  logDate: varchar("logDate", { length: 10 }).notNull(), // YYYY-MM-DD
  mealType: mysqlEnum("mealType", ["breakfast", "lunch", "dinner", "snack"]).notNull(),
  description: text("description"),
  calories: int("calories"),
  protein: int("protein"),
  carbs: int("carbs"),
  fat: int("fat"),
  photoAnalysis: text("photoAnalysis"),
  photoUrl: text("photoUrl"),           // S3 URL of the meal photo
  photoKey: text("photoKey"),           // S3 key for deletion
  recipeId: int("recipeId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MealLog = typeof mealLogs.$inferSelect;
export type InsertMealLog = typeof mealLogs.$inferInsert;

// Daily challenges (one per user per day)
export const dailyChallenges = mysqlTable("daily_challenges", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  challengeDate: varchar("challengeDate", { length: 10 }).notNull(), // YYYY-MM-DD
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  category: mysqlEnum("category", ["exercise", "nutrition", "mindset", "social", "cold_therapy", "breathwork"]).notNull(),
  xpReward: int("xpReward").default(50),
  isCompleted: boolean("isCompleted").default(false),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DailyChallenge = typeof dailyChallenges.$inferSelect;
export type InsertDailyChallenge = typeof dailyChallenges.$inferInsert;

// Dr. Apex daily personalized tips
export const dailyTips = mysqlTable("daily_tips", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  tipDate: varchar("tipDate", { length: 10 }).notNull(), // YYYY-MM-DD
  tipType: mysqlEnum("tipType", ["morning", "evening", "achievement", "warning", "encouragement"]).notNull(),
  content: text("content").notNull(),
  isRead: boolean("isRead").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DailyTip = typeof dailyTips.$inferSelect;
export type InsertDailyTip = typeof dailyTips.$inferInsert;

// Progress photos journal (stored privately in S3)
export const progressPhotos = mysqlTable("progress_photos", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  s3Key: varchar("s3Key", { length: 512 }).notNull(),
  s3Url: text("s3Url").notNull(),
  programDay: int("programDay").notNull(),
  weekNumber: int("weekNumber").notNull(),
  note: text("note"),
  bodyWeight: float("bodyWeight"),
  takenAt: timestamp("takenAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type ProgressPhoto = typeof progressPhotos.$inferSelect;
export type InsertProgressPhoto = typeof progressPhotos.$inferInsert;

// Intimacy positions guide (Kamasutra-inspired)
export const intimacyPositions = mysqlTable("intimacy_positions", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  category: mysqlEnum("category", ["classic", "advanced", "intimate", "playful", "romantic", "sensual", "ed_friendly", "emotional"]).notNull(),
  difficulty: mysqlEnum("difficulty", ["beginner", "intermediate", "advanced"]).notNull().default("beginner"),
  description: text("description").notNull(),
  benefits: text("benefits"),
  tips: text("tips"),
  programWeekUnlock: int("programWeekUnlock").default(1),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type IntimacyPosition = typeof intimacyPositions.$inferSelect;
export type InsertIntimacyPosition = typeof intimacyPositions.$inferInsert;

// Daily romance & seduction tips
export const romanceTips = mysqlTable("romance_tips", {
  id: int("id").autoincrement().primaryKey(),
  category: mysqlEnum("category", ["seduction", "romance", "communication", "confidence", "touch", "mindset", "date_idea", "morning_ritual"]).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
  actionStep: text("actionStep"),
  difficulty: mysqlEnum("difficulty", ["easy", "medium", "bold"]).notNull().default("easy"),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type RomanceTip = typeof romanceTips.$inferSelect;
export type InsertRomanceTip = typeof romanceTips.$inferInsert;

// Track which positions/tips the user has viewed or saved
export const userIntimacyProgress = mysqlTable("user_intimacy_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  positionId: int("positionId"),
  romanceTipId: int("romanceTipId"),
  isSaved: boolean("isSaved").default(false),
  isCompleted: boolean("isCompleted").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type UserIntimacyProgress = typeof userIntimacyProgress.$inferSelect;

// Weekly intimacy challenges (one per week, rotates from positions/tips)
export const weeklyIntimacyChallenges = mysqlTable("weekly_intimacy_challenges", {
  id: int("id").autoincrement().primaryKey(),
  weekNumber: int("weekNumber").notNull(), // ISO week number
  year: int("year").notNull(),
  challengeType: mysqlEnum("challengeType", ["position", "tip"]).notNull(),
  positionId: int("positionId"),
  romanceTipId: int("romanceTipId"),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type WeeklyIntimacyChallenge = typeof weeklyIntimacyChallenges.$inferSelect;

// Track user completions of weekly challenges
export const userWeeklyChallengeCompletions = mysqlTable("user_weekly_challenge_completions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  challengeId: int("challengeId").notNull(),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
  note: text("note"),
  xpEarned: int("xpEarned").default(25),
});
export type UserWeeklyChallengeCompletion = typeof userWeeklyChallengeCompletions.$inferSelect;

// Couple sharing tokens — user shares favorites with partner
export const coupleShareTokens = mysqlTable("couple_share_tokens", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  token: varchar("token", { length: 64 }).notNull().unique(),
  label: varchar("label", { length: 128 }), // e.g. "Minha lista para Ana"
  expiresAt: timestamp("expiresAt"),
  viewCount: int("viewCount").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type CoupleShareToken = typeof coupleShareTokens.$inferSelect;

// Sofia AI chat sessions
export const sofiaChatSessions = mysqlTable("sofia_chat_sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  personaId: varchar("personaId", { length: 64 }).notNull(), // "classic" | "bold" | "emotional"
  title: varchar("title", { length: 256 }), // auto-generated from first message
  messageCount: int("messageCount").default(0),
  lastMessageAt: timestamp("lastMessageAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type SofiaChatSession = typeof sofiaChatSessions.$inferSelect;

// Sofia AI chat messages (per session)
export const sofiaChatMessages = mysqlTable("sofia_chat_messages", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: int("sessionId").notNull(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["user", "assistant", "feedback"]).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type SofiaChatMessage = typeof sofiaChatMessages.$inferSelect;

// Partner emoji reactions on shared couple favorites
export const coupleReactions = mysqlTable("couple_reactions", {
  id: int("id").autoincrement().primaryKey(),
  tokenId: int("token_id").notNull(),
  positionId: int("position_id").notNull(),
  emoji: varchar("emoji", { length: 10 }).notNull(), // "❤️" | "🔥" | "😅"
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type CoupleReaction = typeof coupleReactions.$inferSelect;

// Saved erotic fantasy stories (user's personal library)
export const savedFantasies = mysqlTable("saved_fantasies", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  title: varchar("title", { length: 255 }).notNull().default("Fantasia"),
  story: text("story").notNull(),
  category: varchar("category", { length: 50 }).notNull().default("surpresa"),
  customPrompt: text("custom_prompt"),
  sharedToken: varchar("shared_token", { length: 64 }).unique(),
  sharedAt: bigint("shared_at", { mode: "number" }),
  readCount: int("read_count").notNull().default(0),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
});
export type SavedFantasy = typeof savedFantasies.$inferSelect;

// Sofia AI persistent memory (per user)
export const sofiaMemory = mysqlTable("sofia_memory", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().unique(),
  userName: varchar("user_name", { length: 128 }),
  // Key facts Sofia remembers about the user
  facts: json("facts").$type<string[]>().default([]),
  // Topics discussed across sessions
  topics: json("topics").$type<string[]>().default([]),
  // User's preferred interaction style with Sofia
  preferredPersonality: varchar("preferred_personality", { length: 50 }),
  preferredScenario: varchar("preferred_scenario", { length: 100 }),
  // Relationship status / context
  relationshipContext: text("relationship_context"),
  // Quick-start topic labels the user has already tried
  triedTopics: json("tried_topics").$type<string[]>().default([]),
  // Total sessions and messages
  totalSessions: int("total_sessions").notNull().default(0),
  totalMessages: int("total_messages").notNull().default(0),
  lastSeenAt: timestamp("last_seen_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type SofiaMemory = typeof sofiaMemory.$inferSelect;

// Sofia AI conversation summaries (one per session)
export const sofiaConversationSummaries = mysqlTable("sofia_conversation_summaries", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  sessionId: int("session_id").notNull().unique(),
  summary: text("summary").notNull(),
  keyTopics: json("key_topics").$type<string[]>().default([]),
  newFacts: json("new_facts").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type SofiaConversationSummary = typeof sofiaConversationSummaries.$inferSelect;

// Dr. Apex persistent memory (one row per user)
export const apexMemory = mysqlTable("apex_memory", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().unique(),
  // Key health facts Dr. Apex remembers about the user
  facts: json("facts").$type<string[]>().default([]),
  // Medical/health topics discussed across sessions
  topics: json("topics").$type<string[]>().default([]),
  // Ongoing health concerns mentioned by the user
  healthConcerns: json("health_concerns").$type<string[]>().default([]),
  // Lifestyle context (diet, exercise habits, sleep, stress)
  lifestyleContext: text("lifestyle_context"),
  // Medications or supplements mentioned
  medicationsContext: text("medications_context"),
  // Total sessions and messages
  totalSessions: int("total_sessions").notNull().default(0),
  totalMessages: int("total_messages").notNull().default(0),
  lastSeenAt: timestamp("last_seen_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type ApexMemory = typeof apexMemory.$inferSelect;

// Romance tip daily completions history
export const romanceTipCompletions = mysqlTable("romance_tip_completions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  romanceTipId: int("romance_tip_id").notNull(),
  completedDate: varchar("completed_date", { length: 10 }).notNull(), // YYYY-MM-DD
  completedAt: timestamp("completedAt").defaultNow().notNull(),
});
export type RomanceTipCompletion = typeof romanceTipCompletions.$inferSelect;

// ── Admin Panel Tables ────────────────────────────────────────────────────────

// Admin credentials (separate from OAuth users)
export const adminCredentials = mysqlTable("admin_credentials", {
  id: int("id").autoincrement().primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  role: varchar("role", { length: 50 }).notNull().default("admin"),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});
export type AdminCredential = typeof adminCredentials.$inferSelect;

// Email verification tokens (6-digit code sent on first login)
export const emailVerificationTokens = mysqlTable("email_verification_tokens", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  token: varchar("token", { length: 10 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type EmailVerificationToken = typeof emailVerificationTokens.$inferSelect;

// Password reset tokens
export const passwordResetTokens = mysqlTable("password_reset_tokens", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  token: varchar("token", { length: 64 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;

// User session tracking (for time-on-app analytics)
export const userSessions = mysqlTable("user_sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  sessionStart: timestamp("session_start").defaultNow().notNull(),
  sessionEnd: timestamp("session_end"),
  durationSeconds: int("duration_seconds"),
  pagesVisited: int("pages_visited").notNull().default(1),
  deviceType: varchar("device_type", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type UserSession = typeof userSessions.$inferSelect;

// Admin audit log
export const adminAuditLog = mysqlTable("admin_audit_log", {
  id: int("id").autoincrement().primaryKey(),
  adminId: int("admin_id").notNull(),
  action: varchar("action", { length: 100 }).notNull(),
  targetUserId: int("target_user_id"),
  details: text("details"),
  ipAddress: varchar("ip_address", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type AdminAuditEntry = typeof adminAuditLog.$inferSelect;

// ── Quiz Funnel Completions ──────────────────────────────────────────────────
export const quizCompletions = mysqlTable("quiz_completions", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("session_id", { length: 64 }).notNull(),
  score: int("score").notNull().default(0),
  riskLevel: varchar("risk_level", { length: 20 }).notNull().default("moderate"),
  answers: json("answers").notNull(),
  converted: int("converted").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type QuizCompletion = typeof quizCompletions.$inferSelect;

// ── Funnel Orders (direct checkout from quiz funnel) ─────────────────────────
export const funnelOrders = mysqlTable("funnel_orders", {
  id: int("id").autoincrement().primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 30 }),
  riskLevel: varchar("risk_level", { length: 20 }),
  quizSessionId: varchar("quiz_session_id", { length: 64 }),
  discountApplied: int("discount_applied").default(0), // 0 or 20 (percent)
  amountPaid: int("amount_paid").notNull().default(3990), // in cents
  status: mysqlEnum("status", ["pending", "paid", "refunded"]).default("pending"),
  credentialsSent: int("credentials_sent").default(0),
  day3EmailSent: int("day3_email_sent").default(0), // 0 = not sent, 1 = sent
  day1UpsellEmailSent: int("day1_upsell_email_sent").default(0), // Day 1 upsell recovery email
  day7EmailSent: int("day7_email_sent").default(0), // Day 7 results tip email
  day30EmailSent: int("day30_email_sent").default(0), // Day 30 progress milestone email
  day60EmailSent: int("day60_email_sent").default(0), // Day 60 re-engagement email
  stripeSessionId: varchar("stripe_session_id", { length: 255 }), // Stripe Checkout Session ID
  generatedLogin: varchar("generated_login", { length: 100 }),
  // Upsell tracking
  upsell1Purchased: int("upsell1_purchased").default(0), // Dr. Apex 24h $14.99
  upsell1SessionId: varchar("upsell1_session_id", { length: 255 }),
  upsell2Purchased: int("upsell2_purchased").default(0), // Sofia Fantasy $16.99
  upsell2SessionId: varchar("upsell2_session_id", { length: 255 }),
  upsell3Purchased: int("upsell3_purchased").default(0), // Testosterone Recipes $9.99
  upsell3SessionId: varchar("upsell3_session_id", { length: 255 }),
  affiliateId: int("affiliate_id"),   // FK to affiliates.id (nullable)
  affiliateCode: varchar("affiliate_code", { length: 20 }), // snapshot of code at time of order
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type FunnelOrder = typeof funnelOrders.$inferSelect;

// ── Contact Messages ──────────────────────────────────────────────────────────
export const contactMessages = mysqlTable("contact_messages", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(), // refund, access, billing, general, other
  subject: varchar("subject", { length: 200 }).notNull(),
  message: text("message").notNull(),
  orderId: varchar("order_id", { length: 100 }), // optional order reference
  status: mysqlEnum("status", ["open", "replied", "resolved"]).default("open").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type ContactMessage = typeof contactMessages.$inferSelect;

// ── Carpanda Settings ─────────────────────────────────────────────────────────
export const carpandaSettings = mysqlTable("carpanda_settings", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),  // e.g. "main", "recipeBump", "upsell1"
  label: varchar("label", { length: 200 }).notNull(),       // human-readable label
  url: text("url").notNull(),                                // the actual Carpanda payment link
  updatedAt: timestamp("updated_at").defaultNow().notNull().onUpdateNow(),
});
export type CarpandaSetting = typeof carpandaSettings.$inferSelect;

// ── Affiliate Program ─────────────────────────────────────────────────────────
export const affiliates = mysqlTable("affiliates", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  code: varchar("code", { length: 64 }).notNull().unique(), // unique tracking code e.g. "john-doe-x7k2"
  status: mysqlEnum("status", ["pending", "active", "suspended"]).default("pending").notNull(),
  commissionRate: int("commission_rate").default(40).notNull(), // percentage e.g. 40 = 40%
  paypalEmail: varchar("paypal_email", { length: 320 }),
  paymentMethod: varchar("payment_method", { length: 50 }).default("paypal"),
  totalClicks: int("total_clicks").default(0).notNull(),
  totalSales: int("total_sales").default(0).notNull(),
  totalEarnings: int("total_earnings").default(0).notNull(), // in cents
  totalPaid: int("total_paid").default(0).notNull(),         // in cents
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastLoginAt: timestamp("last_login_at"),
});
export type Affiliate = typeof affiliates.$inferSelect;

export const affiliateClicks = mysqlTable("affiliate_clicks", {
  id: int("id").autoincrement().primaryKey(),
  affiliateId: int("affiliate_id").notNull().references(() => affiliates.id),
  ip: varchar("ip", { length: 45 }),
  userAgent: varchar("user_agent", { length: 500 }),
  referer: varchar("referer", { length: 500 }),
  landingPage: varchar("landing_page", { length: 200 }).default("/"),
  sessionToken: varchar("session_token", { length: 64 }),
  converted: int("converted").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type AffiliateClick = typeof affiliateClicks.$inferSelect;

export const affiliateCommissions = mysqlTable("affiliate_commissions", {
  id: int("id").autoincrement().primaryKey(),
  affiliateId: int("affiliate_id").notNull().references(() => affiliates.id),
  orderId: int("order_id").references(() => funnelOrders.id),
  clickId: int("click_id").references(() => affiliateClicks.id),
  productType: varchar("product_type", { length: 50 }).notNull(), // "main", "upsell1", "upsell2", "upsell3", "bump"
  saleAmount: int("sale_amount").notNull(),       // in cents
  commissionRate: int("commission_rate").notNull(),
  commissionAmount: int("commission_amount").notNull(), // in cents
  status: mysqlEnum("status", ["pending", "approved", "paid", "reversed"]).default("pending").notNull(),
  paidAt: timestamp("paid_at"),
  payoutBatchId: varchar("payout_batch_id", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type AffiliateCommission = typeof affiliateCommissions.$inferSelect;

export const affiliatePayouts = mysqlTable("affiliate_payouts", {
  id: int("id").autoincrement().primaryKey(),
  affiliateId: int("affiliate_id").notNull().references(() => affiliates.id),
  batchId: varchar("batch_id", { length: 100 }).notNull().unique(),
  amount: int("amount").notNull(), // in cents
  method: varchar("method", { length: 50 }).notNull(),
  reference: varchar("reference", { length: 200 }),
  status: mysqlEnum("status", ["processing", "sent", "failed"]).default("processing").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type AffiliatePayout = typeof affiliatePayouts.$inferSelect;

// Add affiliate tracking columns to funnelOrders (affiliateCode + affiliateClickId)
// These are added as separate ALTER TABLE statements in the migration
