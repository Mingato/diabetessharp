/** Blood glucose log entries. Stored in localStorage for charts and time-in-range. */
export type GlucoseContext = "fasting" | "post_breakfast" | "post_lunch" | "post_dinner" | "bedtime" | "other";

export interface GlucoseEntry {
  id: string;
  value: number; // mg/dL
  unit: "mg/dL";
  context: GlucoseContext;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  createdAt: number;
}

const STORAGE_KEY = "diabetessharp_glucose_logs";

export function getGlucoseLogs(): GlucoseEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as GlucoseEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveGlucoseLogs(logs: GlucoseEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  } catch (_) {}
}

export function addGlucoseLog(entry: Omit<GlucoseEntry, "id" | "createdAt">): void {
  const logs = getGlucoseLogs();
  const newEntry: GlucoseEntry = {
    ...entry,
    id: `glucose-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    createdAt: Date.now(),
  };
  logs.push(newEntry);
  logs.sort((a, b) => b.createdAt - a.createdAt);
  saveGlucoseLogs(logs);
}

export function getTodayString(): string {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

/** Last N days of logs, newest first */
export function getRecentLogs(days: number): GlucoseEntry[] {
  const logs = getGlucoseLogs();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = cutoff.getFullYear() + "-" + String(cutoff.getMonth() + 1).padStart(2, "0") + "-" + String(cutoff.getDate()).padStart(2, "0");
  return logs.filter((e) => e.date >= cutoffStr).slice(0, 200);
}

/** Average glucose over last N days (for A1c estimate) */
export function getAverageGlucose(days: number): number | null {
  const logs = getRecentLogs(days);
  if (logs.length === 0) return null;
  const sum = logs.reduce((s, e) => s + e.value, 0);
  return Math.round(sum / logs.length);
}

/** Estimated A1c from average glucose (formula: A1c ≈ (avg + 46.7) / 28.7). Disclaimer: lab is authoritative. */
export function estimateA1c(avgGlucoseMgDl: number): number {
  return Math.round(((avgGlucoseMgDl + 46.7) / 28.7) * 10) / 10;
}

/** Percent of readings in range. Range: fasting [min, max], post-meal [0, postMax]. */
export function getTimeInRangePercent(
  logs: GlucoseEntry[],
  fastingMin: number,
  fastingMax: number,
  postMealMax: number
): number | null {
  if (logs.length === 0) return null;
  const fastingContexts = ["fasting", "bedtime"] as const;
  let inRange = 0;
  for (const e of logs) {
    const isFasting = fastingContexts.includes(e.context as typeof fastingContexts[number]) || e.context === "other";
    if (isFasting) {
      if (e.value >= fastingMin && e.value <= fastingMax) inRange++;
    } else {
      if (e.value >= 0 && e.value <= postMealMax) inRange++;
    }
  }
  return Math.round((inRange / logs.length) * 100);
}

export const GLUCOSE_CONTEXT_LABELS: Record<GlucoseContext, string> = {
  fasting: "Fasting",
  post_breakfast: "Post breakfast",
  post_lunch: "Post lunch",
  post_dinner: "Post dinner",
  bedtime: "Bedtime",
  other: "Other",
};
