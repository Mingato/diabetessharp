import { useCallback, useEffect, useState } from "react";

export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    (navigator as { standalone?: boolean }).standalone === true ||
    window.matchMedia("(display-mode: standalone)").matches ||
    (document.referrer.includes("android-app://") ?? false)
  );
}

/** Hook for PWA install / Add to Home Screen. Use in AppLayout fixed bar. */
export function useAddToHomeScreen() {
  const [installPrompt, setInstallPrompt] = useState<{ prompt: () => Promise<void> } | null>(null);
  const [isIOS] = useState(
    typeof window !== "undefined" && /iPhone|iPad|iPod/i.test(navigator.userAgent)
  );

  useEffect(() => {
    if (isStandalone()) return;
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt({ prompt: () => (e as { prompt: () => Promise<void> }).prompt() });
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const triggerInstall = useCallback(async () => {
    if (installPrompt) {
      await installPrompt.prompt();
      setInstallPrompt(null);
    }
  }, [installPrompt]);

  return { installPrompt, triggerInstall, isIOS, isStandalone: isStandalone() };
}
