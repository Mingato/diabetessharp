/** Reminders (medication, glucose check). Completions stored per day. */
export type ReminderType = "medication" | "glucose";

export interface Reminder {
  id: string;
  type: ReminderType;
  label: string;
  time: string; // HH:mm
  enabled: boolean;
  createdAt: number;
}

const STORAGE_KEY = "diabetessharp_reminders";
const DONE_KEY = "diabetessharp_reminder_done";

export function getReminders(): Reminder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Reminder[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveReminders(reminders: Reminder[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
  } catch (_) {}
}

export function addReminder(entry: Omit<Reminder, "id" | "createdAt">): void {
  const list = getReminders();
  const newOne: Reminder = {
    ...entry,
    id: `rem-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    createdAt: Date.now(),
  };
  list.push(newOne);
  saveReminders(list);
}

export function updateReminder(id: string, patch: Partial<Reminder>): void {
  const list = getReminders().map((r) => (r.id === id ? { ...r, ...patch } : r));
  saveReminders(list);
}

export function deleteReminder(id: string): void {
  saveReminders(getReminders().filter((r) => r.id !== id));
}

/** Get completed reminder IDs for a date (YYYY-MM-DD) */
export function getCompletionsForDate(date: string): Set<string> {
  try {
    const raw = localStorage.getItem(DONE_KEY);
    if (!raw) return new Set();
    const obj = JSON.parse(raw) as Record<string, string[]>;
    const ids = obj[date];
    return new Set(Array.isArray(ids) ? ids : []);
  } catch {
    return new Set();
  }
}

/** All dates (YYYY-MM-DD) that have at least one reminder completion */
export function getDatesWithAnyCompletion(): string[] {
  try {
    const raw = localStorage.getItem(DONE_KEY);
    if (!raw) return [];
    const obj = JSON.parse(raw) as Record<string, string[]>;
    return Object.keys(obj).filter((date) => {
      const ids = obj[date];
      return Array.isArray(ids) && ids.length > 0;
    });
  } catch {
    return [];
  }
}

/** Mark reminder as done for a date */
export function setReminderDone(date: string, reminderId: string, done: boolean): void {
  try {
    const raw = localStorage.getItem(DONE_KEY);
    const obj: Record<string, string[]> = raw ? JSON.parse(raw) : {};
    const list = obj[date] ?? [];
    const set = new Set(list);
    if (done) set.add(reminderId);
    else set.delete(reminderId);
    obj[date] = Array.from(set);
    localStorage.setItem(DONE_KEY, JSON.stringify(obj));
  } catch (_) {}
}

export function getTodayString(): string {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

/** Reminders for today, sorted by time, with done status */
export function getTodaysRemindersWithStatus(): { reminder: Reminder; done: boolean }[] {
  const today = getTodayString();
  const completed = getCompletionsForDate(today);
  return getReminders()
    .filter((r) => r.enabled)
    .sort((a, b) => a.time.localeCompare(b.time))
    .map((reminder) => ({ reminder, done: completed.has(reminder.id) }));
}
