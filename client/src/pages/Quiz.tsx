"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "../trpc";
import { playAnswerSound } from "../utils/sound";

/** Quiz phases: positive (inviting) → neutral → negative (admission). */
type QuizPhase = "positive" | "neutral" | "negative" | "release";

interface QuizAnswers {
  age_functional?: string;
  goal?: string;
  wish?: string;
  current_habits?: string[];
  frequency?: string;
  family_history?: string;
  struggle?: string;
  fear?: string;
  identity?: string;
  preference?: string;
}

/** 1/3 positive (inviting), 1/3 neutral, 1/3 negative, then pressure-release. */
const QUIZ_QUESTIONS: Array<{
  id: number;
  category: keyof QuizAnswers;
  phase: QuizPhase;
  question: string;
  subtitle?: string;
  reasonForAsking?: string;
  type: "radio" | "checkbox";
  options: Array<{ value: string; label: string }>;
  icon: string;
}> = [
  // ─── BLOCK 1: POSITIVE (inviting, "I want / I wish / I hope") ───
  {
    id: 1,
    category: "age_functional",
    phase: "positive",
    question: "This year, I am...",
    subtitle: "This helps us tailor your results.",
    type: "radio",
    options: [
      { value: "40-50", label: "This year I'm 40–50 and I have a lot ahead of me" },
      { value: "50-60", label: "This year I'm 50–60 and I'm feeling optimistic" },
      { value: "60-70", label: "This year I'm 60–70 and I feel better than ever" },
      { value: "70+", label: "This year I'm 70+ and I want to stay sharp and healthy" },
    ],
    icon: "👤",
  },
  {
    id: 2,
    category: "goal",
    phase: "positive",
    question: "In the next 90 days, I want to...",
    subtitle: "What would a clear win look like for you?",
    type: "radio",
    options: [
      { value: "lower_a1c", label: "I want to get my HbA1c into a safer range" },
      { value: "avoid_diabetes", label: "I want to reverse prediabetes or avoid type 2" },
      { value: "lose_weight", label: "I want to lose weight and reduce belly fat" },
      { value: "avoid_complications", label: "I want to protect my eyes, kidneys, heart" },
      { value: "more_energy", label: "I want more daily energy and fewer crashes" },
    ],
    icon: "🎯",
  },
  {
    id: 3,
    category: "wish",
    phase: "positive",
    question: "What matters most to you about your blood sugar and health right now?",
    subtitle: "We ask so we can personalize your recommendation.",
    type: "radio",
    options: [
      { value: "control", label: "I hope to feel in control of my numbers" },
      { value: "energy", label: "I want to feel more energy and clarity" },
      { value: "long_term", label: "I want to avoid complications down the road" },
      { value: "confidence", label: "I want to feel confident about what I eat and do" },
    ],
    icon: "💙",
  },
  // ─── BLOCK 2: NEUTRAL ("I usually", "Sometimes", what's happening) ───
  {
    id: 4,
    category: "current_habits",
    phase: "neutral",
    question: "Which of these do you usually do?",
    subtitle: "Select all that apply. There’s no wrong answer.",
    type: "checkbox",
    options: [
      { value: "exercise", label: "I usually get regular exercise (3+ times a week)" },
      { value: "sleep", label: "I usually sleep 7–9 hours a night" },
      { value: "meditation", label: "I sometimes practice meditation or mindfulness" },
      { value: "social", label: "I spend time with family or friends regularly" },
      { value: "learning", label: "I read or learn something new from time to time" },
      { value: "diet", label: "I try to eat a diabetes-friendly diet most days" },
    ],
    icon: "✅",
  },
  {
    id: 5,
    category: "frequency",
    phase: "neutral",
    question: "How often do you find your blood sugar out of your target range?",
    subtitle: "Be honest — this isn’t judgment, it helps us understand where you are.",
    type: "radio",
    options: [
      { value: "occasional", label: "Sometimes — maybe 1–2 times a week" },
      { value: "frequent", label: "From time to time — 3–5 times a week" },
      { value: "daily", label: "Most days it’s a struggle" },
      { value: "severe", label: "Almost every day — it affects my life" },
    ],
    icon: "📊",
  },
  {
    id: 6,
    category: "family_history",
    phase: "neutral",
    question: "In your family, has anyone had diabetes?",
    subtitle: "This is important for your risk profile.",
    type: "radio",
    options: [
      { value: "no", label: "No" },
      { value: "distant", label: "Yes — a distant relative (aunt, uncle, cousin)" },
      { value: "parent", label: "Yes — a parent" },
      { value: "multiple", label: "Yes — multiple family members" },
    ],
    icon: "👨‍👩‍👧‍👦",
  },
  // ─── BLOCK 3: NEGATIVE (admission, "I have difficulty", "I am", fear) ───
  {
    id: 7,
    category: "struggle",
    phase: "negative",
    question: "I have difficulty with...",
    subtitle: "Which of these feels most true for you right now?",
    type: "radio",
    options: [
      { value: "cravings", label: "I have difficulty controlling my cravings" },
      { value: "diet", label: "I have difficulty sticking to a diet that works" },
      { value: "time", label: "I have difficulty finding time to take care of myself" },
      { value: "energy", label: "I have difficulty having enough energy to focus on my health" },
      { value: "knowledge", label: "I have difficulty knowing what to change" },
      { value: "nothing_works", label: "I have difficulty — nothing I’ve tried seems to work" },
    ],
    icon: "🔄",
  },
  {
    id: 8,
    category: "fear",
    phase: "negative",
    question: "The #1 thing I’m afraid of when it comes to my blood sugar or health is...",
    reasonForAsking: "We ask because we need to know the best way to help you overcome this.",
    type: "radio",
    options: [
      { value: "complications", label: "I’m afraid of complications (eyes, kidneys, feet, heart)" },
      { value: "getting_worse", label: "I’m afraid of things getting worse" },
      { value: "alone", label: "I’m afraid of facing this alone" },
      { value: "too_late", label: "I’m afraid it’s already too late to change" },
      { value: "never_control", label: "I’m afraid I’ll never get it under control" },
    ],
    icon: "💭",
  },
  {
    id: 9,
    category: "identity",
    phase: "negative",
    question: "Which of these do you feel is most true for you right now?",
    subtitle: "This helps us meet you where you are.",
    type: "radio",
    options: [
      { value: "ashamed", label: "I’m a bit ashamed of my weight or my numbers" },
      { value: "very_ashamed", label: "I’m quite ashamed and don’t know where to start" },
      { value: "stuck", label: "No matter what I do, I can’t seem to get my blood sugar under control" },
      { value: "overwhelmed", label: "I feel overwhelmed and need a clear plan" },
      { value: "ready", label: "I’m ready to take action and want the right support" },
    ],
    icon: "🔑",
  },
  // ─── PRESSURE RELEASE: "What would you like instead?" ───
  {
    id: 10,
    category: "preference",
    phase: "release",
    question: "What would you like instead?",
    subtitle: "Choose the outcome that matters most to you. We’ll show you a plan that fits.",
    type: "radio",
    options: [
      { value: "control", label: "I’d like to feel in control of my numbers and my day" },
      { value: "energy", label: "I’d like more energy and to feel like myself again" },
      { value: "peace", label: "I’d like peace of mind about my long-term health" },
      { value: "simple", label: "I’d like a simple plan I can actually follow" },
    ],
    icon: "✨",
  },
];

