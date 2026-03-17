import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import {
  Check,
  CheckCircle,
  Zap,
  Shield,
  Star,
  Crown,
  Loader2,
  ExternalLink,
  Activity,
  MessageCircle,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import { useState, useEffect } from "react";

const MONTHLY_FEATURES = [
  "Full 90-day structured program",
  "Dr. Apex AI physician (unlimited chats)",
  "Complete exercise library (9+ exercises)",
  "Daily performance tracking & analytics",
  "Gamification: XP, badges & streaks",
  "Weekly progress reports",
  "Educational content library",
  "Priority support",
];

const FREE_FEATURES = [
  "7-day free trial included",
  "Basic exercise library (3 exercises)",
  "Daily check-in (limited)",
  "Dr. Apex (5 messages/day)",
];

const TESTIMONIALS = [
  {
    name: "Michael R.",
    age: 42,
    result: "Saw results in 6 weeks",
    quote: "I was skeptical at first, but the combination of Kegel exercises, breathwork, and the AI coach completely changed things. My confidence is back.",
  },
  {
    name: "David K.",
    age: 38,
    result: "Performance score: 34 → 78",
    quote: "The daily structure kept me accountable. Dr. Apex answered questions I was too embarrassed to ask a real doctor. Worth every penny.",
  },
  {
    name: "James T.",
    age: 51,
    result: "30-day streak achieved",
    quote: "I've tried other programs but none had the science-backed approach of RiseUp. The cold therapy protocol alone made a noticeable difference.",
  },
];

export default function Subscribe() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">("monthly");
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { data: subStatus, refetch } = trpc.subscription.getStatus.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const createCheckout = trpc.subscription.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        toast.success("Redirecting to secure Stripe checkout...");
        window.open(data.url, "_blank");
      }
      setIsRedirecting(false);
    },
    onError: (err) => {
      toast.error(`Checkout failed: ${err.message}`);
      setIsRedirecting(false);
    },
  });

  const createPortal = trpc.subscription.createPortal.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.open(data.url, "_blank");
      }
    },
    onError: (err) => {
      toast.error(`Billing portal error: ${err.message}`);
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("canceled") === "true") {
      toast.info("Checkout was canceled. You can try again anytime.");
    }
  }, []);

  const handleSubscribe = () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    setIsRedirecting(true);
    createCheckout.mutate({
      plan: selectedPlan,
      origin: window.location.origin,
    });
  };

  const isActive = subStatus?.status === "active";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 text-amber-400 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            7-Day Free Trial — Cancel Anytime
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Unlock Your Full{" "}
            <span className="text-amber-400">Potential</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of men who've transformed their performance with the
            complete RiseUp 90-day program.
          </p>
        </div>

        {/* Active subscription banner */}
        {isActive ? (
          <div className="mb-10 p-8 rounded-2xl bg-green-500/10 border border-green-500/30 text-center">
            <Crown className="w-10 h-10 text-amber-400 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-foreground mb-2">
              You're a Premium Member!
            </h3>
            <p className="text-muted-foreground mb-6">
              Your subscription is active.
              {subStatus?.endsAt && (
                <> Renews on {new Date(subStatus.endsAt).toLocaleDateString()}.</>
              )}
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => navigate("/app")} className="bg-amber-500 hover:bg-amber-400 text-black font-bold">
                Go to Dashboard
              </Button>
              <Button
                onClick={() => createPortal.mutate({ origin: window.location.origin })}
                variant="outline"
                className="border-green-500/40 text-green-400 hover:bg-green-500/10"
                disabled={createPortal.isPending}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Manage Billing
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Plan toggle */}
            <div className="flex justify-center mb-10">
              <div className="inline-flex bg-card border border-border rounded-xl p-1 gap-1">
                <button
                  onClick={() => setSelectedPlan("monthly")}
                  className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    selectedPlan === "monthly"
                      ? "bg-amber-500 text-black"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setSelectedPlan("annual")}
                  className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    selectedPlan === "annual"
                      ? "bg-amber-500 text-black"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Annual
                  <span className="bg-green-500/20 text-green-400 text-xs px-1.5 py-0.5 rounded-full">
                    Save 44%
                  </span>
                </button>
              </div>
            </div>

            {/* Pricing cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {/* Free */}
              <div className="rounded-2xl border border-border bg-card p-8">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-foreground mb-1">Free Trial</h3>
                  <p className="text-muted-foreground text-sm">Start your journey risk-free</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">$0</span>
                    <span className="text-muted-foreground ml-2">/ 7 days</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {FREE_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant="outline"
                  className="w-full border-border"
                  onClick={() => navigate("/app")}
                >
                  Continue with Free
                </Button>
              </div>

              {/* Premium */}
              <div className="rounded-2xl border-2 border-amber-500/60 bg-card p-8 relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <Badge className="bg-amber-500 text-black font-semibold">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />

                <div className="mb-6 relative">
                  <h3 className="text-xl font-bold text-foreground mb-1">Premium</h3>
                  <p className="text-muted-foreground text-sm">Full program access</p>
                  <div className="mt-4">
                    {selectedPlan === "monthly" ? (
                      <>
                        <span className="text-4xl font-bold text-amber-400">$29.99</span>
                        <span className="text-muted-foreground ml-2">/ month</span>
                      </>
                    ) : (
                      <>
                        <span className="text-4xl font-bold text-amber-400">$199</span>
                        <span className="text-muted-foreground ml-2">/ year</span>
                        <div className="text-sm text-green-400 mt-1">
                          $16.58/month — Save $160/year
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-8 relative">
                  {MONTHLY_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-foreground">
                      <Check className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-base h-12 relative"
                  onClick={handleSubscribe}
                  disabled={isRedirecting || createCheckout.isPending}
                >
                  {isRedirecting || createCheckout.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Opening Checkout...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Start 7-Day Free Trial
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Cancel anytime. No hidden fees. Powered by Stripe.
                </p>
              </div>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {[
                { icon: Activity, label: "Full Exercise Library", desc: "9+ science-backed exercises" },
                { icon: MessageCircle, label: "Unlimited Dr. Apex", desc: "AI physician consultations" },
                { icon: BookOpen, label: "Premium Content", desc: "Evidence-based articles" },
                { icon: TrendingUp, label: "Advanced Analytics", desc: "Detailed progress reports" },
              ].map((item) => (
                <div key={item.label} className="bg-card border border-border rounded-xl p-4 text-center">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-3">
                    <item.icon className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="font-semibold text-sm text-foreground mb-1">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
              ))}
            </div>

            {/* Testimonials */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground text-center mb-6">
                Real Results from Real Men
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {TESTIMONIALS.map((t) => (
                  <div key={t.name} className="bg-card border border-border rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                        <span className="font-bold text-amber-400 text-sm">{t.name[0]}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-sm">{t.name}, {t.age}</div>
                        <Badge className="bg-green-500/15 text-green-400 border-green-500/30 text-xs">{t.result}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground italic">"{t.quote}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust signals */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { icon: Shield, title: "Secure Payment", desc: "256-bit SSL via Stripe" },
                { icon: Star, title: "4.9/5 Rating", desc: "2,400+ verified members" },
                { icon: CheckCircle, title: "Cancel Anytime", desc: "No contracts or commitments" },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="text-center p-4 rounded-xl bg-card border border-border">
                  <Icon className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                  <div className="text-sm font-semibold text-foreground">{title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{desc}</div>
                </div>
              ))}
            </div>

            {/* Test card notice */}
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-center">
              <p className="text-sm text-blue-300">
                <strong>Test Mode:</strong> Use card{" "}
                <code className="bg-blue-500/20 px-1.5 py-0.5 rounded text-blue-200">
                  4242 4242 4242 4242
                </code>{" "}
                with any future expiry and CVC to test payments.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
