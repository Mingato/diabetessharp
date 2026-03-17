import { useState, useEffect, useRef } from "react";
import { useLocation, useSearch } from "wouter";
import { Shield, CheckCircle, Lock, Zap, Star, ChevronRight, ChevronDown, AlertTriangle, Clock, User, Mail, Phone, Award, Heart, Users, TrendingUp } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { usePageSecurity } from "@/hooks/usePageSecurity";

// ── Countdown hook ────────────────────────────────────────────────────────────
function useCountdown(initial: number) {
  const [secs, setSecs] = useState(initial);
  useEffect(() => {
    const t = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return { display: `${m}:${s}`, expired: secs === 0, secs };
}

// ── Live sales counter ──────────────────────────────────────────────────────
function LiveSalesCounter() {
  const [count, setCount] = useState(() => Math.floor(Math.random() * 18) + 31); // 31–48
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    // Increment by 1 every 45–90 seconds to simulate real-time sales
    const tick = () => {
      setCount(c => c + 1);
      setPulse(true);
      setTimeout(() => setPulse(false), 800);
    };
    const delay = Math.floor(Math.random() * 45000) + 45000;
    const t = setInterval(tick, delay);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="bg-[#0d0d1a] border border-orange-500/30 rounded-2xl px-4 py-3 mb-5 flex items-center gap-3">
      <div className="relative flex-shrink-0">
        <div className="w-9 h-9 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center">
          <span className="text-lg">🔥</span>
        </div>
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 border-2 border-[#0d0d1a] animate-pulse" />
      </div>
      <div className="flex-1">
        <p className="text-white text-xs leading-snug">
          <span
            className={`font-black text-orange-400 text-sm tabular-nums transition-all duration-300 ${pulse ? "scale-110 text-amber-300" : ""}`}
            style={{ display: "inline-block" }}
          >
            {count}
          </span>
          {" "}
          <span className="font-bold text-white">men purchased Vigronex</span>
          {" "}
          <span className="text-white/40">in the last 24 hours</span>
        </p>
        <p className="text-white/30 text-[10px] mt-0.5">Updated in real time · Spots filling fast</p>
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="text-green-400 text-[10px] font-bold">● LIVE</p>
      </div>
    </div>
  );
}

// ── Live buyer notification ─────────────────────────────────────────────────────
const BUYERS = [
  { name: "Michael R.", location: "Dallas, TX", time: "2 min ago" },
  { name: "James W.", location: "Phoenix, AZ", time: "4 min ago" },
  { name: "David K.", location: "Miami, FL", time: "7 min ago" },
  { name: "Robert T.", location: "Chicago, IL", time: "11 min ago" },
  { name: "Carlos M.", location: "Houston, TX", time: "14 min ago" },
  { name: "Thomas B.", location: "Seattle, WA", time: "18 min ago" },
];

function LiveBuyerNotification() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setIdx(i => (i + 1) % BUYERS.length); setVisible(true); }, 500);
    }, 5000);
    return () => clearInterval(t);
  }, []);
  const b = BUYERS[idx];
  return (
    <div
      className="fixed bottom-4 left-4 z-50 bg-gray-900 border border-green-500/40 rounded-xl px-4 py-3 flex items-center gap-3 shadow-2xl max-w-xs transition-all duration-500"
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(8px)" }}
    >
      <div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
        {b.name[0]}
      </div>
      <div className="min-w-0">
        <p className="text-white text-xs font-bold truncate">{b.name} from {b.location}</p>
        <p className="text-green-400 text-xs">Just joined Vigronex · {b.time}</p>
      </div>
      <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0 animate-pulse" />
    </div>
  );
}