function calculateCognitiveScore(answers: QuizAnswers): number {
  let score = 100;

  if (answers.age_functional === "70+") score -= 15;
  else if (answers.age_functional === "60-70") score -= 10;
  else if (answers.age_functional === "50-60") score -= 5;

  if (answers.frequency === "severe") score -= 25;
  else if (answers.frequency === "daily") score -= 20;
  else if (answers.frequency === "frequent") score -= 15;
  else if (answers.frequency === "occasional") score -= 5;

  if (answers.family_history === "multiple") score -= 15;
  else if (answers.family_history === "parent") score -= 10;
  else if (answers.family_history === "distant") score -= 5;

  if (Array.isArray(answers.current_habits)) {
    score += answers.current_habits.length * 3;
  }

  if (answers.identity === "stuck" || answers.identity === "very_ashamed") score -= 10;
  else if (answers.identity === "overwhelmed") score -= 5;

  return Math.max(0, Math.min(100, score));
}

function getRiskLevel(score: number): {
  level: string;
  color: string;
  message: string;
  barClass: string;
  bgClass: string;
  borderClass: string;
  titleClass: string;
  textClass: string;
} {
  if (score >= 80)
    return {
      level: "Low Risk",
      color: "green",
      message: "Your blood sugar risk appears relatively low. Keep your current habits and stay consistent.",
      barClass: "bg-green-500",
      bgClass: "bg-green-50",
      borderClass: "border-green-500",
      titleClass: "text-green-900",
      textClass: "text-green-700",
    };
  if (score >= 60)
    return {
      level: "Moderate Risk",
      color: "yellow",
      message: "You may benefit from preventive changes to your diet, activity, and tracking.",
      barClass: "bg-yellow-500",
      bgClass: "bg-yellow-50",
      borderClass: "border-yellow-500",
      titleClass: "text-yellow-900",
      textClass: "text-yellow-700",
    };
  if (score >= 40)
    return {
      level: "Elevated Risk",
      color: "orange",
      message: "Your numbers and habits suggest elevated diabetes risk. Action in the next 90 days is recommended.",
      barClass: "bg-orange-500",
      bgClass: "bg-orange-50",
      borderClass: "border-orange-500",
      titleClass: "text-orange-900",
      textClass: "text-orange-700",
    };
  return {
    level: "High Risk",
    color: "red",
    message: "You're an ideal candidate for DiabetesSharp. A structured program can help you regain control.",
    barClass: "bg-red-500",
    bgClass: "bg-red-50",
    borderClass: "border-red-500",
    titleClass: "text-red-900",
    textClass: "text-red-700",
  };
}

