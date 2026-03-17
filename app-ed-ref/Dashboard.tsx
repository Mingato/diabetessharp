import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Activity,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle,
  Circle,
  Dumbbell,
  Flame,
  MessageCircle,
  Salad,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import CheckInModal from "@/components/CheckInModal";
import { OnboardingTour } from "@/components/OnboardingTour";
import { DailyChallengeWidget } from "@/components/DailyChallengeWidget";
import { DrApexTipWidget } from "@/components/DrApexTipWidget";
import { DailyRomanceWidget } from "@/components/DailyRomanceWidget";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="oklch(0.22 0.03 240)" strokeWidth={8} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="oklch(0.78 0.15 75)"
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 1s ease-in-out", filter: "drop-shadow(0 0 6px oklch(0.78 0.15 75 / 0.5))" }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="font-display font-bold text-foreground" style={{ fontSize: size * 0.22 }}>{score}</div>
        <div className="text-muted-foreground" style={{ fontSize: size * 0.10 }}>SCORE</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [checkInOpen, setCheckInOpen] = useState(false);

  const { data: profile, refetch: refetchProfile } = trpc.profile.get.useQuery();
  const { data: tasks, refetch: refetchTasks } = trpc.tasks.getToday.useQuery();
  const { data: stats } = trpc.gamification.getStats.useQuery();
  const { data: todayCheckin } = trpc.checkin.getToday.useQuery();
  const { data: checkinHistory } = trpc.checkin.getHistory.useQuery({ limit: 7 });

  const completeTaskMutation = trpc.tasks.complete.useMutation({
      onSuccess: () => {
      refetchTasks();
      toast.success(t("dashboard.taskCompleted", "Task completed! +10 XP"));
    },
  });

  if (!profile?.onboardingCompleted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mb-6">
          <Zap size={28} className="text-primary" />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-3">{t("dashboard.completeSetup", "Complete Your Setup")}</h2>
        <p className="text-muted-foreground mb-6 max-w-sm">
          {t("dashboard.completeSetupDesc", "Let's personalize your 90-day program before you get started.")}
        </p>
        <Link href="/onboarding">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            {t("dashboard.startSetup", "Start Setup")} <ArrowRight size={16} className="ml-2" />
          </Button>
        </Link>
      </div>
    );
  }

  const programDay = profile?.programDay ?? 1;
  const programProgress = Math.min((programDay / 90) * 100, 100);
  const latestScore = todayCheckin?.performanceScore ?? checkinHistory?.[0]?.performanceScore ?? 0;
  const completedTasks = tasks?.filter((t) => t.isCompleted).length ?? 0;
  const totalTasks = tasks?.length ?? 0;

  const taskIcon = (type: string) => {
    if (type === "exercise") return <Dumbbell size={16} className="text-blue-400" />;
    if (type === "checkin") return <Activity size={16} className="text-green-400" />;
    if (type === "education") return <BookOpen size={16} className="text-purple-400" />;
    return <Star size={16} className="text-yellow-400" />;
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-muted-foreground text-sm">{t("dashboard.goodMorning", "Good morning,")}</span>
          {stats?.currentStreak && stats.currentStreak > 0 && (
            <Badge className="bg-orange-500/15 text-orange-400 border-orange-500/30 text-xs">
              <Flame size={11} className="mr-1" /> {stats.currentStreak} {t("dashboard.dayStreak", "day streak")}
            </Badge>
          )}
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">{user?.name?.split(" ")[0] ?? "Warrior"}</h1>
      </div>

      {/* Top stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-xs text-muted-foreground mb-1">{t("dashboard.programDay", "Program Day")}</div>
          <div className="font-display text-2xl font-bold text-foreground">{programDay}</div>
          <div className="text-xs text-muted-foreground">{t("dashboard.of90", "of 90")}</div>
          <Progress value={programProgress} className="h-1 mt-2 bg-muted" />
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-xs text-muted-foreground mb-1">{t("dashboard.totalXp", "Total XP")}</div>
          <div className="font-display text-2xl font-bold text-primary">{stats?.totalXp ?? 0}</div>
          <div className="text-xs text-muted-foreground">{t("dashboard.xpPoints", "experience points")}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-xs text-muted-foreground mb-1">{t("dashboard.exercisesDone", "Exercises Done")}</div>
          <div className="font-display text-2xl font-bold text-foreground">{stats?.totalExercisesCompleted ?? 0}</div>
          <div className="text-xs text-muted-foreground">{t("dashboard.totalSessions", "total sessions")}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-xs text-muted-foreground mb-1">{t("dashboard.bestStreak", "Best Streak")}</div>
          <div className="font-display text-2xl font-bold text-orange-400">{stats?.longestStreak ?? 0}</div>
          <div className="text-xs text-muted-foreground">{t("progress.day", "days")}</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Performance Score */}
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col items-center">
          <div className="text-sm font-medium text-muted-foreground mb-4">{t("dashboard.performanceScore", "Performance Score")}</div>
          <ScoreRing score={latestScore} size={140} />
          <div className="mt-4 text-center">
            {latestScore === 0 ? (
              <p className="text-xs text-muted-foreground">{t("dashboard.firstCheckin", "Complete your first check-in to see your score")}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                {latestScore < 40 ? t("dashboard.score1", "Keep going — you're building the foundation") :
                 latestScore < 60 ? t("dashboard.score2", "Good progress — you're on the right track") :
                 latestScore < 80 ? t("dashboard.score3", "Great work — you're seeing real results") :
                 t("dashboard.score4", "Outstanding — you're performing at peak levels")}
              </p>
            )}
          </div>
          {!todayCheckin && (
            <Button
              size="sm"
              className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setCheckInOpen(true)}
            >
              <Activity size={14} className="mr-2" />
              {t("dashboard.checkIn", "Daily Check-In")}
            </Button>
          )}
          {todayCheckin && (
            <Badge className="mt-4 bg-green-500/15 text-green-400 border-green-500/30">
              <CheckCircle size={12} className="mr-1" /> {t("dashboard.checkInDone", "Today's check-in done")}
            </Badge>
          )}
        </div>

        {/* Today's Tasks */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-foreground">{t("dashboard.todayProgram", "Today's Program")}</h2>
            <Badge className="bg-accent text-muted-foreground border-border text-xs">
              {completedTasks}/{totalTasks} {t("dashboard.done", "done")}
            </Badge>
          </div>
          {totalTasks > 0 && (
            <Progress value={(completedTasks / totalTasks) * 100} className="h-1.5 mb-4 bg-muted" />
          )}
          <div className="space-y-2">
            {tasks?.map((task) => (
              <div
                key={task.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border transition-all",
                  task.isCompleted
                    ? "border-border/50 bg-accent/30 opacity-60"
                    : "border-border bg-accent/20 hover:border-border/80"
                )}
              >
                <div className="shrink-0">
                  {task.isCompleted ? (
                    <CheckCircle size={18} className="text-green-400" />
                  ) : (
                    <Circle size={18} className="text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {taskIcon(task.taskType)}
                    <span className={cn("text-sm font-medium", task.isCompleted ? "line-through text-muted-foreground" : "text-foreground")}>
                      {task.title}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{task.description}</p>
                  )}
                </div>
                {!task.isCompleted && (
                  <div className="shrink-0 flex gap-2">
                    {task.taskType === "exercise" && task.exerciseId && (
                      <Link href="/app/exercises">
                        <Button size="sm" variant="outline" className="h-7 text-xs border-border">
                          {t("common.start", "Start")}
                        </Button>
                      </Link>
                    )}
                    {task.taskType === "checkin" && (
                      <Button
                        size="sm"
                        className="h-7 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => setCheckInOpen(true)}
                      >
                        Check In
                      </Button>
                    )}
                    {task.taskType === "education" && (
                      <Link href="/app/learn">
                        <Button size="sm" variant="outline" className="h-7 text-xs border-border">
                          {t("common.read", "Read")}
                        </Button>
                      </Link>
                    )}
                    {task.taskType === "mindset" && (
                        <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs border-border"
                        onClick={() => completeTaskMutation.mutate({ taskId: task.id })}
                      >
                        {t("common.done", "Done")}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
            {(!tasks || tasks.length === 0) && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                {t("dashboard.loadingTasks", "Loading your daily tasks...")}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dr. Apex Tip + Daily Challenge */}
      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <DrApexTipWidget />
        <DailyChallengeWidget />
      </div>

      {/* Daily Romance Widget */}
      <div className="mt-4">
        <DailyRomanceWidget />
      </div>

      {/* Quick access */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        {[
          { href: "/app/exercises", icon: Dumbbell, label: t("nav.exercises", "Exercises"), color: "text-blue-400", bg: "bg-blue-400/10" },
          { href: "/app/dr-apex", icon: MessageCircle, label: t("nav.drApex", "Dr. Apex"), color: "text-green-400", bg: "bg-green-400/10" },
          { href: "/app/nutrition", icon: Salad, label: t("nav.nutrition", "Nutrition"), color: "text-green-400", bg: "bg-green-400/10" },
          { href: "/app/progress", icon: TrendingUp, label: t("nav.progress", "Progress"), color: "text-purple-400", bg: "bg-purple-400/10" },
        ].map((item) => (
          <Link key={item.href} href={item.href}>
            <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3 card-hover cursor-pointer">
              <div className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}>
                <item.icon size={18} className={item.color} />
              </div>
              <span className="font-medium text-sm text-foreground">{item.label}</span>
              <ArrowRight size={14} className="text-muted-foreground ml-auto" />
            </div>
          </Link>
        ))}
      </div>

      <CheckInModal open={checkInOpen} onClose={() => setCheckInOpen(false)} onSuccess={() => { setCheckInOpen(false); refetchProfile(); refetchTasks(); }} />
      <OnboardingTour />
    </div>
  );
}
