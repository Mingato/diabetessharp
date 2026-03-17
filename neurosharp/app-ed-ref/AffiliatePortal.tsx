/**
 * AffiliatePortal.tsx
 * Public-facing affiliate portal: signup, login, and personal dashboard.
 * Uses a separate JWT stored in localStorage (not the main app session).
 */
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Link } from "wouter";
import {
  Award, TrendingUp, DollarSign, MousePointer, ShoppingCart,
  Copy, ExternalLink, LogOut, User, ChevronRight, Star,
  CheckCircle, Clock, BarChart3, Zap, Shield, Globe,
  ArrowRight, Eye, EyeOff
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface AffiliateData {
  id: number;
  name: string;
  email: string;
  code: string;
  commissionRate: number;
  totalClicks: number;
  totalSales: number;
  totalEarnings: number;
  totalPaid: number;
  paypalEmail?: string | null;
  paymentMethod?: string | null;
}

// ── Hook: Affiliate Auth ──────────────────────────────────────────────────────
function useAffiliateAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("aff_token"));
  const login = (t: string) => { localStorage.setItem("aff_token", t); setToken(t); };
  const logout = () => { localStorage.removeItem("aff_token"); setToken(null); };
  return { token, login, logout };
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: string; sub?: string; color: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-gray-400">{label}</p>
      {sub && <p className="text-xs text-gray-600 mt-0.5">{sub}</p>}
    </div>
  );
}

