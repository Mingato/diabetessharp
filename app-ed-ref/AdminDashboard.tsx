import { useLocation } from "wouter";
import { useAdmin } from "@/contexts/AdminContext";
import { AdminLayout } from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users, UserCheck, TrendingUp, Clock, Zap, ArrowUpRight,
  AlertCircle, RefreshCw, DollarSign, Activity, BarChart2
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Send, Mail } from "lucide-react";

function QuizStatsWidget() {
  const { isAuthenticated } = useAdmin();
  const { data: quizStats, isLoading } = trpc.admin.getQuizStats.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const riskColors: Record<string, string> = {
    critical: "text-red-400 bg-red-500/10",
    high: "text-orange-400 bg-orange-500/10",
    moderate: "text-yellow-400 bg-yellow-500/10",
    low: "text-green-400 bg-green-500/10",
  };
  return (
    <Card className="bg-[#13131a] border-white/10 mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-base font-semibold flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-amber-400" />
          Quiz Funnel Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-16 rounded-lg bg-white/5 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-2xl font-bold text-white">{quizStats?.total ?? 0}</div>
              <div className="text-white/50 text-xs mt-0.5">Total Completions</div>
              <div className="text-amber-400 text-xs mt-1">+{quizStats?.recent ?? 0} last 30d</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-2xl font-bold text-emerald-400">{quizStats?.converted ?? 0}</div>
              <div className="text-white/50 text-xs mt-0.5">Converted to Purchase</div>
              <div className="text-emerald-400 text-xs mt-1">{quizStats?.conversionRate ?? 0}% rate</div>
            </div>
            {["critical", "high", "moderate"].map(level => (
              <div key={level} className="bg-white/5 rounded-xl p-4">
                <div className={`text-2xl font-bold ${riskColors[level]?.split(" ")[0]}`}>
                  {quizStats?.byRisk?.[level] ?? 0}
                </div>
                <div className="text-white/50 text-xs mt-0.5 capitalize">{level} Risk</div>
                <div className={`text-xs mt-1 px-1.5 py-0.5 rounded-full inline-block ${riskColors[level]}`}>
                  {quizStats?.total ? Math.round(((quizStats.byRisk?.[level] ?? 0) / quizStats.total) * 100) : 0}%
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
}

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAdmin();
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [bulkResult, setBulkResult] = useState<{ sent: number; failed: number; total: number } | null>(null);

  const bulkReminderMutation = trpc.admin.bulkPaymentReminder.useMutation({
    onSuccess: (data) => {
      setBulkResult(data);
      toast.success(`Sent to ${data.sent} users`);
    },
    onError: (err) => toast.error(err.message),
  });

  useEffect(() => {
    if (!isAuthenticated) navigate("/admin/login");
  }, [isAuthenticated]);

  const { data: stats, isLoading, refetch } = trpc.admin.getStats.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) return null;

  const kpis = [
    {
      label: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      sub: `+${stats?.newToday ?? 0} today`,
    },
    {
      label: "Paid Users",
      value: stats?.paidUsers ?? 0,
      icon: UserCheck,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      sub: `${stats?.conversionRate ?? 0}% conversion`,
    },
    {
      label: "Free Users",
      value: stats?.freeUsers ?? 0,
      icon: AlertCircle,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      sub: "Not subscribed",
    },
    {
      label: "Active (30d)",
      value: stats?.activeLastMonth ?? 0,
      icon: Activity,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      sub: `+${stats?.newThisWeek ?? 0} this week`,
    },
    {
      label: "Avg Session",
      value: stats ? formatDuration(stats.avgSessionSeconds) : "—",
      icon: Clock,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      sub: "Per user",
    },
  ];

  const chartData = (stats?.dailySignups ?? []).map((d: { date: string; count: number }) => ({
    date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    signups: Number(d.count),
  }));

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white text-2xl font-bold">Dashboard</h1>
            <p className="text-white/50 text-sm mt-0.5">Real-time overview of your app</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()} className="border-white/10 text-white/70 hover:text-white">
              <RefreshCw className="w-4 h-4 mr-1.5" /> Refresh
            </Button>
            <Button size="sm" className="bg-amber-500 hover:bg-amber-400 text-black font-semibold" onClick={() => navigate("/admin/users")}>
              <Users className="w-4 h-4 mr-1.5" /> Manage Users
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {kpis.map(({ label, value, icon: Icon, color, bg, sub }) => (
              <Card key={label} className="bg-[#13131a] border-white/10">
                <CardContent className="pt-4 pb-4">
                  <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div className="text-2xl font-bold text-white">{value}</div>
                  <div className="text-white/50 text-xs mt-0.5">{label}</div>
                  <div className={`text-xs mt-1 ${color}`}>{sub}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quiz Funnel Stats */}
        <QuizStatsWidget />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Daily Signups Chart */}
          <Card className="lg:col-span-2 bg-[#13131a] border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-base font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                Daily Signups (Last 30 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="signupGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="date" tick={{ fill: "#ffffff50", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#ffffff50", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: "#1e1e2e", border: "1px solid #ffffff20", borderRadius: "8px", color: "#fff" }}
                      labelStyle={{ color: "#f59e0b" }}
                    />
                    <Area type="monotone" dataKey="signups" stroke="#f59e0b" fill="url(#signupGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-white/30 text-sm">
                  No signup data yet
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-[#13131a] border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-base font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Conversion Rate</span>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-0">{stats?.conversionRate ?? 0}%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">New Today</span>
                <span className="text-white font-semibold">{stats?.newToday ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">New This Week</span>
                <span className="text-white font-semibold">{stats?.newThisWeek ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Avg Session Time</span>
                <span className="text-white font-semibold">{stats ? formatDuration(stats.avgSessionSeconds) : "—"}</span>
              </div>
              <div className="border-t border-white/10 pt-3 space-y-2">
                <Button
                  className="w-full bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border-0 text-sm"
                  variant="outline"
                  onClick={() => navigate("/admin/users?filter=free")}
                >
                  <DollarSign className="w-4 h-4 mr-1.5" />
                  View Free Users
                  <ArrowUpRight className="w-3 h-3 ml-auto" />
                </Button>
                <Button
                  className="w-full bg-red-500/15 hover:bg-red-500/25 text-red-400 border-0 text-sm"
                  variant="outline"
                  onClick={() => { setBulkResult(null); setBulkModalOpen(true); }}
                >
                  <Mail className="w-4 h-4 mr-1.5" />
                  Bulk Payment Reminder
                  <Send className="w-3 h-3 ml-auto" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Bulk Reminder Modal */}
      <Dialog open={bulkModalOpen} onOpenChange={setBulkModalOpen}>
        <DialogContent className="bg-[#13131a] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-amber-400" />
              Bulk Payment Reminder
            </DialogTitle>
          </DialogHeader>
          {bulkResult ? (
            <div className="py-4 space-y-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">{bulkResult.sent}</div>
                <div className="text-white/60 text-sm">emails sent successfully</div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-lg font-bold text-white">{bulkResult.total}</div>
                  <div className="text-white/40 text-xs">Total free users</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-lg font-bold text-emerald-400">{bulkResult.sent}</div>
                  <div className="text-white/40 text-xs">Sent</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-lg font-bold text-red-400">{bulkResult.failed}</div>
                  <div className="text-white/40 text-xs">Failed</div>
                </div>
              </div>
              <Button className="w-full" variant="outline" onClick={() => setBulkModalOpen(false)}>Close</Button>
            </div>
          ) : (
            <>
              <div className="py-2 space-y-4">
                <p className="text-white/60 text-sm">
                  This will send a payment reminder email to <span className="text-amber-400 font-semibold">{stats?.freeUsers ?? 0} free users</span> who have not subscribed yet.
                </p>
                <div>
                  <label className="text-white/70 text-sm mb-1.5 block">Checkout / Upgrade URL</label>
                  <Input
                    value={checkoutUrl}
                    onChange={(e) => setCheckoutUrl(e.target.value)}
                    placeholder="https://your-checkout-link.com"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  />
                  <p className="text-white/40 text-xs mt-1">This link will be included in the email so users can subscribe.</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setBulkModalOpen(false)} className="border-white/10 text-white/70">Cancel</Button>
                <Button
                  className="bg-amber-500 hover:bg-amber-400 text-black font-semibold"
                  disabled={!checkoutUrl || bulkReminderMutation.isPending}
                  onClick={() => bulkReminderMutation.mutate({ checkoutUrl })}
                >
                  {bulkReminderMutation.isPending ? "Sending..." : `Send to ${stats?.freeUsers ?? 0} Users`}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