function mapAnswersToBackend(answers: QuizAnswers): {
  age: number;
  primaryConcern: string;
  symptomSeverity: string;
  familyHistory: boolean;
  currentHabits: string;
  motivationLevel: string;
} {
  const ageMap: Record<string, number> = {
    "40-50": 45,
    "50-60": 55,
    "60-70": 65,
    "70+": 75,
  };
  const severityMap: Record<string, string> = {
    severe: "diagnosed",
    daily: "noticeable",
    frequent: "frequent",
    occasional: "occasional",
  };
  const primaryConcern = answers.fear ?? answers.struggle ?? answers.wish ?? "control";
  const motivationMap: Record<string, string> = {
    ashamed: "moderately_motivated",
    very_ashamed: "very_motivated",
    stuck: "very_motivated",
    overwhelmed: "motivated",
    ready: "very_motivated",
  };
  return {
    age: ageMap[answers.age_functional ?? "50-60"] ?? 55,
    primaryConcern,
    symptomSeverity: severityMap[answers.frequency ?? "occasional"] ?? "occasional",
    familyHistory: answers.family_history !== "no" && !!answers.family_history,
    currentHabits: Array.isArray(answers.current_habits)
      ? answers.current_habits.join(",")
      : "none",
    motivationLevel: motivationMap[answers.identity ?? "ready"] ?? "moderately_motivated",
  };
}

const PHASE_REASON_SENTENCES: Record<QuizPhase, string> = {
  positive: "Your answers help us personalize your results.",
  neutral: "This helps us understand where you are so we can recommend the right next steps.",
  negative: "You’re not alone — many people feel this way. Your answers help us show you a path forward.",
  release: "Almost there. Your choice helps us tailor your plan.",
};

const BOTTOM_BAR_MESSAGES = [
  "37+ million American adults live with diabetes. Another 96 million have prediabetes.",
  "Many people live with high blood sugar for years before diagnosis. Early action matters.",
  "Simple changes in food, movement, and tracking can significantly reduce diabetes risk.",
  "Uncontrolled diabetes is a leading cause of blindness, kidney failure, and amputations.",
  "Improving your HbA1c by even 1 point can lower your risk of complications.",
  "Small daily habits often matter more than perfect willpower once in a while.",
  "You don't have to fix everything at once — a clear 90-day plan is enough to start.",
  "Millions of people are taking control of their blood sugar. You're not alone.",
  "Knowing your risk is the first step. The next step is a plan that fits your life.",
  "You're not the only one who picked that. We're here to help.",
];

