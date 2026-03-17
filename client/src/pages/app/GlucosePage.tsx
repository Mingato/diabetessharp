import { useState } from "react";
import {
  getGlucoseLogs,
  addGlucoseLog,
  getRecentLogs,
  getTodayString,
  getTimeInRangePercent,
  estimateA1c,
  getAverageGlucose,
  GLUCOSE_CONTEXT_LABELS,
  type GlucoseContext,
} from "../../data/glucoseLogs";
import { getGoals } from "../../data/goals";
import { Link } from "react-router-dom";

const CONTEXTS: GlucoseContext[] = ["fasting", "post_breakfast", "post_lunch", "post_dinner", "bedtime", "other"];

function formatTime(): string {
  const d = new Date();
  return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
}

export function GlucosePage() {
  const [value, setValue] = useState("");
  const [context, setContext] = useState<GlucoseContext>("fasting");
  const [date, setDate] = useState(getTodayString());
  const [time, setTime] = useState(formatTime());
  const [version, setVersion] = useState(0);

  const logs = getRecentLogs(90);
  const goals = getGoals();
  const timeInRange = getTimeInRangePercent(logs, goals.fastingMin, goals.fastingMax, goals.postMealMax);
  const avg14 = getAverageGlucose(14);
  const avg30 = getAverageGlucose(30);
  const estimatedA1c = avg30 !== null ? estimateA1c(avg30) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(value.trim(), 10);
    if (Number.isNaN(num) || num < 20 || num > 500) return;
    addGlucoseLog({ value: num, unit: "mg/dL", context, date, time });
    setValue("");
    setTime(formatTime());
    setDate(getTodayString());
    setVersion((v) => v + 1);
  };

  const exportCsv = () => {
    const rows = getGlucoseLogs().slice(0, 500);
    const headers = "Date,Time,Value (mg/dL),Context\n";
    const lines = rows.map((e) => `${e.date},${e.time ?? ""},${e.value},${GLUCOSE_CONTEXT_LABELS[e.context]}`).join("\n");
    const blob = new Blob([headers + lines], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `glucose-log-${getTodayString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const last7 = getRecentLogs(7);
  const maxVal = Math.max(100, ...last7.map((e) => e.value), 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-bold text-[var(--color-text)]">My Sugar</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
            A calm place to watch your numbers and understand how your day is going.
          </p>
        </div>
        <Link
          to="/app/settings"
          className="text-sm text-[var(--color-accent)] hover:underline"
        >
          Set target range →
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {timeInRange !== null && (
          <div className="glass-card p-4 border border-[var(--color-glucose)]/40 bg-[var(--color-glucose)]/10">
            <div className="text-2xl font-display font-bold text-[var(--color-glucose)]">{timeInRange}%</div>
            <div className="text-xs text-[var(--color-text-muted)] mt-0.5">Time in range</div>
          </div>
        )}
        {avg14 !== null && (
          <div className="glass-card p-4 border border-[var(--color-glucose)]/25">
            <div className="text-2xl font-display font-bold text-[var(--color-text)]">{avg14}</div>
            <div className="text-xs text-[var(--color-text-muted)] mt-0.5">Average (14 days)</div>
          </div>
        )}
        {estimatedA1c !== null && (
          <div className="glass-card p-4 border border-[var(--color-progress)]/30">
            <div className="text-2xl font-display font-bold text-[var(--color-text)]">~{estimatedA1c}%</div>
            <div className="text-xs text-[var(--color-text-muted)] mt-0.5">
              Estimated A1c — your lab result is always the reference
            </div>
          </div>
        )}
        <div className="glass-card p-4 border border-[var(--color-surface-hover)]">
          <div className="text-2xl font-display font-bold text-[var(--color-text)]">{logs.length}</div>
          <div className="text-xs text-[var(--color-text-muted)] mt-0.5">Readings you&apos;ve logged so far</div>
        </div>
      </div>

      {/* Smooth line chart - last 7 readings (animated on load) */}
      {last7.length > 0 && (
        <div className="glass-card p-4 animate-in">
          <h2 className="text-sm font-semibold text-[var(--color-text)] mb-3">Last 7 readings</h2>
          <div className="h-40 w-full relative">
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
              {/* Baseline */}
              <line x1="0" y1="90" x2="100" y2="90" stroke="rgba(148,163,184,0.4)" strokeWidth="0.6" />
              {last7.map((e, idx) => {
                const x = (idx / Math.max(1, last7.length - 1)) * 100;
                const y = 10 + (1 - e.value / maxVal) * 70;
                const color =
                  goals &&
                  ((e.context === "fasting" && (e.value < goals.fastingMin || e.value > goals.fastingMax)) ||
                    (e.context !== "fasting" && e.value > goals.postMealMax))
                    ? "#ef4444"
                    : "#22c55e";
                return (
                  <circle key={e.id} cx={x} cy={y} r={1.4} fill={color} />
                );
              })}
              {/* Line */}
              <polyline
                fill="none"
                stroke="url(#glucoseLine)"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={last7
                  .map((e, idx) => {
                    const x = (idx / Math.max(1, last7.length - 1)) * 100;
                    const y = 10 + (1 - e.value / maxVal) * 70;
                    return `${x},${y}`;
                  })
                  .join(" ")}
              />
              <defs>
                <linearGradient id="glucoseLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      )}

      {/* Log form */}
      <div className="glass-card p-5">
        <h2 className="text-sm font-semibold text-[var(--color-text)] mb-4">Add reading</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">Value (mg/dL)</label>
              <input
                type="number"
                min={20}
                max={500}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="e.g. 98"
                className="input-field w-full"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">Context</label>
              <select
                value={context}
                onChange={(e) => setContext(e.target.value as GlucoseContext)}
                className="input-field w-full"
              >
                {CONTEXTS.map((c) => (
                  <option key={c} value={c}>{GLUCOSE_CONTEXT_LABELS[c]}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-field w-full" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">Time</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="input-field w-full" />
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full py-3">
            Save reading
          </button>
        </form>
      </div>

      {/* List + Export */}
        <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Recent readings</h2>
          <button type="button" onClick={exportCsv} className="text-sm text-[var(--color-accent)] hover:underline">
              Export CSV
          </button>
        </div>
        {logs.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)] py-4">No readings yet. Add one above.</p>
        ) : (
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {logs.slice(0, 50).map((e) => (
              <li key={e.id} className="flex justify-between items-center py-2 border-b border-[var(--color-border)] last:border-0">
                <span className="text-sm text-[var(--color-text-muted)]">{e.date} {e.time}</span>
                <span className="font-semibold text-[var(--color-text)]">{e.value} mg/dL</span>
                <span className="text-xs text-[var(--color-text-muted)]">{GLUCOSE_CONTEXT_LABELS[e.context]}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {void version}
    </div>
  );
}
