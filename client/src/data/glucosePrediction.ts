/**
 * Simple glucose prediction from patterns: "Your glucose tends to spike after lunch", etc.
 * Level Unicorn — makes the app feel intelligent.
 */
import { getRecentLogs } from "./glucoseLogs";
import { getGoals } from "./goals";
import { getTotalsByDay } from "./mealLogs";

export interface GlucosePrediction {
  id: string;
  message: string;
  type: "pattern" | "caution" | "positive";
  icon: string;
}

/** Returns 0–2 prediction messages based on recent data. */
export function getGlucosePredictions(): GlucosePrediction[] {
  const logs = getRecentLogs(14);
  const goals = getGoals();
  const byDayMeals = getTotalsByDay(7);
  const predictions: GlucosePrediction[] = [];

  if (logs.length < 5) {
    return [
      {
        id: "need-data",
        message: "Log a few more days of glucose and meals to see predictions.",
        type: "caution",
        icon: "📊",
      },
    ];
  }

  // After-lunch spike pattern
  const postLunch = logs.filter((l) => l.context === "post_lunch");
  if (postLunch.length >= 3) {
    const over = postLunch.filter((l) => l.value > goals.postMealMax).length;
    if (over / postLunch.length >= 0.5) {
      predictions.push({
        id: "spike-lunch",
        message: "Your glucose tends to spike after lunch 👀",
        type: "pattern",
        icon: "👀",
      });
    }
  }

  // After-dinner spike
  const postDinner = logs.filter((l) => l.context === "post_dinner");
  if (postDinner.length >= 3) {
    const over = postDinner.filter((l) => l.value > goals.postMealMax).length;
    if (over / postDinner.length >= 0.5) {
      predictions.push({
        id: "spike-dinner",
        message: "Your glucose often rises after dinner — a short walk may help.",
        type: "pattern",
        icon: "🚶",
      });
    }
  }

  // High-sugar day → caution for next meal
  if (byDayMeals.length >= 3) {
    const lastDay = byDayMeals[0];
    if (lastDay.sugar > 50) {
      predictions.push({
        id: "high-sugar-yesterday",
        message: "If you eat a heavy or sugary meal today, your sugar may spike.",
        type: "caution",
        icon: "🍬",
      });
    }
  }

  // Positive: stable fasting
  const fasting = logs.filter((l) => l.context === "fasting");
  if (fasting.length >= 4) {
    const inRange = fasting.filter(
      (l) => l.value >= goals.fastingMin && l.value <= goals.fastingMax
    ).length;
    if (inRange / fasting.length >= 0.75) {
      predictions.push({
        id: "stable-fasting",
        message: "Your fasting numbers have been stable lately — keep it up.",
        type: "positive",
        icon: "✅",
      });
    }
  }

  return predictions.slice(0, 2); // max 2 so we don't overwhelm
}
