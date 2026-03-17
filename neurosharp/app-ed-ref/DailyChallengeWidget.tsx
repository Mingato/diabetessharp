import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Flame, Loader2, Trophy, Zap } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/_core/hooks/useAuth";

const CATEGORY_COLORS: Record<string, string> = {
  exercise: "text-blue-400 bg-blue-400/10",
  nutrition: "text-green-400 bg-green-400/10",
  mindset: "text-purple-400 bg-purple-400/10",
  social: "text-yellow-400 bg-yellow-400/10",
  cold_therapy: "text-cyan-400 bg-cyan-400/10",
  breathwork: "text-orange-400 bg-orange-400/10",
};

export function DailyChallengeWidget() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const lang = (i18n.language || user?.preferredLanguage || "en") as "en" | "pt-BR" | "es";

  const CATEGORY_LABELS: Record<string, string> = {
    exercise: t("challenge.category.exercise", "Exercise"),
    nutrition: t("challenge.category.nutrition", "Nutrition"),
    mindset: t("challenge.category.mindset", "Mindset"),
    social: t("challenge.category.social", "Social"),
    cold_therapy: t("challenge.category.coldTherapy", "Cold Therapy"),
    breathwork: t("challenge.category.breathwork", "Breathwork"),
  };

  const { data: challenge, isLoading } = trpc.challenges.getToday.useQuery({ language: lang });
  const completeChallenge = trpc.challenges.complete.useMutation();
  const utils = trpc.useUtils();

  const handleComplete = async () => {
    if (!challenge) return;
    const result = await completeChallenge.mutateAsync({ id: challenge.id });
    utils.challenges.getToday.invalidate();
    toast.success(t("challenge.completed", "Challenge completed! +{{xp}} XP", { xp: result.xpEarned }), {
      icon: "🏆",
    });
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-center h-32">
        <Loader2 size={20} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!challenge) return null;

  const colorClass = CATEGORY_COLORS[challenge.category] ?? "text-primary bg-primary/10";
  const isCompleted = challenge.isCompleted;

  return (
    <div className={`bg-card border rounded-xl p-4 transition-all ${isCompleted ? "border-emerald-500/30 bg-emerald-500/5" : "border-primary/30"}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Flame size={16} className="text-primary" />
          <span className="text-xs font-semibold text-primary uppercase tracking-wide">
            {t("challenge.title", "Daily Challenge")}
          </span>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colorClass}`}>
          {CATEGORY_LABELS[challenge.category]}
        </span>
      </div>

      <h3 className="font-semibold text-foreground text-sm mb-1">{challenge.title}</h3>
      <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{challenge.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-primary">
          <Zap size={12} />
          <span>+{challenge.xpReward} XP</span>
        </div>
        {isCompleted ? (
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
            <CheckCircle2 size={14} />
            {t("challenge.done", "Done!")}
          </div>
        ) : (
          <Button
            size="sm"
            className="h-7 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleComplete}
            disabled={completeChallenge.isPending}
          >
            {completeChallenge.isPending ? (
              <Loader2 size={12} className="mr-1 animate-spin" />
            ) : (
              <Trophy size={12} className="mr-1" />
            )}
            {t("challenge.complete", "Complete")}
          </Button>
        )}
      </div>
    </div>
  );
}
