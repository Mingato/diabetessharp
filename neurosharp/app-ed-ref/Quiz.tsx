import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation } from "wouter";
import { Zap, ChevronRight, Shield, Star, Users, Clock, CheckCircle, X, Mail, User } from "lucide-react";
import { trpc } from "@/lib/trpc";

// ── Quiz Data ──────────────────────────────────────────────────────────────────

interface Option {
  label: string;
  score: number;
  icon?: string;
}

interface Question {
  id: number;
  category: string;
  headline: string;
  subtext?: string;
  options: Option[];
  urgencyTrigger?: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    category: "IDENTIFY THE PROBLEM",
    headline: "Which of these have you experienced in the last 6 months?",
    subtext: "Be honest — this is completely confidential and will help us build your personalized plan.",
    urgencyTrigger: "You're not alone. 52% of men over 30 experience this — but most never get real help.",
    options: [
      { label: "Difficulty getting or maintaining an erection", score: 10, icon: "⚡" },
      { label: "Low libido / no desire for sex", score: 9, icon: "🔥" },
      { label: "Finishing too quickly (premature ejaculation)", score: 8, icon: "⏱️" },
      { label: "Lack of energy and motivation in general", score: 7, icon: "😴" },
      { label: "All of the above", score: 10, icon: "💥" },
    ],
  },
  {
    id: 2,
    category: "SEVERITY CHECK",
    headline: "How often does this problem affect your sex life?",
    subtext: "Understanding frequency helps us determine the severity of your case.",
    urgencyTrigger: "⚠️ This frequency indicates a hormonal or vascular issue that gets worse over time without treatment.",
    options: [
      { label: "Almost every time (80–100% of attempts)", score: 10, icon: "🚨" },
      { label: "More than half the time (50–80%)", score: 8, icon: "⚠️" },
      { label: "Sometimes (25–50% of the time)", score: 6, icon: "😟" },
      { label: "Occasionally (less than 25%)", score: 4, icon: "😕" },
      { label: "I'm not sure / it varies a lot", score: 5, icon: "🤔" },
    ],
  },
  {
    id: 3,
    category: "EMOTIONAL IMPACT",
    headline: "How has this affected your relationship or self-confidence?",
    subtext: "This is the part most men never admit — but it's the most important.",
    urgencyTrigger: "💔 Relationship damage from sexual dysfunction compounds over time. Early action prevents permanent damage.",
    options: [
      { label: "My partner is frustrated and we fight about it", score: 10, icon: "💔" },
      { label: "I avoid intimacy to escape the embarrassment", score: 10, icon: "😔" },
      { label: "I feel less like a man / my confidence is destroyed", score: 9, icon: "💪" },
      { label: "I'm worried about losing my partner", score: 9, icon: "😰" },
      { label: "It bothers me but I haven't told anyone", score: 7, icon: "🤐" },
    ],
  },
  {
    id: 4,
    category: "PAST ATTEMPTS",
    headline: "What have you already tried to fix this?",
    subtext: "Most solutions only mask the symptom. We need to know what hasn't worked.",
    urgencyTrigger: "🔬 These approaches treat symptoms, not the root cause. The Vigronex protocol targets the 3 biological triggers most men never address.",
    options: [
      { label: "Blue pills (Viagra, Cialis) — works but I hate depending on them", score: 9, icon: "💊" },
      { label: "Supplements / herbs — little to no results", score: 8, icon: "🌿" },
      { label: "Exercise and diet changes — helped a little but not enough", score: 6, icon: "🏋️" },
      { label: "Therapy or counseling — addressed mental side but not physical", score: 7, icon: "🧠" },
      { label: "Nothing — I've been hoping it would fix itself", score: 10, icon: "😞" },
    ],
  },
  {
    id: 5,
    category: "CORE MOTIVATION",
    headline: "What would getting this fixed mean to you?",
    subtext: "Your 'why' is the fuel that makes transformation possible.",
    urgencyTrigger: "🎯 Men who identify their core motivation are 4x more likely to complete the program and see results.",
    options: [
      { label: "Saving or improving my relationship / marriage", score: 10, icon: "💍" },
      { label: "Feeling like a real man again — confident and powerful", score: 9, icon: "🦁" },
      { label: "Having the best sex of my life at any age", score: 9, icon: "🔥" },
      { label: "Stopping the anxiety and fear before every intimate moment", score: 8, icon: "😌" },
      { label: "All of the above — I want my life back", score: 10, icon: "⚡" },
    ],
  },
  {
    id: 6,
    category: "COMMITMENT LEVEL",
    headline: "If you had a proven, doctor-designed 90-day protocol, how committed would you be?",
    subtext: "Vigronex works — but only for men who are ready to commit.",
    urgencyTrigger: "✅ Perfect. Men with your commitment level see an average 73% improvement in erection quality by week 6.",
    options: [
      { label: "100% — I'll do whatever it takes, I'm done suffering", score: 10, icon: "🔥" },
      { label: "Very committed — I'll follow it seriously", score: 9, icon: "💪" },
      { label: "Somewhat committed — I'll try my best", score: 6, icon: "👍" },
      { label: "I'm skeptical but willing to try", score: 4, icon: "🤔" },
      { label: "Not sure — I need to think about it", score: 2, icon: "😐" },
    ],
  },
  {
    id: 7,
    category: "URGENCY FACTOR",
    headline: "How long have you been dealing with this problem?",
    subtext: "The longer you wait, the harder it becomes to reverse. Science confirms this.",
    urgencyTrigger: "⏰ CRITICAL: After 2 years, vascular damage from sexual dysfunction can become permanent. You're in the window where full recovery is still possible.",
    options: [
      { label: "Less than 6 months — it just started", score: 6, icon: "🟡" },
      { label: "6 months to 1 year", score: 7, icon: "🟠" },
      { label: "1 to 2 years", score: 8, icon: "🔴" },
      { label: "2 to 5 years", score: 9, icon: "🚨" },
      { label: "More than 5 years — it's been a long time", score: 10, icon: "💀" },
    ],
  },
  {
    id: 8,
    category: "HEALTH PROFILE",
    headline: "Which of these apply to you?",
    subtext: "These factors directly influence which part of the Vigronex protocol will work fastest for you.",
    urgencyTrigger: "📊 Based on your profile, we've identified the exact protocol sequence that will work for your specific case.",
    options: [
      { label: "I'm over 35 years old", score: 8, icon: "📅" },
      { label: "I have high stress / anxiety levels", score: 7, icon: "😤" },
      { label: "I don't exercise regularly", score: 7, icon: "🛋️" },
      { label: "I've noticed my testosterone feels low", score: 9, icon: "📉" },
      { label: "I'm generally healthy but this problem appeared anyway", score: 6, icon: "🤷" },
    ],
  },
];

