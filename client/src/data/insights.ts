import { getRecentLogs, getTimeInRangePercent, type GlucoseEntry } from "./glucoseLogs";
import { getTotalsByDay, getMealLogs } from "./mealLogs";
import { getGoals } from "./goals";

export interface Insight {
  id: string;
  title: string;
  body: string;
  severity: "info" | "warning";
}

function hasEnoughData(logs: GlucoseEntry[]): boolean {
  return logs.length >= 8;
}

export function getSimpleInsights(): Insight[] {
  const logs = getRecentLogs(14);
  const goals = getGoals();
  const byDayMeals = getTotalsByDay(14);

  if (!hasEnoughData(logs)) {
    return [
      {
        id: "need-data",
        title: "Add more data",
        body: "Log a few days of blood sugar and meals so we can show you simple patterns.",
        severity: "info",
      },
    ];
  }

  const fasting = logs.filter((l) => l.context === "fasting");
  const afterMeals = logs.filter(
    (l) => l.context === "post_breakfast" || l.context === "post_lunch" || l.context === "post_dinner"
  );

  const insights: Insight[] = [];

  if (fasting.length >= 4) {
    const avgFasting =
      fasting.reduce((s, l) => s + l.value, 0) / fasting.length;
    if (avgFasting > goals.fastingMax) {
      insights.push({
        id: "high-fasting",
        title: "Fasting numbers are often high",
        body: "Your fasting blood sugar has been above your target on many days. You can discuss evening meals, snacks, and medication timing with your doctor.",
        severity: "warning",
      });
    }
  }

  if (afterMeals.length >= 4) {
    const overTarget = afterMeals.filter((l) => l.value > goals.postMealMax).length;
    if (overTarget / afterMeals.length > 0.4) {
      insights.push({
        id: "after-meals-high",
        title: "After-meal readings often above target",
        body: "Several after-meal readings are above your target. You can experiment with portion size, more fiber, or a short walk after meals and track the effect.",
        severity: "warning",
      });
    }
  }

  const recentMeals = byDayMeals.slice(0, 7);
  if (recentMeals.length >= 3) {
    const highSugarDays = recentMeals.filter((d) => d.sugar > 60).length;
    if (highSugarDays >= 3) {
      insights.push({
        id: "high-sugar-days",
        title: "Several days with higher sugar intake",
        body: "On multiple days your estimated sugar intake was higher. You can try swapping sugary drinks or desserts on a few days and see how your numbers respond.",
        severity: "info",
      });
    }
  }

  if (insights.length === 0) {
    insights.push({
      id: "doing-well",
      title: "Nice work keeping track",
      body: "Your recent logs do not show strong negative patterns. Keep logging glucose and meals — consistency helps you and your care team see what works.",
      severity: "info",
    });
  }

  return insights;
}

/** Smart alerts: short, actionable messages for the dashboard (pattern-based). */
export interface SmartAlert {
  id: string;
  message: string;
  icon: string;
  type: "positive" | "warning" | "info";
}

export function getSmartAlerts(): SmartAlert[] {
  const alerts: SmartAlert[] = [];
  const logs = getRecentLogs(14);
  const goals = getGoals();
  const yesterday = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  })();
  const hadActivityYesterday =
    logs.some((e) => e.date === yesterday) || getMealLogs().some((e) => e.date === yesterday);

  if (!hadActivityYesterday && logs.length > 0) {
    alerts.push({
      id: "skipped-yesterday",
      message: "You skipped tracking yesterday",
      icon: "📋",
      type: "info",
    });
  }

  const tir = getTimeInRangePercent(logs, goals.fastingMin, goals.fastingMax, goals.postMealMax);
  if (tir !== null && tir >= 70) {
    alerts.push({
      id: "levels-improved",
      message: `Your time in range is ${tir}% this period 🎉`,
      icon: "🎉",
      type: "positive",
    });
  }

  const afterLunch = logs.filter((l) => l.context === "post_lunch");
  if (afterLunch.length >= 3) {
    const over = afterLunch.filter((l) => l.value > goals.postMealMax).length;
    if (over / afterLunch.length >= 0.5) {
      alerts.push({
        id: "spike-lunch",
        message: "Your glucose tends to spike after lunch 👀",
        icon: "👀",
        type: "warning",
      });
    }
  }

  return alerts.slice(0, 3);
}

