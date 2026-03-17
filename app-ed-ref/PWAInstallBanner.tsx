import { useState } from "react";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, Share, X, Smartphone } from "lucide-react";
import { useTranslation } from "react-i18next";

export function PWAInstallBanner() {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { t } = useTranslation();

  if (isInstalled || dismissed) return null;
  if (!isInstallable && !isIOS) return null;

  return (
    <>
      {/* Banner */}
      <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-6 md:w-80">
        <div className="bg-card border border-primary/40 rounded-2xl p-4 shadow-2xl glow-gold-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
              <Smartphone size={18} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-sm">{t("pwa.bannerTitle")}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t("pwa.bannerDesc")}
              </p>
              <div className="flex gap-2 mt-3">
                {isIOS ? (
                  <Button
                    size="sm"
                    className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90 flex-1"
                    onClick={() => setShowIOSGuide(true)}
                  >
                    <Share size={12} className="mr-1.5" /> {t("pwa.howToInstall")}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90 flex-1"
                    onClick={install}
                  >
                    <Download size={12} className="mr-1.5" /> {t("pwa.installNow")}
                  </Button>
                )}
              </div>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Guide Dialog */}
      <Dialog open={showIOSGuide} onOpenChange={setShowIOSGuide}>
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-foreground flex items-center gap-2">
              <Smartphone size={18} className="text-primary" />
              {t("pwa.iosTitle")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              {t("pwa.iosIntro")}
            </p>
            <div className="space-y-3">
              {[
                { step: "1", text: t("pwa.iosStep1") },
                { step: "2", text: t("pwa.iosStep2") },
                { step: "3", text: t("pwa.iosStep3") },
              ].map((item) => (
                <div key={item.step} className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
                    {item.step}
                  </div>
                  <p className="text-sm text-foreground pt-0.5">{item.text}</p>
                </div>
              ))}
            </div>
            <div className="bg-accent/30 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">
                💡 {t("pwa.iosTip")}
              </p>
            </div>
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => { setShowIOSGuide(false); setDismissed(true); }}
            >
              {t("pwa.understood")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Compact install button for use in navigation/profile
export function PWAInstallButton() {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const { t } = useTranslation();

  if (isInstalled) return null;
  if (!isInstallable && !isIOS) return null;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="border-primary/40 text-primary hover:bg-primary/10 text-xs h-8"
        onClick={isIOS ? () => setShowIOSGuide(true) : install}
      >
        <Download size={13} className="mr-1.5" />
        {isIOS ? t("pwa.installIOS") : t("pwa.installApp")}
      </Button>

      <Dialog open={showIOSGuide} onOpenChange={setShowIOSGuide}>
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-foreground">{t("pwa.iosTitle")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {[
              t("pwa.iosStep1"),
              t("pwa.iosStep2"),
              t("pwa.iosStep3"),
            ].map((step, i) => (
              <div key={i} className="flex gap-3 items-center">
                <div className="w-6 h-6 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                  {i + 1}
                </div>
                <p className="text-sm text-foreground">{step}</p>
              </div>
            ))}
            <Button className="w-full mt-2 bg-primary text-primary-foreground" onClick={() => setShowIOSGuide(false)}>
              {t("pwa.understood")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
