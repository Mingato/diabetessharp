import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { trpc } from "../../trpc";
import { getTotalsForDate, getTodayString } from "../../data/mealLogs";
import { getTodaysRemindersWithStatus } from "../../data/reminders";
import { getRecentLogs, getTimeInRangePercent } from "../../data/glucoseLogs";
import { getGoals } from "../../data/goals";
import {
  getCurrentStreak,
  getBestStreak,
  shouldShowDontBreakStreak,
  getMilestoneToCelebrate,
  getMilestoneMessage,
  setLastCelebratedMilestone,
  type MilestoneType,
} from "../../data/streak";
import { getTipOfTheDay } from "../../data/tipsOfTheDay";
import { getDailyMissions, toggleMissionDone } from "../../data/dailyMissions";
import { getSimpleInsights, getSmartAlerts } from "../../data/insights";
import { getCurrentChallenge, toggleChallengeToday } from "../../data/challenges";
import { getControlLevel } from "../../data/levels";
import { evaluateAndStoreAchievements, getAchievements, ACHIEVEMENT_BADGES } from "../../data/achievements";
import { getSmartNotification } from "../../data/smartNotifications";
import { getDailyCoachTips } from "../../data/dailyCoach";
import { getGlucosePredictions } from "../../data/glucosePrediction";
import { getWeekComparison } from "../../data/weekComparison";

const DEMO = { controlScore: 58, dailyStreak: 5, programDay: 2, checkInsDone: 0, bestStreak: 5 };

