/** Meal log entry: one dish/photo analysis per meal. Persisted in localStorage for reports by day, month, year. */
export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface MealLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  mealType: MealType;
  calories: number;
  protein: number;
  sugar: number;
  source: "photo" | "manual";
  createdAt: number;
}

const STORAGE_KEY = "diabetessharp_meal_logs";

export function getMealLogs(): MealLogEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as MealLogEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveMealLogs(logs: MealLogEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  } catch (_) {}
}

export function addMealLog(entry: Omit<MealLogEntry, "id" | "createdAt">): void {
  const logs = getMealLogs();
  const newEntry: MealLogEntry = {
    ...entry,
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    createdAt: Date.now(),
  };
  logs.push(newEntry);
  saveMealLogs(logs);
}

export function getTodayString(): string {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

export function getTotalsForDate(date: string): { calories: number; protein: number; sugar: number } {
  const logs = getMealLogs().filter((e) => e.date === date);
  return logs.reduce(
    (acc, e) => ({
      calories: acc.calories + e.calories,
      protein: acc.protein + e.protein,
      sugar: acc.sugar + e.sugar,
    }),
    { calories: 0, protein: 0, sugar: 0 }
  );
}

export function getEntriesByDate(date: string): MealLogEntry[] {
  return getMealLogs()
    .filter((e) => e.date === date)
    .sort((a, b) => a.createdAt - b.createdAt);
}

/** Unique dates that have at least one log, newest first */
export function getLoggedDates(): string[] {
  const set = new Set(getMealLogs().map((e) => e.date));
  return Array.from(set).sort().reverse();
}

/** Totals grouped by day in a range (e.g. last 30 days) */
export function getTotalsByDay(daysBack: number): { date: string; calories: number; protein: number; sugar: number }[] {
  const logs = getMealLogs();
  const today = getTodayString();
  const result: { date: string; calories: number; protein: number; sugar: number }[] = [];
  for (let i = 0; i < daysBack; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const date =
      d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    const dayLogs = logs.filter((e) => e.date === date);
    const calories = dayLogs.reduce((s, e) => s + e.calories, 0);
    const protein = dayLogs.reduce((s, e) => s + e.protein, 0);
    const sugar = dayLogs.reduce((s, e) => s + e.sugar, 0);
    result.push({ date, calories, protein, sugar });
  }
  return result;
}

/** Totals by month (key: "YYYY-MM") */
export function getTotalsByMonth(): { monthKey: string; calories: number; protein: number; sugar: number; days: number }[] {
  const logs = getMealLogs();
  const byMonth = new Map<string, { calories: number; protein: number; sugar: number; days: Set<string> }>();
  for (const e of logs) {
    const monthKey = e.date.slice(0, 7);
    const cur = byMonth.get(monthKey) ?? { calories: 0, protein: 0, sugar: 0, days: new Set<string>() };
    cur.calories += e.calories;
    cur.protein += e.protein;
    cur.sugar += e.sugar;
    cur.days.add(e.date);
    byMonth.set(monthKey, cur);
  }
  return Array.from(byMonth.entries())
    .map(([monthKey, data]) => ({
      monthKey,
      calories: data.calories,
      protein: data.protein,
      sugar: data.sugar,
      days: data.days.size,
    }))
    .sort((a, b) => b.monthKey.localeCompare(a.monthKey));
}

/** Totals by year */
export function getTotalsByYear(): { year: number; calories: number; protein: number; sugar: number; days: number }[] {
  const logs = getMealLogs();
  const byYear = new Map<number, { calories: number; protein: number; sugar: number; days: Set<string> }>();
  for (const e of logs) {
    const year = parseInt(e.date.slice(0, 4), 10);
    const cur = byYear.get(year) ?? { calories: 0, protein: 0, sugar: 0, days: new Set<string>() };
    cur.calories += e.calories;
    cur.protein += e.protein;
    cur.sugar += e.sugar;
    cur.days.add(e.date);
    byYear.set(year, cur);
  }
  return Array.from(byYear.entries())
    .map(([year, data]) => ({
      year,
      calories: data.calories,
      protein: data.protein,
      sugar: data.sugar,
      days: data.days.size,
    }))
    .sort((a, b) => b.year - a.year);
}

/** Totals by meal type for a given date (or all time if date not provided) */
export function getTotalsByMealType(
  date?: string
): { mealType: MealType; label: string; calories: number; protein: number; sugar: number }[] {
  const logs = date ? getMealLogs().filter((e) => e.date === date) : getMealLogs();
  const byMeal: Record<MealType, { calories: number; protein: number; sugar: number }> = {
    breakfast: { calories: 0, protein: 0, sugar: 0 },
    lunch: { calories: 0, protein: 0, sugar: 0 },
    dinner: { calories: 0, protein: 0, sugar: 0 },
    snack: { calories: 0, protein: 0, sugar: 0 },
  };
  for (const e of logs) {
    byMeal[e.mealType].calories += e.calories;
    byMeal[e.mealType].protein += e.protein;
    byMeal[e.mealType].sugar += e.sugar;
  }
  const labels: { mealType: MealType; label: string }[] = [
    { mealType: "breakfast", label: "Café" },
    { mealType: "lunch", label: "Almoço" },
    { mealType: "dinner", label: "Jantar" },
    { mealType: "snack", label: "Lanche" },
  ];
  return labels.map(({ mealType, label }) => ({
    mealType,
    label,
    ...byMeal[mealType],
  }));
}

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: "Café",
  lunch: "Almoço",
  dinner: "Jantar",
  snack: "Lanche",
};
