/**
 * Activity streak: consecutive days with at least one "activity" (glucose log, meal log, or reminder completed).
 * Used for "don't break your streak" and celebrations.
 */
import { getGlucoseLogs } from "./glucoseLogs";
import { getMealLogs } from "./mealLogs";
import { getCompletionsForDate, getDatesWithAnyCompletion } from "./reminders";

function getTodayString(): string {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

/** Dates that have at least one activity (glucose, meal, or any reminder done) */
function getActiveDates(): Set<string> {
  const dates = new Set<string>();
  getGlucoseLogs().forEach((e) => dates.add(e.date));
  getMealLogs().forEach((e) => dates.add(e.date));
  getDatesWithAnyCompletion().forEach((d) => dates.add(d));
  return dates;
}

/** Current streak: consecutive days with activity, ending on the most recent active day (including today if active) */
export function getCurrentStreak(): number {
  const active = getActiveDates();
  if (active.size === 0) return 0;
  const today = getTodayString();
  const sorted = Array.from(active).filter((d) => d <= today).sort().reverse();
  if (sorted.length === 0) return 0;
  const mostRecent = sorted[0];
  const start = new Date(mostRecent + "T12:00:00");
  let count = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() - i);
    const dateStr = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    if (active.has(dateStr)) count++;
    else break;
  }
  return count;
}

/** Best streak so far (max consecutive days we can find in active set) */
export function getBestStreak(): number {
  const active = getActiveDates();
  if (active.size === 0) return 0;
  const sorted = Array.from(active).sort();
  let best = 1;
  let current = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = (curr.getTime() - prev.getTime()) / (24 * 60 * 60 * 1000);
    if (diff === 1) current++;
    else current = 1;
    if (current > best) best = current;
  }
  return best;
}

/** Whether user has done at least one activity today */
export function hasActivityToday(): boolean {
  const today = getTodayString();
  const glucose = getGlucoseLogs().some((e) => e.date === today);
  if (glucose) return true;
  const meals = getMealLogs().some((e) => e.date === today);
  if (meals) return true;
  const done = getCompletionsForDate(today);
  return done.size > 0;
}

/** Show "don't break your streak" when streak > 0 and no activity today yet */
export function shouldShowDontBreakStreak(): boolean {
  const streak = getCurrentStreak();
  if (streak === 0) return false;
  return !hasActivityToday();
}

const CELEBRATION_KEY = "diabetessharp_last_celebration";

export type MilestoneType = "streak_7" | "streak_14" | "streak_30" | "time_in_range_70" | "time_in_range_80";

export function getLastCelebratedMilestone(): string | null {
  try {
    return localStorage.getItem(CELEBRATION_KEY);
  } catch {
    return null;
  }
}

export function setLastCelebratedMilestone(milestone: MilestoneType): void {
  try {
    localStorage.setItem(CELEBRATION_KEY, milestone);
  } catch (_) {}
}

/** Returns the milestone to celebrate now (if any) that we haven't celebrated yet */
export function getMilestoneToCelebrate(
  currentStreak: number,
  timeInRangePercent: number | null
): MilestoneType | null {
  const last = getLastCelebratedMilestone();
  if (currentStreak >= 30 && last !== "streak_30") return "streak_30";
  if (currentStreak >= 14 && last !== "streak_14") return "streak_14";
  if (currentStreak >= 7 && last !== "streak_7") return "streak_7";
  if (timeInRangePercent !== null && timeInRangePercent >= 80 && last !== "time_in_range_80") return "time_in_range_80";
  if (timeInRangePercent !== null && timeInRangePercent >= 70 && last !== "time_in_range_70" && last !== "time_in_range_80") return "time_in_range_70";
  return null;
}

export function getMilestoneMessage(milestone: MilestoneType): string {
  switch (milestone) {
    case "streak_7":
      return "7 days in a row! You're building a real habit.";
    case "streak_14":
      return "2 weeks straight! You're on fire.";
    case "streak_30":
      return "30-day streak! You're a champion.";
    case "time_in_range_70":
      return "70% time in range! Your numbers are looking great.";
    case "time_in_range_80":
      return "80% time in range! Outstanding control.";
    default:
      return "Goal reached! Keep it up.";
  }
}