// ── Sign Up Form ──────────────────────────────────────────────────────────────
function SignupForm({ onSwitch, onSuccess }: { onSwitch: () => void; onSuccess: (token: string, data: AffiliateData) => void }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", paypalEmail: "", trafficSource: "meta" });
  const [showPass, setShowPass] = useState(false);
  const register = trpc.affiliate.register.useMutation({
    onSuccess: () => {
      toast.success("Application submitted! We'll review and notify you by email.");
      onSwitch();
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Award className="w-8 h-8 text-orange-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Become an Affiliate</h2>
        <p className="text-gray-400 mt-2">Earn up to 40% commission on every sale</p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { icon: DollarSign, label: "40% Commission", color: "text-emerald-400" },
          { icon: Zap, label: "Instant Tracking", color: "text-blue-400" },
          { icon: Shield, label: "Weekly Payouts", color: "text-purple-400" },
        ].map(({ icon: Icon, label, color }) => (
          <div key={label} className="bg-white/5 rounded-xl p-3 text-center">
            <Icon className={`w-5 h-5 ${color} mx-auto mb-1`} />
            <p className="text-xs text-gray-300">{label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Full Name *</label>
          <input
            type="text"
            placeholder="John Smith"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500"
          />
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Email *</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500"
          />
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Password *</label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 pr-10"
            />
            <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1 block">PayPal Email (for payouts)</label>
          <input
            type="email"
            placeholder="paypal@example.com"
            value={form.paypalEmail}
            onChange={e => setForm(f => ({ ...f, paypalEmail: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500"
          />
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Primary Traffic Source</label>
          <select
            value={form.trafficSource}
            onChange={e => setForm(f => ({ ...f, trafficSource: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500"
          >
            <option value="meta">Meta Ads (Facebook/Instagram)</option>
            <option value="tiktok">TikTok Ads</option>
            <option value="google">Google Ads</option>
            <option value="native">Native Ads (Taboola/Outbrain)</option>
            <option value="email">Email Marketing</option>
            <option value="organic">Organic / SEO</option>
            <option value="other">Other</option>
          </select>
        </div>

        <button
          onClick={() => register.mutate(form)}
          disabled={register.isPending || !form.name || !form.email || !form.password}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {register.isPending ? "Submitting..." : <><Award className="w-5 h-5" /> Apply Now — It's Free</>}
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <button onClick={onSwitch} className="text-orange-400 hover:text-orange-300">Sign in</button>
        </p>
      </div>
    </div>
  );
}

// ── Login Form ────────────────────────────────────────────────────────────────
function LoginForm({ onSwitch, onSuccess }: { onSwitch: () => void; onSuccess: (token: string, data: AffiliateData) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const login = trpc.affiliate.login.useMutation({
    onSuccess: (data) => { onSuccess(data.token, data.affiliate as AffiliateData); },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Award className="w-8 h-8 text-orange-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Affiliate Login</h2>
        <p className="text-gray-400 mt-2">Access your dashboard and tracking links</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500"
          />
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Password</label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && login.mutate({ email, password })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 pr-10"
            />
            <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          onClick={() => login.mutate({ email, password })}
          disabled={login.isPending || !email || !password}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-colors"
        >
          {login.isPending ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <button onClick={onSwitch} className="text-orange-400 hover:text-orange-300">Apply now</button>
        </p>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function AffiliateDashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const dashQ = trpc.affiliate.dashboard.useQuery(undefined, {
    // Pass token via custom header using trpc context
    // We use a workaround: store token in window for the trpc client to pick up
  });

  // Inject token into trpc headers via a custom approach
  useEffect(() => {
    (window as any).__affiliateToken = token;
  }, [token]);

  const data = dashQ.data;
  const aff = data?.affiliate;

  if (dashQ.isLoading) {
    return (
      <div className="min-h-screen bg-[#080b12] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (dashQ.isError) {
    return (
      <div className="min-h-screen bg-[#080b12] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Session expired. Please log in again.</p>
          <button onClick={onLogout} className="text-orange-400 hover:text-orange-300">Back to Login</button>
        </div>
      </div>
    );
  }

  if (!aff) return null;

  const trackingLink = `https://vigronex.com/?ref=${aff.code}`;
  const pendingBalance = (data?.pendingBalance ?? 0);
  const conversionRate = aff.totalClicks > 0 ? ((aff.totalSales / aff.totalClicks) * 100).toFixed(1) : "0.0";
  const epc = aff.totalClicks > 0 ? ((aff.totalEarnings / 100) / aff.totalClicks).toFixed(2) : "0.00";

  return (
    <div className="min-h-screen bg-[#080b12] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0a0d14]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Vigronex Affiliates</p>
              <p className="text-xs text-gray-500">Partner Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">{aff.name}</p>
              <p className="text-xs text-gray-500">{aff.commissionRate}% commission</p>
            </div>
            <button onClick={onLogout} className="text-gray-500 hover:text-white transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/10 border border-orange-500/30 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-xl font-bold text-white">Welcome back, {aff.name}! 👋</h1>
              <p className="text-gray-400 text-sm mt-1">Your unique tracking link is ready to use</p>
            </div>
            <div className="flex items-center gap-2 bg-black/30 rounded-xl px-4 py-3">
              <code className="text-orange-400 text-sm font-mono">{trackingLink}</code>
              <button
                onClick={() => { navigator.clipboard.writeText(trackingLink); toast.success("Link copied!"); }}
                className="text-gray-500 hover:text-white ml-2"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={MousePointer} label="Total Clicks" value={aff.totalClicks.toLocaleString()} color="bg-blue-500/20 text-blue-400" />
          <StatCard icon={ShoppingCart} label="Total Sales" value={String(aff.totalSales)} sub={`${conversionRate}% conversion`} color="bg-emerald-500/20 text-emerald-400" />
          <StatCard icon={DollarSign} label="Total Earned" value={`$${(aff.totalEarnings / 100).toFixed(2)}`} sub={`$${(aff.totalPaid / 100).toFixed(2)} paid out`} color="bg-purple-500/20 text-purple-400" />
          <StatCard icon={TrendingUp} label="Pending Payout" value={`$${(pendingBalance / 100).toFixed(2)}`} sub={`EPC: $${epc}`} color="bg-orange-500/20 text-orange-400" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Tracking Links */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-orange-400" /> Your Tracking Links
            </h3>
            <div className="space-y-3">
              {[
                { label: "Main Offer — Vigronex $29.99", url: `https://vigronex.com/?ref=${aff.code}` },
                { label: "Advertorial (Warm Traffic)", url: `https://vigronex.com/advertorial?ref=${aff.code}` },
                { label: "Direct Checkout", url: `https://vigronex.com/checkout?ref=${aff.code}` },
              ].map(({ label, url }) => (
                <div key={label} className="bg-black/20 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">{label}</p>
                  <div className="flex items-center gap-2">
                    <code className="text-orange-400 text-xs flex-1 truncate">{url}</code>
                    <button onClick={() => { navigator.clipboard.writeText(url); toast.success("Copied!"); }} className="text-gray-500 hover:text-white flex-shrink-0">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Commission Structure */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-orange-400" /> Commission Structure
            </h3>
            <div className="space-y-3">
              {[
                { product: "Vigronex 90-Day Program", price: "$29.99", commission: `$${(29.99 * aff.commissionRate / 100).toFixed(2)}` },
                { product: "Recipe Bible (Order Bump)", price: "$9.99", commission: `$${(9.99 * aff.commissionRate / 100).toFixed(2)}` },
                { product: "Dr. Apex AI (Upsell 1)", price: "$14.99", commission: `$${(14.99 * aff.commissionRate / 100).toFixed(2)}` },
                { product: "Sofia AI (Upsell 2)", price: "$16.99", commission: `$${(16.99 * aff.commissionRate / 100).toFixed(2)}` },
              ].map(({ product, price, commission }) => (
                <div key={product} className="flex items-center justify-between bg-black/20 rounded-lg p-3">
                  <div>
                    <p className="text-sm text-white">{product}</p>
                    <p className="text-xs text-gray-500">{price} sale price</p>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-400 font-bold">{commission}</p>
                    <p className="text-xs text-gray-500">{aff.commissionRate}%</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400">Max per customer (all products)</p>
              <p className="text-orange-400 font-bold text-lg">${(61.97 * aff.commissionRate / 100).toFixed(2)}</p>
            </div>
          </div>

          {/* Recent Commissions */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-orange-400" /> Recent Commissions
            </h3>
            {(data?.commissions ?? []).length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No commissions yet</p>
                <p className="text-gray-600 text-xs mt-1">Start sharing your link to earn!</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {(data?.commissions ?? []).slice(0, 10).map(c => (
                  <div key={c.id} className="flex items-center justify-between bg-black/20 rounded-lg p-3">
                    <div>
                      <p className="text-sm text-white capitalize">{c.productType.replace("_", " ")}</p>
                      <p className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        c.status === "paid" ? "bg-emerald-500/20 text-emerald-400" :
                        c.status === "approved" ? "bg-blue-500/20 text-blue-400" :
                        "bg-amber-500/20 text-amber-400"
                      }`}>{c.status}</span>
                      <span className="text-emerald-400 font-bold">${(c.commissionAmount / 100).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resources */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-400" /> Affiliate Resources
            </h3>
            <div className="space-y-3">
              {[
                { icon: BarChart3, label: "Traffic Guide (Meta, TikTok, Google, Native)", desc: "Step-by-step ad setup for each platform", href: "/affiliate/traffic-guide" },
                { icon: Globe, label: "Landing Page Preview", desc: "See what your visitors will see", href: "/?ref=" + aff.code },
                { icon: Star, label: "Creatives & Ad Copy", desc: "Ready-to-use headlines and ad texts", href: "/affiliate/creatives" },
              ].map(({ icon: Icon, label, desc, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  className="flex items-center gap-3 bg-black/20 hover:bg-black/30 rounded-lg p-3 transition-colors group"
                >
                  <div className="w-9 h-9 bg-orange-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-orange-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">{label}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400" />
                </a>
              ))}
            </div>

            {/* Payout info */}
            <div className="mt-4 border-t border-white/10 pt-4">
              <p className="text-xs text-gray-400 mb-2">Payout Information</p>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <p className="text-xs text-gray-300">
                  {aff.paypalEmail ? `PayPal: ${aff.paypalEmail}` : "No payout method set — contact support"}
                </p>
              </div>
              <p className="text-xs text-gray-600 mt-1">Payouts processed weekly for balances over $50</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AffiliatePortal() {
  const { token, login, logout } = useAffiliateAuth();
  const [view, setView] = useState<"login" | "signup">("login");
  const [affiliateData, setAffiliateData] = useState<AffiliateData | null>(null);

  // If we have a token, show dashboard
  if (token) {
    return <AffiliateDashboard token={token} onLogout={logout} />;
  }

  return (
    <div className="min-h-screen bg-[#080b12] flex flex-col">
      {/* Top bar */}
      <div className="border-b border-white/10 bg-[#0a0d14] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-orange-400" />
            <span className="font-bold text-white">Vigronex Affiliates</span>
          </div>
          <Link href="/" className="text-gray-500 hover:text-white text-sm transition-colors">
            ← Back to site
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-b from-orange-500/10 to-transparent py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 text-sm px-4 py-2 rounded-full mb-6">
            <Star className="w-4 h-4" /> Top Affiliate Program in Men's Health
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Earn <span className="text-orange-400">40% Commission</span><br />on Every Sale
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Join 1,000+ affiliates promoting Vigronex — the #1 men's performance program.
            Average EPC of $2.40. Weekly payouts via PayPal.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-300">
            {["✓ No approval wait for top affiliates", "✓ Real-time click tracking", "✓ Weekly PayPal payouts", "✓ Dedicated affiliate manager"].map(f => (
              <span key={f} className="bg-white/5 px-3 py-1.5 rounded-full">{f}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Auth Form */}
      <div className="flex-1 flex items-start justify-center px-6 pb-16 pt-8">
        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8">
          {view === "signup" ? (
            <SignupForm onSwitch={() => setView("login")} onSuccess={(t, d) => { login(t); setAffiliateData(d); }} />
          ) : (
            <LoginForm onSwitch={() => setView("signup")} onSuccess={(t, d) => { login(t); setAffiliateData(d); }} />
          )}
        </div>
      </div>
    </div>
  );
}
