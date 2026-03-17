import { Link } from "react-router-dom";
import { trpc } from "../../trpc";
import { MEMORY_EXERCISES } from "../../data/memoryExercises";

const DEMO = { cognitiveScore: 58, brainAge: 62, dailyStreak: 5, programDay: 2, totalXP: 65, exercisesDone: 0, bestStreak: 1 };

/** Skeleton screen: no spinner, shimmer blocks for perceived performance (Apple HIG) */
function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-wrap items-center gap-2">
        <div className="skeleton h-5 w-24" />
        <div className="skeleton h-6 w-28 rounded-full" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="stat-card">
            <div className="skeleton h-3 w-16 mb-2" />
            <div className="skeleton h-7 w-20" />
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 flex flex-col items-center">
          <div className="skeleton h-4 w-32 mb-6" />
          <div className="skeleton w-36 h-36 rounded-full" />
          <div className="skeleton h-4 w-48 mt-4" />
          <div className="skeleton h-12 w-full mt-4 rounded-xl" />
        </div>
        <div className="glass-card p-6">
          <div className="flex justify-between mb-4">
            <div className="skeleton h-4 w-28" />
            <div className="skeleton h-3 w-12" />
          </div>
          <ul className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <li key={i} className="flex gap-3 p-3 rounded-xl bg-[var(--color-surface-hover)]/50">
                <div className="skeleton w-5 h-5 rounded-full shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="skeleton h-4 w-3/4" />
                  <div className="skeleton h-3 w-full" />
                </div>
                <div className="skeleton h-8 w-14 rounded-lg shrink-0" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const { data, isLoading, isError } = trpc.cognitive.getDashboard.useQuery(undefined, { retry: false });
  const { data: todayExercises = [] } = trpc.cognitive.getTodayExercises.useQuery(undefined, { retry: false, enabled: !isError });
  const score = data?.cognitiveScore ?? DEMO.cognitiveScore;
  const brainAge = data?.brainAge ?? DEMO.brainAge;
  const streak = data?.dailyStreak ?? DEMO.dailyStreak;
  const isDemo = isError;
  const programDay = DEMO.programDay;
  const totalXP = DEMO.totalXP;
  const exercisesDone = isDemo ? todayExercises.length : (data ? todayExercises.length : DEMO.exercisesDone);
  const bestStreak = streak;
  const todayTasks = [
    { id: "checkin", title: "Daily Performance Check-In", desc: "Rate your energy, mood, sleep, and focus to track your progress.", cta: "Check In", href: "/app/dashboard", done: false },
    { id: "ex1", title: MEMORY_EXERCISES[0].name, desc: MEMORY_EXERCISES[0].description, cta: "Start", href: "/app/exercises", done: todayExercises.some((e: { exerciseType: string }) => e.exerciseType === MEMORY_EXERCISES[0].id) },
    { id: "ex2", title: MEMORY_EXERCISES[2].name, desc: MEMORY_EXERCISES[2].description, cta: "Start", href: "/app/exercises", done: todayExercises.some((e: { exerciseType: string }) => e.exerciseType === MEMORY_EXERCISES[2].id) },
    { id: "read", title: "Read Today's Article", desc: "Expand your knowledge with today's educational content.", cta: "Read", href: "/app/learn", done: false },
  ];
  const todayCount = todayTasks.length;
  const doneCount = todayTasks.filter((t) => t.done).length;

  return (
    <div className="space-y-5 sm:space-y-8">
      {isDemo && (
        <div className="rounded-xl bg-[var(--color-warning-soft)] border border-[var(--color-warning)]/30 text-[var(--color-text-primary)] text-xs sm:text-sm px-3 sm:px-4 py-2.5 sm:py-3" role="status" aria-live="polite">
          Demo mode — showing sample data.
        </div>
      )}

      {isLoading && !isDemo ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* Greeting + streak — hierarchy: 1 line primary, 1 metadata */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-[var(--color-text-secondary)] text-xs sm:text-sm">Good morning</span>
            {streak > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)] text-sm font-medium">
                <span aria-hidden>🔥</span> {streak} day streak
              </span>
            )}
          </div>

          {/* 4 metric cards — stat-card: label (tertiary) + value (primary) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="stat-card">
              <div className="label">Program Day</div>
              <div className="value">{programDay} of 90</div>
            </div>
            <div className="stat-card">
              <div className="label">Total XP</div>
              <div className="value">{totalXP} XP</div>
            </div>
            <div className="stat-card">
              <div className="label">Exercises Done</div>
              <div className="value">{exercisesDone} sessions</div>
            </div>
            <div className="stat-card">
              <div className="label">Best Streak</div>
              <div className="value">{bestStreak} Day</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Performance Score — 3 levels: title, value, supporting text */}
            <div className="glass-card p-4 sm:p-6 flex flex-col items-center">
              <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4 w-full tracking-tight">Performance Score</h2>
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--color-border)" strokeWidth="2.8" />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="url(#scoreGradient)"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    strokeDasharray={`${(score / 100) * 100} ${100 - (score / 100) * 100}`}
                  />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="1" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#eab308" />
                      <stop offset="1" stopColor="#f59e0b" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display font-bold text-2xl text-[var(--color-text-primary)]" aria-hidden>{score}</span>
                  <span className="text-xs text-[var(--color-text-tertiary)] uppercase tracking-wider">Score</span>
                </div>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] mt-4 text-center leading-relaxed">Keep going — you&apos;re building the foundation.</p>
              <Link to="/app/dashboard" className="btn btn-primary mt-4 w-full justify-center gap-2 min-h-[44px]">
                <span aria-hidden>📊</span> Daily Check-in
              </Link>
            </div>

            {/* Today's Program — list with dividers, no heavy borders */}
            <div className="glass-card p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <h2 className="text-sm font-semibold text-[var(--color-text-primary)] tracking-tight">Today&apos;s Program</h2>
                <span className="text-xs text-[var(--color-text-tertiary)]">{doneCount}/{todayCount} done</span>
              </div>
              <ul className="space-y-3 sm:space-y-4" role="list">
                {todayTasks.map((task) => (
                  <li key={task.id} className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-[var(--color-surface-hover)]/40 border border-[var(--color-border-subtle)]">
                    <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center text-xs ${task.done ? "bg-[var(--color-success)] border-[var(--color-success)] text-white" : "border-[var(--color-text-tertiary)]"}`} aria-hidden>
                      {task.done ? "✓" : ""}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-[var(--color-text-primary)] text-sm">{task.title}</div>
                      <p className="text-xs text-[var(--color-text-tertiary)] mt-1 line-clamp-2 leading-relaxed">{task.desc}</p>
                    </div>
                    <Link to={task.href} className="btn btn-primary flex-shrink-0 py-2 px-4 text-xs min-h-[44px] w-full sm:w-auto justify-center touch-manipulation">
                      {task.cta}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Dr. Marcus — title, body, CTA */}
            <div className="glass-card p-4 sm:p-6">
              <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2 tracking-tight">
                <span aria-hidden>👨‍⚕️</span> Dr. Marcus
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4 leading-relaxed">
                Good morning! Focus on building a strong foundation. Try 5–10 minutes of a memory exercise first thing — it helps set your brain for the day.
              </p>
              <Link to="/app/dr-marcus" className="text-sm font-medium text-[var(--color-accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-active)] rounded-md">
                Chat with Dr. Marcus →
              </Link>
            </div>

            {/* Daily Challenge */}
            <div className="glass-card p-4 sm:p-6 relative overflow-hidden">
              <span className="absolute top-4 right-4 text-xs font-semibold px-2.5 py-1 rounded-lg bg-[var(--color-success-soft)] text-[var(--color-success)]">Nutrition</span>
              <p className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-1">Daily Challenge</p>
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2 tracking-tight">Eat one brain-boosting meal</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4 leading-relaxed">Include foods rich in omega-3s, antioxidants, or B vitamins today.</p>
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-[var(--color-accent)] font-medium">+50 XP</span>
                <button type="button" className="btn btn-primary py-2 px-4 text-xs min-h-[44px] flex items-center gap-1.5">
                  <span aria-hidden>🏆</span> Complete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
