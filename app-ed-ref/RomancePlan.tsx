import { useState } from "react";
import { useTranslation } from "react-i18next";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Streamdown } from "streamdown";
import {
  Heart,
  Sparkles,
  RefreshCw,
  ChevronRight,
  User,
  Target,
  Clock,
  Brain,
  Flame,
  Download,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
type RelationshipStatus = "single" | "dating" | "relationship" | "married";
type PrimaryGoal = "attract_new" | "rekindle" | "deepen_connection" | "improve_intimacy";
type PartnerPersonality = "adventurous" | "romantic" | "intellectual" | "playful" | "reserved";
type AvailableTime = "15min" | "30min" | "1hour" | "flexible";

// ── Config ────────────────────────────────────────────────────────────────────
const RELATIONSHIP_OPTIONS: { value: RelationshipStatus; label: string; emoji: string; desc: string }[] = [
  { value: "single", label: "Single", emoji: "🎯", desc: "Attract new people" },
  { value: "dating", label: "Dating", emoji: "💑", desc: "Deepen the connection" },
  { value: "relationship", label: "In a Relationship", emoji: "❤️", desc: "Strengthen the bond" },
  { value: "married", label: "Married", emoji: "💍", desc: "Rekindle the flame" },
];

const GOAL_OPTIONS: { value: PrimaryGoal; label: string; emoji: string }[] = [
  { value: "attract_new", label: "Attract new people", emoji: "✨" },
  { value: "rekindle", label: "Rekindle the flame", emoji: "🔥" },
  { value: "deepen_connection", label: "Deepen emotional connection", emoji: "🌊" },
  { value: "improve_intimacy", label: "Improve physical intimacy", emoji: "💫" },
];

const PERSONALITY_OPTIONS: { value: PartnerPersonality; label: string; emoji: string }[] = [
  { value: "adventurous", label: "Adventurous", emoji: "🏔️" },
  { value: "romantic", label: "Romantic", emoji: "🌹" },
  { value: "intellectual", label: "Intellectual", emoji: "📚" },
  { value: "playful", label: "Playful", emoji: "🎭" },
  { value: "reserved", label: "Reserved", emoji: "🌙" },
];

const TIME_OPTIONS: { value: AvailableTime; label: string; desc: string }[] = [
  { value: "15min", label: "15 min/day", desc: "Powerful micro-actions" },
  { value: "30min", label: "30 min/day", desc: "Perfect balance" },
  { value: "1hour", label: "1 hour/day", desc: "Full immersion" },
  { value: "flexible", label: "Flexible", desc: "No restrictions" },
];

// ── Step indicator ────────────────────────────────────────────────────────────
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i < current ? "bg-primary flex-1" : i === current ? "bg-primary/60 flex-1" : "bg-border flex-1"
          }`}
        />
      ))}
    </div>
  );
}

// ── Option Button ─────────────────────────────────────────────────────────────
function OptionButton({ selected, onClick, children }: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
        selected
          ? "bg-primary/10 border-primary text-foreground"
          : "bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function RomancePlan() {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<RelationshipStatus | null>(null);
  const [confidence, setConfidence] = useState(5);
  const [goal, setGoal] = useState<PrimaryGoal | null>(null);
  const [personality, setPersonality] = useState<PartnerPersonality | null>(null);
  const [availableTime, setAvailableTime] = useState<AvailableTime | null>(null);
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);

  const generateMutation = trpc.romancePlan.generate.useMutation({
    onSuccess: (data) => {
      setGeneratedPlan(data.plan);
      setGeneratedAt(data.generatedAt);
      setStep(5);
    },
    onError: () => {
      toast.error("Error generating the plan. Please try again.");
    },
  });

  const handleGenerate = () => {
    if (!status || !goal || !availableTime) return;
    generateMutation.mutate({
      relationshipStatus: status,
      confidenceLevel: confidence,
      primaryGoal: goal,
      partnerPersonality: personality ?? undefined,
      availableTime,
    });
  };

  const handleCopyPlan = () => {
    if (!generatedPlan) return;
    navigator.clipboard.writeText(generatedPlan);
    toast.success("Plan copied to clipboard!");
  };

  const handleReset = () => {
    setStep(0);
    setStatus(null);
    setConfidence(5);
    setGoal(null);
    setPersonality(null);
    setAvailableTime(null);
    setGeneratedPlan(null);
    setGeneratedAt(null);
  };

  const TOTAL_STEPS = 5;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
              <Sparkles size={20} className="text-rose-400" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">{t("romancePlan.title", "Weekly Seduction Plan")}</h1>
              <p className="text-sm text-muted-foreground">{t("romancePlan.subtitle", "Dr. Apex creates a personalized 7-day roadmap for you")}</p>
            </div>
          </div>
        </div>

        {/* Generated Plan View — show if plan exists regardless of step */}
        {generatedPlan ? (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-rose-500/10 via-card to-card border border-rose-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center">
                    <Heart size={16} className="text-rose-400" fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t("romancePlan.yourPlan", "Your Personalized Plan")}</p>
                    {generatedAt && (
                      <p className="text-xs text-muted-foreground">
                        Generated on {new Date(generatedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyPlan}
                    className="p-2 rounded-lg bg-card border border-border hover:border-primary/40 text-muted-foreground hover:text-foreground transition-colors"
                    title="Copiar plano"
                  >
                    <Download size={14} />
                  </button>
                  <button
                    onClick={handleReset}
                    className="p-2 rounded-lg bg-card border border-border hover:border-primary/40 text-muted-foreground hover:text-foreground transition-colors"
                    title="Generate new plan"
                  >
                    <RefreshCw size={14} />
                  </button>
                </div>
              </div>

              <div className="prose prose-sm prose-invert max-w-none">
                <div className="text-sm text-foreground leading-relaxed">
                  <Streamdown>{generatedPlan}</Streamdown>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex-1"
              >
                <RefreshCw size={14} className="mr-2" />
                {t("romancePlan.generateNew", "Generate New Plan")}
              </Button>
              <Button
                onClick={handleCopyPlan}
                className="flex-1"
              >
                <Download size={14} className="mr-2" />
                {t("romancePlan.copyPlan", "Copiar Plano")}
              </Button>
            </div>
          </div>
        ) : (
          /* Questionnaire */
          <div className="space-y-6">
            {step < TOTAL_STEPS && <StepIndicator current={step} total={TOTAL_STEPS} />}

            {/* Loading state */}
            {generateMutation.isPending && (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                  <Heart size={28} className="text-rose-400 animate-pulse" fill="currentColor" />
                </div>
                <p className="font-semibold text-foreground mb-2">{t("romancePlan.generating", "Dr. Apex is creating your plan...")}</p>
                <p className="text-sm text-muted-foreground">{t("romancePlan.generatingDesc", "Analyzing your profile and creating a personalized 7-day roadmap")}</p>
                <div className="flex justify-center gap-1 mt-4">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}

            {/* Step 0 — Relationship Status */}
            {step === 0 && !generateMutation.isPending && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <User size={18} className="text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">{t("romancePlan.step1Title", "What is your relationship status?")}</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-5">{t("romancePlan.step1Desc", "This helps Dr. Apex personalize the right strategies for you.")}</p>
                <div className="space-y-3">
                  {RELATIONSHIP_OPTIONS.map((opt) => (
                    <OptionButton
                      key={opt.value}
                      selected={status === opt.value}
                      onClick={() => setStatus(opt.value)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{opt.emoji}</span>
                        <div>
                          <p className="font-medium text-sm">{opt.label}</p>
                          <p className="text-xs opacity-70">{opt.desc}</p>
                        </div>
                      </div>
                    </OptionButton>
                  ))}
                </div>
                <Button
                  onClick={() => setStep(1)}
                  disabled={!status}
                  className="w-full mt-6"
                >
                  Continue <ChevronRight size={16} className="ml-1" />
                </Button>
              </div>
            )}

            {/* Step 1 — Confidence Level */}
            {step === 1 && !generateMutation.isPending && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Brain size={18} className="text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">What is your current confidence level?</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-6">Be honest — this ensures the plan is realistic and effective for you.</p>

                <div className="bg-card border border-border rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">Low confidence</span>
                    <div className="text-center">
                      <span className="text-3xl font-bold text-primary">{confidence}</span>
                      <span className="text-sm text-muted-foreground">/10</span>
                    </div>
                    <span className="text-sm text-muted-foreground">High confidence</span>
                  </div>
                  <Slider
                    value={[confidence]}
                    onValueChange={(v) => setConfidence(v[0])}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="mt-4 text-center">
                    <p className="text-xs text-muted-foreground">
                      {confidence <= 3 ? "🌱 Beginner — let's build your foundation" :
                       confidence <= 6 ? "🌿 Intermediate — time to level up" :
                       "🔥 Advanced — let's take it to the next level"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(0)} className="flex-1">Back</Button>
                  <Button onClick={() => setStep(2)} className="flex-1">
                    Continue <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2 — Primary Goal */}
            {step === 2 && !generateMutation.isPending && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Target size={18} className="text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">What is your primary goal?</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-5">The plan will be fully focused on this goal.</p>
                <div className="space-y-3">
                  {GOAL_OPTIONS.map((opt) => (
                    <OptionButton
                      key={opt.value}
                      selected={goal === opt.value}
                      onClick={() => setGoal(opt.value)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{opt.emoji}</span>
                        <p className="font-medium text-sm">{opt.label}</p>
                      </div>
                    </OptionButton>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
                  <Button onClick={() => setStep(3)} disabled={!goal} className="flex-1">
                    Continue <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3 — Partner Personality (optional) */}
            {step === 3 && !generateMutation.isPending && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Heart size={18} className="text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">What is her personality like?</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Optional — but makes the plan much more precise.</p>
                <button
                  onClick={() => { setPersonality(null); setStep(4); }}
                  className="text-xs text-primary underline mb-5 block"
                >
                  Skip this step
                </button>
                <div className="space-y-3">
                  {PERSONALITY_OPTIONS.map((opt) => (
                    <OptionButton
                      key={opt.value}
                      selected={personality === opt.value}
                      onClick={() => setPersonality(opt.value)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{opt.emoji}</span>
                        <p className="font-medium text-sm">{opt.label}</p>
                      </div>
                    </OptionButton>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Back</Button>
                  <Button onClick={() => setStep(4)} className="flex-1">
                    Continue <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4 — Available Time */}
            {step === 4 && !generateMutation.isPending && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={18} className="text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">How much time do you have per day?</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-5">Actions will be adapted to your available time.</p>
                <div className="space-y-3">
                  {TIME_OPTIONS.map((opt) => (
                    <OptionButton
                      key={opt.value}
                      selected={availableTime === opt.value}
                      onClick={() => setAvailableTime(opt.value)}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{opt.label}</p>
                        <p className="text-xs opacity-70">{opt.desc}</p>
                      </div>
                    </OptionButton>
                  ))}
                </div>

                {/* Summary */}
                {availableTime && (
                  <div className="mt-5 bg-primary/5 border border-primary/20 rounded-xl p-4">
                    <p className="text-xs font-semibold text-primary mb-2 flex items-center gap-1.5">
                      <Flame size={12} /> Your plan summary
                    </p>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Status: <span className="text-foreground font-medium">{RELATIONSHIP_OPTIONS.find(o => o.value === status)?.label}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Confidence: <span className="text-foreground font-medium">{confidence}/10</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Goal: <span className="text-foreground font-medium">{GOAL_OPTIONS.find(o => o.value === goal)?.label}</span>
                      </p>
                      {personality && (
                        <p className="text-xs text-muted-foreground">
                          Personality: <span className="text-foreground font-medium">{PERSONALITY_OPTIONS.find(o => o.value === personality)?.label}</span>
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Time: <span className="text-foreground font-medium">{TIME_OPTIONS.find(o => o.value === availableTime)?.label}</span>
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <Button variant="outline" onClick={() => setStep(3)} className="flex-1">Back</Button>
                  <Button
                    onClick={handleGenerate}
                    disabled={!availableTime || generateMutation.isPending}
                    className="flex-1 bg-rose-500 hover:bg-rose-600 text-white"
                  >
                    <Sparkles size={14} className="mr-2" />
                    Generate My Plan
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
