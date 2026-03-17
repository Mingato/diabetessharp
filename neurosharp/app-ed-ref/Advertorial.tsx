import { useEffect, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { ChevronRight, Shield, Star, CheckCircle, AlertTriangle, Clock, Users, TrendingUp, Heart, Zap, Award, Menu, Search, Play, Headphones } from "lucide-react";

// ── Image CDN URLs ───────────────────────────────────────────────────────────────
const IMG_SHARKTANK = "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/advertorial_sharktank-JKQnXkkMWGxU8V7jFTdTtR.png";
const IMG_BEFORE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/advertorial_before-brNaa8KJPjvW2kNMei9dFt.png";
const IMG_AFTER = "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/advertorial_after-EL9ZYfHtZZCXJwRoayB7nt.png";

// ── CNN Health Navbar ─────────────────────────────────────────────────────────
function CNNHealthNavbar() {
  return (
    <div className="font-sans">

      {/* Main nav */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center px-3 md:px-6 py-2 gap-3 md:gap-5 overflow-x-auto no-scrollbar">
          {/* Hamburger */}
          <button className="text-gray-800 flex-shrink-0"><Menu className="w-5 h-5" /></button>
          {/* CNN Health Logo */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <div className="bg-[#cc0000] text-white font-black px-2 py-0.5 rounded text-base tracking-tight" style={{ fontFamily: "CNN, Arial Black, sans-serif", letterSpacing: "-1px" }}>CNN</div>
            <span className="font-bold text-gray-900 text-base ml-1" style={{ fontFamily: "Arial, sans-serif" }}>Health</span>
          </div>
          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-semibold text-gray-800 flex-shrink-0">
            {["Life, But Better", "Fitness", "Food", "Sleep", "Mindfulness", "Relationships"].map(item => (
              <a key={item} href="#" onClick={e => e.preventDefault()} className="hover:text-[#cc0000] whitespace-nowrap transition-colors">{item}</a>
            ))}
          </nav>
          {/* Mobile nav links (scrollable) */}
          <nav className="flex md:hidden items-center gap-4 text-xs font-semibold text-gray-700 overflow-x-auto no-scrollbar">
            {["Life, But Better", "Fitness", "Food", "Sleep", "Mindfulness"].map(item => (
              <a key={item} href="#" onClick={e => e.preventDefault()} className="whitespace-nowrap">{item}</a>
            ))}
          </nav>
          {/* Right side actions */}
          <div className="ml-auto flex items-center gap-2 flex-shrink-0">
            <div className="hidden md:flex items-center gap-1 bg-[#cc0000] text-white text-xs font-bold px-2 py-0.5 rounded">
              <span className="bg-white text-[#cc0000] text-[9px] font-black px-1 rounded-sm mr-1">NEW</span>
              Watch
            </div>
            <button className="hidden md:flex items-center gap-1 text-xs font-semibold text-gray-700">
              <Headphones className="w-4 h-4" /> Listen
            </button>
            <button className="text-gray-700"><Search className="w-4 h-4" /></button>
            <button className="bg-[#cc0000] text-white text-xs font-bold px-3 py-1.5 rounded">Subscribe</button>
            <button className="hidden md:block text-xs font-semibold text-gray-700">Sign in</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Exit-Intent Popup ─────────────────────────────────────────────────────────
function ExitIntentPopup({ onStay, onLeave }: { onStay: () => void; onLeave: () => void }) {
  const [shake, setShake] = useState(false);
  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)" }}
      onClick={triggerShake}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
        style={shake ? { animation: "shake 0.5s ease" } : {}}
      >
        {/* Red urgency header */}
        <div className="bg-[#cc0000] px-6 py-4 text-center">
          <div className="text-4xl mb-2">🚨</div>
          <h2 className="text-white font-black text-xl leading-tight">WAIT — Don't Give Up On Yourself</h2>
        </div>
        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-gray-900 font-bold text-lg text-center mb-3 leading-snug">
            You're about to make the same mistake that 73% of men regret for the rest of their lives.
          </p>
          <p className="text-gray-600 text-sm text-center mb-4 leading-relaxed">
            Every day you wait, the damage gets harder to reverse. The Harvard researchers who discovered this solution say the window for <strong>full recovery</strong> closes faster than most men realize.
          </p>
          {/* Emotional stakes */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5">
            <p className="text-red-800 font-bold text-sm mb-2">If you close this page right now:</p>
            <ul className="text-sm text-red-700 space-y-1">
              <li>❌ Your partner will keep pretending everything is fine</li>
              <li>❌ The problem will get worse — not better — with age</li>
              <li>❌ You'll spend thousands on pills that don't fix the root cause</li>
              <li>❌ You'll spend another year avoiding intimacy</li>
            </ul>
          </div>
          {/* Stay CTA */}
          <button
            onClick={onStay}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-400 text-black font-black text-base py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-400/30 mb-3"
          >
            ✅ YES — I Want to Reclaim My Life
            <ChevronRight className="w-5 h-5" />
          </button>
          {/* Leave link */}
          <button
            onClick={onLeave}
            className="w-full text-center text-xs text-gray-400 underline py-1"
          >
            No thanks, I prefer to keep suffering in silence
          </button>
        </div>
      </div>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-8px); }
          30% { transform: translateX(8px); }
          45% { transform: translateX(-6px); }
          60% { transform: translateX(6px); }
          75% { transform: translateX(-4px); }
          90% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}

// ── Reading progress bar ───────────────────────────────────────────────────────
function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", update);
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-[100]">
      <div
        className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// ── Floating CTA bar (appears after scroll) ────────────────────────────────────
function FloatingCTA({ onClick }: { onClick: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!visible) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-red-600 shadow-2xl px-4 py-3 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-bold text-gray-800 truncate">⚡ Free Assessment — 60 seconds</p>
        <p className="text-xs text-gray-500">Discover your recovery stage now</p>
      </div>
      <button
        onClick={onClick}
        className="flex-shrink-0 bg-red-600 hover:bg-red-700 text-white font-black text-sm px-5 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors"
      >
        TAKE THE QUIZ
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── Social proof ticker ────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: "Michael R.", location: "Dallas, TX", text: "Week 4 and I feel 20 years younger. No pills, no side effects." },
  { name: "James W.", location: "Phoenix, AZ", text: "My wife thought I was cheating. I was just using Vigronex." },
  { name: "David K.", location: "Miami, FL", text: "After 3 years of ED, I finally have my confidence back." },
  { name: "Robert T.", location: "Chicago, IL", text: "Shark Tank was right. This is the real deal." },
  { name: "Carlos M.", location: "Houston, TX", text: "Threw away my Viagra prescription after week 6." },
];

function TestimonialTicker() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setIdx(i => (i + 1) % TESTIMONIALS.length); setVisible(true); }, 400);
    }, 4500);
    return () => clearInterval(interval);
  }, []);
  const t = TESTIMONIALS[idx];
  return (
    <div
      className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex items-start gap-3 transition-all duration-400"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
        {t.name[0]}
      </div>
      <div>
        <div className="flex items-center gap-1 mb-0.5">
          {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
          <span className="text-xs text-gray-500 ml-1">· {t.name}, {t.location}</span>
        </div>
        <p className="text-sm text-gray-700 italic">"{t.text}"</p>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Advertorial() {
  const [, navigate] = useLocation();
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [exitDismissed, setExitDismissed] = useState(false);

  function goToQuiz() {
    window.scrollTo(0, 0);
    navigate("/quiz");
  }

  // ── Exit-intent detection ─────────────────────────────────────────────────────────
  useEffect(() => {
    // Desktop: mouse leaves viewport toward top (back button / close tab)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5 && !exitDismissed) {
        setShowExitPopup(true);
      }
    };
    // Mobile: page visibility change (switching apps / home button)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && !exitDismissed) {
        setShowExitPopup(true);
      }
    };
    // beforeunload: catches close tab / navigate away
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!exitDismissed) {
        e.preventDefault();
        e.returnValue = "";
        setShowExitPopup(true);
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [exitDismissed]);

  const handleStay = useCallback(() => {
    setShowExitPopup(false);
    // Scroll to first CTA
    document.getElementById("main-cta")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const handleLeave = useCallback(() => {
    setExitDismissed(true);
    setShowExitPopup(false);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-serif">
      {/* Exit-intent popup */}
      {showExitPopup && <ExitIntentPopup onStay={handleStay} onLeave={handleLeave} />}

      <ReadingProgress />
      <FloatingCTA onClick={goToQuiz} />

      {/* ── CNN Health Navbar ── */}
      <CNNHealthNavbar />

      {/* ── Main article ── */}
      <div className="max-w-3xl mx-auto px-4 py-6 pb-24">

        {/* Category tag */}
        <div className="text-xs font-bold text-red-600 uppercase tracking-widest font-sans mb-3">
          EXCLUSIVE INVESTIGATION · SEXUAL HEALTH
        </div>

        {/* Headline */}
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4" style={{ fontFamily: "Georgia, serif" }}>
          Harvard Medical Team Discovers the Real Reason 30 Million American Men Can't Perform in Bed — And the Natural App That's Quietly Fixing It
        </h1>

        {/* Subheadline */}
        <p className="text-xl text-gray-600 leading-relaxed mb-5" style={{ fontFamily: "Georgia, serif" }}>
          After appearing on Shark Tank and helping over <strong>60,000 men</strong> reclaim their sexual health without dangerous pills, Vigronex is now available to the public — and the results are shocking the medical community.
        </p>

        {/* Byline */}
        <div className="flex items-center gap-3 border-y border-gray-200 py-3 mb-6 font-sans">
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-sm">JM</div>
          <div>
            <p className="text-sm font-semibold text-gray-800">By Jonathan Mills, Health Correspondent</p>
            <p className="text-xs text-gray-500">Published March 12, 2026 · 8 min read</p>
          </div>
          <div className="ml-auto flex items-center gap-1 text-xs text-gray-500">
            <Users className="w-3.5 h-3.5" />
            <span>47,291 reads</span>
          </div>
        </div>

        {/* Social proof ticker */}
        <div className="mb-6">
          <TestimonialTicker />
        </div>

        {/* ── Article body ── */}
        <div className="prose prose-lg max-w-none" style={{ fontFamily: "Georgia, serif" }}>

          {/* Opening hook */}
          <p className="text-lg leading-relaxed text-gray-800 mb-5">
            <strong>BOSTON, MA</strong> — It starts with a moment of silence. The kind that fills a bedroom and never quite leaves. A man lies next to his partner, unable to perform, and says nothing. He blames stress. He blames work. He blames age. But according to a groundbreaking study from Harvard Medical School, the real cause is something entirely different — and it's been hiding in plain sight for decades.
          </p>

          {/* CTA #1 — after opening hook */}
          <div id="main-cta" className="my-6 bg-amber-50 border-2 border-amber-400 rounded-2xl p-5 text-center font-sans">
            <p className="text-sm font-bold text-gray-700 mb-3">⚡ <span className="text-red-600">WARNING:</span> If you recognize these symptoms, your window for full recovery is still open — but not for long.</p>
            <button
              onClick={goToQuiz}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-400 text-black font-black text-base py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-400/30 active:scale-95 transition-transform"
            >
              TAKE MY FREE ASSESSMENT NOW
              <ChevronRight className="w-5 h-5" />
            </button>
            <p className="text-xs text-gray-500 mt-2">🔒 100% confidential · No credit card required · Results in 60 seconds</p>
          </div>

          {/* Pull quote */}
          <blockquote className="border-l-4 border-red-600 pl-5 my-6 bg-red-50 py-4 pr-4 rounded-r-lg">
            <p className="text-xl font-bold text-gray-800 italic leading-snug mb-2">
              "We are facing a silent epidemic. 30 million American men suffer from erectile dysfunction, and the pharmaceutical industry has been profiting from a solution that doesn't actually fix the problem — and in many cases, makes it worse."
            </p>
            <cite className="text-sm text-gray-600 not-italic font-sans">— Dr. Richard Harmon, Harvard Medical School, Department of Urology</cite>
          </blockquote>

          <p className="text-base leading-relaxed text-gray-700 mb-5">
            The numbers are staggering. According to the <em>Journal of Sexual Medicine</em>, erectile dysfunction affects <strong>1 in 3 American men over the age of 30</strong>. By age 40, that number climbs to nearly 40%. By 50, it's over half. And yet, the conversation remains taboo — men suffer in silence, relationships crumble, and the pharmaceutical industry collects billions selling pills that carry a terrifying secret.
          </p>

          {/* Stats box */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 my-6 font-sans">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">The ED Crisis By The Numbers</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "30M+", label: "American men with ED", color: "text-red-600" },
                { value: "52%", label: "Men over 40 affected", color: "text-red-600" },
                { value: "$5B+", label: "Spent on ED pills annually", color: "text-orange-600" },
                { value: "2,000+", label: "Deaths linked to ED pills per year", color: "text-red-700" },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* The pill danger section */}
          <h2 className="text-2xl font-black text-gray-900 mt-8 mb-4" style={{ fontFamily: "Georgia, serif" }}>
            The Deadly Secret the Pharmaceutical Industry Doesn't Want You to Know
          </h2>

          <p className="text-base leading-relaxed text-gray-700 mb-4">
            Every year, thousands of American men die from cardiac events directly linked to erectile dysfunction medications. Sildenafil (Viagra), tadalafil (Cialis), and their generic counterparts work by dramatically expanding blood vessels — a mechanism that, in men with undiagnosed heart conditions, can trigger fatal heart attacks.
          </p>

          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5 my-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-red-800 text-base mb-2 font-sans">FDA Warning: The Risks They Bury in Fine Print</h4>
                <ul className="space-y-1.5 text-sm text-red-700 font-sans">
                  {[
                    "Sudden cardiac death reported in men taking PDE5 inhibitors",
                    "Severe drop in blood pressure when combined with nitrates (common in heart patients)",
                    "Vision loss and hearing loss reported in thousands of cases",
                    "Priapism — painful, dangerous erections lasting 4+ hours requiring emergency surgery",
                    "Psychological dependency: men who take pills can no longer perform without them",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5 flex-shrink-0">✗</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <p className="text-base leading-relaxed text-gray-700 mb-5">
            "The pill model is fundamentally broken," says Dr. Harmon. "It treats the symptom — the inability to achieve an erection — while completely ignoring the three biological root causes that are actually driving the dysfunction. And every time a man takes a pill, those root causes get worse."
          </p>

          {/* CTA #2 — after pill danger section */}
          <div className="my-6 bg-gray-900 rounded-2xl p-5 text-center font-sans">
            <div className="inline-flex items-center gap-1.5 bg-red-500/20 border border-red-500/40 rounded-full px-3 py-1 text-red-400 text-xs font-bold mb-3">
              ⚠️ STOP RISKING YOUR HEART
            </div>
            <p className="text-white font-bold text-base mb-1">There's a safer, permanent solution.</p>
            <p className="text-gray-400 text-sm mb-4">Find out if you qualify for the natural Vigronex protocol — free in 60 seconds.</p>
            <button
              onClick={goToQuiz}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-400 text-black font-black text-base py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-400/30 active:scale-95 transition-transform"
            >
              CHECK MY ELIGIBILITY — FREE
              <ChevronRight className="w-5 h-5" />
            </button>
            <p className="text-gray-500 text-xs mt-2">No pills. No side effects. No credit card.</p>
          </div>

          {/* Harvard discovery section */}
          <h2 className="text-2xl font-black text-gray-900 mt-8 mb-4" style={{ fontFamily: "Georgia, serif" }}>
            The Harvard Discovery That Changed Everything
          </h2>

          <p className="text-base leading-relaxed text-gray-700 mb-4">
            In 2021, a team of researchers at Harvard Medical School's Department of Urology began a 3-year study on the biological mechanisms behind erectile dysfunction. What they found contradicted everything the pharmaceutical industry had been telling men for 25 years.
          </p>

          <p className="text-base leading-relaxed text-gray-700 mb-4">
            The root cause of erectile dysfunction, they discovered, is not a single problem — it's a <strong>triple biological cascade</strong> involving three interconnected systems that most doctors never test for:
          </p>

          <div className="space-y-4 my-6">
            {[
              {
                num: "01",
                title: "Endothelial Dysfunction",
                desc: "The inner lining of blood vessels loses its ability to produce nitric oxide — the molecule responsible for blood flow to the penis. This is caused by chronic inflammation, poor diet, and sedentary lifestyle. Pills temporarily force blood flow, but the underlying dysfunction worsens.",
                color: "bg-red-600",
              },
              {
                num: "02",
                title: "Testosterone Cascade Collapse",
                desc: "Modern life — chronic stress, poor sleep, environmental toxins, processed foods — systematically destroys the hormonal axis that produces testosterone. Low T doesn't just kill libido; it makes erections physiologically impossible regardless of arousal.",
                color: "bg-orange-600",
              },
              {
                num: "03",
                title: "Neural Anxiety Loop",
                desc: "After even one failed sexual encounter, the brain creates a fear-based neural pathway that triggers performance anxiety before every subsequent attempt. This loop releases cortisol, which directly suppresses erection function — creating a self-fulfilling cycle of failure.",
                color: "bg-amber-600",
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl font-sans">
                <div className={`w-10 h-10 rounded-lg ${item.color} text-white flex items-center justify-center font-black text-sm flex-shrink-0`}>
                  {item.num}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-base leading-relaxed text-gray-700 mb-5">
            "When we mapped these three systems," Dr. Harmon explains, "we realized that a structured, protocol-based intervention — combining specific physical exercises, targeted nutrition, and neural reprogramming — could reverse all three simultaneously. No pills required. No side effects. And the results were permanent."
          </p>

          {/* CTA #3 — after Harvard 3 root causes */}
          <div className="my-6 border-2 border-red-500 rounded-2xl overflow-hidden font-sans">
            <div className="bg-red-600 px-4 py-2 text-center">
              <p className="text-white font-black text-sm">🔬 HARVARD PROTOCOL NOW AVAILABLE AS A MOBILE APP</p>
            </div>
            <div className="bg-white p-5 text-center">
              <p className="text-gray-800 font-bold text-base mb-1">Do you have 1 or more of these 3 root causes?</p>
              <p className="text-gray-500 text-sm mb-4">Take the free 60-second assessment and find out which biological systems are failing you — and how to fix them.</p>
              <button
                onClick={goToQuiz}
                className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-black text-base py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-500/30 active:scale-95 transition-transform"
              >
                DISCOVER MY ROOT CAUSE — FREE
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="flex items-center justify-center gap-4 mt-3">
                {["✅ 60 seconds", "🔒 100% private", "💳 No card needed"].map((b, i) => (
                  <span key={i} className="text-xs text-gray-500">{b}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Vigronex introduction */}
          <h2 className="text-2xl font-black text-gray-900 mt-8 mb-4" style={{ fontFamily: "Georgia, serif" }}>
            Enter Vigronex: The App That Turned the Harvard Protocol Into a 90-Day Transformation
          </h2>

          <p className="text-base leading-relaxed text-gray-700 mb-4">
            In 2023, a team of Silicon Valley engineers partnered with the Harvard research group to turn their clinical protocol into a mobile application that any man could follow from his phone. The result was <strong>Vigronex</strong> — a comprehensive 90-day program that addresses all three root causes through a daily guided routine.
          </p>

          {/* Shark Tank image */}
          <figure className="my-6 rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
            <img
              src={IMG_SHARKTANK}
              alt="Vigronex founders presenting on Shark Tank"
              className="w-full object-contain"
              loading="lazy"
            />
            <figcaption className="bg-gray-50 border-t border-gray-200 px-4 py-2 text-xs text-gray-500 text-center font-sans">
              The Vigronex medical team presenting their 90-day clinical data to the Shark Tank investors. The room went silent when they revealed the results.
            </figcaption>
          </figure>

          {/* Shark Tank box */}
          <div className="bg-gray-900 text-white rounded-2xl p-6 my-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0">
                <Award className="w-7 h-7 text-black" />
              </div>
              <div>
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1 font-sans">AS SEEN ON SHARK TANK</div>
                <h3 className="text-lg font-black mb-2">The Sharks Were Stunned</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  When the Vigronex founders walked onto the Shark Tank stage, they brought something no one had ever seen before: a 90-day clinical data set showing <strong className="text-white">87% of users reported significant improvement in erection quality</strong> — without a single pill. The room went silent. Then the bidding war began.
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-amber-400 font-sans">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>"This is the most important men's health product I've ever seen." — Shark Tank Investor</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-base leading-relaxed text-gray-700 mb-4">
            Since its public launch, Vigronex has helped over <strong>60,000 American men</strong> reclaim their sexual health, their confidence, and their relationships. The app has been featured in Men's Health, Forbes, and WebMD, and maintains a 4.9-star rating across more than 12,000 verified reviews.
          </p>

          {/* What's inside */}
          <h2 className="text-2xl font-black text-gray-900 mt-8 mb-4" style={{ fontFamily: "Georgia, serif" }}>
            What's Inside the Vigronex 90-Day Protocol
          </h2>

          <div className="grid grid-cols-1 gap-3 my-5 font-sans">
            {[
              { icon: "🧬", title: "Hormonal Reset Protocol", desc: "Daily targeted exercises proven to increase testosterone by up to 34% in 21 days — without supplements or injections." },
              { icon: "🩸", title: "Vascular Repair System", desc: "A specific sequence of pelvic floor and cardiovascular exercises that restore nitric oxide production and blood flow to the penis." },
              { icon: "🧠", title: "Neural Rewiring Program", desc: "Evidence-based cognitive and breathwork techniques that permanently break the anxiety-dysfunction loop." },
              { icon: "🤖", title: "Dr. Apex AI Coach", desc: "A 24/7 AI physician trained on the Harvard protocol that answers your questions, tracks your progress, and adjusts your plan in real time." },
              { icon: "🍽️", title: "Performance Nutrition Plan", desc: "A complete dietary guide featuring the 12 foods scientifically proven to boost testosterone and endothelial function." },
              { icon: "💑", title: "Intimacy & Confidence Module", desc: "Guided exercises for rebuilding emotional and physical intimacy with your partner — because recovery is a relationship journey." },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl bg-white">
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                  <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5 ml-auto" />
              </div>
            ))}
          </div>

          {/* CTA #4 — after What's Inside section */}
          <div className="my-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 font-sans">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-black" />
              </div>
              <div>
                <p className="text-white font-black text-base">Everything above — included in your plan.</p>
                <p className="text-gray-400 text-xs">Find out which modules apply to your specific case.</p>
              </div>
            </div>
            <button
              onClick={goToQuiz}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-400 text-black font-black text-base py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-400/30 active:scale-95 transition-transform mb-2"
            >
              GET MY PERSONALIZED PROTOCOL — FREE
              <ChevronRight className="w-5 h-5" />
            </button>
            <p className="text-gray-500 text-xs text-center">Join 60,000+ men who already started their recovery</p>
          </div>

          {/* Results section */}
          <h2 className="text-2xl font-black text-gray-900 mt-8 mb-4" style={{ fontFamily: "Georgia, serif" }}>
            Real Men. Real Results. No Pills.
          </h2>

          {/* Before / After photo */}
          <div className="my-6 rounded-2xl overflow-hidden border border-gray-200 shadow-lg font-sans">
            <div className="grid grid-cols-2">
              <div className="relative">
                <img src={IMG_BEFORE} alt="Before Vigronex" className="w-full h-64 object-cover object-top" loading="lazy" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-red-900/90 to-transparent px-3 py-3">
                  <span className="text-white font-black text-sm uppercase tracking-wider">BEFORE</span>
                  <p className="text-red-200 text-xs mt-0.5">Exhausted. Defeated. Hopeless.</p>
                </div>
              </div>
              <div className="relative">
                <img src={IMG_AFTER} alt="After Vigronex" className="w-full h-64 object-cover object-top" loading="lazy" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-900/90 to-transparent px-3 py-3">
                  <span className="text-white font-black text-sm uppercase tracking-wider">AFTER</span>
                  <p className="text-green-200 text-xs mt-0.5">Confident. Energized. Alive.</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 border-t border-gray-200 px-4 py-2.5 text-xs text-gray-500 text-center">
              Robert M., 52 — Austin, Texas · 90 days on the Vigronex protocol · Results may vary.
            </div>
          </div>

          <div className="space-y-4 my-5">
            {[
              {
                name: "Robert M., 52",
                location: "Austin, Texas",
                before: "Couldn't maintain an erection for 3 years. Tried Viagra — ended up in the ER with chest pains.",
                after: "By week 4 of Vigronex, I had the best erection of my life. My wife cried. I cried. This program saved my marriage.",
                stars: 5,
              },
              {
                name: "Marcus T., 44",
                location: "Atlanta, Georgia",
                before: "Low libido, no energy, my wife thought I was no longer attracted to her. Our relationship was falling apart.",
                after: "Week 6: my testosterone levels went up 28% according to my doctor. I feel 25 again. No exaggeration.",
                stars: 5,
              },
              {
                name: "David K., 38",
                location: "Denver, Colorado",
                before: "Performance anxiety so bad I started avoiding sex completely. I was 38 years old and felt like an old man.",
                after: "The neural rewiring module was the game changer. The anxiety is gone. I'm a completely different person.",
                stars: 5,
              },
            ].map((t, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-5 font-sans">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.name} · {t.location}</p>
                    <div className="flex items-center gap-0.5">
                      {[...Array(t.stars)].map((_, j) => <Star key={j} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                      <span className="text-xs text-gray-500 ml-1">Verified Purchase</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-xs font-bold text-red-600 mb-1">BEFORE</p>
                    <p className="text-xs text-gray-700 leading-relaxed italic">"{t.before}"</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs font-bold text-green-600 mb-1">AFTER</p>
                    <p className="text-xs text-gray-700 leading-relaxed italic">"{t.after}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA #5 — after testimonials / before/after */}
          <div className="my-6 font-sans">
            <div className="bg-green-600 rounded-t-2xl px-4 py-2.5 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-white" />
              <p className="text-white font-bold text-sm">These results are real. Yours could be next.</p>
            </div>
            <div className="bg-green-50 border-2 border-green-600 border-t-0 rounded-b-2xl p-5 text-center">
              <p className="text-gray-800 font-bold text-base mb-1">87% of men see results by week 4.</p>
              <p className="text-gray-600 text-sm mb-4">Take the free assessment to see your personalized timeline.</p>
              <button
                onClick={goToQuiz}
                className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white font-black text-base py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 active:scale-95 transition-transform"
              >
                START MY FREE ASSESSMENT
                <ChevronRight className="w-5 h-5" />
              </button>
              <p className="text-gray-500 text-xs mt-2">🔒 Private & confidential · No credit card · 60 seconds</p>
            </div>
          </div>

          {/* The science section */}
          <h2 className="text-2xl font-black text-gray-900 mt-8 mb-4" style={{ fontFamily: "Georgia, serif" }}>
            Why This Works When Everything Else Has Failed You
          </h2>

          <p className="text-base leading-relaxed text-gray-700 mb-4">
            Most men who come to Vigronex have already tried everything: pills, supplements, herbs, testosterone injections, even therapy. They've spent thousands of dollars and years of frustration. The reason nothing worked is simple: <strong>they were treating the symptom, not the cause.</strong>
          </p>

          <p className="text-base leading-relaxed text-gray-700 mb-4">
            Vigronex is the only program in the world that simultaneously targets all three biological root causes identified by the Harvard team. It's not a supplement. It's not a pill. It's a structured, science-backed protocol delivered through a mobile app — designed to fit into your daily life in as little as 20 minutes per day.
          </p>

          {/* Timeline */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 my-6 font-sans">
            <h3 className="font-bold text-gray-900 text-base mb-4">What to Expect: Your 90-Day Timeline</h3>
            <div className="space-y-3">
              {[
                { week: "Week 1–2", title: "Foundation & Activation", desc: "Baseline established. First hormonal and vascular exercises begin. Most men report increased energy and better sleep within 10 days.", color: "bg-blue-500" },
                { week: "Week 3–4", title: "First Breakthroughs", desc: "73% of users report their first noticeable improvement in erection quality. The neural anxiety loop begins to break.", color: "bg-amber-500" },
                { week: "Week 5–8", title: "Transformation Phase", desc: "Testosterone levels measurably increase. Blood flow improves significantly. Most men report consistent, reliable erections.", color: "bg-orange-500" },
                { week: "Week 9–12", title: "Full Recovery", desc: "87% of users report complete resolution of ED symptoms. The changes are biological and permanent — no maintenance pills required.", color: "bg-green-500" },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className={`w-2 h-2 rounded-full ${item.color} flex-shrink-0 mt-2`} />
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase">{item.week} — </span>
                    <span className="text-sm font-bold text-gray-900">{item.title}</span>
                    <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Urgency section */}
          <h2 className="text-2xl font-black text-gray-900 mt-8 mb-4" style={{ fontFamily: "Georgia, serif" }}>
            Why You Need to Act Now — Not Tomorrow
          </h2>

          <p className="text-base leading-relaxed text-gray-700 mb-4">
            Here's the uncomfortable truth that most doctors won't tell you: erectile dysfunction is a progressive condition. The longer you wait, the harder it becomes to reverse. The vascular damage accumulates. The neural pathways calcify. The hormonal cascade deepens.
          </p>

          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5 my-5 font-sans">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-red-800 text-sm mb-2">The Window of Full Recovery Is Closing</h4>
                <p className="text-sm text-red-700 leading-relaxed">
                  Research shows that men who begin the Vigronex protocol within 6 months of symptom onset have a <strong>97% success rate</strong>. After 2 years, that number drops to 71%. After 5 years, permanent vascular damage makes full recovery unlikely. <strong>If you're reading this, you're still in the window.</strong>
                </p>
              </div>
            </div>
          </div>

          <p className="text-base leading-relaxed text-gray-700 mb-6">
            The good news: you don't need to commit to anything today. Vigronex offers a <strong>completely free 60-second assessment</strong> that will tell you exactly where you stand — your risk level, your recovery timeline, and the specific protocol that will work for your case.
          </p>

        </div>

        {/* ── Big CTA section ── */}
        <div className="bg-gray-900 rounded-2xl p-6 mt-8 text-white text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 rounded-full px-4 py-1.5 text-amber-400 text-xs font-bold mb-4 font-sans">
            <Zap className="w-3.5 h-3.5" />
            FREE · NO CREDIT CARD · 60 SECONDS
          </div>

          <h2 className="text-2xl font-black leading-tight mb-3" style={{ fontFamily: "Georgia, serif" }}>
            Take the Free Assessment and Discover<br />
            <span className="text-amber-400">Your Personal Recovery Stage</span>
          </h2>

          <p className="text-gray-300 text-sm leading-relaxed mb-6 font-sans">
            Answer 8 confidential questions and receive your personalized diagnosis — including your exact risk level, the biological root causes affecting you, and your custom 90-day recovery roadmap.
          </p>

          {/* Mini stats */}
          <div className="grid grid-cols-3 gap-3 mb-6 font-sans">
            {[
              { value: "60,000+", label: "Men Helped" },
              { value: "87%", label: "Success Rate" },
              { value: "4.9★", label: "Average Rating" },
            ].map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="text-amber-400 font-black text-xl">{s.value}</div>
                <div className="text-gray-400 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* What they'll get */}
          <div className="text-left bg-white/5 border border-white/10 rounded-xl p-4 mb-6 font-sans">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Your free assessment includes:</p>
            {[
              "Your personalized risk level (Critical / High / Moderate / Early Stage)",
              "The specific biological root causes affecting your case",
              "Your custom 90-day recovery timeline",
              "The exact Vigronex protocol sequence for your profile",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2.5 mb-2">
                <CheckCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-xs">{item}</p>
              </div>
            ))}
          </div>

          <button
            onClick={goToQuiz}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-400 text-black font-black text-lg py-5 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-amber-500/30 active:scale-95 transition-transform mb-3 font-sans"
          >
            TAKE MY FREE ASSESSMENT NOW
            <ChevronRight className="w-5 h-5" />
          </button>

          <p className="text-gray-500 text-xs font-sans">
            🔒 100% confidential · No credit card required · Results in 60 seconds
          </p>
        </div>



      </div>
    </div>
  );
}
