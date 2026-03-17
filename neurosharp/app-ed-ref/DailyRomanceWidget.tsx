import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Heart, Sparkles, ChevronRight, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";

export function DailyRomanceWidget() {
  const { t } = useTranslation();
  const lang = i18n.language as "en" | "pt-BR" | "es";
  const validLang = (lang === "en" || lang === "pt-BR" || lang === "es") ? lang : ("pt-BR" as const);

  const [done, setDone] = useState(() => {
    const key = `romance_done_${new Date().toDateString()}`;
    return localStorage.getItem(key) === "true";
  });

  const { data: tip } = trpc.intimacy.getDailyTip.useQuery(
    { language: validLang },
    { staleTime: 3_600_000 }
  );

  const utils = trpc.useUtils();
  const markDoneMutation = trpc.intimacy.markTipDone.useMutation({
    onSuccess: () => {
      utils.intimacy.getTipHistory.invalidate();
    },
  });

  const handleMarkDone = () => {
    if (!tip) return;
    const key = `romance_done_${new Date().toDateString()}`;
    localStorage.setItem(key, "true");
    setDone(true);
    toast.success(t("romance.markedDone", "🔥 Daily romance completed! +15 XP"), {
      description: t("romance.markedDoneDesc", "Keep it up — consistency is the secret to attraction."),
    });
    markDoneMutation.mutate({ romanceTipId: tip.id });
  };

  if (!tip) return null;

  return (
    <div className={`rounded-2xl border p-5 transition-all duration-300 ${done
      ? "bg-rose-500/5 border-rose-500/20"
      : "bg-gradient-to-br from-rose-500/10 via-card to-card border-rose-500/20"
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-rose-500/20">
            <Heart size={16} className="text-rose-400" fill={done ? "currentColor" : "none"} />
          </div>
          <div>
            <p className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
              {t("romance.dailyTitle", "Daily Romance")}
            </p>
          </div>
        </div>
        {done && (
          <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
            <CheckCircle2 size={14} />
            {t("romance.completed", "Completed")}
          </div>
        )}
      </div>

      {/* Tip content */}
      <h3 className="font-semibold text-foreground text-sm mb-1.5">{tip.title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">{tip.content}</p>

      {tip.actionStep && (
        <div className="bg-black/20 rounded-lg px-3 py-2 mb-4">
          <p className="text-xs text-rose-300 font-medium">
            <Sparkles size={10} className="inline mr-1" />
            {t("romance.action", "Action")}: {tip.actionStep}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        {!done ? (
          <button
            onClick={handleMarkDone}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold transition-colors"
          >
            <Heart size={12} fill="currentColor" />
            {t("romance.markDone", "Mark as done +15 XP")}
          </button>
        ) : (
          <div className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
            <CheckCircle2 size={12} />
            {t("romance.missionDone", "Romance mission complete!")}
          </div>
        )}
        <Link href="/app/intimacy">
          <button className="p-2 rounded-lg bg-card border border-border hover:border-primary/40 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronRight size={14} />
          </button>
        </Link>
      </div>
    </div>
  );
}
