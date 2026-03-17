import { getTodayString } from "./mealLogs";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  focus: "nutrition" | "activity" | "routine";
  totalDays: number;
  completedDays: number;
  completedToday: boolean;
}

const STORAGE_KEY = "diabetessharp_monthly_challenge";

interface StoredChallenge {
  id: string;
  monthKey: string; // YYYY-MM
  completedDates: string[]; // YYYY-MM-DD
}

const CURRENT_CHALLENGE: Pick<StoredChallenge, "id"> & {
  title: string;
  description: string;
  focus: Challenge["focus"];
  totalDays: number;
} = {
  id: "walk-after-meal-30",
  title: "30 days of a 10-min walk after a meal",
  description: "Choose one meal per day and walk for about 10 minutes afterward. Simple habit, big impact.",
  focus: "activity",
  totalDays: 30,
};

function loadStored(): StoredChallenge | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw) as StoredChallenge;
    if (!obj || typeof obj.id !== "string" || typeof obj.monthKey !== "string" || !Array.isArray(obj.completedDates)) {
      return null;
    }
    return obj;
  } catch {
    return null;
  }
}

function saveStored(stored: StoredChallenge): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // ignore
  }
}

function getCurrentMonthKey(): string {
  const today = getTodayString();
  return today.slice(0, 7);
}

export function getCurrentChallenge(): Challenge {
  const today = getTodayString();
  const monthKey = getCurrentMonthKey();
  const stored = loadStored();

  const base: StoredChallenge = stored && stored.monthKey === monthKey && stored.id === CURRENT_CHALLENGE.id
    ? stored
    : { id: CURRENT_CHALLENGE.id, monthKey, completedDates: [] };

  const completedSet = new Set(base.completedDates);
  const completedToday = completedSet.has(today);

  const firstDayOfMonth = new Date(monthKey + "-01T12:00:00");
  const now = new Date(today + "T12:00:00");
  Math.floor((now.getTime() - firstDayOfMonth.getTime()) / (24 * 60 * 60 * 1000));

  const completedDays = Array.from(completedSet).filter((d) => d.startsWith(monthKey)).length;

  return {
    id: CURRENT_CHALLENGE.id,
    title: CURRENT_CHALLENGE.title,
    description: CURRENT_CHALLENGE.description,
    focus: CURRENT_CHALLENGE.focus,
    totalDays: CURRENT_CHALLENGE.totalDays,
    completedDays,
    completedToday,
  };
}

export function toggleChallengeToday(done: boolean): void {
  const today = getTodayString();
  const monthKey = getCurrentMonthKey();
  const stored = loadStored();
  const base: StoredChallenge = stored && stored.monthKey === monthKey && stored.id === CURRENT_CHALLENGE.id
    ? stored
    : { id: CURRENT_CHALLENGE.id, monthKey, completedDates: [] };

  const set = new Set(base.completedDates);
  if (done) set.add(today);
  else set.delete(today);
  base.completedDates = Array.from(set);
  saveStored(base);
}