const NOTIFICATIONS = [
  { name: "Marcus T.", location: "Texas", msg: "Just completed week 3 — incredible results!" },
  { name: "David R.", location: "Florida", msg: "My wife noticed a difference in week 2." },
  { name: "James K.", location: "California", msg: "I wish I found this 5 years ago." },
  { name: "Robert M.", location: "New York", msg: "Finally feel like myself again at 48." },
  { name: "Carlos S.", location: "Arizona", msg: "No more pills. This is the real solution." },
  { name: "Anthony L.", location: "Georgia", msg: "Week 6 and I'm a completely different man." },
];

function getResult(totalScore: number, answers: number[]) {
  const avg = totalScore / Math.max(answers.length, 1);
  if (avg >= 8.5) {
    return {
      level: "CRITICAL",
      color: "#ef4444",
      bgColor: "rgba(239,68,68,0.1)",
      borderColor: "rgba(239,68,68,0.3)",
      title: "⚠️ CRITICAL STAGE — Immediate Action Required",
      subtitle: "Your results indicate severe sexual dysfunction with high risk of permanent damage if left untreated.",
      description: "Based on your answers, you are experiencing a multi-system breakdown affecting vascular function, testosterone production, and neurological response. This is not a willpower issue — it's a biological crisis that requires a structured medical protocol.",
      urgency: "Every day you wait, the damage compounds. Men in your stage who start the Vigronex protocol within 30 days have a 94% success rate. After 90 days of inaction, that number drops to 61%.",
      cta: "START MY RECOVERY NOW — BEFORE IT'S TOO LATE",
    };
  } else if (avg >= 7) {
    return {
      level: "HIGH RISK",
      color: "#f97316",
      bgColor: "rgba(249,115,22,0.1)",
      borderColor: "rgba(249,115,22,0.3)",
      title: "🔴 HIGH RISK — You're at a Tipping Point",
      subtitle: "Your results show significant sexual dysfunction that is actively worsening without intervention.",
      description: "You're at the stage where the problem is real, consistent, and affecting your life — but you're still in the window where full recovery is achievable.",
      urgency: "Men at your stage who start the Vigronex 90-day protocol see an average 78% improvement in erection quality and 3x increase in libido by week 8.",
      cta: "CLAIM MY PERSONALIZED 90-DAY PROTOCOL NOW",
    };
  } else if (avg >= 5) {
    return {
      level: "MODERATE",
      color: "#eab308",
      bgColor: "rgba(234,179,8,0.1)",
      borderColor: "rgba(234,179,8,0.3)",
      title: "🟡 MODERATE RISK — Don't Wait Until It Gets Worse",
      subtitle: "Your results show early-to-moderate sexual dysfunction. This is the BEST time to act.",
      description: "You're catching this early enough that recovery is faster and more complete. Without intervention, 73% of men in your stage progress to severe dysfunction within 18 months.",
      urgency: "Starting now means faster results, lower effort, and complete recovery. Men who act at your stage see results in as little as 3 weeks.",
      cta: "START NOW WHILE RECOVERY IS FASTEST",
    };
  } else {
    return {
      level: "EARLY STAGE",
      color: "#22c55e",
      bgColor: "rgba(34,197,94,0.1)",
      borderColor: "rgba(34,197,94,0.3)",
      title: "🟢 EARLY STAGE — You Can Stop This Before It Gets Worse",
      subtitle: "You're catching this early. This is the absolute best time to act.",
      description: "Your results show early signs of sexual dysfunction. While it may not seem severe yet, the biological processes causing this are already in motion.",
      urgency: "Men who act at the early stage see results in as little as 2 weeks and have a 97% success rate with the Vigronex protocol.",
      cta: "LOCK IN MY EARLY RECOVERY PLAN NOW",
    };
  }
}

