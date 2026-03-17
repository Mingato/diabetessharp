/**
 * Smart in-app notifications: contextual messages to increase retention.
 * "Time to log your sugar 👀", "Don't break your streak 🔥", "You're improving, keep going"
 */
import { getTodayString } from "./mealLogs";
import { getCurrentStreak } from "./streak";
import { getRecentLogs, getTimeInRangePercent } from "./glucoseLogs";
import { getGoals } from "./goals";
import { getGlucoseLogs, type GlucoseEntry } from "./glucoseLogs";
import { getMealLogs } from "./mealLogs";

export interface SmartNotification {
  id: string;
  message: string;
  icon: string;
  priority: number; // higher = show first
  cta?: { label: string; path: string };
}

function hasAnyActivityToday(): boolean {
  const today = getTodayString();
  const logs = getGlucoseLogs();
  const meals = getMealLogs();
  if (logs.some((e) => e.date === today)) return true;
  if (meals.some((e) => e.date === today)) return true;
  return false;
}

function getLogsInDateRange(startDate: string, endDate: string): GlucoseEntry[] {
  const all = getGlucoseLogs();
  return all.filter((e) => e.date >= startDate && e.date <= endDate);
}

function getTirForRange(logs: GlucoseEntry[]): number | null {
  if (logs.length < 3) return null;
  const goals = getGoals();
  return getTimeInRangePercent(logs, goals.fastingMin, goals.fastingMax, goals.postMealMax);
}

/** Returns the best smart notification to show right now (one at a time). */
export function getSmartNotification(): SmartNotification | null {
  const today = getTodayString();
  const streak = getCurrentStreak();
  const hasActivity = hasAnyActivityToday();
  const hour = new Date().getHours();

  // 1. Don't break your streak — high priority when user has streak and no activity today
  if (streak > 0 && !hasActivity) {
    return {
      id: "dont-break-streak",
      message: "Don't break your streak 🔥",
      icon: "🔥",
      priority: 100,
      cta: { label: "Log now", path: "/app/glucose" },
    };
  }

  // 2. Time to log your sugar — morning/afternoon and no glucose log today
  const glucoseToday = getRecentLogs(1).filter((e) => e.date === today).length;
  if (glucoseToday === 0 && hour >= 7 && hour <= 18) {
    return {
      id: "time-to-log",
      message: "Time to log your sugar 👀",
      icon: "👀",
      priority: 90,
      cta: { label: "Log glucose", path: "/app/glucose" },
    };
  }

  // 3. You're improving — TIR this week vs previous week
  const last7Start = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  })();
  const prev7End = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  })();
  const prev7Start = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 13);
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  })();
  const thisWeekLogs = getLogsInDateRange(last7Start, today);
  const prevWeekLogs = getLogsInDateRange(prev7Start, prev7End);
  const tirNow = getTirForRange(thisWeekLogs);
  const tirPrev = getTirForRange(prevWeekLogs);
  if (tirNow !== null && tirPrev !== null && tirNow > tirPrev) {
    const diff = tirNow - tirPrev;
    return {
      id: "improving",
      message: `Your levels improved ${diff}% this week 🎉`,
      icon: "🎉",
      priority: 80,
      cta: { label: "See insights", path: "/app/insights" },
    };
  }

  // 4. You skipped tracking yesterday — gentle nudge
  const yesterday = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  })();
  const hadActivityYesterday =
    getGlucoseLogs().some((e) => e.date === yesterday) || getMealLogs().some((e) => e.date === yesterday);
  if (!hadActivityYesterday && streak === 0 && hour >= 9 && hour <= 20) {
    return {
      id: "skipped-yesterday",
      message: "You skipped tracking yesterday — log today to stay on track",
      icon: "📋",
      priority: 50,
      cta: { label: "Log now", path: "/app/glucose" },
    };
  }

  return null;
}
