import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { useAdmin } from "@/contexts/AdminContext";
import { toast } from "sonner";
import {
  MessageSquare, RefreshCw, ChevronLeft, ChevronRight,
  Send, X, AlertCircle, Mail, Inbox, MailOpen, MailCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const STATUS_CONFIG = {
  open:     { label: "Open",     color: "text-red-400",   bg: "bg-red-500/10 border-red-500/20",     dot: "bg-red-400"   },
  replied:  { label: "Replied",  color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", dot: "bg-amber-400" },
  resolved: { label: "Resolved", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", dot: "bg-green-400" },
};

const CATEGORY_LABELS: Record<string, string> = {
  refund: "💰 Refund", access: "🔑 Access", billing: "💳 Billing",
  technical: "⚙️ Technical", general: "💬 General", other: "📋 Other",
};

function formatDate(d: Date | string) {
  return new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function TicketBadge({ status }: { status: "open" | "replied" | "resolved" }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-xs font-bold ${cfg.bg} ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export default function AdminSupport() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAdmin();
  const utils = trpc.useUtils();

  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "replied" | "resolved">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyMode, setReplyMode] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate("/admin/login");
  }, [isAuthenticated]);

  const { data: stats, refetch: refetchStats } = trpc.admin.getSupportStats.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const { data, isLoading, refetch } = trpc.admin.getSupportTickets.useQuery(
    { status: statusFilter, category: categoryFilter || undefined, page, limit: 15 },
    { enabled: isAuthenticated }
  );

  const { data: selectedTicket, isLoading: ticketLoading } = trpc.admin.getSupportTicket.useQuery(
    { id: selectedId! },
    { enabled: isAuthenticated && selectedId !== null }
  );

  const updateStatus = trpc.admin.updateTicketStatus.useMutation({
    onSuccess: () => {
      toast.success("Status updated");
      utils.admin.getSupportTickets.invalidate();
      utils.admin.getSupportTicket.invalidate({ id: selectedId! });
      utils.admin.getSupportStats.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const replyMutation = trpc.admin.replyToTicket.useMutation({
    onSuccess: () => {
      toast.success("Reply sent successfully!");
      setReplyText("");
      setReplyMode(false);
      utils.admin.getSupportTickets.invalidate();
      utils.admin.getSupportTicket.invalidate({ id: selectedId! });
      utils.admin.getSupportStats.invalidate();
    },
    onError: (err) => toast.error(err.message || "Failed to send reply"),
  });

  if (!isAuthenticated) return null;

  const totalPages = data ? Math.ceil(data.total / 15) : 1;

  return (
    <AdminLayout>
      <div className="p-6 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white font-black text-2xl">Support Tickets</h1>
            <p className="text-white/40 text-sm mt-0.5">View and respond to customer messages</p>
          </div>
          <Button
            variant="outline" size="sm"
            onClick={() => { refetch(); refetchStats(); }}
            className="border-white/20 text-white/60 hover:text-white gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total",    value: stats?.total    ?? 0, icon: <Inbox className="w-4 h-4" />,     color: "text-white/60"  },
            { label: "Open",     value: stats?.open     ?? 0, icon: <AlertCircle className="w-4 h-4" />, color: "text-red-400"   },
            { label: "Replied",  value: stats?.replied  ?? 0, icon: <MailOpen className="w-4 h-4" />,   color: "text-amber-400" },
            { label: "Resolved", value: stats?.resolved ?? 0, icon: <MailCheck className="w-4 h-4" />,  color: "text-green-400" },
          ].map((s, i) => (
            <div key={i} className="bg-[#111118] border border-white/10 rounded-xl p-4">
              <div className={`flex items-center gap-2 mb-2 ${s.color}`}>{s.icon}<span className="text-xs font-bold uppercase tracking-wide">{s.label}</span></div>
              <p className="text-white font-black text-2xl">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          {/* Left: Ticket List */}
          <div className="flex-1 min-w-0">
            {/* Filters */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <div className="flex items-center gap-1 bg-[#111118] border border-white/10 rounded-lg p-1">
                {(["all", "open", "replied", "resolved"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => { setStatusFilter(s); setPage(1); }}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold capitalize transition-colors ${
                      statusFilter === s ? "bg-amber-500/20 text-amber-400" : "text-white/40 hover:text-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                className="bg-[#111118] border border-white/10 rounded-lg px-3 py-2 text-white/60 text-xs focus:outline-none focus:border-amber-500/50"
              >
                <option value="">All Categories</option>
                {Object.entries(CATEGORY_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
              <span className="text-white/30 text-xs ml-auto">{data?.total ?? 0} tickets</span>
            </div>

            {/* Ticket rows */}
            <div className="space-y-2">
              {isLoading && (
                <div className="text-center py-12 text-white/30 text-sm">Loading tickets...</div>
              )}
              {!isLoading && (data?.tickets.length ?? 0) === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="w-8 h-8 text-white/10 mx-auto mb-3" />
                  <p className="text-white/30 text-sm">No tickets found</p>
                </div>
              )}
              {data?.tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => { setSelectedId(ticket.id); setReplyMode(false); setReplyText(""); }}
                  className={`bg-[#111118] border rounded-xl p-4 cursor-pointer transition-all hover:border-amber-500/30 ${
                    selectedId === ticket.id ? "border-amber-500/50 bg-amber-500/5" : "border-white/10"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-bold text-sm truncate">{ticket.subject}</span>
                        {ticket.status === "open" && <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-white/40 flex-wrap">
                        <span className="font-medium text-white/60">{ticket.name}</span>
                        <span>·</span><span>{ticket.email}</span>
                        <span>·</span><span>{CATEGORY_LABELS[ticket.category] ?? ticket.category}</span>
                      </div>
                      <p className="text-white/30 text-xs mt-1.5 line-clamp-1">{ticket.message}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <TicketBadge status={ticket.status} />
                      <span className="text-white/20 text-xs">{formatDate(ticket.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="border-white/20 text-white/60 hover:text-white">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-white/40 text-xs">Page {page} of {totalPages}</span>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="border-white/20 text-white/60 hover:text-white">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Right: Ticket Detail */}
          {selectedId !== null && (
            <div className="w-96 flex-shrink-0">
              <div className="bg-[#111118] border border-white/10 rounded-xl overflow-hidden sticky top-6">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                  <span className="text-white font-bold text-sm">Ticket Detail</span>
                  <button onClick={() => setSelectedId(null)} className="text-white/30 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {ticketLoading && <div className="p-6 text-center text-white/30 text-sm">Loading...</div>}

                {selectedTicket && (
                  <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {/* ID + Status */}
                    <div className="flex items-center justify-between">
                      <span className="text-white/40 text-xs font-bold">#{String(selectedTicket.id).padStart(5, "0")}</span>
                      <TicketBadge status={selectedTicket.status} />
                    </div>

                    {/* Subject */}
                    <div>
                      <p className="text-white font-bold text-sm leading-tight">{selectedTicket.subject}</p>
                      <p className="text-white/30 text-xs mt-1">{formatDate(selectedTicket.createdAt)}</p>
                    </div>

                    {/* Customer info */}
                    <div className="bg-[#0d0d1a] rounded-xl p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-black text-sm">
                          {selectedTicket.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm">{selectedTicket.name}</p>
                          <p className="text-white/40 text-xs">{selectedTicket.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-white/30">Category:</span>
                        <span className="text-white/70">{CATEGORY_LABELS[selectedTicket.category] ?? selectedTicket.category}</span>
                      </div>
                      {selectedTicket.orderId && (
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-white/30">Order ID:</span>
                          <span className="text-amber-400 font-mono">{selectedTicket.orderId}</span>
                        </div>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <p className="text-white/40 text-xs font-bold uppercase tracking-wide mb-2">Message</p>
                      <div className="bg-[#0d0d1a] rounded-xl p-3">
                        <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">{selectedTicket.message}</p>
                      </div>
                    </div>

                    {/* Status actions */}
                    <div>
                      <p className="text-white/40 text-xs font-bold uppercase tracking-wide mb-2">Update Status</p>
                      <div className="flex gap-2">
                        {(["open", "replied", "resolved"] as const).map((s) => (
                          <button
                            key={s}
                            disabled={selectedTicket.status === s || updateStatus.isPending}
                            onClick={() => updateStatus.mutate({ id: selectedTicket.id, status: s })}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                              selectedTicket.status === s
                                ? `${STATUS_CONFIG[s].bg} ${STATUS_CONFIG[s].color}`
                                : "bg-white/5 border-white/10 text-white/40 hover:border-white/30 hover:text-white"
                            }`}
                          >
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Reply */}
                    {!replyMode ? (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setReplyMode(true)}
                          className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs gap-2"
                          size="sm"
                        >
                          <Mail className="w-3.5 h-3.5" /> Reply by Email
                        </Button>
                        <Button
                          onClick={() => window.open(`mailto:${selectedTicket.email}?subject=Re: ${encodeURIComponent(selectedTicket.subject)} [Ticket #${String(selectedTicket.id).padStart(5, "0")}]`)}
                          variant="outline" size="sm"
                          className="border-white/20 text-white/60 hover:text-white"
                          title="Open in email client"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-white/40 text-xs font-bold uppercase tracking-wide">Reply to {selectedTicket.name}</p>
                          <button onClick={() => { setReplyMode(false); setReplyText(""); }} className="text-white/30 hover:text-white transition-colors">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`Hi ${selectedTicket.name},\n\nThank you for reaching out...`}
                          rows={6}
                          className="w-full bg-[#0d0d1a] border border-white/15 rounded-xl px-3 py-2.5 text-white text-xs placeholder-white/20 focus:outline-none focus:border-amber-500/60 transition-colors resize-none"
                        />
                        <p className="text-white/20 text-xs text-right mb-2">{replyText.length}/10000</p>
                        <Button
                          onClick={() => replyMutation.mutate({ id: selectedTicket.id, replyMessage: replyText.trim() })}
                          disabled={!replyText.trim() || replyMutation.isPending}
                          className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black text-xs gap-2 disabled:opacity-50"
                          size="sm"
                        >
                          {replyMutation.isPending ? (
                            <><div className="w-3.5 h-3.5 rounded-full border-2 border-black/40 border-t-black animate-spin" /> Sending...</>
                          ) : (
                            <><Send className="w-3.5 h-3.5" /> Send Reply</>
                          )}
                        </Button>
                        <p className="text-white/20 text-xs text-center mt-2">
                          Email will be sent to <span className="text-white/40">{selectedTicket.email}</span>
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
