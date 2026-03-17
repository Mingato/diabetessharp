import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Award, BarChart2, Flame, Star, TrendingUp, Zap } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const BADGE_ICONS: Record<string, React.ElementType> = {
  footprints: TrendingUp,
  flame: Flame,
  shield: Award,
  dumbbell: BarChart2,
  wind: Star,
  snowflake: Star,
  "trending-up": TrendingUp,
  zap: Zap,
  calendar: Star,
  target: Star,
  award: Award,
};

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 text-sm">
        <p className="text-muted-foreground mb-1">Day {label}</p>
        <p className="font-bold text-primary">Score: {payload[0]?.value}</p>
      </div>
    );
  }
  return null;
}

export default function Progress() {
  const { t } = useTranslation();
  const { data: checkinHistory } = trpc.checkin.getHistory.useQuery({ limit: 30 });
  const { data: stats } = trpc.gamification.getStats.useQuery();
  const { data: badgesData } = trpc.gamification.getBadges.useQuery();
  const { data: profile } = trpc.profile.get.useQuery();

  const chartData = (checkinHistory ?? [])
    .slice()
    .reverse()
    .map((c) => ({
      day: c.programDay,
      score: c.performanceScore,
      energy: c.energyLevel,
      mood: c.moodScore,
      sleep: c.sleepQuality,
      libido: c.libidoScore,
      erection: c.erectionQuality,
    }));

  const latestCheckin = checkinHistory?.[0];
  const firstCheckin = checkinHistory?.[checkinHistory.length - 1];
  const improvement = latestCheckin && firstCheckin
    ? (latestCheckin.performanceScore ?? 0) - (firstCheckin.performanceScore ?? 0)
    : 0;

  const radarData = latestCheckin
    ? [
        { metric: "Energy", value: (latestCheckin.energyLevel ?? 5) * 10 },
        { metric: "Mood", value: (latestCheckin.moodScore ?? 5) * 10 },
        { metric: "Sleep", value: (latestCheckin.sleepQuality ?? 5) * 10 },
        { metric: "Libido", value: (latestCheckin.libidoScore ?? 5) * 10 },
        { metric: "Performance", value: (latestCheckin.erectionQuality ?? 5) * 10 },
      ]
    : [];

  const xpLevel = Math.floor((stats?.totalXp ?? 0) / 500) + 1;
  const xpInCurrentLevel = (stats?.totalXp ?? 0) % 500;
  const xpProgress = (xpInCurrentLevel / 500) * 100;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">{t("progress.title", "Your Progress")}</h1>
        <p className="text-muted-foreground">{t("progress.subtitle", "Track your transformation over the 90-day program.")}</p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="font-display text-3xl font-bold text-primary mb-1">{profile?.programDay ?? 1}</div>
          <div className="text-xs text-muted-foreground">{t("dashboard.programDay", "Program Day")}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className={cn("font-display text-3xl font-bold mb-1", improvement > 0 ? "text-green-400" : improvement < 0 ? "text-red-400" : "text-foreground")}>
            {improvement > 0 ? "+" : ""}{improvement}
          </div>
          <div className="text-xs text-muted-foreground">{t("progress.scoreImprovement", "Score Improvement")}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="font-display text-3xl font-bold text-orange-400 mb-1">{stats?.currentStreak ?? 0}</div>
          <div className="text-xs text-muted-foreground">{t("progress.currentStreak", "Current Streak")}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="font-display text-3xl font-bold text-foreground mb-1">{badgesData?.earned.length ?? 0}</div>
          <div className="text-xs text-muted-foreground">{t("progress.badgesEarned", "Badges Earned")}</div>
        </div>
      </div>

      {/* XP Level */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
              <Zap size={18} className="text-primary" />
            </div>
            <div>
              <div className="font-display font-bold text-foreground">{t("progress.level", "Level")} {xpLevel}</div>
              <div className="text-xs text-muted-foreground">{stats?.totalXp ?? 0} {t("progress.totalXp", "total XP")}</div>
            </div>
          </div>
          <Badge className="bg-primary/15 text-primary border-primary/30">
            {xpInCurrentLevel}/500 {t("progress.xpToNextLevel", "XP to next level")}
          </Badge>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="h-2 rounded-full bg-primary transition-all duration-700"
            style={{ width: `${xpProgress}%`, boxShadow: "0 0 8px oklch(0.78 0.15 75 / 0.5)" }}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Performance score chart */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-primary" />
            {t("progress.scoreOverTime", "Performance Score Over Time")}
          </h2>
          {chartData.length > 0 ? (
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.03 240)" />
                  <XAxis dataKey="day" stroke="oklch(0.55 0.03 240)" tick={{ fontSize: 11 }} label={{ value: "Day", position: "insideBottom", offset: -2, fill: "oklch(0.55 0.03 240)", fontSize: 11 }} />
                  <YAxis domain={[0, 100]} stroke="oklch(0.55 0.03 240)" tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="oklch(0.78 0.15 75)"
                    strokeWidth={2.5}
                    dot={{ fill: "oklch(0.78 0.15 75)", r: 4 }}
                    activeDot={{ r: 6, fill: "oklch(0.78 0.15 75)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
              {t("progress.noScoreTrend", "Complete your first check-in to see your score trend")}
            </div>
          )}
        </div>

        {/* Latest metrics radar */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart2 size={18} className="text-primary" />
            {t("progress.latestBreakdown", "Latest Performance Breakdown")}
          </h2>
          {radarData.length > 0 ? (
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="oklch(0.22 0.03 240)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: "oklch(0.55 0.03 240)", fontSize: 11 }} />
                  <Radar
                    name="Score"
                    dataKey="value"
                    stroke="oklch(0.78 0.15 75)"
                    fill="oklch(0.78 0.15 75)"
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
              {t("progress.noBreakdown", "Complete your first check-in to see your breakdown")}
            </div>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
          <Award size={18} className="text-primary" />
          {t("progress.achievements", "Achievements")}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {badgesData?.all.map((badge) => {
            const isEarned = badgesData.earnedIds.includes(badge.id);
            const Icon = BADGE_ICONS[badge.icon ?? "award"] ?? Award;
            return (
              <div
                key={badge.id}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all",
                  isEarned
                    ? "border-primary/40 bg-primary/10"
                    : "border-border bg-accent/20 opacity-40 grayscale"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  isEarned ? "bg-primary/20 border border-primary/30" : "bg-muted border border-border"
                )}>
                  <Icon size={22} className={isEarned ? "text-primary" : "text-muted-foreground"} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground">{badge.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{badge.description}</div>
                </div>
                {isEarned && (
                  <Badge className="bg-primary/15 text-primary border-primary/30 text-xs">+{badge.xpReward} XP</Badge>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
