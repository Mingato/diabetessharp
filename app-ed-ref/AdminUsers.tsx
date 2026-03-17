import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAdmin } from "@/contexts/AdminContext";
import { AdminLayout } from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search, UserCheck, UserX, Clock, Mail, Key, ChevronLeft, ChevronRight,
  Send, RefreshCw, Eye, AlertCircle, Copy, CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type FilterType = "all" | "paid" | "free" | "active";

function formatDate(d: Date | string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatDuration(seconds: number): string {
  if (!seconds) return "—";
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
}

export default function AdminUsers() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAdmin();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  // Modals
  const [credModal, setCredModal] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [generatedCreds, setGeneratedCreds] = useState<{ login: string; password: string } | null>(null);
  const [credsSent, setCredsSent] = useState(false);
  const [bulkReminderModal, setBulkReminderModal] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState("https://vigronex.com/subscribe");

  useEffect(() => {
    if (!isAuthenticated) navigate("/admin/login");
  }, [isAuthenticated]);

  const { data, isLoading, refetch } = trpc.admin.getUsers.useQuery(
    { page, search, filter, sortBy: "createdAt", sortDir: "desc" },
    { enabled: isAuthenticated }
  );

  const genCredsMutation = trpc.admin.generateCredentials.useMutation({
    onSuccess: (creds) => { setGeneratedCreds(creds); setCredsSent(false); },
  });

  const sendCredsMutation = trpc.admin.sendCredentials.useMutation({
    onSuccess: () => { toast.success("Credentials sent!"); setCredsSent(true); },
    onError: (e) => toast.error("Failed to send", { description: e.message }),
  });

  const sendReminderMutation = trpc.admin.sendPaymentReminder.useMutation({
    onSuccess: () => toast.success("Payment reminder sent!"),
    onError: (e) => toast.error("Failed", { description: e.message }),
  });

  const bulkReminderMutation = trpc.admin.sendBulkPaymentReminders.useMutation({
    onSuccess: (r) => { toast.success(`Sent to ${r.sent} users`); setBulkReminderModal(false); },
    onError: (e) => toast.error("Failed", { description: e.message }),
  });

  const sendEmailMutation = trpc.admin.sendCustomEmail.useMutation({
    onSuccess: () => { toast.success("Email sent!"); setEmailModal(false); setEmailSubject(""); setEmailBody(""); },
    onError: (e) => toast.error("Failed", { description: e.message }),
  });

  const filterTabs: { key: FilterType; label: string }[] = [
    { key: "all", label: "All Users" },
    { key: "paid", label: "Paid" },
    { key: "free", label: "Free" },
    { key: "active", label: "Active (7d)" },
  ];

  const totalPages = data ? Math.ceil(data.total / 20) : 1;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white text-2xl font-bold">Users</h1>
            <p className="text-white/50 text-sm mt-0.5">{data?.total ?? 0} total users</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-white/10 text-white/70 hover:text-white" onClick={() => setBulkReminderModal(true)}>
              <Send className="w-4 h-4 mr-1.5" /> Bulk Reminder
            </Button>
            <Button variant="outline" size="sm" className="border-white/10 text-white/70 hover:text-white" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 mr-1.5" /> Refresh
            </Button>
          </div>
        </div>

        {/* Filters + Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name or email..."
              className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
          </div>
          <div className="flex gap-1.5">
            {filterTabs.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => { setFilter(key); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === key
                    ? "bg-amber-500 text-black"
                    : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#13131a] border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-white/50 text-xs font-medium px-4 py-3">User</th>
                  <th className="text-left text-white/50 text-xs font-medium px-4 py-3">Status</th>
                  <th className="text-left text-white/50 text-xs font-medium px-4 py-3">Program Day</th>
                  <th className="text-left text-white/50 text-xs font-medium px-4 py-3">Joined</th>
                  <th className="text-left text-white/50 text-xs font-medium px-4 py-3">Last Active</th>
                  <th className="text-right text-white/50 text-xs font-medium px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  [...Array(8)].map((_, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td colSpan={6} className="px-4 py-3">
                        <div className="h-5 bg-white/5 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : data?.users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-white/30 py-12 text-sm">No users found</td>
                  </tr>
                ) : (
                  data?.users.map((user) => {
                    const isPaid = !!user.subscriptionId;
                    return (
                      <tr key={user.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-sm font-bold">
                              {(user.name ?? user.email ?? "?")[0].toUpperCase()}
                            </div>
                            <div>
                              <div className="text-white text-sm font-medium">{user.name ?? "—"}</div>
                              <div className="text-white/40 text-xs">{user.email ?? "—"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {isPaid ? (
                            <Badge className="bg-emerald-500/15 text-emerald-400 border-0 text-xs">
                              <UserCheck className="w-3 h-3 mr-1" /> Paid
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-500/15 text-amber-400 border-0 text-xs">
                              <AlertCircle className="w-3 h-3 mr-1" /> Free
                            </Badge>
                          )}
                        </td>
                        <td className="px-4 py-3 text-white/70 text-sm">
                          Day {user.programDay ?? 1}
                        </td>
                        <td className="px-4 py-3 text-white/50 text-sm">{formatDate(user.createdAt)}</td>
                        <td className="px-4 py-3 text-white/50 text-sm">{formatDate(user.lastSignedIn)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost" size="sm"
                              className="h-7 w-7 p-0 text-white/40 hover:text-white"
                              onClick={() => navigate(`/admin/users/${user.id}`)}
                              title="View details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost" size="sm"
                              className="h-7 w-7 p-0 text-white/40 hover:text-amber-400"
                              onClick={() => { setSelectedUser(user.id); setCredModal(true); genCredsMutation.mutate({ userId: user.id }); }}
                              title="Generate credentials"
                            >
                              <Key className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost" size="sm"
                              className="h-7 w-7 p-0 text-white/40 hover:text-blue-400"
                              onClick={() => { setSelectedUser(user.id); setEmailModal(true); }}
                              title="Send email"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </Button>
                            {!isPaid && (
                              <Button
                                variant="ghost" size="sm"
                                className="h-7 w-7 p-0 text-white/40 hover:text-emerald-400"
                                onClick={() => sendReminderMutation.mutate({ userId: user.id, checkoutUrl })}
                                title="Send payment reminder"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
              <span className="text-white/40 text-sm">Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-white/10 text-white/70" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="border-white/10 text-white/70" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Credentials Modal */}
        <Dialog open={credModal} onOpenChange={setCredModal}>
          <DialogContent className="bg-[#13131a] border-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" /> Generate Credentials
              </DialogTitle>
            </DialogHeader>
            {genCredsMutation.isPending ? (
              <div className="py-8 text-center text-white/50">Generating...</div>
            ) : generatedCreds ? (
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/50 text-sm">Login</span>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 font-mono font-semibold">{generatedCreds.login}</span>
                      <button onClick={() => copyToClipboard(generatedCreds.login)} className="text-white/30 hover:text-white">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50 text-sm">Password</span>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 font-mono font-semibold">{generatedCreds.password}</span>
                      <button onClick={() => copyToClipboard(generatedCreds.password)} className="text-white/30 hover:text-white">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
                {credsSent && (
                  <div className="flex items-center gap-2 text-emerald-400 text-sm">
                    <CheckCircle className="w-4 h-4" /> Credentials sent to user's email
                  </div>
                )}
              </div>
            ) : null}
            <DialogFooter className="gap-2">
              <Button variant="outline" className="border-white/10 text-white/70" onClick={() => genCredsMutation.mutate({ userId: selectedUser ?? undefined })}>
                <RefreshCw className="w-4 h-4 mr-1.5" /> Regenerate
              </Button>
              {generatedCreds && selectedUser && (
                <Button
                  className="bg-amber-500 hover:bg-amber-400 text-black font-semibold"
                  disabled={sendCredsMutation.isPending || credsSent}
                  onClick={() => sendCredsMutation.mutate({
                    userId: selectedUser,
                    login: generatedCreds.login,
                    password: generatedCreds.password,
                    appUrl: window.location.origin,
                  })}
                >
                  <Mail className="w-4 h-4 mr-1.5" />
                  {sendCredsMutation.isPending ? "Sending..." : credsSent ? "Sent!" : "Send by Email"}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Custom Email Modal */}
        <Dialog open={emailModal} onOpenChange={setEmailModal}>
          <DialogContent className="bg-[#13131a] border-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-400" /> Send Custom Email
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label className="text-white/70 text-sm mb-1.5 block">Subject</Label>
                <Input value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} placeholder="Email subject..." className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <Label className="text-white/70 text-sm mb-1.5 block">Message</Label>
                <Textarea value={emailBody} onChange={(e) => setEmailBody(e.target.value)} placeholder="Your message..." rows={5} className="bg-white/5 border-white/10 text-white resize-none" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" className="border-white/10 text-white/70" onClick={() => setEmailModal(false)}>Cancel</Button>
              <Button
                className="bg-blue-500 hover:bg-blue-400 text-white font-semibold"
                disabled={!emailSubject || !emailBody || sendEmailMutation.isPending || !selectedUser}
                onClick={() => selectedUser && sendEmailMutation.mutate({ userId: selectedUser, subject: emailSubject, body: emailBody })}
              >
                {sendEmailMutation.isPending ? "Sending..." : "Send Email"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bulk Reminder Modal */}
        <Dialog open={bulkReminderModal} onOpenChange={setBulkReminderModal}>
          <DialogContent className="bg-[#13131a] border-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Send className="w-5 h-5 text-amber-400" /> Bulk Payment Reminder
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <p className="text-white/60 text-sm">This will send a payment reminder email to all users who don't have an active subscription.</p>
              <div>
                <Label className="text-white/70 text-sm mb-1.5 block">Checkout URL</Label>
                <Input value={checkoutUrl} onChange={(e) => setCheckoutUrl(e.target.value)} className="bg-white/5 border-white/10 text-white font-mono text-sm" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" className="border-white/10 text-white/70" onClick={() => setBulkReminderModal(false)}>Cancel</Button>
              <Button
                className="bg-amber-500 hover:bg-amber-400 text-black font-semibold"
                disabled={bulkReminderMutation.isPending}
                onClick={() => bulkReminderMutation.mutate({ checkoutUrl })}
              >
                {bulkReminderMutation.isPending ? "Sending..." : "Send to All Free Users"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
