import { getCurrentStreak } from "./streak";
import { getRecentLogs, getTimeInRangePercent } from "./glucoseLogs";
import { getGoals } from "./goals";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt: string; // ISO string
}

const STORAGE_KEY = "diabetessharp_achievements";

function loadAchievements(): Achievement[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Achievement[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveAchievements(list: Achievement[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

function addIfNew(list: Achievement[], id: string, title: string, description: string): Achievement[] {
  if (list.some((a) => a.id === id)) return list;
  const unlockedAt = new Date().toISOString();
  return [...list, { id, title, description, unlockedAt }];
}

export function evaluateAndStoreAchievements(): Achievement[] {
  let list = loadAchievements();
  const streak = getCurrentStreak();
  const goals = getGoals();
  const logs = getRecentLogs(30);
  const timeInRange = getTimeInRangePercent(logs, goals.fastingMin, goals.fastingMax, goals.postMealMax);

  if (streak >= 7) {
    list = addIfNew(
      list,
      "streak_7",
      "7 days in a row",
      "You logged activity for 7 days in a row. That's how habits are built."
    );
  }

  if (streak >= 30) {
    list = addIfNew(
      list,
      "streak_30",
      "30-day streak",
      "30 days of activity — amazing commitment to your health."
    );
  }

  if (timeInRange !== null && timeInRange >= 70) {
    list = addIfNew(
      list,
      "tir_70",
      "70% time in range",
      "Your time in range reached 70%. You and your care team can build on this."
    );
  }

  if (timeInRange !== null && timeInRange >= 80) {
    list = addIfNew(
      list,
      "tir_80",
      "80% time in range",
      "80% time in range — outstanding diabetes control."
    );
  }

  if (logs.length >= 1) {
    list = addIfNew(
      list,
      "first_log",
      "First blood sugar log",
      "You logged your first blood sugar reading in the app. Great first step."
    );
  }

  saveAchievements(list);
  return list;
}

export function getAchievements(): Achievement[] {
  return loadAchievements().sort((a, b) => b.unlockedAt.localeCompare(a.unlockedAt));
}

/** Badge icon for each achievement (Duolingo-style). */
export const ACHIEVEMENT_BADGES: Record<string, string> = {
  streak_7: "🔥",
  streak_30: "🏆",
  tir_70: "📊",
  tir_80: "⭐",
  first_log: "🎯",
};

