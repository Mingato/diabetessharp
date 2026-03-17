import { trpc } from "../../trpc";

const DEMO = { programDay: 2, scoreImprovement: 0, currentStreak: 1, badgesEarned: 0, totalXP: 65, levelXP: 500 };
const DEMO_SCORES = [
  { day: 1, score: 32 },
  { day: 2, score: 34 },
];
const RADAR_LABELS = ["Focus", "Memory", "Speed", "Recall", "Attention"];
const RADAR_VALUES = [65, 58, 52, 60, 55];
const ACHIEVEMENTS = [
  { id: "1", icon: "📈", title: "First Step", desc: "Complete your first check-in" },
  { id: "2", icon: "🔥", title: "Week Warrior", desc: "Complete 7 consecutive days" },
  { id: "3", icon: "👤", title: "Iron Will", desc: "Maintain a 30-day streak" },
  { id: "4", icon: "🧠", title: "Memory Master", desc: "Complete 10 memory sessions" },
];

export function ProgressPage() {
  const { data, isLoading, isError } = trpc.cognitive.getProgress.useQuery(undefined, { retry: false });
  const scores = isError ? DEMO_SCORES : (data?.scores ?? []).slice(0, 7).map((r: { date: string; cognitiveScore: number }, i: number) => ({ day: i + 1, score: r.cognitiveScore }));
  const displayScores = scores.length ? scores : DEMO_SCORES;
  const programDay = DEMO.programDay;
  const streak = data?.dailyStreak ?? DEMO.currentStreak;
  const totalXP = DEMO.totalXP;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-display font-bold text-[var(--color-text)]">Progress</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Track your journey</p>
      </div>

      {isError && (
        <div className="mb-4 px-4 py-2 rounded-lg bg-[var(--color-warning-soft)] border border-[var(--color-warning)]/30 text-[var(--color-text)] text-sm">
          Demo mode — showing sample data.
        </div>
      )}

      {isLoading && !isError ? (
        <div className="flex items-center gap-3 text-[var(--color-text-muted)] py-10">
          <div className="w-7 h-7 rounded-full border-2 border-[var(--color-accent)] border-t-transparent animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        <>
          {/* 4 metric cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="glass-card p-4">
              <div className="font-display font-bold text-xl text-[var(--color-text)]">{programDay}</div>
              <div className="text-xs text-[var(--color-text-muted)] mt-0.5">Program Day</div>
            </div>
            <div className="glass-card p-4">
              <div className="font-display font-bold text-xl text-[var(--color-text)]">{DEMO.scoreImprovement}</div>
              <div className="text-xs text-[var(--color-text-muted)] mt-0.5">Score Improvement</div>
            </div>
            <div className="glass-card p-4">
              <div className="font-display font-bold text-xl text-[var(--color-text)]">{streak}</div>
              <div className="text-xs text-[var(--color-text-muted)] mt-0.5">Current Streak</div>
            </div>
            <div className="glass-card p-4">
              <div className="font-display font-bold text-xl text-[var(--color-text)]">{DEMO.badgesEarned}</div>
              <div className="text-xs text-[var(--color-text-muted)] mt-0.5">Badges Earned</div>
            </div>
          </div>

          {/* Level / XP bar */}
          <div className="glass-card p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[var(--color-accent)]">⚡</span>
              <span className="font-semibold text-[var(--color-text)]">Level 1</span>
              <span className="text-[var(--color-text-muted)] text-sm">65 total XP</span>
            </div>
            <div className="h-2 bg-[var(--color-surface)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-[var(--gradient-accent)] transition-all"
                style={{ width: `${(totalXP / DEMO.levelXP) * 100}%` }}
              />
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">{totalXP}/500 XP to next level</p>
          </div>

          {/* Two main cards: Line chart + Radar */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2 mb-4">
                <span>📈</span> Performance Score Over Time
              </h3>
              <div className="h-48 flex items-end justify-around gap-1 px-2">
                {displayScores.map((p: { day: number; score: number }) => (
                  <div key={p.day} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t bg-[var(--gradient-accent)] min-h-[4px] transition-all"
                      style={{ height: `${p.score}%` }}
                    />
                    <span className="text-[10px] text-[var(--color-text-muted)]">Day {p.day}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-[var(--color-text-muted)] mt-2 px-1">
                <span>0</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
              </div>
            </div>

            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2 mb-4">
                <span>📊</span> Latest Performance Breakdown
              </h3>
              <div className="h-48 flex items-center justify-center">
                <svg viewBox="0 0 120 120" className="w-full h-full max-w-[200px] mx-auto">
                  {RADAR_LABELS.map((_, i) => {
                    const angle = (i * 360) / RADAR_LABELS.length - 90;
                    const rad = (angle * Math.PI) / 180;
                    const r = (RADAR_VALUES[i] / 100) * 40;
                    const x = 60 + r * Math.cos(rad);
                    const y = 60 + r * Math.sin(rad);
                    return (
                      <line
                        key={i}
                        x1="60"
                        y1="60"
                        x2={x}
                        y2={y}
                        stroke="var(--color-accent)"
                        strokeWidth="2"
                        opacity="0.8"
                      />
                    );
                  })}
                  <polygon
                    points={RADAR_LABELS.map((_, i) => {
                      const angle = (i * 360) / RADAR_LABELS.length - 90;
                      const rad = (angle * Math.PI) / 180;
                      const r = (RADAR_VALUES[i] / 100) * 40;
                      return `${60 + r * Math.cos(rad)},${60 + r * Math.sin(rad)}`;
                    }).join(" ")}
                    fill="var(--color-accent)"
                    fillOpacity="0.25"
                    stroke="var(--color-accent)"
                    strokeWidth="1.5"
                  />
                  {RADAR_LABELS.map((label, i) => {
                    const angle = (i * 360) / RADAR_LABELS.length - 90;
                    const rad = (angle * Math.PI) / 180;
                    const x = 60 + 48 * Math.cos(rad);
                    const y = 60 + 48 * Math.sin(rad);
                    return (
                      <text key={i} x={x} y={y} textAnchor="middle" fill="var(--color-text-muted)" fontSize="6">{label}</text>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2 mb-4">
              <span>🏆</span> Achievements
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {ACHIEVEMENTS.map((a) => (
                <div key={a.id} className="glass-card p-4">
                  <div className="text-2xl mb-2">{a.icon}</div>
                  <div className="font-semibold text-[var(--color-text)] text-sm">{a.title}</div>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{a.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
