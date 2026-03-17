import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronRight, ChevronLeft, X, Zap, Dumbbell, MessageCircle, TrendingUp, Salad, CheckCircle2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

const TOUR_STEP_KEYS = [
  { icon: Zap, titleKey: "tour.step1Title", descKey: "tour.step1Desc", color: "text-primary", bg: "bg-primary/15" },
  { icon: CheckCircle2, titleKey: "tour.step2Title", descKey: "tour.step2Desc", color: "text-emerald-400", bg: "bg-emerald-400/15" },
  { icon: Dumbbell, titleKey: "tour.step3Title", descKey: "tour.step3Desc", color: "text-blue-400", bg: "bg-blue-400/15" },
  { icon: MessageCircle, titleKey: "tour.step4Title", descKey: "tour.step4Desc", color: "text-purple-400", bg: "bg-purple-400/15" },
  { icon: Salad, titleKey: "tour.step5Title", descKey: "tour.step5Desc", color: "text-green-400", bg: "bg-green-400/15" },
  { icon: TrendingUp, titleKey: "tour.step6Title", descKey: "tour.step6Desc", color: "text-yellow-400", bg: "bg-yellow-400/15" },
  { icon: Zap, titleKey: "tour.step7Title", descKey: "tour.step7Desc", color: "text-primary", bg: "bg-primary/15" },
];

export const TOUR_KEY = "vigronex_tour_completed";

export function OnboardingTour() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const sendWelcome = trpc.push.sendWelcome.useMutation();

  useEffect(() => {
    const completed = localStorage.getItem(TOUR_KEY);
    if (!completed) {
      // Delay slightly so the dashboard renders first
      const timer = setTimeout(() => setOpen(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = (completed = false) => {
    localStorage.setItem(TOUR_KEY, "true");
    setOpen(false);
    if (completed) {
      // Fire-and-forget welcome push notification
      sendWelcome.mutate();
    }
  };

  const handleNext = () => {
    if (step < TOUR_STEP_KEYS.length - 1) {
      setStep(step + 1);
    } else {
      handleClose(true);
    }
  };

  const current = TOUR_STEP_KEYS[step];
  const Icon = current.icon;
  const isLast = step === TOUR_STEP_KEYS.length - 1;
  const title = t(current.titleKey);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="bg-card border-border max-w-sm p-0 overflow-hidden">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        {/* Progress bar */}
        <div className="h-1 bg-accent">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${((step + 1) / TOUR_STEP_KEYS.length) * 100}%` }}
          />
        </div>

        <div className="p-6 space-y-5">
          {/* Close button */}
          <div className="flex justify-end">
            <button onClick={() => handleClose(false)} className="text-muted-foreground hover:text-foreground transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Icon */}
          <div className="flex justify-center">
            <div className={`w-20 h-20 rounded-2xl ${current.bg} border border-current/20 flex items-center justify-center`}>
              <Icon size={40} className={current.color} />
            </div>
          </div>

          {/* Content */}
          <div className="text-center space-y-2">
            <h2 className="text-xl font-display font-bold text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{t(current.descKey)}</p>
          </div>

          {/* Step dots */}
          <div className="flex justify-center gap-1.5">
            {TOUR_STEP_KEYS.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === step ? "bg-primary w-4" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            {step > 0 && (
              <Button
                variant="outline"
                className="flex-1 border-border text-muted-foreground"
                onClick={() => setStep(step - 1)}
              >
                <ChevronLeft size={16} className="mr-1" /> {t("tour.prev")}
              </Button>
            )}
            <Button
              className={`flex-1 bg-primary text-primary-foreground hover:bg-primary/90 ${step === 0 ? "w-full" : ""}`}
              onClick={handleNext}
            >
              {isLast ? (
                <>{t("tour.startNow")}</>
              ) : (
                <>{t("tour.next")} <ChevronRight size={16} className="ml-1" /></>
              )}
            </Button>
          </div>

          {/* Skip */}
          {!isLast && (
            <button
              onClick={() => handleClose(false)}
              className="w-full text-center text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              {t("tour.skip")}
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