// ── Simple pulsing dots loader (NO keyframe animation — uses CSS transition only) ──
function PulsingDots() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % 4), 500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex gap-2 justify-center">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: step === i ? "#f59e0b" : "rgba(245,158,11,0.3)",
            transition: "background-color 0.3s ease",
          }}
        />
      ))}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

type Phase = "intro" | "question" | "trigger" | "calculating" | "email_capture" | "result";

export default function Quiz() {
  const [, navigate] = useLocation();
  const [currentQ, setCurrentQ] = useState(0);
  const [phase, setPhase] = useState<Phase>("intro");
  const sessionId = useMemo(() => `quiz-${Date.now()}-${Math.random().toString(36).slice(2)}`, []);
  const trackQuiz = trpc.quiz.track.useMutation();
  const markConverted = trpc.quiz.markConverted.useMutation();
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [notifIndex, setNotifIndex] = useState(0);
  const [notifVisible, setNotifVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState(600);
  const [spotsLeft] = useState(Math.floor(Math.random() * 8) + 3);

  // Email capture state
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailSubmitting, setEmailSubmitting] = useState(false);

  // Exit-intent popup state
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [exitPopupDismissed, setExitPopupDismissed] = useState(false);
  const exitIntentFired = useRef(false);

  // Countdown timer
  useEffect(() => {
    const t = setInterval(() => setTimeLeft(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  // Social proof notifications
  useEffect(() => {
    const t = setInterval(() => {
      setNotifVisible(false);
      setTimeout(() => {
        setNotifIndex(i => (i + 1) % NOTIFICATIONS.length);
        setNotifVisible(true);
      }, 400);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  // Exit-intent detection — fires on ALL phases (intro, question, email, calculating, result)
  useEffect(() => {
    if (exitPopupDismissed) return;
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 5 && !exitIntentFired.current) {
        exitIntentFired.current = true;
        setShowExitPopup(true);
      }
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden" && !exitIntentFired.current) {
        exitIntentFired.current = true;
        setShowExitPopup(true);
      }
    };
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!exitIntentFired.current) {
        e.preventDefault();
        e.returnValue = "";
        setShowExitPopup(true);
      }
    };
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [exitPopupDismissed]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const totalScore = answers.reduce((a, b) => a + b, 0);
  const result = getResult(totalScore, answers.length > 0 ? answers : [5]);
  const progress = currentQ / QUESTIONS.length;
  const question = QUESTIONS[currentQ];

  // ── Handlers ──────────────────────────────────────────────────────────────────

  function goToPhase(next: Phase) {
    setPhase(next);
  }

  function handleStart() {
    goToPhase("question");
  }

  function handleOptionSelect(option: Option) {
    setSelectedOption(option);
    setAnswers(prev => [...prev, option.score]);
    goToPhase("trigger");
  }

  function handleNextQuestion() {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(q => q + 1);
      setSelectedOption(null);
      goToPhase("question");
    } else {
      // Move to calculating screen
      goToPhase("calculating");
      const finalAnswers = [...answers];
      const finalScore = finalAnswers.reduce((a, b) => a + b, 0);
      const r = getResult(finalScore, finalAnswers.length > 0 ? finalAnswers : [5]);
      trackQuiz.mutate({
        sessionId,
        score: Math.min(100, finalScore),
        riskLevel: r.level === "CRITICAL" ? "critical" : r.level === "HIGH RISK" ? "high" : r.level === "MODERATE" ? "moderate" : "low",
        answers: QUESTIONS.map((q, i) => ({ questionId: q.id, answerId: i, points: finalAnswers[i] ?? 0 })),
      });
      // After 3s show email capture
      setTimeout(() => goToPhase("email_capture"), 3000);
    }
  }

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!leadName.trim()) { setEmailError("Please enter your first name."); return; }
    if (!leadEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadEmail)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    setEmailSubmitting(true);
    setTimeout(() => {
      setEmailSubmitting(false);
      goToPhase("result");
    }, 1200);
  }

  function handleSkipEmail() {
    goToPhase("result");
  }

  function handleExitPopupClaim() {
    setShowExitPopup(false);
    setExitPopupDismissed(true);
    markConverted.mutate({ sessionId });
    navigate("/checkout?discount=20");
  }

  function handleExitPopupStay() {
    // User chose to stay — close popup, reset fired flag so it can fire once more if they try again
    setShowExitPopup(false);
    exitIntentFired.current = false;
  }

  function handleExitPopupDismiss() {
    setShowExitPopup(false);
    setExitPopupDismissed(true);
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#080810] text-white overflow-x-hidden">

      {/* Exit-Intent Popup — fires on all quiz phases */}
      {showExitPopup && (() => {
        const isOnResult = phase === "result";
        const questionsAnswered = answers.length;
        const progressPct = Math.round((questionsAnswered / QUESTIONS.length) * 100);
        return (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.92)" }}
          >
            <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
              {/* Red urgency header */}
              <div className="bg-[#cc0000] px-6 py-4 text-center">
                <div className="text-4xl mb-2">🚨</div>
                <h2 className="text-white font-black text-xl leading-tight">
                  {isOnResult
                    ? "WAIT — Your Results Are Ready!"
                    : `WAIT — You're ${progressPct}% Through Your Assessment`}
                </h2>
              </div>
              {/* Body */}
              <div className="px-6 py-5">
                {!isOnResult && (
                  <>
                    {/* Progress bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Assessment progress</span>
                        <span className="font-bold text-[#cc0000]">{progressPct}% complete</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-[#cc0000] h-2.5 rounded-full"
                          style={{ width: `${Math.max(progressPct, 8)}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-gray-900 font-bold text-lg text-center mb-3 leading-snug">
                      Don't give up on yourself now. You're so close to your personalized recovery plan.
                    </p>
                    <p className="text-gray-600 text-sm text-center mb-4 leading-relaxed">
                      Men who abandon their assessment <strong>never come back</strong>. Meanwhile, the problem gets worse every single week you wait.
                    </p>
                  </>
                )}
                {isOnResult && (
                  <>
                    <p className="text-gray-900 font-bold text-lg text-center mb-3 leading-snug">
                      You're about to make the same mistake that 73% of men regret for the rest of their lives.
                    </p>
                    <p className="text-gray-600 text-sm text-center mb-4 leading-relaxed">
                      Your personalized results are ready. Every day you wait, the damage gets harder to reverse.
                    </p>
                  </>
                )}
                {/* Emotional stakes */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5">
                  <p className="text-red-800 font-bold text-sm mb-2">If you close this page right now:</p>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>❌ Your partner will keep pretending everything is fine</li>
                    <li>❌ The problem gets worse — not better — with age</li>
                    <li>❌ You'll spend thousands on pills that don't fix the root cause</li>
                    <li>❌ You'll spend another year avoiding intimacy</li>
                  </ul>
                </div>
                {/* Stay CTA */}
                <button
                  onClick={isOnResult ? handleExitPopupClaim : handleExitPopupStay}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-400 text-black font-black text-base py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-400/30 mb-3"
                >
                  {isOnResult
                    ? <>✅ CLAIM MY 20% DISCOUNT NOW <ChevronRight className="w-5 h-5" /></>
                    : <>✅ YES — Continue My Assessment <ChevronRight className="w-5 h-5" /></>}
                </button>
                {/* Leave link */}
                <button
                  onClick={handleExitPopupDismiss}
                  className="w-full text-center text-xs text-gray-400 underline py-1"
                >
                  No thanks, I prefer to keep suffering in silence
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Top Bar */}
      <div className="bg-[#0d0d1a] border-b border-white/5 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center">
            <Zap className="w-4 h-4 text-black" />
          </div>
          <span className="font-bold text-white text-sm">Vigronex</span>
        </div>
        {phase !== "intro" && phase !== "result" && (
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
            <Clock className="w-3.5 h-3.5" />
            Offer expires: {formatTime(timeLeft)}
          </div>
        )}
        <div className="flex items-center gap-1 text-xs text-white/40">
          <Shield className="w-3.5 h-3.5" />
          100% Private
        </div>
      </div>

      {/* Progress Bar */}
      {(phase === "question" || phase === "trigger") && (
        <div className="bg-[#0d0d1a] px-4 py-2">
          <div className="flex justify-between text-xs text-white/40 mb-1">
            <span>Question {currentQ + 1} of {QUESTIONS.length}</span>
            <span>{Math.round(progress * 100)}% complete</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${progress * 100}%`, transition: "width 0.7s ease" }} />
          </div>
        </div>
      )}

      {/* Social Proof Notification */}
      {(phase === "question" || phase === "intro") && (
        <div
          className="mx-4 mt-3 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-2.5 flex items-center gap-3"
          style={{ opacity: notifVisible ? 1 : 0, transition: "opacity 0.4s ease" }}
        >
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-xs font-bold text-black flex-shrink-0">
            {NOTIFICATIONS[notifIndex].name[0]}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-green-400">{NOTIFICATIONS[notifIndex].name} · {NOTIFICATIONS[notifIndex].location}</p>
            <p className="text-xs text-white/60 truncate">"{NOTIFICATIONS[notifIndex].msg}"</p>
          </div>
          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-lg mx-auto px-4 py-6">

        {/* INTRO */}
        {phase === "intro" && (
          <div>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 text-amber-400 text-xs font-semibold mb-5">
                <Zap className="w-3.5 h-3.5" />
                FREE 90-SECOND ASSESSMENT
              </div>
              <h1 className="text-3xl font-black text-white leading-tight mb-3">
                Discover Your<br /><span className="text-amber-400">ED Recovery Score</span>
              </h1>
              <p className="text-white/60 text-sm leading-relaxed">
                Answer 8 confidential questions and get a personalized recovery plan based on your specific situation.
              </p>
            </div>

            <div className="bg-[#0d0d1a] border border-white/10 rounded-2xl p-5 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Trusted by 60,000+ men</p>
                  <p className="text-white/40 text-xs">Average 4.9★ rating · Harvard-backed protocol</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: "🔒", label: "100% Private" },
                  { icon: "⚡", label: "60 Seconds" },
                  { icon: "🎯", label: "Personalized" },
                ].map(item => (
                  <div key={item.label} className="bg-white/5 rounded-xl p-3 text-center">
                    <div className="text-xl mb-1">{item.icon}</div>
                    <div className="text-white/60 text-xs">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
              <Users className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-400 font-bold text-sm">Only {spotsLeft} spots remaining today</p>
                <p className="text-white/50 text-xs mt-0.5">We limit daily assessments to ensure personalized attention for each member.</p>
              </div>
            </div>

            <button
              onClick={handleStart}
              className="w-full bg-amber-500 text-black font-black text-lg py-4 rounded-2xl flex items-center justify-center gap-2 mb-3"
            >
              TAKE MY FREE ASSESSMENT NOW <ChevronRight className="w-5 h-5" />
            </button>
            <p className="text-center text-white/30 text-xs">🔒 100% confidential · No credit card required · Results in 60 seconds</p>
          </div>
        )}

        {/* QUESTION */}
        {phase === "question" && (
          <div>
            <div className="mb-2">
              <span className="text-amber-400 text-xs font-bold tracking-widest">{question.category}</span>
            </div>
            <h2 className="text-xl font-black text-white leading-tight mb-2">{question.headline}</h2>
            {question.subtext && <p className="text-white/50 text-sm mb-5">{question.subtext}</p>}
            <div className="space-y-3">
              {question.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleOptionSelect(option)}
                  className="w-full text-left bg-[#0d0d1a] border border-white/10 rounded-xl p-4 flex items-center gap-3 hover:border-amber-500/50 hover:bg-amber-500/5"
                  style={{ transition: "border-color 0.2s, background-color 0.2s" }}
                >
                  <span className="text-xl flex-shrink-0">{option.icon}</span>
                  <span className="text-white/80 text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TRIGGER */}
        {phase === "trigger" && selectedOption && (
          <div>
            <div className="bg-[#0d0d1a] border border-white/10 rounded-2xl p-5 mb-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Answer recorded</p>
                  <p className="text-white/40 text-xs">Building your profile...</p>
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 mb-3">
                <p className="text-white/60 text-xs mb-1">Your answer:</p>
                <p className="text-white text-sm font-semibold">{selectedOption.icon} {selectedOption.label}</p>
              </div>
              {question.urgencyTrigger && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                  <p className="text-amber-300 text-sm leading-relaxed">{question.urgencyTrigger}</p>
                </div>
              )}
            </div>

            {currentQ < QUESTIONS.length - 1 ? (
              <button
                onClick={handleNextQuestion}
                className="w-full bg-amber-500 text-black font-black text-base py-4 rounded-2xl flex items-center justify-center gap-2"
              >
                NEXT QUESTION ({currentQ + 2}/{QUESTIONS.length}) <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="w-full bg-amber-500 text-black font-black text-base py-4 rounded-2xl flex items-center justify-center gap-2"
              >
                SEE MY RESULTS <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* CALCULATING */}
        {phase === "calculating" && (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center mx-auto mb-6">
              <Zap className="w-10 h-10 text-amber-400" />
            </div>
            <h2 className="text-2xl font-black text-white mb-3">Analyzing Your Profile...</h2>
            <p className="text-white/50 text-sm mb-8">Our AI is processing your answers against 47,000+ case studies</p>
            <div className="space-y-4 text-left max-w-xs mx-auto mb-8">
              {[
                "Identifying root cause...",
                "Calculating severity score...",
                "Matching recovery protocol...",
                "Generating personalized plan...",
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-white/60">
                  <div className="w-4 h-4 rounded-full border-2 border-amber-500/50 flex-shrink-0" />
                  {step}
                </div>
              ))}
            </div>
            <PulsingDots />
          </div>
        )}

        {/* EMAIL CAPTURE */}
        {phase === "email_capture" && (
          <div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-amber-400" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">Your Results Are Ready!</h2>
              <p className="text-white/60 text-sm leading-relaxed">
                Enter your details below to receive your personalized recovery plan and see your full results.
              </p>
            </div>

            <div className="bg-[#0d0d1a] border border-amber-500/20 rounded-2xl p-5 mb-5">
              <p className="text-amber-400 font-bold text-sm mb-3">What you'll receive:</p>
              <div className="space-y-2">
                {[
                  "Your personalized ED Recovery Score",
                  "Your custom 90-day Vigronex roadmap",
                  "Free Vigronex Starter Guide (PDF)",
                  "Early access to member pricing",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-white/70">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-3 mb-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="Your first name"
                  value={leadName}
                  onChange={e => setLeadName(e.target.value)}
                  className="w-full bg-[#0d0d1a] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-amber-500/50"
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  placeholder="Your best email address"
                  value={leadEmail}
                  onChange={e => setLeadEmail(e.target.value)}
                  className="w-full bg-[#0d0d1a] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-amber-500/50"
                />
              </div>
              {emailError && <p className="text-red-400 text-xs">{emailError}</p>}
              <button
                type="submit"
                disabled={emailSubmitting}
                className="w-full bg-amber-500 text-black font-black text-base py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {emailSubmitting ? "Processing..." : "SHOW MY RESULTS NOW"}
                {!emailSubmitting && <ChevronRight className="w-5 h-5" />}
              </button>
            </form>

            <button onClick={handleSkipEmail} className="w-full text-white/30 text-xs py-2 text-center">
              Skip — show results without saving
            </button>
            <p className="text-center text-white/20 text-xs mt-2">🔒 We never share your information. Unsubscribe anytime.</p>
          </div>
        )}

        {/* RESULT */}
        {phase === "result" && (
          <div>
            <div className="rounded-2xl border p-5 mb-5" style={{ backgroundColor: result.bgColor, borderColor: result.borderColor }}>
              <h2 className="text-xl font-black text-white mb-1">{result.title}</h2>
              <p className="text-white/70 text-sm">{result.subtitle}</p>
            </div>

            <div className="bg-[#0d0d1a] border border-white/10 rounded-2xl p-5 mb-5">
              <p className="text-white/80 text-sm leading-relaxed mb-4">{result.description}</p>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <p className="text-amber-300 text-sm leading-relaxed">{result.urgency}</p>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="bg-[#0d0d1a] border border-white/10 rounded-2xl p-5 mb-5">
              <p className="text-white font-bold text-sm mb-3">Your Assessment Score</p>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, (totalScore / (QUESTIONS.length * 10)) * 100)}%`,
                      backgroundColor: result.color,
                      transition: "width 1s ease",
                    }}
                  />
                </div>
                <span className="text-white font-black text-lg" style={{ color: result.color }}>
                  {Math.min(100, Math.round((totalScore / (QUESTIONS.length * 10)) * 100))}
                </span>
              </div>
              <p className="text-white/40 text-xs">Risk Level: <span className="font-bold" style={{ color: result.color }}>{result.level}</span></p>
            </div>

            {/* Social Proof */}
            <div className="bg-[#0d0d1a] border border-white/10 rounded-2xl p-5 mb-5">
              <p className="text-white font-bold text-sm mb-3">What men like you achieved:</p>
              <div className="space-y-3">
                {[
                  { name: "Michael R., 52", result: "Full recovery in 67 days", stars: 5 },
                  { name: "James T., 44", result: "3x improvement in 6 weeks", stars: 5 },
                  { name: "David K., 58", result: "Better than I was at 30", stars: 5 },
                ].map((t, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-xs font-bold text-black flex-shrink-0">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-white text-xs font-semibold">{t.name}</p>
                      <div className="flex gap-0.5 mb-0.5">
                        {Array.from({ length: t.stars }).map((_, j) => (
                          <Star key={j} className="w-3 h-3 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-white/60 text-xs">"{t.result}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 mb-4">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-3">
                <Clock className="w-3.5 h-3.5" />
                OFFER EXPIRES IN {formatTime(timeLeft)}
              </div>
              <div className="text-center mb-4">
                <div className="text-white/50 text-sm line-through">Regular: $39.90/month</div>
                <div className="text-amber-400 font-black text-4xl">$39.90</div>
                <div className="text-white/50 text-xs">/month · Cancel anytime</div>
              </div>
              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-amber-500 text-black font-black text-base py-4 rounded-2xl flex items-center justify-center gap-2 mb-3"
              >
                {result.cta} <ChevronRight className="w-5 h-5" />
              </button>
              <div className="flex items-center justify-center gap-4 text-white/40 text-xs">
                <span>🔒 Secure checkout</span>
                <span>✅ 7-day guarantee</span>
                <span>🚚 Instant access</span>
              </div>
            </div>

            <p className="text-center text-white/20 text-xs">
              Results may vary. Vigronex is a wellness program, not a medical treatment.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
