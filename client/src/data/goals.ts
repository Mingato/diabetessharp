/** Blood sugar target ranges (mg/dL). Used for time-in-range %. */
export interface GlucoseGoals {
  fastingMin: number;
  fastingMax: number;
  postMealMax: number;
}

const STORAGE_KEY = "diabetessharp_goals";
const DEFAULTS: GlucoseGoals = { fastingMin: 70, fastingMax: 130, postMealMax: 180 };

export function getGoals(): GlucoseGoals {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw) as GlucoseGoals;
    return {
      fastingMin: typeof parsed.fastingMin === "number" ? parsed.fastingMin : DEFAULTS.fastingMin,
      fastingMax: typeof parsed.fastingMax === "number" ? parsed.fastingMax : DEFAULTS.fastingMax,
      postMealMax: typeof parsed.postMealMax === "number" ? parsed.postMealMax : DEFAULTS.postMealMax,
    };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveGoals(goals: GlucoseGoals): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  } catch (_) {}
}
