import { useLocation, useParams } from "wouter";
import { useAdmin } from "@/contexts/AdminContext";
import { AdminLayout } from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft, UserCheck, AlertCircle, Clock, Calendar,
  Activity, Globe, Send, Key, Mail, RotateCcw
} from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { StickyNote, Save } from "lucide-react";

function formatDate(d: Date | string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function formatDuration(seconds: number | null | undefined): string {
  if (!seconds) return "—";
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
}

export default function AdminUserDetail() {
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();
  const userId = parseInt(params.id ?? "0");
  const { isAuthenticated } = useAdmin();

  useEffect(() => {
    if (!isAuthenticated) navigate("/admin/login");
  }, [isAuthenticated]);

  const { data, isLoading } = trpc.admin.getUserDetail.useQuery(
    { userId },
    { enabled: isAuthenticated && !!userId }
  );

  const resetMutation = trpc.admin.triggerPasswordReset.useMutation({
    onSuccess: () => toast.success("Password reset email sent!"),
    onError: (e) => toast.error("Failed", { description: e.message }),
  });

  const reminderMutation = trpc.admin.sendPaymentReminder.useMutation({
    onSuccess: () => toast.success("Payment reminder sent!"),
    onError: (e) => toast.error("Failed", { description: e.message }),
  });

  if (!isAuthenticated) return null;

  const user = data?.user;
  const profile = data?.profile;
  const stats = data?.sessionStats;
  const isPaid = !!profile?.subscriptionId;

  // CRM Notes
  const noteQuery = trpc.admin.getUserNote.useQuery(
    { userId },
    { enabled: isAuthenticated && !!userId }
  );
  const [noteText, setNoteText] = useState("");
  useEffect(() => { if (noteQuery.data?.note !== undefined) setNoteText(noteQuery.data.note); }, [noteQuery.data]);

  const saveNoteMutation = trpc.admin.saveUserNote.useMutation({
    onSuccess: () => toast.success("Note saved!"),
    onError: (e) => toast.error("Failed", { description: e.message }),
  });

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Back */}
        <button onClick={() => navigate("/admin/users")} className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Users
        </button>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-white/5 rounded-xl animate-pulse" />)}
          </div>
        ) : !user ? (
          <div className="text-center text-white/30 py-20">User not found</div>
        ) : (
          <div className="space-y-5">
            {/* User Header */}
            <div className="bg-[#13131a] border border-white/10 rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 text-2xl font-bold">
                    {(user.name ?? user.email ?? "?")[0].toUpperCase()}
                  </div>
                  <div>
                    <h1 className="text-white text-xl font-bold">{user.name ?? "—"}</h1>
                    <p className="text-white/50 text-sm">{user.email ?? "No email"}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {isPaid ? (
                        <Badge className="bg-emerald-500/15 text-emerald-400 border-0 text-xs">
                          <UserCheck className="w-3 h-3 mr-1" /> Paid
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-500/15 text-amber-400 border-0 text-xs">
                          <AlertCircle className="w-3 h-3 mr-1" /> Free
                        </Badge>
                      )}
                      <Badge className="bg-white/5 text-white/50 border-0 text-xs">
                        <Globe className="w-3 h-3 mr-1" /> {user.preferredLanguage ?? "en"}
                      </Badge>
                      <Badge className="bg-white/5 text-white/50 border-0 text-xs">
                        Day {profile?.programDay ?? 1} of 90
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline" size="sm"
                    className="border-white/10 text-white/70 hover:text-white"
                    onClick={() => navigate(`/admin/users?userId=${user.id}&action=credentials`)}
                  >
                    <Key className="w-4 h-4 mr-1.5" /> Credentials
                  </Button>
                  {!isPaid && (
                    <Button
                      variant="outline" size="sm"
                      className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                      onClick={() => reminderMutation.mutate({ userId: user.id, checkoutUrl: window.location.origin + "/subscribe" })}
                      disabled={reminderMutation.isPending}
                    >
                      <Send className="w-4 h-4 mr-1.5" /> Send Reminder
                    </Button>
                  )}
                  <Button
                    variant="outline" size="sm"
                    className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                    onClick={() => resetMutation.mutate({ userId: user.id, origin: window.location.origin })}
                    disabled={resetMutation.isPending}
                  >
                    <RotateCcw className="w-4 h-4 mr-1.5" /> Reset Password
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Sessions", value: stats?.totalSessions ?? 0, icon: Activity, color: "text-blue-400", bg: "bg-blue-500/10" },
                { label: "Total Time", value: formatDuration(stats?.totalSeconds), icon: Clock, color: "text-purple-400", bg: "bg-purple-500/10" },
                { label: "Avg Session", value: formatDuration(stats?.avgSeconds), icon: Clock, color: "text-cyan-400", bg: "bg-cyan-500/10" },
                { label: "Joined", value: new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), icon: Calendar, color: "text-amber-400", bg: "bg-amber-500/10" },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <Card key={label} className="bg-[#13131a] border-white/10">
                  <CardContent className="pt-4 pb-4">
                    <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-2`}>
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <div className="text-white font-bold text-lg">{value}</div>
                    <div className="text-white/40 text-xs">{label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Profile Details */}
            <Card className="bg-[#13131a] border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-base font-semibold">Profile Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  {[
                    { label: "Subscription Status", value: profile?.subscriptionStatus ?? "free" },
                    { label: "Subscription ID", value: profile?.subscriptionId ?? "—" },
                    { label: "Program Day", value: `Day ${profile?.programDay ?? 1}` },
                    { label: "Total XP", value: data?.userStats?.totalXp ?? 0 },
                    { label: "Current Streak", value: `${data?.userStats?.currentStreak ?? 0} days` },
                    { label: "Last Signed In", value: formatDate(user.lastSignedIn) },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div className="text-white/40 text-xs mb-0.5">{label}</div>
                      <div className="text-white font-medium">{String(value)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* CRM Notes */}
            <Card className="bg-[#13131a] border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-base font-semibold flex items-center gap-2">
                  <StickyNote className="w-4 h-4 text-amber-400" /> Internal Notes
                  <span className="text-white/30 text-xs font-normal ml-auto">Visible only to admins</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add internal notes about this user (e.g. contacted via WhatsApp, refund requested, VIP customer...)"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/25 resize-none min-h-[100px] text-sm"
                  rows={4}
                />
                <div className="flex justify-end mt-2">
                  <Button
                    size="sm"
                    className="bg-amber-500 hover:bg-amber-400 text-black font-semibold"
                    disabled={saveNoteMutation.isPending}
                    onClick={() => saveNoteMutation.mutate({ userId, note: noteText })}
                  >
                    <Save className="w-3.5 h-3.5 mr-1.5" />
                    {saveNoteMutation.isPending ? "Saving..." : "Save Note"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Session History */}
            <Card className="bg-[#13131a] border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-base font-semibold flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-400" /> Recent Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data?.sessions.length === 0 ? (
                  <p className="text-white/30 text-sm py-4 text-center">No sessions recorded yet</p>
                ) : (
                  <div className="space-y-2">
                    {data?.sessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-amber-500" />
                          <div>
                            <div className="text-white text-sm">{formatDate(session.sessionStart)}</div>
                            <div className="text-white/40 text-xs">{session.deviceType ?? "web"} · {session.pagesVisited} pages</div>
                          </div>
                        </div>
                        <div className="text-white/60 text-sm font-mono">
                          {formatDuration(session.durationSeconds)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