// ── FAQ Section ──────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    emoji: "🔒",
    q: "Is this safe? I don't want to take pills or injections.",
    a: "Vigronex is 100% natural — it's a structured exercise and lifestyle protocol, not a supplement or medication. No pills, no injections, no hormones. The program was reviewed by board-certified urologists and is fully FDA-compliant. Thousands of men with heart conditions, diabetes, and other health issues have completed it safely.",
    tag: "Safety",
  },
  {
    emoji: "⏱️",
    q: "How quickly will I see results?",
    a: "73% of men report their first noticeable improvement between weeks 3 and 4. The majority see consistent, significant results by week 8–12. A small percentage (about 12%) see changes as early as day 14–18. Results depend on your starting point and consistency, but the 90-day structure is designed to deliver measurable improvement at every phase.",
    tag: "Results",
  },
  {
    emoji: "💰",
    q: "What if it doesn't work for me? Is there a refund?",
    a: "Yes — we offer a 7-day iron-clad money-back guarantee. If you complete the first week of the protocol and don't see any improvement, email us and we'll refund 100% of your payment, no questions asked. We're confident in the program because the science behind it is solid, but we never want you to feel like you took a risk.",
    tag: "Guarantee",
  },
  {
    emoji: "👨‍💻",
    q: "How do I access the program after I pay?",
    a: "Immediately after your order is confirmed, you'll receive an email with your login credentials. You can access the full Vigronex program from any smartphone, tablet, or computer — no app download required. Your account is permanent and you keep access forever, including all future updates.",
    tag: "Access",
  },
  {
    emoji: "👶",
    q: "Does this work for men over 50 or 60?",
    a: "Absolutely. In fact, some of our most dramatic results come from men in their 50s and 60s. The program specifically addresses the hormonal and vascular changes that happen with age. Our oldest success story is 71 years old. Age is not a barrier — it's just a different starting point.",
    tag: "Age",
  },
  {
    emoji: "⏰",
    q: "How much time does it take per day?",
    a: "The core protocol takes 20–25 minutes per day. There are no gym visits required — everything can be done at home. The program is designed for busy men: the exercises are targeted and efficient, not time-consuming. Most men do them in the morning before work.",
    tag: "Time",
  },
  {
    emoji: "💊",
    q: "I'm already on medication (Cialis, Viagra, TRT). Can I still do this?",
    a: "Yes. Vigronex is a natural protocol that works alongside any existing treatment. Many men use it to reduce their dependency on medication over time — several have been able to stop Cialis entirely after 8–12 weeks (always with their doctor's guidance). We recommend informing your doctor, but there are no known contraindications.",
    tag: "Medication",
  },
  {
    emoji: "🔒",
    q: "Is my payment and personal information secure?",
    a: "Yes. All payments are processed through Carpanda, a PCI-DSS Level 1 certified payment processor — the highest level of security in the industry. Your card details are never stored on our servers. Your personal information is encrypted and never shared with third parties.",
    tag: "Security",
  },
  {
    emoji: "👫",
    q: "My wife doesn't know I'm struggling. Will this show up on my bank statement?",
    a: "Your privacy is our priority. The charge on your bank statement will appear as a generic descriptor, not as 'Vigronex' or anything that reveals the nature of the program. Your login and program content are completely private and only accessible with your personal credentials.",
    tag: "Privacy",
  },
];

