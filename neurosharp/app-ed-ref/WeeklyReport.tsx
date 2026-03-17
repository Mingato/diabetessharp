import { useState } from "react";
import { trpc } from "@/lib/trpc";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp, TrendingDown, Minus, Flame, Zap, Activity,
  CheckCircle2, Dumbbell, Loader2, Stethoscope, Star, Trophy
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Streamdown } from "streamdown";

function StatCard({ label, value, sub, icon: Icon, color }: { label: string; value: string | number; sub?: string; icon: typeof Flame; color: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={16} className={color} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className={`text-2xl font-display font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

export default function WeeklyReport() {
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: report, isLoading } = trpc.report.getWeekly.useQuery();
  const generateSummary = trpc.report.generateAISummary.useMutation();

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    try {
      const result = await generateSummary.mutateAsync();
      setAiSummary(result.summary);
    } catch {
      setAiSummary("Could not generate the summary right now. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const chartData = report?.checkins
    ? [...report.checkins].reverse().map((c, i) => ({
        day: `Day ${i + 1}`,
        score: c.performanceScore ?? 0,
      }))
    : [];

  const trendIcon = report
    ? report.scoreTrend > 0
      ? <TrendingUp size={16} className="text-emerald-400" />
      : report.scoreTrend < 0
      ? <TrendingDown size={16} className="text-red-400" />
      : <Minus size={16} className="text-muted-foreground" />
    : null;

  const trendText = report
    ? report.scoreTrend > 0
      ? `+${report.scoreTrend} points`
      : report.scoreTrend < 0
      ? `${report.scoreTrend} points`
      : "Stable"
    : "—";

  const trendColor = report
    ? report.scoreTrend > 0 ? "text-emerald-400" : report.scoreTrend < 0 ? "text-red-400" : "text-muted-foreground"
    : "text-muted-foreground";

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy size={20} className="text-primary" />
            <h1 className="text-2xl font-display font-bold text-foreground">Weekly Report</h1>
          </div>
          <p className="text-sm text-muted-foreground">Last 7 days of your program</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Check-ins" value={`${report?.checkinsCompleted ?? 0}/7`} sub="days" icon={CheckCircle2} color="text-emerald-400" />
          <StatCard label="Exercises" value={report?.exercisesCompleted ?? 0} sub="sessions" icon={Dumbbell} color="text-blue-400" />
          <StatCard label="Avg Score" value={report?.avgPerformanceScore ?? 0} sub="out of 100" icon={Activity} color="text-primary" />
          <StatCard label="Current Streak" value={`${report?.currentStreak ?? 0}🔥`} sub="days in a row" icon={Flame} color="text-orange-400" />
        </div>

        {/* Score Trend */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Score Evolution</h2>
            <div className={`flex items-center gap-1.5 text-sm font-medium ${trendColor}`}>
              {trendIcon}
              <span>{trendText}</span>
            </div>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.03 240)" />
                <XAxis dataKey="day" tick={{ fill: "oklch(0.55 0.03 240)", fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fill: "oklch(0.55 0.03 240)", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: "oklch(0.15 0.03 240)", border: "1px solid oklch(0.22 0.03 240)", borderRadius: 8 }}
                  labelStyle={{ color: "oklch(0.85 0.02 240)" }}
                  itemStyle={{ color: "oklch(0.78 0.15 75)" }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="oklch(0.78 0.15 75)"
                  strokeWidth={2}
                  dot={{ fill: "oklch(0.78 0.15 75)", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[180px] flex items-center justify-center text-muted-foreground text-sm">
              Complete daily check-ins to see your progress here
            </div>
          )}
        </div>

        {/* Program Progress */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-foreground">Program Progress</h2>
            <Badge className="bg-primary/15 text-primary border-primary/30">
              Day {report?.programDay ?? 1} / 90
            </Badge>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-yellow-400 rounded-full transition-all"
              style={{ width: `${Math.min(((report?.programDay ?? 1) / 90) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Start</span>
            <span>{Math.round(((report?.programDay ?? 1) / 90) * 100)}% complete</span>
            <span>Day 90</span>
          </div>
        </div>

        {/* XP & Streak */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <Zap size={24} className="text-primary mx-auto mb-2" />
            <p className="text-2xl font-display font-bold text-primary">{report?.totalXp ?? 0}</p>
            <p className="text-xs text-muted-foreground">Total XP Accumulated</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <Star size={24} className="text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-display font-bold text-yellow-400">{report?.longestStreak ?? 0}</p>
            <p className="text-xs text-muted-foreground">Longest Streak (days)</p>
          </div>
        </div>

        {/* AI Summary */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/15 border border-purple-500/30 flex items-center justify-center">
              <Stethoscope size={18} className="text-purple-400" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Dr. Apex Analysis</p>
              <p className="text-xs text-muted-foreground">Personalized summary of your week</p>
            </div>
          </div>

          {aiSummary ? (
            <div className="text-sm text-muted-foreground leading-relaxed">
              <Streamdown>{aiSummary}</Streamdown>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-4">
                Ask Dr. Apex to analyze your week and generate a personalized report with recommendations.
              </p>
              <Button
                onClick={handleGenerateSummary}
                disabled={isGenerating}
                className="bg-purple-500/15 text-purple-400 border border-purple-500/30 hover:bg-purple-500/25"
                variant="outline"
              >
                {isGenerating ? (
                  <><Loader2 size={16} className="mr-2 animate-spin" /> Generating analysis...</>
                ) : (
                  <><Stethoscope size={16} className="mr-2" /> Generate Weekly Analysis</>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