/** Skeleton screen: shimmer blocks only (Apple HIG); no spinner */
function DashboardSkeleton() {
  return (
    <div className="space-y-8 sm:space-y-10 animate-in">
      <div className="flex flex-wrap items-center gap-3">
        <div className="skeleton h-5 w-24" />
        <div className="skeleton h-6 w-28 rounded-full" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="stat-card">
            <div className="label skeleton h-3 w-20 rounded" />
            <div className="value skeleton h-7 w-16 rounded" />
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="glass-card p-6 sm:p-8 flex flex-col items-center">
          <div className="skeleton h-4 w-32 mb-6" />
          <div className="skeleton w-36 h-36 rounded-full" />
          <div className="skeleton h-4 w-48 mt-6" />
          <div className="skeleton h-12 w-full mt-6 rounded-xl" />
        </div>
        <div className="glass-card p-6 sm:p-8">
          <div className="flex justify-between mb-6">
            <div className="skeleton h-4 w-28" />
            <div className="skeleton h-3 w-12" />
          </div>
          <ul className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <li key={i} className="flex gap-4 p-4 rounded-xl bg-[var(--color-surface-hover)]/50">
                <div className="skeleton w-6 h-6 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-3/4" />
                  <div className="skeleton h-3 w-full" />
                </div>
                <div className="skeleton h-10 w-14 rounded-lg shrink-0" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/** One big "number of the day" for the dashboard hero */
function getNumberOfTheDay(
  todayStr: string,
  glucoseLogs: ReturnType<typeof getRecentLogs>,
  timeInRange: number | null,
  streak: number
): { value: string; label: string } {
  const todayLogs = glucoseLogs.filter((e) => e.date === todayStr);
  const fasting = todayLogs.find((e) => e.context === "fasting");
  if (fasting) return { value: `${fasting.value}`, label: "mg/dL (fasting today)" };
  if (todayLogs.length > 0)
    return { value: `${todayLogs[0].value}`, label: `mg/dL (${todayLogs[0].context.replace("_", " ")})` };
  if (timeInRange !== null) return { value: `${timeInRange}%`, label: "time in range" };
  if (streak > 0) return { value: `${streak}`, label: "day streak" };
  return { value: "—", label: "Log glucose to see your number" };
}

/** Hero emotional headline — human first, number second */
function getHeroEmotionalMessage(
  controlLevelId: string,
  streak: number,
  timeInRange: number | null
): string {
  if (streak >= 7 && (timeInRange === null || timeInRange >= 60))
    return "You're doing great 👏";
  if (controlLevelId === "high_performance") return "You're on track";
  if (streak >= 3) return "Keep going — you're building a strong habit";
  if (streak >= 1) return "You're building a new habit — one step at a time.";
  return "Let's make today count.";
}

/** Score emotional state: green / yellow / red + phrase */
function getScoreEmotionalState(score: number): {
  state: "great" | "attention" | "action";
  label: string;
  phrase: string;
} {
  if (score >= 70) return { state: "great", label: "Great control", phrase: "You're improving." };
  if (score >= 45) return { state: "attention", label: "Needs attention", phrase: "Let's make today even better." };
  return { state: "action", label: "Action needed", phrase: "Small steps today will add up." };
}

export function Dashboard() {
  const { data, isLoading, isError } = trpc.cognitive.getDashboard.useQuery(undefined, { retry: false });
  const realStreak = getCurrentStreak();
  const realBest = getBestStreak();
  const streak = realStreak > 0 ? realStreak : (data?.dailyStreak ?? DEMO.dailyStreak);
  const isDemo = isError;
  const programDay = DEMO.programDay;
  const score = data?.cognitiveScore ?? DEMO.controlScore;
  const checkInsDone = DEMO.checkInsDone;
  const bestStreak = realBest > 0 ? realBest : streak;
  const showDontBreak = shouldShowDontBreakStreak();
  const [celebrationMilestone, setCelebrationMilestone] = useState<MilestoneType | null>(null);
  const celebrationFired = useRef(false);
  const missions = getDailyMissions();
  const todayCount = missions.length;
  const doneCount = missions.filter((t) => t.done).length;
  const todayNutrition = getTotalsForDate(getTodayString());
  const todaysReminders = getTodaysRemindersWithStatus();
  const glucoseLogs = getRecentLogs(90);
  const goals = getGoals();
  const timeInRange = getTimeInRangePercent(glucoseLogs, goals.fastingMin, goals.fastingMax, goals.postMealMax);
  const navigate = useNavigate();
  const todayStr = getTodayString();
  const controlLevel = getControlLevel();
  const numberOfTheDay = getNumberOfTheDay(todayStr, glucoseLogs, timeInRange, streak);
  const heroMessage = getHeroEmotionalMessage(controlLevel.id, streak, timeInRange);
  const scoreState = getScoreEmotionalState(score);
  const tipOfTheDay = getTipOfTheDay();
  const insights = getSimpleInsights().slice(0, 2);
  const challenge = getCurrentChallenge();
  const achievements = getAchievements().slice(0, 3);
  const smartNotification = getSmartNotification();
  const coachTips = getDailyCoachTips();
  const predictions = getGlucosePredictions();
  const smartAlerts = getSmartAlerts();
  const weekComparison = getWeekComparison();

  const navTo = (path: string) => () => navigate(path);

  const handleShareProgress = () => {
    if (typeof document === "undefined") return;
    const canvas = document.createElement("canvas");
    const width = 1080;
    const height = 1920;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#020617");
    gradient.addColorStop(1, "#0b1120");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Accent glow
    const accent = ctx.createLinearGradient(0, 0, width, 0);
    accent.addColorStop(0, "#2d7ff9");
    accent.addColorStop(1, "#22c55e");

    ctx.fillStyle = accent;
    ctx.fillRect(80, 220, width - 160, 4);

    ctx.fillStyle = "#f9fafb";
    ctx.font = "bold 54px 'Plus Jakarta Sans', system-ui";
    ctx.fillText("DiabetesSharp Progress", 80, 180);

    // Health score
    ctx.font = "600 40px 'Plus Jakarta Sans', system-ui";
    ctx.fillText("Health Score", 80, 320);
    ctx.font = "bold 96px 'Outfit', system-ui";
    ctx.fillText(String(score), 80, 420);

    // Week comparison
    const firstTir = weekComparison?.firstWeekTir ?? null;
    const currentTir = weekComparison?.currentWeekTir ?? null;
    ctx.font = "600 40px 'Plus Jakarta Sans', system-ui";
    ctx.fillText("Week 1 vs Now", 80, 540);
    ctx.font = "400 32px 'Plus Jakarta Sans', system-ui";
    if (firstTir !== null && currentTir !== null) {
      ctx.fillText(`Week 1: ${firstTir}% time in range`, 80, 600);
      ctx.fillText(`This week: ${currentTir}% time in range`, 80, 650);
      const improvement = currentTir - firstTir;
      const msg =
        improvement > 0
          ? `Your glucose stability improved ${improvement}% 🎉`
          : improvement < 0
            ? `Your glucose has been more variable by ${Math.abs(improvement)}%. Small tweaks can help.`
            : "Your stability is similar to the first week — consistency matters.";
      ctx.fillText(msg, 80, 710);
    } else {
      ctx.fillText("Log at least 7 days to see your before/after view.", 80, 600);
    }

    // Streak + level
    ctx.font = "600 40px 'Plus Jakarta Sans', system-ui";
    ctx.fillText("Habits", 80, 840);
    ctx.font = "400 32px 'Plus Jakarta Sans', system-ui";
    ctx.fillText(`Streak: ${streak} days`, 80, 900);
    ctx.fillText(`Level: ${controlLevel.label}`, 80, 950);

    // Footer
    ctx.font = "400 28px 'Plus Jakarta Sans', system-ui";
    ctx.fillStyle = "#9ca3af";
    ctx.fillText("Made with DiabetesSharp", 80, height - 140);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `diabetessharp-progress-${todayStr}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  useEffect(() => {
    if (celebrationFired.current) return;
    const toCelebrate = getMilestoneToCelebrate(realStreak, timeInRange);
    if (!toCelebrate) return;
    celebrationFired.current = true;
    setCelebrationMilestone(toCelebrate);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
    setLastCelebratedMilestone(toCelebrate);
  }, [realStreak, timeInRange]);

  useEffect(() => {
    evaluateAndStoreAchievements();
  }, []);

  return (
    <div className="space-y-8 sm:space-y-10" role="main" aria-label="Dashboard">
      {isDemo && (
        <div
          className="rounded-xl bg-[var(--color-warning-soft)] border border-[var(--color-warning)]/30 text-[var(--color-text-primary)] text-sm px-4 py-3"
          role="status"
          aria-live="polite"
        >
          Demo mode — showing sample data.
        </div>
      )}

      {/* Smart notification — retention-focused message + CTA */}
      {(smartNotification || showDontBreak) && (
        <div
          className="rounded-xl bg-[var(--color-accent-soft)] border border-[var(--color-accent)]/40 text-[var(--color-text-primary)] text-sm px-4 py-3 flex flex-wrap items-center justify-between gap-3"
          role="status"
          aria-live="polite"
        >
          <span className="flex items-center gap-2">
            <span aria-hidden>{smartNotification?.icon ?? "🔥"}</span>
            <span>{smartNotification?.message ?? "Don't break your streak! Log something today — glucose, a meal, or complete a reminder."}</span>
          </span>
          {smartNotification?.cta && (
            <button
              type="button"
              onClick={navTo(smartNotification.cta.path)}
              className="shrink-0 px-4 py-2 rounded-lg bg-[var(--color-accent)] text-white font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              {smartNotification.cta.label}
            </button>
          )}
        </div>
      )}

      {celebrationMilestone && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="celebration-title"
        >
          <div className="glass-card p-6 sm:p-8 max-w-sm w-full text-center animate-in">
            <p id="celebration-title" className="text-2xl mb-2" aria-hidden>🎉</p>
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">Goal reached!</h2>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">{getMilestoneMessage(celebrationMilestone)}</p>
            <button
              type="button"
              onClick={() => setCelebrationMilestone(null)}
              className="btn btn-primary w-full"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {isLoading && !isDemo ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* Greeting + streak + control-level microcopy */}
          <section className="space-y-1" aria-label="Greeting">
            <span className="text-sm text-[var(--color-text-secondary)]">Good morning 👋</span>
            <p className="text-xs text-[var(--color-text-tertiary)]">
              {controlLevel.id === "beginner" && "You’re building a new habit — one small step today is enough."}
              {controlLevel.id === "in_balance" && "Your routine is paying off — small, steady choices are working."}
              {controlLevel.id === "high_performance" && "You’ve created strong control — keep doing what’s working for you."}
            </p>
          </section>

          {streak > 0 && (
            <section className="rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/10 border border-amber-400/30 p-5 flex items-center gap-4 streak-glow" aria-label="Streak">
              <span className="text-4xl streak-pulse" aria-hidden>🔥</span>
              <div>
                <p className="font-display font-bold text-2xl text-amber-400">{streak} Day Streak</p>
                <p className="text-sm text-[var(--color-text-secondary)]">You&apos;re building a powerful habit</p>
              </div>
            </section>
          )}

          {/* Hero — emotional message first, number secondary */}
          <section className="rounded-2xl bg-[var(--color-accent-soft)]/50 border border-[var(--color-accent)]/25 p-6 text-center transition-base hover:border-[var(--color-accent)]/40" aria-label="Today's status">
            <p className="text-xl sm:text-2xl font-display font-bold text-[var(--color-text-primary)] mb-2">{heroMessage}</p>
            <p className="text-3xl sm:text-4xl font-display font-bold text-[var(--color-accent)] mb-0.5">{numberOfTheDay.value}</p>
            <p className="text-sm text-[var(--color-text-tertiary)]">{numberOfTheDay.label}</p>
          </section>

          {/* Report for doctor — premium CTA */}
          <section aria-label="Report for doctor">
            <button
              type="button"
              onClick={navTo("/app/doctor-prep")}
              className="w-full rounded-2xl bg-[var(--gradient-accent)] text-white font-bold py-5 px-5 flex items-center justify-center gap-3 shadow-[0_8px_32px_var(--color-accent-glow)] hover:shadow-[0_12px_40px_var(--color-accent-glow)] hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-primary)]"
            >
              <span className="text-2xl" aria-hidden>📄</span>
              <span>Generate Doctor Report</span>
            </button>
          </section>

          {/* Tip of the day */}
          <section className="rounded-2xl bg-[var(--color-blue-soft)]/30 border border-[var(--color-glucose)]/25 p-4" aria-label="Tip of the day">
            <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-2 flex items-center gap-2">
              <span aria-hidden>💡</span> Tip of the day
            </p>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              💡 Tip: {tipOfTheDay}
            </p>
          </section>

          {/* Daily Coach — actionable tips */}
          {coachTips.length > 0 && (
            <section className="rounded-2xl border border-[var(--color-success)]/25 bg-[var(--color-success-soft)]/15 p-4" aria-label="Daily Coach">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                <span aria-hidden>🤖</span> Daily Coach
              </p>
              <ul className="space-y-2">
                {coachTips.map((t) => (
                  <li key={t.id} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                    <span aria-hidden>{t.icon}</span>
                    <span>{t.text}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Smart alerts — pattern-based messages */}
          {smartAlerts.length > 0 && (
            <section className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-hover)]/50 p-4" aria-label="Smart alerts">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                <span aria-hidden>🚀</span> Smart alerts
              </p>
              <ul className="space-y-2 mb-3">
                {smartAlerts.map((a) => (
                  <li
                    key={a.id}
                    className={`flex items-center gap-2 text-sm rounded-lg px-3 py-2 ${
                      a.type === "positive"
                        ? "bg-[var(--color-success-soft)]/40 text-[var(--color-success)]"
                        : a.type === "warning"
                          ? "bg-[var(--color-warning-soft)]/40 text-[var(--color-warning)]"
                          : "text-[var(--color-text-secondary)]"
                    }`}
                  >
                    <span aria-hidden>{a.icon}</span>
                    <span>{a.message}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => {
                  const primary = smartAlerts[0];
                  let prefill = "I’d like help understanding my recent blood sugar patterns.";
                  if (primary?.id === "spike-lunch") {
                    prefill = "I’ve noticed my glucose tends to spike after lunch. Can you help me adjust my meals or routine around lunchtime?";
                  } else if (primary?.id === "levels-improved") {
                    prefill = "My time in range has improved recently. What should I keep doing, and is there anything simple I can improve further?";
                  } else if (primary?.id === "skipped-yesterday") {
                    prefill = "I’ve been skipping some tracking days. Can you help me create a simple routine so I don’t miss logs?";
                  }
                  navigate("/app/dr-marcus", { state: { prefill } });
                }}
                className="text-xs font-medium text-[var(--color-accent)] hover:underline mt-1"
              >
                Ask AI Doctor about this →
              </button>
            </section>
          )}

          {/* Glucose prediction — unicorn-level insight */}
          {predictions.length > 0 && (
            <section className="rounded-2xl border border-[var(--color-glucose)]/25 bg-[var(--color-glucose)]/10 p-4" aria-label="Glucose prediction">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-2 flex items-center gap-2">
                <span aria-hidden>📈</span> Predict your glucose
              </p>
              <ul className="space-y-2">
                {predictions.map((p) => (
                  <li key={p.id} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                    <span aria-hidden>{p.icon}</span>
                    <span>{p.message}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Metrics — cards with category colors */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Overview metrics">
            <div className="stat-card border border-[var(--color-progress)]/25 bg-[var(--color-progress)]/10 hover:border-[var(--color-progress)]/40">
              <div className="label">Day on plan</div>
              <div className="value">{programDay} of 90</div>
            </div>
            <div className="stat-card border border-[var(--color-glucose)]/25 bg-[var(--color-glucose)]/10 hover:border-[var(--color-glucose)]/40">
              <div className="label">Check-ins this week</div>
              <div className="value">{checkInsDone}</div>
            </div>
            <div className="stat-card border border-[var(--color-progress)]/25 bg-[var(--color-progress)]/10 hover:border-[var(--color-progress)]/40">
              <div className="label">Today&apos;s tasks done</div>
              <div className="value">{doneCount} / {todayCount}</div>
            </div>
            <div className="stat-card border border-amber-400/25 bg-amber-500/10 hover:border-amber-400/40">
              <div className="label">Best streak</div>
              <div className="value">{bestStreak} days</div>
            </div>
          </section>

          {/* Today's calories & sugar from meal photo logs — link to full report */}
          <section className="grid grid-cols-2 gap-4" aria-label="Today's nutrition from meal photos">
            <Link
              to="/app/nutrition"
              className="stat-card block transition-colors hover:bg-[var(--color-surface-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-nutrition)]/60 focus-visible:ring-offset-2 rounded-xl border border-[var(--color-nutrition)]/30 bg-[var(--color-nutrition)]/5"
            >
              <div className="label">Calorias hoje</div>
              <div className="value">{todayNutrition.calories} kcal</div>
              <div className="text-[10px] text-[var(--color-text-tertiary)] mt-1">Fotos analisadas · valores est.</div>
            </Link>
            <Link
              to="/app/nutrition"
              className="stat-card block transition-colors hover:bg-[var(--color-surface-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-nutrition)]/60 focus-visible:ring-offset-2 rounded-xl border border-[var(--color-nutrition)]/30 bg-[var(--color-nutrition)]/5"
            >
              <div className="label">Açúcar hoje (est.)</div>
              <div className="value">{todayNutrition.sugar}g</div>
              <div className="text-[10px] text-[var(--color-text-tertiary)] mt-1">Ver relatório por refeição/dia/mês/ano</div>
            </Link>
          </section>

          {/* Time in range + Emergency + Doctor prep + Reminders — category colors */}
          {(timeInRange !== null || todaysReminders.length > 0) && (
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Quick actions">
              {timeInRange !== null && (
                <button
                  type="button"
                  onClick={navTo("/app/glucose")}
                  className="stat-card block w-full text-left transition-base rounded-xl cursor-pointer border border-[var(--color-glucose)]/25 bg-[var(--color-glucose)]/10 hover:border-[var(--color-glucose)]/40"
                >
                  <div className="label">Time in range</div>
                  <div className="value">{timeInRange}%</div>
                  <div className="text-[10px] text-[var(--color-text-tertiary)] mt-1">Blood sugar log</div>
                </button>
              )}
              <button
                type="button"
                onClick={navTo("/app/emergency")}
                className="stat-card block w-full text-left transition-base rounded-xl cursor-pointer border border-[var(--color-alert)]/30 bg-[var(--color-alert)]/10 hover:border-[var(--color-alert)]/50"
              >
                <div className="label">Low blood sugar?</div>
                <div className="value text-[var(--color-alert)]">What to do</div>
                <div className="text-[10px] text-[var(--color-text-tertiary)] mt-1">Emergency guide</div>
              </button>
              <button
                type="button"
                onClick={navTo("/app/doctor-prep")}
                className="stat-card block w-full text-left transition-base rounded-xl cursor-pointer border border-[var(--color-glucose)]/25 bg-[var(--color-glucose)]/10 hover:border-[var(--color-glucose)]/40"
              >
                <div className="label">Doctor visit</div>
                <div className="value">Summary</div>
                <div className="text-[10px] text-[var(--color-text-tertiary)] mt-1">Prepare & print</div>
              </button>
              <button
                type="button"
                onClick={navTo("/app/reminders")}
                className="stat-card block w-full text-left transition-base rounded-xl cursor-pointer border border-[var(--color-progress)]/25 bg-[var(--color-progress)]/10 hover:border-[var(--color-progress)]/40"
              >
                <div className="label">Reminders today</div>
                <div className="value">{todaysReminders.filter((r) => r.done).length} / {todaysReminders.length}</div>
                <div className="text-[10px] text-[var(--color-text-tertiary)] mt-1">Meds & glucose</div>
              </button>
            </section>
          )}

          {todaysReminders.length === 0 && timeInRange === null && (
            <section className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={navTo("/app/emergency")}
                className="stat-card block w-full text-left transition-base rounded-xl cursor-pointer border border-[var(--color-alert)]/30 bg-[var(--color-alert)]/10 hover:border-[var(--color-alert)]/50"
              >
                <div className="label">Low blood sugar?</div>
                <div className="value text-[var(--color-alert)]">What to do</div>
              </button>
              <button
                type="button"
                onClick={navTo("/app/doctor-prep")}
                className="stat-card block w-full text-left transition-base rounded-xl cursor-pointer border border-[var(--color-glucose)]/25 bg-[var(--color-glucose)]/10 hover:border-[var(--color-glucose)]/40"
              >
                <div className="label">Doctor visit</div>
                <div className="value">Summary</div>
              </button>
              <button
                type="button"
                onClick={navTo("/app/reminders")}
                className="stat-card block w-full text-left transition-base rounded-xl cursor-pointer border border-[var(--color-progress)]/25 bg-[var(--color-progress)]/10 hover:border-[var(--color-progress)]/40"
              >
                <div className="label">Reminders</div>
                <div className="value">Set up</div>
              </button>
            </section>
          )}

          {/* Week 1 vs now — before/after view */}
          {weekComparison && (
            <section className="glass-card p-6 sm:p-8 border border-[var(--color-progress)]/25 bg-[var(--color-progress)]/5" aria-label="Week 1 vs now">
              <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-3 tracking-[var(--tracking-heading)]">
                Week 1 vs now
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                Based on your blood sugar time in range.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-[var(--color-text-tertiary)] mb-1">Week 1</p>
                  <div className="h-2 rounded-full bg-[var(--color-surface-hover)] overflow-hidden mb-1">
                    <div
                      className="h-full rounded-full bg-[var(--color-border-default)]"
                      style={{ width: `${Math.min(100, Math.max(0, weekComparison.firstWeekTir))}%` }}
                    />
                  </div>
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">
                    {weekComparison.firstWeekTir}% in range
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-tertiary)] mb-1">This week</p>
                  <div className="h-2 rounded-full bg-[var(--color-surface-hover)] overflow-hidden mb-1">
                    <div
                      className="h-full rounded-full bg-[var(--gradient-accent)]"
                      style={{ width: `${Math.min(100, Math.max(0, weekComparison.currentWeekTir))}%` }}
                    />
                  </div>
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">
                    {weekComparison.currentWeekTir}% in range
                  </p>
                </div>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                {weekComparison.improvement > 0 &&
                  `Your glucose stability improved ${weekComparison.improvement}% 🎉`}
                {weekComparison.improvement < 0 &&
                  `Your glucose has been more variable by ${Math.abs(
                    weekComparison.improvement
                  )}%. Small tweaks to meals, timing, or activity can help.`}
                {weekComparison.improvement === 0 &&
                  "Your stability is similar to the first week — staying consistent is powerful."}
              </p>
              <button
                type="button"
                onClick={handleShareProgress}
                className="btn btn-secondary w-full justify-center gap-2 mt-2"
              >
                <span aria-hidden>📤</span> Share your progress
              </button>
            </section>
          )}

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Control score — emotional state (green / yellow / red) + phrase */}
            <section
              className={`glass-card p-6 sm:p-8 flex flex-col items-center border-2 transition-base ${
                scoreState.state === "great"
                  ? "border-[var(--color-success)]/40 bg-[var(--color-success-soft)]/20"
                  : scoreState.state === "attention"
                    ? "border-[var(--color-warning)]/40 bg-[var(--color-warning-soft)]/20"
                    : "border-[var(--color-alert)]/30 bg-[var(--color-alert)]/10"
              }`}
              aria-labelledby="control-score-title"
            >
              <h2 id="control-score-title" className="text-base font-semibold text-[var(--color-text-primary)] mb-1 w-full text-left tracking-[var(--tracking-heading)]">
                Health Score
              </h2>
              <p className="text-xs text-[var(--color-text-tertiary)] mb-2 w-full text-left">0–100 · combines habits and numbers</p>
              <div className="relative w-36 h-36 flex items-center justify-center" aria-hidden>
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--color-border-subtle)" strokeWidth="2.8" />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke={scoreState.state === "great" ? "var(--color-success)" : scoreState.state === "attention" ? "var(--color-warning)" : "var(--color-alert)"}
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    strokeDasharray={`${(score / 100) * 100} ${100 - (score / 100) * 100}`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display font-bold text-2xl text-[var(--color-text-primary)]">{score}</span>
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: scoreState.state === "great" ? "var(--color-success)" : scoreState.state === "attention" ? "var(--color-warning)" : "var(--color-alert)" }}>{scoreState.label}</span>
                </div>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] mt-4 text-center leading-relaxed max-w-[280px]">
                {scoreState.phrase}
              </p>
              <Link
                to="/app/dashboard"
                className="btn btn-primary mt-6 w-full justify-center gap-2 min-h-[var(--touch-min)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-active)]"
                aria-label="Daily check-in"
              >
                <span aria-hidden>📊</span> Daily check-in
              </Link>
            </section>

            {/* Today's program — tasks category (purple tint) */}
            <section
              className="glass-card p-6 sm:p-8 border border-[var(--color-progress)]/20 bg-[var(--color-progress)]/5"
              aria-label={`Today's program, ${doneCount} of ${todayCount} tasks completed`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-semibold text-[var(--color-text-primary)] tracking-[var(--tracking-heading)]">
                  Today&apos;s program
                </h2>
                <span className="text-xs text-[var(--color-text-tertiary)]" aria-live="polite">
                  {doneCount}/{todayCount} done
                </span>
              </div>
              <ul className="space-y-4" role="list">
                {missions.map((task) => (
                  <li
                    key={task.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-[var(--color-surface-hover)]/50"
                  >
                    <span
                      className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs ${
                        task.done
                          ? "bg-[var(--color-success)] border-[var(--color-success)] text-white"
                          : "border-[var(--color-text-tertiary)]"
                      }`}
                      aria-hidden
                      onClick={() => toggleMissionDone(task.id, !task.done)}
                    >
                      {task.done ? "✓" : ""}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[var(--color-text-primary)] text-sm">{task.title}</p>
                      <p className="text-xs text-[var(--color-text-tertiary)] mt-1 line-clamp-2 leading-relaxed">
                        {task.description}
                      </p>
                    </div>
                    <Link
                      to={task.href}
                      className="btn btn-primary flex-shrink-0 py-2.5 px-5 text-sm min-h-[var(--touch-min)] w-full sm:w-auto justify-center touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-active)]"
                    >
                      Go
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Insights card — data/glucose tint */}
            <section className="glass-card p-6 sm:p-8 border border-[var(--color-glucose)]/15 bg-[var(--color-glucose)]/5" aria-label="Insights">
              <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-3 tracking-[var(--tracking-heading)]">
                Insights from your last days
              </h2>
              <ul className="space-y-3 text-sm">
                {insights.map((insight) => (
                  <li
                    key={insight.id}
                    className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-hover)]/60 p-3"
                  >
                    <p className="font-medium text-[var(--color-text-primary)] mb-1">{insight.title}</p>
                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{insight.body}</p>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={navTo("/app/insights")}
                className="mt-4 text-xs font-medium text-[var(--color-accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-active)] rounded-md py-1"
              >
                See all insights →
              </button>
            </section>

            {/* Monthly challenge — success/green tint */}
            <section className="glass-card p-6 sm:p-8 relative overflow-hidden border border-[var(--color-success)]/20 bg-[var(--color-success-soft)]/10" aria-labelledby="challenge-title">
              <span
                className="absolute top-6 right-6 text-xs font-semibold px-2.5 py-1 rounded-lg bg-[var(--color-success-soft)] text-[var(--color-success)]"
                aria-hidden
              >
                {challenge.focus === "nutrition" ? "Nutrition" : challenge.focus === "activity" ? "Activity" : "Routine"}
              </span>
              <p className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-2">
                Monthly challenge
              </p>
              <h3 id="challenge-title" className="text-base font-semibold text-[var(--color-text-primary)] mb-3 tracking-[var(--tracking-heading)]">
                {challenge.title}
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4 leading-relaxed">
                {challenge.description}
              </p>
              <div className="mb-3">
                <div className="flex justify-between items-center text-xs text-[var(--color-text-tertiary)] mb-1">
                  <span>
                    {challenge.completedDays} / {challenge.totalDays} days
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[var(--color-surface-hover)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--gradient-accent)]"
                    style={{ width: `${Math.min(100, (challenge.completedDays / challenge.totalDays) * 100)}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 mt-3">
                <span className="text-xs text-[var(--color-accent)] font-medium">
                  Did you complete it today?
                </span>
                <button
                  type="button"
                  onClick={() => toggleChallengeToday(!challenge.completedToday)}
                  className={`btn py-2.5 px-5 text-sm min-h-[var(--touch-min)] flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-active)] ${
                    challenge.completedToday ? "btn-secondary" : "btn-primary"
                  }`}
                  aria-label="Mark monthly challenge complete for today"
                >
                  <span aria-hidden>🏆</span> {challenge.completedToday ? "Marked" : "Mark today"}
                </button>
              </div>
            </section>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Control level */}
            <section className="glass-card p-6 sm:p-8" aria-label="Control level">
              <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-3 tracking-[var(--tracking-heading)]">
                Control level
              </h2>
              <p className="text-lg font-display font-bold text-[var(--color-accent)] mb-1">
                {controlLevel.label}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {controlLevel.description}
              </p>
            </section>

            {/* Achievements feed */}
            <section className="glass-card p-6 sm:p-8 border border-amber-400/20 bg-amber-500/5" aria-label="Recent achievements">
              <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-3 tracking-[var(--tracking-heading)] flex items-center gap-2">
                <span aria-hidden>🏆</span> Badges & achievements
              </h2>
              {achievements.length === 0 ? (
                <p className="text-sm text-[var(--color-text-secondary)]">
                  As you build streaks and spend more time in range, your achievements will appear here.
                </p>
              ) : (
                <ul className="space-y-3 text-sm">
                  {achievements.map((a) => (
                    <li key={a.id} className="rounded-lg bg-[var(--color-surface-hover)]/60 p-3 flex items-start gap-3">
                      <span className="text-2xl shrink-0" aria-hidden>{ACHIEVEMENT_BADGES[a.id] ?? "🏅"}</span>
                      <div>
                        <p className="font-medium text-[var(--color-text-primary)] mb-0.5">{a.title}</p>
                        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                          {a.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}
