import { z } from "zod";
import { router, protectedProcedure } from "../trpc/trpc.js";
import { query } from "../db/client.js";

export const cognitiveRouter = router({
  getProgress: protectedProcedure.query(async ({ ctx }) => {
    const rows = await query<{
      cognitiveScore: number;
      memoryScore: number;
      processingSpeed: number;
      attentionScore: number;
      dailyStreak: number;
      phaseNumber: number;
      date: string;
    }>(
      `SELECT "cognitiveScore", "memoryScore", "processingSpeed", "attentionScore", "dailyStreak", "phaseNumber", date
       FROM cognitive_progress WHERE "userId" = $1 ORDER BY date DESC LIMIT 90`,
      [ctx.user.id]
    );
    const latest = rows.rows[0];
    return {
      scores: rows.rows,
      dailyStreak: latest?.dailyStreak ?? 0,
      phaseNumber: latest?.phaseNumber ?? 1,
    };
  }),

  logExercise: protectedProcedure
    .input(
      z.object({
        exerciseType: z.string(),
        difficulty: z.number(),
        successRate: z.number(),
        timeSpent: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const today = new Date().toISOString().slice(0, 10);
      await query(
        `INSERT INTO daily_exercises ("userId", date, "exerciseType", difficulty, "successRate", "timeSpent", completed)
         VALUES ($1, $2, $3, $4, $5, $6, 1)`,
        [ctx.user.id, today, input.exerciseType, input.difficulty, input.successRate, input.timeSpent]
      );
      const prev = await query<{ cognitiveScore: number; "dailyExercisesCompleted": number; "exerciseMinutes": number }>(
        `SELECT "cognitiveScore", "dailyExercisesCompleted", "exerciseMinutes" FROM cognitive_progress WHERE "userId" = $1 ORDER BY date DESC LIMIT 1`,
        [ctx.user.id]
      );
      const prevScore = prev.rows[0]?.cognitiveScore ?? 50;
      const newScore = Math.min(100, Math.max(0, prevScore + (input.successRate > 70 ? 1 : -0.5)));
      const newMinutes = Math.ceil(input.timeSpent / 60);
      await query(
        `INSERT INTO cognitive_progress ("userId", date, "cognitiveScore", "memoryScore", "processingSpeed", "attentionScore", "dailyExercisesCompleted", "exerciseMinutes", "dailyStreak", "phaseNumber")
         VALUES ($1, $2, $3, $3, $3, $3, 1, $4, 1, 1)
         ON CONFLICT ("userId", date) DO UPDATE SET
           "cognitiveScore" = EXCLUDED."cognitiveScore",
           "memoryScore" = EXCLUDED."memoryScore",
           "processingSpeed" = EXCLUDED."processingSpeed",
           "attentionScore" = EXCLUDED."attentionScore",
           "dailyExercisesCompleted" = cognitive_progress."dailyExercisesCompleted" + 1,
           "exerciseMinutes" = cognitive_progress."exerciseMinutes" + EXCLUDED."exerciseMinutes"`,
        [ctx.user.id, today, Math.round(newScore), newMinutes]
      );
      return { success: true, newScore: Math.round(newScore) };
    }),

  getTodayExercises: protectedProcedure.query(async ({ ctx }) => {
    const today = new Date().toISOString().slice(0, 10);
    const r = await query<{
      id: number;
      "exerciseType": string;
      difficulty: number;
      "successRate": number;
      "timeSpent": number;
      completed: number;
    }>(
      `SELECT id, "exerciseType", difficulty, "successRate", "timeSpent", completed
       FROM daily_exercises WHERE "userId" = $1 AND date = $2 ORDER BY id ASC`,
      [ctx.user.id, today]
    );
    return r.rows;
  }),

  getDashboard: protectedProcedure.query(async ({ ctx }) => {
    const r = await query<{
      cognitiveScore: number;
      memoryScore: number;
      processingSpeed: number;
      attentionScore: number;
      dailyStreak: number;
    }>(
      `SELECT "cognitiveScore", "memoryScore", "processingSpeed", "attentionScore", "dailyStreak"
       FROM cognitive_progress WHERE "userId" = $1 ORDER BY date DESC LIMIT 1`,
      [ctx.user.id]
    );
    const row = r.rows[0];
    const cognitiveScore = row?.cognitiveScore ?? 50;
    const brainAge = Math.max(40, 90 - cognitiveScore);
    return {
      cognitiveScore: row?.cognitiveScore ?? 50,
      memoryScore: row?.memoryScore ?? 50,
      processingSpeed: row?.processingSpeed ?? 50,
      attentionScore: row?.attentionScore ?? 50,
      dailyStreak: row?.dailyStreak ?? 0,
      brainAge,
    };
  }),
});
