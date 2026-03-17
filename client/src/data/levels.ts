import { getCurrentStreak } from "./streak";
import { getRecentLogs, getTimeInRangePercent } from "./glucoseLogs";
import { getGoals } from "./goals";
import { getTodaysRemindersWithStatus } from "./reminders";

export type ControlLevelId = "beginner" | "in_balance" | "high_performance";

export interface ControlLevel {
  id: ControlLevelId;
  label: string;
  description: string;
}

export function getControlLevel(): ControlLevel {
  const streak = getCurrentStreak();
  const goals = getGoals();
  const logs = getRecentLogs(30);
  const timeInRange = getTimeInRangePercent(logs, goals.fastingMin, goals.fastingMax, goals.postMealMax);
  const todaysReminders = getTodaysRemindersWithStatus();
  const adherenceToday =
    todaysReminders.length === 0 ? 0 : todaysReminders.filter((r) => r.done).length / todaysReminders.length;

  const tir = timeInRange ?? 0;

  if (tir >= 75 && streak >= 14 && adherenceToday >= 0.6) {
    return {
      id: "high_performance",
      label: "High performance",
      description:
        "You’ve built a very strong routine — your numbers and habits are working together. Keep your current plan, and use this app to bring a clear story to your next doctor visit.",
    };
  }

  if (tir >= 50 && streak >= 5) {
    return {
      id: "in_balance",
      label: "In balance",
      description:
        "You’re on the right track — your routine is taking shape. This week, choose one small experiment: adjust a meal, add a short walk after eating, or improve one reminder and watch what happens.",
    };
  }

  return {
    id: "beginner",
    label: "Getting started",
    description:
      "You’ve taken the most important step: starting. Pick one simple habit for today — like logging a fasting reading or one meal — and let the app help you build from there.",
  };
}

