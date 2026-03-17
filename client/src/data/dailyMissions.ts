import { getTodayString } from "./mealLogs";
import { getTodaysRemindersWithStatus } from "./reminders";
import { getRecentLogs } from "./glucoseLogs";

export type MissionId = "log_fasting" | "log_after_meal" | "plan_meal" | "complete_reminders" | "check_feet" | "read_article";

export interface DailyMission {
  id: MissionId;
  title: string;
  description: string;
  href: string;
  done: boolean;
}

const STORAGE_KEY = "diabetessharp_daily_missions";

interface StoredMissions {
  date: string;
  completedIds: MissionId[];
}

function loadStored(): StoredMissions | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw) as StoredMissions;
    if (!obj || typeof obj.date !== "string" || !Array.isArray(obj.completedIds)) return null;
    return obj;
  } catch {
    return null;
  }
}

function saveCompleted(date: string, completedIds: MissionId[]): void {
  try {
    const payload: StoredMissions = { date, completedIds };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore
  }
}

export function toggleMissionDone(id: MissionId, done: boolean): void {
  const today = getTodayString();
  const current = loadStored();
  const completed = new Set<MissionId>(current?.date === today ? current.completedIds : []);
  if (done) completed.add(id);
  else completed.delete(id);
  saveCompleted(today, Array.from(completed));
}

export function getDailyMissions(): DailyMission[] {
  const today = getTodayString();
  const stored = loadStored();
  const completed = new Set<MissionId>(stored?.date === today ? stored.completedIds : []);

  const glucoseLogs = getRecentLogs(3);
  const todayGlucose = glucoseLogs.filter((e) => e.date === today);
  const hasFastingToday = todayGlucose.some((e) => e.context === "fasting");
  const hasAnyGlucoseToday = todayGlucose.length > 0;

  const todaysReminders = getTodaysRemindersWithStatus();
  const hasAnyReminder = todaysReminders.length > 0;
  const doneReminders = todaysReminders.filter((r) => r.done).length;

  const missions: { id: MissionId; title: string; description: string; href: string; condition?: boolean }[] = [
    {
      id: "log_fasting",
      title: "Log fasting blood sugar",
      description: "Start the day by logging your fasting glucose.",
      href: "/app/glucose",
      condition: !hasFastingToday,
    },
    {
      id: "log_after_meal",
      title: "Log after-meal blood sugar",
      description: "Pick one meal today and log your glucose 1–2 hours after.",
      href: "/app/glucose",
      condition: !hasAnyGlucoseToday,
    },
    {
      id: "plan_meal",
      title: "Plan one diabetes-friendly meal",
      description: "Choose or log one meal using the Nutrition tab.",
      href: "/app/nutrition",
    },
    {
      id: "complete_reminders",
      title: "Complete today’s reminders",
      description: hasAnyReminder
        ? "Mark your medication and glucose reminders as done."
        : "Set up your medication and glucose reminders.",
      href: "/app/reminders",
    },
    {
      id: "check_feet",
      title: "Foot check today",
      description: "Check your feet for cuts or changes and take a quick photo if needed.",
      href: "/app/photos",
    },
    {
      id: "read_article",
      title: "Read today’s article",
      description: "Spend 5 minutes learning something new in the Education tab.",
      href: "/app/learn",
    },
  ];

  const withConditions = missions.filter((m) => m.condition !== false);

  const withDone: DailyMission[] = withConditions.map((m) => ({
    ...m,
    done: m.id === "complete_reminders" ? doneReminders > 0 && doneReminders === todaysReminders.length && completed.has(m.id) : completed.has(m.id),
  }));

  // Sort: incomplete first, then completed
  withDone.sort((a, b) => Number(a.done) - Number(b.done));

  return withDone;
}

