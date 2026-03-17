import { useLocation } from "wouter";
import { useAdmin } from "@/contexts/AdminContext";
import { AdminLayout } from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Eye, EyeOff, Shield, FlaskConical, Link2, CheckCircle2, Copy, Mail } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export default function AdminSettings() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAdmin();

  useEffect(() => {
    if (!isAuthenticated) navigate("/admin/login");
  }, [isAuthenticated]);

  // ── Change Password ──────────────────────────────────────────────────────────
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const changePasswordMutation = trpc.admin.changeAdminPassword.useMutation({
    onSuccess: () => {
      toast.success("Password changed successfully!");
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
    },
    onError: (e) => toast.error("Failed to change password", { description: e.message }),
  });

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPw !== confirmPw) { toast.error("Passwords do not match"); return; }
    if (newPw.length < 8) { toast.error("New password must be at least 8 characters"); return; }
    changePasswordMutation.mutate({ currentPassword: currentPw, newPassword: newPw });
  };

  // ── Test Order ───────────────────────────────────────────────────────────────
  const [testEmail, setTestEmail] = useState("");
  const [testName, setTestName] = useState("");
  const [testResult, setTestResult] = useState<{ orderId: string; emailSent: boolean; password: string } | null>(null);

  const createTestOrderMutation = trpc.tools.createTestOrder.useMutation({
    onSuccess: (data: { success: boolean; orderId: string; emailSent: boolean; password: string }) => {
      setTestResult(data);
      toast.success("Test order created! Check your email.");
    },
    onError: (e: { message: string }) => toast.error("Failed to create test order", { description: e.message }),
  });

  const handleTestOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!testEmail || !testName) { toast.error("Fill in email and name"); return; }
    createTestOrderMutation.mutate({ email: testEmail, firstName: testName });
  };

  // ── Carpanda Links ───────────────────────────────────────────────────────────
  const { data: carpandaLinks, refetch: refetchLinks } = trpc.tools.getCarpandaSettings.useQuery();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingUrl, setEditingUrl] = useState("");

  const updateLinkMutation = trpc.tools.updateCarpandaLink.useMutation({
    onSuccess: () => {
      toast.success("Link updated successfully!");
      setEditingKey(null);
      setEditingUrl("");
      refetchLinks();
    },
    onError: (e) => toast.error("Failed to update link", { description: e.message }),
  });

  const startEdit = (key: string, currentUrl: string) => {
    setEditingKey(key);
    setEditingUrl(currentUrl === "PLACEHOLDER" ? "" : currentUrl);
  };

  const saveLink = () => {
    if (!editingKey) return;
    if (!editingUrl.startsWith("http")) { toast.error("Must be a valid URL starting with http"); return; }
    updateLinkMutation.mutate({ key: editingKey, url: editingUrl });
  };

  if (!isAuthenticated) return null;

  return (
    <AdminLayout>
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <div className="mb-2">
          <h1 className="text-white text-2xl font-bold">Settings</h1>
          <p className="text-white/50 text-sm mt-0.5">Admin account, payment links, and testing tools</p>
        </div>

        {/* ── Test Order ─────────────────────────────────────────────────────── */}
        <Card className="bg-[#13131a] border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base font-semibold flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-green-400" />
              Create Test Order
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white/50 text-sm mb-4">
              Creates a paid order instantly and sends the credentials email to the specified address. Use this to verify the full email flow without going through the checkout.
            </p>
            <form onSubmit={handleTestOrder} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/60 text-xs mb-1.5 block">First Name</label>
                  <Input
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    placeholder="e.g. John"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/25"
                    required
                  />
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1.5 block">Email Address</label>
                  <Input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/25"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-500 text-white font-semibold"
                disabled={createTestOrderMutation.isPending}
              >
                <Mail className="w-4 h-4 mr-1.5" />
                {createTestOrderMutation.isPending ? "Sending..." : "Send Test Credentials Email"}
              </Button>
            </form>

            {testResult && (
              <div className="mt-4 bg-green-500/10 border border-green-500/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-green-400 font-semibold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  Test order created successfully!
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-white/40">Order ID</span>
                    <p className="text-white font-mono">{testResult.orderId}</p>
                  </div>
                  <div>
                    <span className="text-white/40">Temp Password</span>
                    <div className="flex items-center gap-1">
                      <p className="text-white font-mono">{testResult.password}</p>
                      <button
                        onClick={() => { navigator.clipboard.writeText(testResult.password); toast.success("Copied!"); }}
                        className="text-white/40 hover:text-white"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-white/50 text-xs">
                  {testResult.emailSent
                    ? "✅ Credentials email sent to " + testEmail
                    : "⚠️ Order created but email failed to send — check Resend API key"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Carpanda Payment Links ──────────────────────────────────────────── */}
        <Card className="bg-[#13131a] border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base font-semibold flex items-center gap-2">
              <Link2 className="w-4 h-4 text-amber-400" />
              Carpanda Payment Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white/50 text-sm mb-4">
              Paste the payment links from your Carpanda account. These are used in the checkout and upsell pages. Changes take effect immediately.
            </p>
            <div className="space-y-3">
              {carpandaLinks?.map((link: { key: string; label: string; url: string }) => (
                <div key={link.key} className="bg-white/5 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-white text-sm font-medium">{link.label}</span>
                    {link.url !== "PLACEHOLDER" && link.url.startsWith("http") ? (
                      <span className="text-green-400 text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="text-amber-400 text-xs">⚠ Not configured</span>
                    )}
                  </div>

                  {editingKey === link.key ? (
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={editingUrl}
                        onChange={(e) => setEditingUrl(e.target.value)}
                        placeholder="https://pay.carpanda.com/..."
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/25 text-xs h-8 flex-1"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        className="bg-amber-500 hover:bg-amber-400 text-black font-semibold h-8 px-3 text-xs"
                        onClick={saveLink}
                        disabled={updateLinkMutation.isPending}
                      >
                        {updateLinkMutation.isPending ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white/40 hover:text-white h-8 px-3 text-xs"
                        onClick={() => setEditingKey(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-white/30 text-xs font-mono truncate max-w-xs">
                        {link.url === "PLACEHOLDER" ? "No link set" : link.url}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-amber-400 hover:text-amber-300 h-7 px-2 text-xs"
                        onClick={() => startEdit(link.key, link.url)}
                      >
                        Edit
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              {!carpandaLinks?.length && (
                <p className="text-white/30 text-sm text-center py-4">Loading payment links...</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ── Change Password ─────────────────────────────────────────────────── */}
        <Card className="bg-[#13131a] border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base font-semibold flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              Change Admin Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Current Password</label>
                <div className="relative">
                  <Input
                    type={showCurrent ? "text" : "password"}
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    placeholder="Enter current password"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/25 pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                    onClick={() => setShowCurrent(!showCurrent)}
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">New Password</label>
                <div className="relative">
                  <Input
                    type={showNew ? "text" : "password"}
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/25 pr-10"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                    onClick={() => setShowNew(!showNew)}
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Confirm New Password</label>
                <Input
                  type="password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  placeholder="Repeat new password"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/25"
                  required
                />
                {confirmPw && newPw !== confirmPw && (
                  <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
                )}
              </div>
              <div className="pt-2">
                <Button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-black font-semibold"
                  disabled={changePasswordMutation.isPending || !currentPw || !newPw || !confirmPw}
                >
                  <Shield className="w-4 h-4 mr-1.5" />
                  {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Security Tips */}
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
          <p className="text-amber-400 text-xs font-semibold mb-2">Security Recommendations</p>
          <ul className="text-white/50 text-xs space-y-1">
            <li>• Use at least 12 characters with a mix of letters, numbers, and symbols</li>
            <li>• Never share your admin credentials with anyone</li>
            <li>• Change your password immediately if you suspect unauthorized access</li>
            <li>• The default password <code className="text-amber-400">Admin@Vigronex2026!</code> should be changed right away</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
