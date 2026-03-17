import { getGlucoseLogs, type GlucoseEntry, getTimeInRangePercent } from "./glucoseLogs";
import { getGoals } from "./goals";

export interface WeekComparison {
  firstWeekTir: number;
  currentWeekTir: number;
  improvement: number; // positive = better, negative = worse
}

function groupByDate(logs: GlucoseEntry[]): Map<string, GlucoseEntry[]> {
  const map = new Map<string, GlucoseEntry[]>();
  for (const e of logs) {
    const arr = map.get(e.date) ?? [];
    arr.push(e);
    map.set(e.date, arr);
  }
  return map;
}

function computeTirForDates(dates: string[], byDate: Map<string, GlucoseEntry[]>): number | null {
  const goals = getGoals();
  const logs: GlucoseEntry[] = [];
  for (const d of dates) {
    const dayLogs = byDate.get(d);
    if (dayLogs) logs.push(...dayLogs);
  }
  if (logs.length < 5) return null;
  return getTimeInRangePercent(logs, goals.fastingMin, goals.fastingMax, goals.postMealMax);
}

/** Compare time-in-range of the first 7 days with data vs the most recent 7 days. */
export function getWeekComparison(): WeekComparison | null {
  const all = getGlucoseLogs();
  if (all.length < 10) return null;

  const byDate = groupByDate(all);
  const allDates = Array.from(byDate.keys()).sort(); // ascending
  if (allDates.length < 10) return null;

  const firstWeekDates = allDates.slice(0, 7);
  const lastWeekDates = allDates.slice(-7);

  const firstWeekTir = computeTirForDates(firstWeekDates, byDate);
  const currentWeekTir = computeTirForDates(lastWeekDates, byDate);

  if (firstWeekTir === null || currentWeekTir === null) return null;

  const improvement = currentWeekTir - firstWeekTir;
  return { firstWeekTir, currentWeekTir, improvement };
}