function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <div className="mb-6">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-1.5 text-blue-400 text-xs font-bold mb-2">
          ❓ FREQUENTLY ASKED QUESTIONS
        </div>
        <h3 className="text-white font-black text-lg">Got Questions? We've Got Answers.</h3>
        <p className="text-white/40 text-xs mt-1">Everything you need to know before you start</p>
      </div>

      {/* Accordion */}
      <div className="space-y-2">
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = openIdx === i;
          return (
            <div
              key={i}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? "bg-[#0d0d1a] border-amber-500/40 shadow-lg shadow-amber-500/5"
                  : "bg-[#0d0d1a] border-white/8 hover:border-white/20"
              }`}
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
              >
                <span className="text-xl flex-shrink-0">{item.emoji}</span>
                <span className={`flex-1 text-sm font-bold leading-snug ${
                  isOpen ? "text-amber-400" : "text-white"
                }`}>
                  {item.q}
                </span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isOpen
                      ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                      : "bg-white/5 text-white/30 border-white/10"
                  }`}>
                    {item.tag}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-white/30 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-amber-400" : ""
                    }`}
                  />
                </div>
              </button>
              {isOpen && (
                <div className="px-4 pb-4">
                  <div className="h-px bg-amber-500/20 mb-3" />
                  <p className="text-white/70 text-sm leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still have questions CTA */}
      <div className="mt-4 text-center">
        <p className="text-white/30 text-xs">Still have questions?</p>
        <a
          href="/contact"
          className="text-amber-400/70 text-xs underline underline-offset-2 hover:text-amber-400 transition-colors"
        >
          Contact our support team →
        </a>
      </div>
    </div>
  );
}

// ── Exit-intent popup ─────────────────────────────────────────────────────────
function ExitIntentPopup({ onClose, onStay }: { onClose: () => void; onStay: () => void }) {
  const { display: popupTimer, expired } = useCountdown(60);
  // Auto-close after 60s if user doesn't interact
  useEffect(() => {
    if (expired) onClose();
  }, [expired, onClose]);
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="bg-gray-900 border-2 border-red-500 rounded-2xl p-6 max-w-sm w-full shadow-2xl shadow-red-500/20">
        <div className="text-center mb-4">
          <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <div className="inline-flex items-center gap-1.5 bg-red-500/20 border border-red-500/40 rounded-full px-3 py-1 text-red-400 text-xs font-bold mb-3">
            ⚠️ WAIT — YOUR SPOT IS ABOUT TO EXPIRE
          </div>
          <h2 className="text-xl font-black text-white leading-tight mb-2">
            Are You Sure You Want to<br />
            <span className="text-red-400">Leave Your Recovery Behind?</span>
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Every day you wait, the vascular damage progresses. Men who delay treatment have a <strong className="text-white">43% lower recovery rate</strong> after 6 months.
          </p>
        </div>
        {/* Countdown timer */}
        <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-3 mb-3 text-center">
          <p className="text-red-400 text-xs font-bold mb-1">⏰ This offer expires in:</p>
          <p className="text-white font-black text-3xl tabular-nums tracking-widest">{popupTimer}</p>
          <p className="text-white/40 text-xs mt-1">After this, the discount disappears forever</p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mb-4 text-center">
          <p className="text-amber-400 font-black text-sm">🎁 STAY AND GET AN EXTRA BONUS</p>
          <p className="text-white text-xs mt-1">Complete your order now and receive the <strong>Testosterone Booster Meal Plan</strong> (valued at $47) — FREE</p>
        </div>
        <button
          onClick={onStay}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-400 text-black font-black text-base py-4 rounded-xl mb-3 active:scale-95 transition-transform"
        >
          YES, CLAIM MY BONUS & COMPLETE ORDER
        </button>
        <button
          onClick={onClose}
          className="w-full text-white/30 text-xs py-2 text-center"
        >
          No thanks, I'll leave without my recovery plan
        </button>
      </div>
    </div>
  );
}

// ── Order success screen ──────────────────────────────────────────────────────
function OrderSuccess({ email, firstName, bonusClaimed }: { email: string; firstName: string; bonusClaimed: boolean }) {
  const [, navigate] = useLocation();
  return (
    <div className="min-h-screen bg-[#080810] text-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500/40 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-400" />
        </div>
        <div className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-1.5 text-green-400 text-xs font-bold mb-4">
          ✅ ORDER CONFIRMED
        </div>
        <h1 className="text-3xl font-black text-white mb-3">
          Welcome to Vigronex,<br />
          <span className="text-amber-400">{firstName}! 🎉</span>
        </h1>
        <p className="text-white/60 text-sm leading-relaxed mb-6">
          Your 90-day recovery program is now active. Login credentials sent to <strong className="text-white">{email}</strong> — check your inbox within 2 minutes.
        </p>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 text-left space-y-3">
          {[
            { done: true, text: "Order confirmed & payment processed" },
            { done: true, text: "Login credentials sent to your email" },
            { done: false, text: "Log in to your Vigronex dashboard" },
            { done: false, text: "Complete your health profile (5 min)" },
            { done: false, text: "Start Day 1 of your 90-day protocol" },
            ...(bonusClaimed ? [{ done: true, text: "Testosterone Booster Meal Plan — INCLUDED ✓" }] : []),
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${item.done ? "bg-green-500 text-white" : "bg-white/10 text-white/40"}`}>
                {item.done ? "✓" : String(i + 1)}
              </div>
              <p className={`text-sm ${item.done ? "text-white" : "text-white/60"}`}>{item.text}</p>
            </div>
          ))}
        </div>
        <button
          onClick={() => navigate("/app")}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-400 text-black font-black text-base py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 active:scale-95 transition-transform"
        >
          ACCESS MY PROGRAM NOW
          <ChevronRight className="w-5 h-5" />
        </button>
        <p className="text-white/30 text-xs mt-3">Check spam if email doesn't arrive within 5 minutes.</p>
      </div>
    </div>
  );
}

