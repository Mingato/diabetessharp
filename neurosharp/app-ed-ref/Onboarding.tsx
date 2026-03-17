import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { ArrowLeft, ArrowRight, CheckCircle, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

type StepId = "age" | "edSeverity" | "exerciseFrequency" | "smokingStatus" | "alcoholUse" | "sleepHours" | "stressLevel" | "primaryGoal";

type StepDef = {
  id: StepId;
  type: "single";
  field: string;
  options: { value: string; labelKey: string; descKey: string }[];
};

const STEPS: StepDef[] = [
  {
    id: "age",
    type: "single",
    field: "age",
    options: [
      { value: "25-34", labelKey: "25–34", descKey: "onboarding.options.age25" },
      { value: "35-44", labelKey: "35–44", descKey: "onboarding.options.age35" },
      { value: "45-54", labelKey: "45–54", descKey: "onboarding.options.age45" },
      { value: "55+", labelKey: "55+", descKey: "onboarding.options.age55" },
    ],
  },
  {
    id: "edSeverity",
    type: "single",
    field: "edSeverity",
    options: [
      { value: "mild", labelKey: "Mild", descKey: "onboarding.options.mild" },
      { value: "moderate", labelKey: "Moderate", descKey: "onboarding.options.moderate" },
      { value: "severe", labelKey: "Severe", descKey: "onboarding.options.severe" },
    ],
  },
  {
    id: "exerciseFrequency",
    type: "single",
    field: "exerciseFrequency",
    options: [
      { value: "none", labelKey: "Never", descKey: "onboarding.options.none" },
      { value: "1-2x", labelKey: "1–2x/week", descKey: "onboarding.options.light12" },
      { value: "3-4x", labelKey: "3–4x/week", descKey: "onboarding.options.moderate34" },
      { value: "5+", labelKey: "5+/week", descKey: "onboarding.options.active5" },
    ],
  },
  {
    id: "smokingStatus",
    type: "single",
    field: "smokingStatus",
    options: [
      { value: "never", labelKey: "Never smoked", descKey: "onboarding.options.neverSmoked" },
      { value: "former", labelKey: "Former smoker", descKey: "onboarding.options.formerSmoker" },
      { value: "current", labelKey: "Current smoker", descKey: "onboarding.options.currentSmoker" },
    ],
  },
  {
    id: "alcoholUse",
    type: "single",
    field: "alcoholUse",
    options: [
      { value: "none", labelKey: "None", descKey: "onboarding.options.noDrink" },
      { value: "light", labelKey: "Light", descKey: "onboarding.options.lightDrink" },
      { value: "moderate", labelKey: "Moderate", descKey: "onboarding.options.moderateDrink" },
      { value: "heavy", labelKey: "Heavy", descKey: "onboarding.options.heavyDrink" },
    ],
  },
  {
    id: "sleepHours",
    type: "single",
    field: "sleepHours",
    options: [
      { value: "5", labelKey: "< 5h", descKey: "onboarding.options.sleep5" },
      { value: "6", labelKey: "5–6h", descKey: "onboarding.options.sleep6" },
      { value: "7", labelKey: "6–7h", descKey: "onboarding.options.sleep7" },
      { value: "8", labelKey: "7–9h", descKey: "onboarding.options.sleep8" },
    ],
  },
  {
    id: "stressLevel",
    type: "single",
    field: "stressLevel",
    options: [
      { value: "2", labelKey: "Low (1–3)", descKey: "onboarding.options.stressLow" },
      { value: "5", labelKey: "Moderate (4–6)", descKey: "onboarding.options.stressMod" },
      { value: "8", labelKey: "High (7–8)", descKey: "onboarding.options.stressHigh" },
      { value: "10", labelKey: "Extreme (9–10)", descKey: "onboarding.options.stressEx" },
    ],
  },
  {
    id: "primaryGoal",
    type: "single",
    field: "primaryGoal",
    options: [
      { value: "improve_performance", labelKey: "Improve Sexual Performance", descKey: "onboarding.options.improvePerf" },
      { value: "boost_confidence", labelKey: "Boost Confidence", descKey: "onboarding.options.boostConf" },
      { value: "relationship", labelKey: "Improve My Relationship", descKey: "onboarding.options.relationship" },
      { value: "overall_health", labelKey: "Overall Health Optimization", descKey: "onboarding.options.overallHealth" },
    ],
  },
];

export default function Onboarding() {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [, navigate] = useLocation();

  const saveProfileMutation = trpc.profile.saveOnboarding.useMutation({
    onSuccess: () => {
      navigate("/app");
    },
    onError: (err) => {
      toast.error(t("common.error") + ": " + err.message);
    },
  });

  const stepDef = STEPS[currentStep];
  const stepId = stepDef.id;
  const progress = (currentStep / STEPS.length) * 100;
  const isLastStep = currentStep === STEPS.length - 1;
  const currentAnswer = answers[stepDef.field];

  const handleSelect = (value: string) => {
    setAnswers((prev) => ({ ...prev, [stepDef.field]: value }));
  };

  const handleNext = () => {
    if (!currentAnswer) {
      toast.error(t("onboarding.selectOption"));
      return;
    }
    if (isLastStep) {
      handleSubmit();
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleSubmit = () => {
    saveProfileMutation.mutate({
      age: answers.age ? parseInt(answers.age) : undefined,
      edSeverity: answers.edSeverity as "mild" | "moderate" | "severe" | undefined,
      exerciseFrequency: answers.exerciseFrequency as "none" | "1-2x" | "3-4x" | "5+" | undefined,
      smokingStatus: answers.smokingStatus as "never" | "former" | "current" | undefined,
      alcoholUse: answers.alcoholUse as "none" | "light" | "moderate" | "heavy" | undefined,
      sleepHours: answers.sleepHours ? parseFloat(answers.sleepHours) : undefined,
      stressLevel: answers.stressLevel ? parseInt(answers.stressLevel) : undefined,
      primaryGoal: answers.primaryGoal,
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center glow-gold-sm">
          <Zap size={16} className="text-primary-foreground" fill="currentColor" />
        </div>
        <span className="font-display font-bold text-foreground">RiseUp</span>
        <Badge className="ml-2 bg-accent text-muted-foreground border-border text-xs">
          {t("onboarding.setup")}
        </Badge>
      </div>

      {/* Progress */}
      <div className="px-6 pt-6">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">
              {t("onboarding.stepOf", { current: currentStep + 1, total: STEPS.length })}
            </span>
            <span className="text-xs text-muted-foreground">{Math.round(progress)}% {t("onboarding.complete")}</span>
          </div>
          <Progress value={progress} className="h-1.5 bg-muted" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              {t(`onboarding.steps.${stepId}.title`)}
            </h1>
            <p className="text-muted-foreground">
              {t(`onboarding.steps.${stepId}.subtitle`)}
            </p>
          </div>

          <div className="space-y-3">
            {stepDef.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-150 text-left",
                  currentAnswer === opt.value
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-card text-foreground hover:border-border/80 hover:bg-accent"
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                    currentAnswer === opt.value
                      ? "border-primary bg-primary"
                      : "border-muted-foreground"
                  )}
                >
                  {currentAnswer === opt.value && (
                    <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{opt.labelKey}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{t(opt.descKey)}</div>
                </div>
                {currentAnswer === opt.value && (
                  <CheckCircle size={16} className="text-primary shrink-0" />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mt-8">
            <Button
              variant="ghost"
              onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
              disabled={currentStep === 0}
              className="text-muted-foreground"
            >
              <ArrowLeft size={16} className="mr-2" />
              {t("onboarding.back")}
            </Button>
            <Button
              onClick={handleNext}
              disabled={!currentAnswer || saveProfileMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
            >
              {saveProfileMutation.isPending
                ? t("onboarding.saving")
                : isLastStep
                ? t("onboarding.startProgram")
                : t("onboarding.continue")}
              {!isLastStep && <ArrowRight size={16} className="ml-2" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
