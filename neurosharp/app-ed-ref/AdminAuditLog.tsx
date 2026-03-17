import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAdmin } from "@/contexts/AdminContext";
import { AdminLayout } from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, ScrollText, ChevronLeft, ChevronRight } from "lucide-react";

function formatDate(d: Date | string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

const actionColors: Record<string, string> = {
  login: "bg-blue-500/15 text-blue-400",
  logout: "bg-white/10 text-white/50",
  generate_credentials: "bg-amber-500/15 text-amber-400",
  send_credentials: "bg-emerald-500/15 text-emerald-400",
  send_payment_reminder: "bg-orange-500/15 text-orange-400",
  bulk_payment_reminder: "bg-red-500/15 text-red-400",
  send_custom_email: "bg-purple-500/15 text-purple-400",
  trigger_password_reset: "bg-cyan-500/15 text-cyan-400",
};

export default function AdminAuditLog() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAdmin();
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!isAuthenticated) navigate("/admin/login");
  }, [isAuthenticated]);

  const { data, isLoading, refetch } = trpc.admin.getAuditLog.useQuery(
    { page },
    { enabled: isAuthenticated }
  );

  if (!isAuthenticated) return null;

  const totalPages = data ? Math.ceil(data.total / 50) : 1;

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white text-2xl font-bold flex items-center gap-2">
              <ScrollText className="w-6 h-6 text-amber-400" /> Audit Log
            </h1>
            <p className="text-white/50 text-sm mt-0.5">All admin actions recorded</p>
          </div>
          <Button variant="outline" size="sm" className="border-white/10 text-white/70 hover:text-white" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-1.5" /> Refresh
          </Button>
        </div>

        <div className="bg-[#13131a] border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-white/50 text-xs font-medium px-4 py-3">Time</th>
                <th className="text-left text-white/50 text-xs font-medium px-4 py-3">Action</th>
                <th className="text-left text-white/50 text-xs font-medium px-4 py-3">Target User</th>
                <th className="text-left text-white/50 text-xs font-medium px-4 py-3">Details</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(10)].map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td colSpan={4} className="px-4 py-3">
                      <div className="h-4 bg-white/5 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : data?.logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-white/30 py-12 text-sm">No audit logs yet</td>
                </tr>
              ) : (
                data?.logs.map((log) => (
                  <tr key={log.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3 text-white/50 text-sm font-mono whitespace-nowrap">{formatDate(log.createdAt)}</td>
                    <td className="px-4 py-3">
                      <Badge className={`border-0 text-xs ${actionColors[log.action] ?? "bg-white/10 text-white/60"}`}>
                        {log.action.replace(/_/g, " ")}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-white/60 text-sm">{log.targetUserId ?? "—"}</td>
                    <td className="px-4 py-3 text-white/50 text-sm truncate max-w-xs">{log.details ?? "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

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
      </div>
    </AdminLayout>
  );
}