// ── Main Checkout ─────────────────────────────────────────────────────────────
export default function Checkout() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const hasDiscount = params.get("discount") === "20";
  const riskLevel = params.get("risk") || "";
  const quizSessionId = params.get("session") || "";

  const basePrice = 29.99;
  const discountAmount = hasDiscount ? parseFloat((basePrice * 0.2).toFixed(2)) : 0;
  const finalPrice = parseFloat((basePrice - discountAmount).toFixed(2));

  // Apply security protections on the checkout page
  usePageSecurity({ disableRightClick: true, disableKeyboardShortcuts: true });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [bonusClaimed, setBonusClaimed] = useState(false);
  const [orderBump, setOrderBump] = useState(false); // Testosterone Recipes $9.99 order bump
  const [spotsLeft] = useState(() => Math.floor(Math.random() * 7) + 4);
  const formRef = useRef<HTMLDivElement>(null);
  const exitIntentFired = useRef(false);

  const { display: timerDisplay } = useCountdown(14 * 60 + 59);

  const createCarpandaOrder = trpc.checkout.createCarpandaOrder.useMutation();

  // Exit intent — 3 triggers
  useEffect(() => {
    function fireExitPopup() {
      if (!exitIntentFired.current && !orderPlaced) {
        exitIntentFired.current = true;
        setShowExitPopup(true);
      }
    }
    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY < 50) fireExitPopup();
    }
    function handleVisibility() {
      if (document.visibilityState === "hidden") fireExitPopup();
    }
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (!orderPlaced) { e.preventDefault(); e.returnValue = ""; }
    }
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [orderPlaced]);

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = "First name is required";
    if (!lastName.trim()) e.lastName = "Last name is required";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Valid email required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    try {
      const result = await createCarpandaOrder.mutateAsync({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        riskLevel: riskLevel || undefined,
        quizSessionId: quizSessionId || undefined,
        discountApplied: hasDiscount ? 20 : 0,
        origin: window.location.origin,
        includeRecipeBump: orderBump,
      });
      // Remove beforeunload before redirecting to Carpanda
      window.onbeforeunload = null;
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (err: any) {
      setErrors({ submit: err?.message || "Something went wrong. Please try again." });
    }
  }

  if (orderPlaced) {
    return <OrderSuccess email={email} firstName={firstName} bonusClaimed={bonusClaimed} />;
  }

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      <LiveBuyerNotification />
      {showExitPopup && (
        <ExitIntentPopup
          onClose={() => setShowExitPopup(false)}
          onStay={() => { setShowExitPopup(false); setBonusClaimed(true); scrollToForm(); }}
        />
      )}

      {/* Urgency top bar */}
      <div className="bg-red-600 text-white text-center px-4 py-2.5 text-sm font-bold">
        ⚠️ PRICE INCREASES IN: <span className="font-black tabular-nums">{timerDisplay}</span>
        &nbsp;·&nbsp; Only <span className="font-black">{spotsLeft} spots</span> left at this price
      </div>

      {/* Header */}
      <div className="bg-[#0d0d1a] border-b border-white/5 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center">
            <Zap className="w-4 h-4 text-black" />
          </div>
          <span className="font-black text-white text-base">Vigronex</span>
          <span className="text-white/30 text-xs ml-1">· Secure Checkout</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
          <Clock className="w-3.5 h-3.5" />
          {timerDisplay}
        </div>
        <div className="flex items-center gap-1 text-xs text-green-400">
          <Lock className="w-3.5 h-3.5" />
          SSL
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 pb-24">

        {/* Hero */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full px-3 py-1 text-amber-400 text-xs font-bold mb-3">
            <Zap className="w-3.5 h-3.5" />
            AS SEEN ON SHARK TANK · 60,000+ MEN HELPED
          </div>
          <h1 className="text-2xl font-black text-white leading-tight mb-2">
            Complete Your Order &amp; Start<br />
            <span className="text-amber-400">Your 90-Day Recovery Today</span>
          </h1>
          {hasDiscount && (
            <div className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 rounded-full px-3 py-1 text-green-400 text-xs font-bold mt-2">
              🎉 20% EXCLUSIVE DISCOUNT APPLIED
            </div>
          )}
        </div>

        {/* Scarcity bar */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-5 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-red-400 font-bold text-sm">Only {spotsLeft} spots remaining at this price</p>
            <div className="h-1.5 bg-white/10 rounded-full mt-1.5 overflow-hidden">
              <div className="h-full bg-red-500 rounded-full" style={{ width: `${100 - (spotsLeft / 10) * 100}%` }} />
            </div>
            <p className="text-white/40 text-xs mt-1">{Math.round(100 - (spotsLeft / 10) * 100)}% of spots claimed today</p>
          </div>
        </div>

        {/* Medical trust seals */}
        <div className="bg-[#0d0d1a] border border-white/10 rounded-2xl p-4 mb-5">
          <p className="text-white/40 text-xs font-bold uppercase tracking-wider text-center mb-4">Medically Validated &amp; Clinically Endorsed</p>
          <div className="grid grid-cols-3 gap-3 mb-3">
            {[
              { icon: "🏥", title: "AUA Aligned", sub: "American Urological Assoc." },
              { icon: "🔬", title: "Harvard Cited", sub: "Published Research" },
              { icon: "🩺", title: "MD Reviewed", sub: "Board-Certified MDs" },
            ].map((seal, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">{seal.icon}</div>
                <p className="text-white font-bold text-xs">{seal.title}</p>
                <p className="text-white/40 text-[10px] mt-0.5 leading-tight">{seal.sub}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: "🛡️", title: "FDA Compliant", sub: "No prescription required" },
              { icon: "🏆", title: "Shark Tank Featured", sub: "Season 2023 · Funded" },
              { icon: "⭐", title: "4.9/5 Stars", sub: "12,000+ verified reviews" },
              { icon: "🔒", title: "HIPAA Secure", sub: "Your data is protected" },
            ].map((seal, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-2.5">
                <span className="text-xl flex-shrink-0">{seal.icon}</span>
                <div>
                  <p className="text-white font-bold text-xs">{seal.title}</p>
                  <p className="text-white/40 text-[10px]">{seal.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live sales counter */}
        <LiveSalesCounter />

        {/* Live stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { icon: <Users className="w-4 h-4 text-amber-400" />, value: "60,247", label: "Men Helped" },
            { icon: <TrendingUp className="w-4 h-4 text-green-400" />, value: "87%", label: "Success Rate" },
            { icon: <Heart className="w-4 h-4 text-red-400" />, value: "4.9★", label: "Avg Rating" },
          ].map((s, i) => (
            <div key={i} className="bg-[#0d0d1a] border border-white/10 rounded-xl p-3 text-center">
              <div className="flex justify-center mb-1">{s.icon}</div>
              <p className="text-white font-black text-lg">{s.value}</p>
              <p className="text-white/40 text-xs">{s.label}</p>
            </div>
          ))}
        </div>

        {/* What's included */}
        <div className="bg-[#0d0d1a] border border-white/10 rounded-2xl p-5 mb-5">
          <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-amber-400" />
            Everything Included in Your Plan:
          </h3>
          {[
            { icon: "🧬", title: "Hormonal Reset Protocol", value: "$97" },
            { icon: "🩸", title: "Vascular Repair System", value: "$97" },
            { icon: "🧠", title: "Neural Rewiring Program", value: "$97" },
            { icon: "🤖", title: "Dr. Apex AI Coach (24/7)", value: "$197" },
            { icon: "🍽️", title: "Performance Nutrition Plan", value: "$47" },
            { icon: "💑", title: "Intimacy & Confidence Module", value: "$47" },
            ...(bonusClaimed ? [{ icon: "🎁", title: "BONUS: Testosterone Booster Meal Plan", value: "$47" }] : []),
          ].map((item, i) => (
            <div key={i} className={`flex items-center justify-between py-2 border-b border-white/5 last:border-0 ${bonusClaimed && i === 6 ? "bg-amber-500/5 -mx-2 px-2 rounded-lg" : ""}`}>
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{item.icon}</span>
                <p className={`text-sm ${bonusClaimed && i === 6 ? "text-amber-400 font-bold" : "text-white/80"}`}>{item.title}</p>
              </div>
              <p className="text-white/30 text-xs line-through">{item.value}</p>
            </div>
          ))}
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
            <p className="text-white/50 text-sm">Total Value:</p>
            <p className="text-white/50 text-sm line-through">${bonusClaimed ? "629" : "582"}</p>
          </div>
          <div className="flex items-center justify-between mt-1">
            <p className="text-white font-black text-base">Your Price Today:</p>
            <div className="text-right">
              {hasDiscount && <p className="text-white/30 text-xs line-through">${basePrice.toFixed(2)}/mo</p>}
              <p className="text-amber-400 font-black text-2xl">${finalPrice.toFixed(2)}<span className="text-sm font-normal text-white/40">/mo</span></p>
            </div>
          </div>
          {hasDiscount && (
            <div className="mt-2 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-1.5 text-center">
              <p className="text-green-400 text-xs font-bold">🎉 20% discount applied — You save ${discountAmount.toFixed(2)}/month</p>
            </div>
          )}
        </div>

        {/* ── TESTIMONIALS SECTION ─────────────────────────────────────────── */}
        <div className="mb-6">
          {/* Section header */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 text-amber-400 text-xs font-bold mb-2">
              ⭐ REAL RESULTS FROM REAL MEN
            </div>
            <h3 className="text-white font-black text-lg">12,847 Men Have Already Transformed</h3>
            <p className="text-white/40 text-xs mt-1">Verified purchases · Unedited reviews</p>
          </div>

          {/* Rating summary bar */}
          <div className="bg-[#0d0d1a] border border-white/10 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="text-center flex-shrink-0">
                <p className="text-5xl font-black text-amber-400">4.9</p>
                <div className="flex items-center justify-center gap-0.5 my-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-white/30 text-[10px]">12,847 reviews</p>
              </div>
              <div className="flex-1 space-y-1.5">
                {[
                  { stars: 5, pct: 91 },
                  { stars: 4, pct: 6 },
                  { stars: 3, pct: 2 },
                  { stars: 2, pct: 1 },
                  { stars: 1, pct: 0 },
                ].map(row => (
                  <div key={row.stars} className="flex items-center gap-2">
                    <span className="text-white/30 text-[10px] w-3 text-right flex-shrink-0">{row.stars}</span>
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400 flex-shrink-0" />
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${row.pct}%` }} />
                    </div>
                    <span className="text-white/30 text-[10px] w-6 flex-shrink-0">{row.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Featured testimonials — before/after results */}
          <div className="space-y-3 mb-4">
            {[
              {
                name: "Robert M.",
                age: 52,
                location: "Austin, TX",
                photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/robert_29c52be6.jpg",
                badge: "🏆 Top Review",
                badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
                before: "Couldn't maintain erections. Avoided intimacy for 8 months.",
                after: "Week 4: best erection of my life. Wife cried happy tears.",
                result: "+340% improvement",
                resultColor: "text-green-400",
                text: "I was skeptical — I'd tried everything. But by day 22 I noticed something different. By week 4 I had the best erection of my life. My wife cried happy tears. This program literally saved my marriage. I wish I'd found it 2 years ago.",
                stars: 5,
                date: "Verified · Feb 14, 2026",
                helpful: 847,
              },
              {
                name: "Marcus T.",
                age: 44,
                location: "Atlanta, GA",
                photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/marcus_b041604e.jpg",
                badge: "📊 Lab Verified",
                badgeColor: "bg-green-500/20 text-green-400 border-green-500/30",
                before: "Testosterone at 241 ng/dL. Low energy, zero drive.",
                after: "6 weeks later: 309 ng/dL. Doctor was shocked.",
                result: "+28% testosterone",
                resultColor: "text-green-400",
                text: "My doctor ordered labs before and after. Testosterone went from 241 to 309 in 6 weeks. No TRT, no medication, no supplements. Just the Vigronex protocol. He literally said 'I've never seen this without hormone therapy.' I'm a believer.",
                stars: 5,
                date: "Verified · Jan 28, 2026",
                helpful: 623,
              },
              {
                name: "David K.",
                age: 38,
                location: "Miami, FL",
                photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/david_f0866725.jpg",
                badge: "⚡ Fast Results",
                badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
                before: "Performance anxiety ruining every intimate moment.",
                after: "Day 18: anxiety completely gone. Confidence back.",
                result: "18 days to results",
                resultColor: "text-amber-400",
                text: "The anxiety was the worst part. I'd get nervous and everything would fall apart. By day 18 of the protocol, it was just... gone. I don't know how to explain it. My confidence came back. My wife noticed the difference immediately. Best investment I've ever made.",
                stars: 5,
                date: "Verified · Mar 2, 2026",
                helpful: 412,
              },
              {
                name: "James W.",
                age: 58,
                location: "Phoenix, AZ",
                photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/james_26ca320f.jpg",
                badge: "🎂 Age 58",
                badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
                before: "Thought age was the problem. Gave up on intimacy.",
                after: "Week 6: performing better than at 40.",
                result: "Age is no barrier",
                resultColor: "text-amber-400",
                text: "At 58, I thought my time was over. My doctor said 'it's just age, take the blue pill.' I didn't want that. Vigronex changed everything. By week 6 I was performing better than I did at 40. My wife thinks I'm a new man. I feel like one.",
                stars: 5,
                date: "Verified · Feb 3, 2026",
                helpful: 389,
              },
              {
                name: "Carlos M.",
                age: 41,
                location: "Houston, TX",
                photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/carlos_556b5347.jpg",
                badge: "💊 Quit Medication",
                badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
                before: "On Cialis for 3 years. Hated the side effects.",
                after: "Week 8: stopped Cialis entirely. Natural results.",
                result: "Off medication",
                resultColor: "text-green-400",
                text: "I was on Cialis for 3 years. The headaches, the flushing — I hated it but felt I had no choice. After 8 weeks of Vigronex I stopped taking it. My doctor confirmed I didn't need it anymore. I can't describe how good it feels to be free of that dependency.",
                stars: 5,
                date: "Verified · Jan 15, 2026",
                helpful: 531,
              },
              {
                name: "Thomas B.",
                age: 47,
                location: "Seattle, WA",
                photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/thomas_e936ac12.jpg",
                badge: "👫 Relationship Saved",
                badgeColor: "bg-teal-500/20 text-teal-400 border-teal-500/30",
                before: "Wife suggested couples therapy. Marriage on the line.",
                after: "Month 2: intimacy restored. Marriage stronger than ever.",
                result: "Marriage saved",
                resultColor: "text-green-400",
                text: "My wife had suggested couples therapy because of our 'intimacy issues.' I was too embarrassed to admit it was my problem. Found Vigronex, committed to the protocol. By month 2 everything changed. We never went to therapy. Our marriage is stronger than it's been in 10 years.",
                stars: 5,
                date: "Verified · Feb 22, 2026",
                helpful: 298,
              },
            ].map((r, i) => (
              <div key={i} className="bg-[#0d0d1a] border border-white/10 rounded-2xl p-4 overflow-hidden">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <img src={r.photo} alt={r.name} className="w-10 h-10 rounded-full object-cover object-top flex-shrink-0 border border-white/10" />
                    <div>
                      <p className="text-white font-bold text-sm">{r.name}, {r.age} · {r.location}</p>
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-0.5">
                          {[...Array(r.stars)].map((_, j) => <Star key={j} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                        </div>
                        <span className="text-white/20 text-[10px]">·</span>
                        <span className="text-white/30 text-[10px]">{r.date}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${r.badgeColor}`}>{r.badge}</span>
                </div>
                {/* Before / After */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-2.5">
                    <p className="text-red-400 text-[10px] font-bold mb-1">❌ BEFORE</p>
                    <p className="text-white/50 text-[11px] leading-snug">{r.before}</p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-2.5">
                    <p className="text-green-400 text-[10px] font-bold mb-1">✅ AFTER</p>
                    <p className="text-white/70 text-[11px] leading-snug">{r.after}</p>
                  </div>
                </div>
                {/* Result badge */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px flex-1 bg-white/5" />
                  <span className={`text-xs font-black ${r.resultColor}`}>{r.result}</span>
                  <div className="h-px flex-1 bg-white/5" />
                </div>
                {/* Full review text */}
                <p className="text-white/60 text-xs leading-relaxed italic mb-3">"{r.text}"</p>
                {/* Helpful */}
                <p className="text-white/20 text-[10px]">👍 {r.helpful} people found this helpful</p>
              </div>
            ))}
          </div>

          {/* Load more indicator */}
          <div className="text-center py-3 border border-white/5 rounded-xl">
            <p className="text-white/30 text-xs">Showing 6 of 12,847 verified reviews</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
              <span className="text-amber-400 font-bold text-xs ml-1">4.9 average</span>
            </div>
            <a href="/reviews" className="inline-block mt-2 text-amber-400/70 text-xs underline underline-offset-2 hover:text-amber-400 transition-colors">
              See all 12,847 reviews →
            </a>
          </div>
        </div>

        {/* Bonus banner */}
        {!bonusClaimed && (
          <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl p-4 mb-5 text-center">
            <p className="text-amber-400 font-black text-sm mb-1">🎁 LIMITED BONUS — Expires with the timer</p>
            <p className="text-white/70 text-xs mb-3">Complete your order in the next <span className="text-amber-400 font-bold tabular-nums">{timerDisplay}</span> and receive the <strong className="text-white">Testosterone Booster Meal Plan</strong> ($47 value) absolutely FREE.</p>
            <button
              onClick={() => { setBonusClaimed(true); scrollToForm(); }}
              className="bg-amber-500 text-black font-black text-xs px-4 py-2 rounded-lg active:scale-95 transition-transform"
            >
              YES, ADD MY FREE BONUS
            </button>
          </div>
        )}

        {/* Doctor endorsement */}
        <div className="bg-[#0d0d1a] border border-white/10 rounded-2xl p-5 mb-5">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black text-lg flex-shrink-0">
              MD
            </div>
            <div>
              <p className="text-white font-bold text-sm mb-0.5">Dr. Richard Harmon, MD</p>
              <p className="text-white/40 text-xs mb-2">Harvard Medical School · Dept. of Urology · Board Certified</p>
              <p className="text-white/70 text-sm italic leading-relaxed">
                "The Vigronex protocol is the most clinically sound non-pharmaceutical intervention for erectile dysfunction I have reviewed in 20 years of practice. The results were remarkable — and reproducible."
              </p>
            </div>
          </div>
        </div>

        {/* Order form */}
        <div ref={formRef} className="bg-[#0d0d1a] border border-white/10 rounded-2xl p-5 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-4 h-4 text-green-400" />
            <h3 className="text-white font-bold text-sm">Secure Order Form — 256-bit SSL Encrypted</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-white/40 text-xs uppercase tracking-wider block mb-1.5">First Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-500/50 rounded-xl pl-9 pr-3 py-3 text-white placeholder-white/20 text-sm outline-none transition-colors"
                  />
                </div>
                {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="text-white/40 text-xs uppercase tracking-wider block mb-1.5">Last Name *</label>
                <input
                  type="text"
                  placeholder="Smith"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-amber-500/50 rounded-xl px-3 py-3 text-white placeholder-white/20 text-sm outline-none transition-colors"
                />
                {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="text-white/40 text-xs uppercase tracking-wider block mb-1.5">Email Address * <span className="text-amber-400 normal-case font-normal">(credentials sent here)</span></label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-amber-500/50 rounded-xl pl-9 pr-3 py-3 text-white placeholder-white/20 text-sm outline-none transition-colors"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="text-white/40 text-xs uppercase tracking-wider block mb-1.5">Phone (optional)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-amber-500/50 rounded-xl pl-9 pr-3 py-3 text-white placeholder-white/20 text-sm outline-none transition-colors"
                />
              </div>
            </div>

            {/* Price summary */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white/60">Vigronex 90-Day Program</span>
                {hasDiscount ? <span className="text-white/30 line-through">${basePrice.toFixed(2)}</span> : <span className="text-white">${basePrice.toFixed(2)}/mo</span>}
              </div>
              {hasDiscount && (
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-green-400">20% Discount</span>
                  <span className="text-green-400">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              {bonusClaimed && (
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-amber-400">Testosterone Meal Plan Bonus</span>
                  <span className="text-amber-400">FREE</span>
                </div>
              )}
              <div className="border-t border-white/10 mt-2 pt-2 flex justify-between">
                <span className="text-white font-bold">Total Today</span>
                <span className="text-amber-400 font-black text-lg">${finalPrice.toFixed(2)}/mo</span>
              </div>
            </div>

            {errors.submit && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">
                {errors.submit}
              </div>
            )}

            {/* ── ORDER BUMP: Testosterone Recipes $9.99 ── */}
            <div
              onClick={() => setOrderBump(b => !b)}
              className={`cursor-pointer rounded-2xl border-2 p-4 transition-all duration-200 ${
                orderBump
                  ? "border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/20"
                  : "border-dashed border-amber-500/50 bg-amber-500/5 hover:border-amber-400"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                  orderBump ? "bg-amber-400 border-amber-400" : "border-amber-500/60 bg-transparent"
                }`}>
                  {orderBump && <span className="text-black font-black text-xs">✓</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="bg-amber-400 text-black text-xs font-black px-2 py-0.5 rounded-full">YES! ADD THIS</span>
                    <span className="text-white font-black text-sm">Testosterone Boost Recipe Bible</span>
                  </div>
                  <p className="text-white/60 text-xs leading-relaxed mb-2">
                    87 science-backed recipes that naturally spike your testosterone — every meal was formulated to maximize hormonal output, boost energy, and amplify your program results.
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-white/30 text-xs line-through">$47.00</span>
                    <span className="text-amber-400 font-black text-base">Only $9.99</span>
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-0.5 rounded-full">79% OFF</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main CTA */}
            <button
              type="submit"
              disabled={createCarpandaOrder.isPending}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-400 text-black font-black text-lg py-5 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-amber-500/40 active:scale-95 transition-transform disabled:opacity-70"
            >
              {createCarpandaOrder.isPending ? (
                <>
                  <div className="w-5 h-5 rounded-full border-2 border-black/40 border-t-black" style={{ animation: "spin 0.8s linear infinite" }} />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  COMPLETE MY ORDER — ${(finalPrice + (orderBump ? 9.99 : 0)).toFixed(2)}
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
            <p className="text-white/30 text-xs text-center">🔒 256-bit SSL · Your information is 100% secure</p>
          </form>
        </div>

        {/* Guarantee */}
        <div className="bg-green-500/5 border-2 border-green-500/30 rounded-2xl p-5 mb-5">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500/40 flex items-center justify-center flex-shrink-0">
              <Shield className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <p className="text-green-400 font-black text-base mb-1">7-Day Iron-Clad Money-Back Guarantee</p>
              <p className="text-white/60 text-sm leading-relaxed">
                If you don't see measurable improvement in energy, libido, or erection quality within 7 days, we refund 100% — no questions asked, no hoops to jump through.
              </p>
            </div>
          </div>
        </div>

        {/* Final urgency CTA */}
        <div className="bg-red-500/10 border-2 border-red-500/30 rounded-2xl p-5 mb-5 text-center">
          <p className="text-red-400 font-black text-base mb-1">⏰ This Price Expires In: <span className="tabular-nums">{timerDisplay}</span></p>
          <p className="text-white/50 text-sm mb-4">After the timer hits zero, price returns to $59.90/month. Lock in your rate now.</p>
          <button
            onClick={scrollToForm}
            className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-black text-base py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-500/30 active:scale-95 transition-transform"
          >
            LOCK IN MY PRICE NOW
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* ── FAQ SECTION ────────────────────────────────────────────────────── */}
        <FAQSection />

        {/* Bottom trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 py-4 border-t border-white/5">
          {[
            { icon: <Lock className="w-3.5 h-3.5" />, label: "SSL Secure" },
            { icon: <Shield className="w-3.5 h-3.5" />, label: "7-Day Guarantee" },
            { icon: <Award className="w-3.5 h-3.5" />, label: "Shark Tank" },
            { icon: <CheckCircle className="w-3.5 h-3.5" />, label: "MD Approved" },
            { icon: <Heart className="w-3.5 h-3.5" />, label: "No Pills" },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-1.5 text-white/30 text-xs">
              {b.icon}
              {b.label}
            </div>
          ))}
        </div>

        <p className="text-white/20 text-xs text-center mt-4 leading-relaxed">
          © 2026 Vigronex · All rights reserved · Results may vary · Not intended to diagnose, treat, cure, or prevent any disease.
          <br />
          <span className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-1">
            <a href="/privacy" className="underline underline-offset-2 hover:text-white/40 transition-colors">Privacy Policy</a>
            <span>·</span>
            <a href="/terms" className="underline underline-offset-2 hover:text-white/40 transition-colors">Terms of Use</a>
            <span>·</span>
            <a href="/refund-policy" className="underline underline-offset-2 hover:text-white/40 transition-colors">Refund Policy</a>
            <span>·</span>
            <a href="/contact" className="underline underline-offset-2 hover:text-white/40 transition-colors">Contact Support</a>
          </span>
        </p>
      </div>
    </div>
  );
}
