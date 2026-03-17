/**
 * Daily Coach: contextual tips like "Drink more water", "Avoid sugar after 8pm", "Walk 10 min after meals".
 * Companion to Tip of the day — multiple actionable tips per day.
 */
import { getTodayString } from "./mealLogs";

export interface CoachTip {
  id: string;
  text: string;
  icon: string;
  category: "hydration" | "timing" | "activity" | "food" | "routine";
}

const TIPS: CoachTip[] = [
  { id: "water", text: "Drink more water today", icon: "💧", category: "hydration" },
  { id: "sugar-evening", text: "Avoid sugar after 8pm", icon: "🌙", category: "timing" },
  { id: "walk-meals", text: "Walk 10 min after meals", icon: "🚶", category: "activity" },
  { id: "fiber", text: "Add fiber to your next meal", icon: "🥗", category: "food" },
  { id: "sleep", text: "Aim for 7–8 hours of sleep tonight", icon: "😴", category: "routine" },
  { id: "portion", text: "Try a smaller portion at dinner", icon: "🍽️", category: "food" },
  { id: "check-feet", text: "Do a quick foot check today", icon: "🦶", category: "routine" },
  { id: "stress", text: "Take 5 minutes to breathe or stretch", icon: "🧘", category: "routine" },
];

/** Picks 2–3 daily coach tips (deterministic per day so they don't change on every load). */
export function getDailyCoachTips(): CoachTip[] {
  const today = getTodayString();
  const seed = today.split("-").reduce((acc, s) => acc + s.charCodeAt(0), 0);
  const indices = [seed % TIPS.length, (seed + 3) % TIPS.length, (seed + 6) % TIPS.length];
  const seen = new Set<string>();
  return indices
    .map((i) => TIPS[i])
    .filter((t) => {
      if (seen.has(t.id)) return false;
      seen.add(t.id);
      return true;
    });
}