export function Quiz() {
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [cognitiveScore, setCognitiveScore] = useState(0);
  const [leadData, setLeadData] = useState({ firstName: "", lastName: "", email: "" });
  const leadDataRef = useRef(leadData);
  leadDataRef.current = leadData;
  const confettiFired = useRef(false);

  useEffect(() => {
    if (showResults) {
      const prev = document.title;
      document.title = "Checkout — DiabetesSharp | Your Diabetes Profile";
      return () => {
        document.title = prev;
      };
    }
  }, [showResults]);

  useEffect(() => {
    if (!showResults || confettiFired.current) return;
    confettiFired.current = true;
    const duration = 2500;
    const end = Date.now() + duration;
    const colors = ["#3b82f6", "#6366f1", "#8b5cf6", "#06b6d4", "#10b981"];
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, [showResults]);

  const submitQuiz = trpc.funnel.submitQuiz.useMutation();

  const handleAnswer = (category: keyof QuizAnswers, value: string | string[]) => {
    playAnswerSound();
    setAnswers((prev) => ({ ...prev, [category]: value }));
  };

  const handleNext = async () => {
    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setShowLeadForm(true);
    }
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const first = leadData.firstName.trim();
    const last = leadData.lastName.trim();
    const email = leadData.email.trim();
    if (!first || !last || !email) return;
    setShowLeadForm(false);
    setIsProcessing(true);
    (async () => {
      await new Promise((r) => setTimeout(r, 2000));
      const score = calculateCognitiveScore(answers);
      setCognitiveScore(score);
      setIsProcessing(false);
      setShowResults(true);
    })();
  };

  const createCarpandaOrder = trpc.funnel.createCarpandaOrder.useMutation();
  const isRedirecting = createCarpandaOrder.isPending;

  const handleStartRecovery = async () => {
    const lead = leadDataRef.current;
    if (!lead.firstName?.trim() || !lead.lastName?.trim() || !lead.email?.trim()) return;
    try {
      const payload = mapAnswersToBackend(answers);
      const quizData = await submitQuiz.mutateAsync(payload);
      const orderData = await createCarpandaOrder.mutateAsync({
        firstName: lead.firstName.trim(),
        lastName: lead.lastName.trim(),
        email: lead.email.trim(),
        cognitiveProfile: "diabetes_risk",
        symptomSeverity: payload.symptomSeverity,
        familyHistory: payload.familyHistory,
        quizSessionId: quizData.sessionId,
        cognitiveRiskScore: quizData.cognitiveRiskScore,
        discountApplied: 20,
        refCode: searchParams.get("ref") ?? undefined,
      });
      window.location.href = orderData.url;
    } catch {
      // Error surfaced by mutation; button stays enabled for retry
    }
  };

  if (showLeadForm) {
    return (
      <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-6 sm:py-12 pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-md w-full">
          <Card className="p-5 sm:p-8 shadow-lg">
            <div className="text-center mb-5 sm:mb-6">
              <span className="text-4xl mb-3 sm:mb-4 block">👨‍⚕️</span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                One last step before your results
              </h2>
              <p className="text-gray-600 text-sm">
                Enter your details to see your personalized diabetes profile and recommendation.
              </p>
            </div>
            <form onSubmit={handleLeadSubmit} className="space-y-4" data-form="lead-no-age">
              <p className="text-xs text-gray-500 -mt-1">
                Just tell us your name and email so we can prepare your personalized report.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                  <input
                    type="text"
                    required
                    autoComplete="given-name"
                    value={leadData.firstName}
                    onChange={(e) => setLeadData((p) => ({ ...p, firstName: e.target.value }))}
                    className="w-full min-h-[48px] px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none touch-manipulation"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                  <input
                    type="text"
                    required
                    autoComplete="family-name"
                    value={leadData.lastName}
                    onChange={(e) => setLeadData((p) => ({ ...p, lastName: e.target.value }))}
                    className="w-full min-h-[48px] px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none touch-manipulation"
                    placeholder="Last name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  value={leadData.email}
                  onChange={(e) => setLeadData((p) => ({ ...p, email: e.target.value }))}
                  className="w-full min-h-[48px] px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none touch-manipulation"
                  placeholder="your@email.com"
                />
              </div>
              <Button
                type="submit"
                className="w-full min-h-[52px] bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 text-base rounded-xl touch-manipulation active:scale-[0.98] transition-transform"
              >
                See my results
              </Button>
            </form>
            <p className="text-xs text-gray-500 text-center mt-4">
              Your data is confidential and will only be used to send your results and personalized recommendation.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Analyzing your answers...
          </h2>
          <p className="text-gray-600">
            We're building your personalized diabetes risk profile and recommendation.
          </p>
        </div>
      </div>
    );
  }

  if (showResults) {
    if (typeof window !== "undefined") {
      window.location.href = "/checkout-premium.html";
    }
    return null;
  }

  const question = QUIZ_QUESTIONS[currentStep];
  const currentValue = answers[question.category];
  const isAnswered =
    question.type === "checkbox"
      ? Array.isArray(currentValue) && currentValue.length > 0
      : currentValue !== undefined && currentValue !== "";

  const phaseReason = question.reasonForAsking ?? PHASE_REASON_SENTENCES[question.phase];
  const bottomMessage = BOTTOM_BAR_MESSAGES[currentStep % BOTTOM_BAR_MESSAGES.length];

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-blue-50 to-indigo-100 py-6 sm:py-12 px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-block bg-white rounded-full p-3 sm:p-4 mb-3 sm:mb-4 shadow-sm">
            <span className="text-4xl sm:text-5xl">👨‍⚕️</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Your Personalized Diabetes Risk Assessment
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Discover your risk profile and get a plan that fits — under 2 minutes
          </p>
        </div>

        <div className="mb-6 sm:mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-bold text-gray-700">
              Question {currentStep + 1} of {QUIZ_QUESTIONS.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(((currentStep + 1) / QUIZ_QUESTIONS.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{
                width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <Card className="p-5 sm:p-8 shadow-lg mb-5 sm:mb-6">
          <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{question.icon}</div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 leading-snug">
            {question.question}
          </h2>
          {question.subtitle && (
            <p className="text-gray-600 mb-2 text-sm sm:text-base">{question.subtitle}</p>
          )}
          {phaseReason && (
            <p className="text-gray-500 mb-5 sm:mb-6 text-xs sm:text-sm italic">
              {phaseReason}
            </p>
          )}

          <div className="space-y-2 sm:space-y-3">
            {question.type === "radio" &&
              question.options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center min-h-[48px] py-3 px-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 active:bg-blue-100 transition-all touch-manipulation select-none"
                >
                  <input
                    type="radio"
                    name={question.category}
                    value={option.value}
                    checked={currentValue === option.value}
                    onChange={() => handleAnswer(question.category, option.value)}
                    className="w-5 h-5 sm:w-4 sm:h-4 text-blue-600 shrink-0"
                  />
                  <span className="ml-3 text-gray-900 font-medium text-sm sm:text-base">
                    {option.label}
                  </span>
                </label>
              ))}

            {question.type === "checkbox" &&
              question.options.map((option) => {
                const arr = (currentValue as string[] | undefined) ?? [];
                const checked = arr.includes(option.value);
                return (
                  <label
                    key={option.value}
                    className="flex items-center min-h-[48px] py-3 px-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 active:bg-blue-100 transition-all touch-manipulation select-none"
                  >
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={checked}
                      onChange={() => {
                        const updated = checked
                          ? arr.filter((v) => v !== option.value)
                          : [...arr, option.value];
                        handleAnswer(question.category, updated);
                      }}
                      className="w-5 h-5 sm:w-4 sm:h-4 text-blue-600 shrink-0"
                    />
                    <span className="ml-3 text-gray-900 font-medium text-sm sm:text-base">
                      {option.label}
                    </span>
                  </label>
                );
              })}
          </div>
        </Card>

        <div className="flex gap-3 sm:gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
            disabled={currentStep === 0}
            className="flex-1 min-h-[48px] text-sm sm:text-base touch-manipulation rounded-xl"
          >
            ← Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!isAnswered}
            className="flex-1 min-h-[48px] bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base touch-manipulation rounded-xl active:scale-[0.98] transition-transform"
          >
            {currentStep === QUIZ_QUESTIONS.length - 1
              ? "See my results"
              : "Next →"}
          </Button>
        </div>

        <p className="text-center mt-5 sm:mt-6 text-sm font-medium text-gray-700 px-4 py-3 bg-amber-50 border-l-4 border-amber-500 rounded-r">
          {bottomMessage}
        </p>
      </div>
    </div>
  );
}
