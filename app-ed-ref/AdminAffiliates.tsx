import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Users, TrendingUp, DollarSign, Clock, CheckCircle,
  XCircle, Eye, ChevronRight, Search, Filter, RefreshCw,
  ExternalLink, Copy, Award, MousePointer, ShoppingCart,
  AlertCircle, Ban, UserCheck
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  suspended: "bg-red-500/20 text-red-400 border-red-500/30",
};

const COMMISSION_STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-400",
  approved: "bg-blue-500/20 text-blue-400",
  paid: "bg-emerald-500/20 text-emerald-400",
  reversed: "bg-red-500/20 text-red-400",
};

function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function StatCard({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: string; sub?: string; color: string }) {
  return (
    <div className="bg-[#0f1117] border border-white/10 rounded-xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminAffiliates() {
  // toast from sonner
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "active" | "suspended">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutRef, setPayoutRef] = useState("");
  const [commissionRate, setCommissionRate] = useState("");
  const [editingRate, setEditingRate] = useState(false);

  const statsQ = trpc.affiliate.adminStats.useQuery();
  const listQ = trpc.affiliate.adminList.useQuery({ status: statusFilter, page, limit: 20 });
  const detailQ = trpc.affiliate.adminGetAffiliate.useQuery(
    { id: selectedId! },
    { enabled: !!selectedId }
  );

  const updateStatus = trpc.affiliate.adminUpdateStatus.useMutation({
    onSuccess: () => { listQ.refetch(); detailQ.refetch(); toast.success("Status updated"); },
  });
  const setCommission = trpc.affiliate.adminSetCommission.useMutation({
    onSuccess: () => { detailQ.refetch(); setEditingRate(false); toast.success("Commission rate updated"); },
  });
  const markPayout = trpc.affiliate.adminMarkPayout.useMutation({
    onSuccess: () => { detailQ.refetch(); statsQ.refetch(); setShowPayoutModal(false); toast.success("Payout recorded!"); },
  });
  const approveCommission = trpc.affiliate.adminApproveCommission.useMutation({
    onSuccess: () => { detailQ.refetch(); toast.success("Commission approved"); },
  });

  const stats = statsQ.data;
  const affiliates = (listQ.data?.affiliates || []).filter(a =>
    !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase())
  );
  const detail = detailQ.data;

  const pendingBalance = detail
    ? detail.commissions.filter(c => c.status === "pending" || c.status === "approved").reduce((s, c) => s + c.commissionAmount, 0)
    : 0;

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Award className="w-7 h-7 text-orange-400" /> Affiliate Program
            </h1>
            <p className="text-gray-400 text-sm mt-1">Manage affiliates, commissions, and payouts</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-white/10 text-gray-400 hover:text-white"
            onClick={() => { statsQ.refetch(); listQ.refetch(); }}
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard icon={Users} label="Total Affiliates" value={String(stats?.total ?? 0)} color="bg-blue-500/20 text-blue-400" />
          <StatCard icon={UserCheck} label="Active" value={String(stats?.active ?? 0)} color="bg-emerald-500/20 text-emerald-400" />
          <StatCard icon={Clock} label="Pending Approval" value={String(stats?.pending ?? 0)} color="bg-amber-500/20 text-amber-400" />
          <StatCard icon={DollarSign} label="Total Commissions" value={formatCents(stats?.totalCommissions ?? 0)} color="bg-purple-500/20 text-purple-400" />
          <StatCard icon={TrendingUp} label="Pending Payout" value={formatCents(stats?.pendingPayout ?? 0)} sub="to be paid out" color="bg-orange-500/20 text-orange-400" />
        </div>

        <div className="flex gap-6">
          {/* Left: Affiliate List */}
          <div className="flex-1 min-w-0">
            {/* Filters */}
            <div className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 bg-[#0f1117] border-white/10 text-white"
                />
              </div>
              <div className="flex gap-1">
                {(["all", "pending", "active", "suspended"] as const).map(s => (
                  <Button
                    key={s}
                    size="sm"
                    variant={statusFilter === s ? "default" : "outline"}
                    className={statusFilter === s ? "bg-orange-500 text-white" : "border-white/10 text-gray-400"}
                    onClick={() => { setStatusFilter(s); setPage(1); }}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="bg-[#0f1117] border border-white/10 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-gray-400 font-medium">Affiliate</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                    <th className="text-right p-4 text-gray-400 font-medium">Clicks</th>
                    <th className="text-right p-4 text-gray-400 font-medium">Sales</th>
                    <th className="text-right p-4 text-gray-400 font-medium">Earned</th>
                    <th className="text-right p-4 text-gray-400 font-medium">Rate</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {affiliates.length === 0 ? (
                    <tr><td colSpan={7} className="text-center p-8 text-gray-500">No affiliates found</td></tr>
                  ) : affiliates.map(a => (
                    <tr
                      key={a.id}
                      className={`border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${selectedId === a.id ? "bg-orange-500/10" : ""}`}
                      onClick={() => setSelectedId(a.id)}
                    >
                      <td className="p-4">
                        <div>
                          <p className="text-white font-medium">{a.name}</p>
                          <p className="text-gray-500 text-xs">{a.email}</p>
                          <p className="text-orange-400 text-xs font-mono mt-0.5">/{a.code}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded-full border ${STATUS_COLORS[a.status]}`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="p-4 text-right text-gray-300">{a.totalClicks.toLocaleString()}</td>
                      <td className="p-4 text-right text-gray-300">{a.totalSales}</td>
                      <td className="p-4 text-right text-emerald-400 font-medium">{formatCents(a.totalEarnings)}</td>
                      <td className="p-4 text-right text-gray-300">{a.commissionRate}%</td>
                      <td className="p-4">
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {(listQ.data?.total ?? 0) > 20 && (
              <div className="flex justify-center gap-2 mt-4">
                <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)} className="border-white/10 text-gray-400">Prev</Button>
                <span className="text-gray-400 text-sm py-2">Page {page}</span>
                <Button size="sm" variant="outline" onClick={() => setPage(p => p + 1)} className="border-white/10 text-gray-400">Next</Button>
              </div>
            )}
          </div>

          {/* Right: Detail Panel */}
          {selectedId && detail && (
            <div className="w-96 flex-shrink-0">
              <div className="bg-[#0f1117] border border-white/10 rounded-xl p-5 sticky top-6">
                {/* Affiliate Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-white font-bold text-lg">{detail.affiliate.name}</h3>
                    <p className="text-gray-400 text-sm">{detail.affiliate.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS[detail.affiliate.status]}`}>
                        {detail.affiliate.status}
                      </span>
                      <span className="text-xs text-orange-400 font-mono">{detail.affiliate.commissionRate}% commission</span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedId(null)} className="text-gray-600 hover:text-white">✕</button>
                </div>

                {/* Tracking Link */}
                <div className="bg-black/30 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-500 mb-1">Tracking Link</p>
                  <div className="flex items-center gap-2">
                    <code className="text-orange-400 text-xs flex-1 truncate">
                      vigronex.com/?ref={detail.affiliate.code}
                    </code>
                    <button
                      onClick={() => { navigator.clipboard.writeText(`https://vigronex.com/?ref=${detail.affiliate.code}`); toast.success("Link copied!"); }}
                      className="text-gray-500 hover:text-white"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-black/20 rounded-lg p-3 text-center">
                    <MousePointer className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                    <p className="text-white font-bold">{detail.affiliate.totalClicks.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Clicks</p>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3 text-center">
                    <ShoppingCart className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                    <p className="text-white font-bold">{detail.affiliate.totalSales}</p>
                    <p className="text-xs text-gray-500">Sales</p>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3 text-center">
                    <DollarSign className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                    <p className="text-white font-bold">{formatCents(detail.affiliate.totalEarnings)}</p>
                    <p className="text-xs text-gray-500">Total Earned</p>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3 text-center">
                    <TrendingUp className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                    <p className="text-white font-bold">{formatCents(pendingBalance)}</p>
                    <p className="text-xs text-gray-500">Pending Payout</p>
                  </div>
                </div>

                {/* PayPal */}
                {detail.affiliate.paypalEmail && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4 text-sm">
                    <p className="text-gray-400 text-xs mb-0.5">PayPal Email</p>
                    <p className="text-blue-300">{detail.affiliate.paypalEmail}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2 mb-4">
                  {detail.affiliate.status === "pending" && (
                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => updateStatus.mutate({ id: selectedId, status: "active" })}
                      disabled={updateStatus.isPending}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" /> Approve Affiliate
                    </Button>
                  )}
                  {detail.affiliate.status === "active" && (
                    <>
                      <Button
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                        onClick={() => setShowPayoutModal(true)}
                        disabled={pendingBalance === 0}
                      >
                        <DollarSign className="w-4 h-4 mr-2" /> Mark Payout ({formatCents(pendingBalance)})
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
                        onClick={() => updateStatus.mutate({ id: selectedId, status: "suspended" })}
                      >
                        <Ban className="w-4 h-4 mr-2" /> Suspend
                      </Button>
                    </>
                  )}
                  {detail.affiliate.status === "suspended" && (
                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => updateStatus.mutate({ id: selectedId, status: "active" })}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" /> Reactivate
                    </Button>
                  )}
                </div>

                {/* Commission Rate Editor */}
                <div className="border border-white/10 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-400">Commission Rate</p>
                    <button onClick={() => { setEditingRate(!editingRate); setCommissionRate(String(detail.affiliate.commissionRate)); }} className="text-xs text-orange-400 hover:text-orange-300">
                      {editingRate ? "Cancel" : "Edit"}
                    </button>
                  </div>
                  {editingRate ? (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min={1}
                        max={80}
                        value={commissionRate}
                        onChange={e => setCommissionRate(e.target.value)}
                        className="bg-black/30 border-white/10 text-white h-8 text-sm"
                      />
                      <Button
                        size="sm"
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                        onClick={() => setCommission.mutate({ id: selectedId, commissionRate: parseInt(commissionRate) })}
                        disabled={setCommission.isPending}
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <p className="text-white font-bold text-xl">{detail.affiliate.commissionRate}%</p>
                  )}
                </div>

                {/* Recent Commissions */}
                <div>
                  <p className="text-sm text-gray-400 mb-2">Recent Commissions</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {detail.commissions.length === 0 ? (
                      <p className="text-xs text-gray-600 text-center py-3">No commissions yet</p>
                    ) : detail.commissions.slice(0, 10).map(c => (
                      <div key={c.id} className="flex items-center justify-between bg-black/20 rounded p-2">
                        <div>
                          <p className="text-xs text-gray-300">{c.productType}</p>
                          <p className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-1.5 py-0.5 rounded ${COMMISSION_STATUS_COLORS[c.status]}`}>{c.status}</span>
                          <span className="text-emerald-400 text-xs font-medium">{formatCents(c.commissionAmount)}</span>
                          {c.status === "pending" && (
                            <button
                              onClick={() => approveCommission.mutate({ commissionId: c.id })}
                              className="text-blue-400 hover:text-blue-300 text-xs"
                            >
                              ✓
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payout Modal */}
      {showPayoutModal && selectedId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f1117] border border-white/10 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-white font-bold text-lg mb-4">Record Payout</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Amount (USD)</label>
                <Input
                  type="number"
                  placeholder={`Max: ${formatCents(pendingBalance)}`}
                  value={payoutAmount}
                  onChange={e => setPayoutAmount(e.target.value)}
                  className="bg-black/30 border-white/10 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Transaction Reference (optional)</label>
                <Input
                  placeholder="PayPal transaction ID, etc."
                  value={payoutRef}
                  onChange={e => setPayoutRef(e.target.value)}
                  className="bg-black/30 border-white/10 text-white"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => markPayout.mutate({
                    affiliateId: selectedId,
                    amount: Math.round(parseFloat(payoutAmount) * 100),
                    method: detail?.affiliate.paymentMethod || "paypal",
                    reference: payoutRef || undefined,
                  })}
                  disabled={!payoutAmount || markPayout.isPending}
                >
                  {markPayout.isPending ? "Processing..." : "Confirm Payout"}
                </Button>
                <Button variant="outline" className="border-white/10 text-gray-400" onClick={() => setShowPayoutModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
