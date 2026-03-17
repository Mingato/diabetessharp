import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "@/lib/i18n";

const STORAGE_KEY = "riseup_language_welcomed";

export default function LanguageWelcomeModal() {
  const { i18n } = useTranslation();
  const [show, setShow] = useState(false);
  const [detectedLang, setDetectedLang] = useState<string>("en");

  useEffect(() => {
    // Only show if user hasn't been welcomed before
    const welcomed = localStorage.getItem(STORAGE_KEY);
    if (welcomed) return;

    // Detect browser language
    const browserLang = navigator.language || "en";
    let matched = "en";
    if (browserLang.startsWith("pt")) matched = "pt-BR";
    else if (browserLang.startsWith("es")) matched = "es";

    setDetectedLang(matched);

    // Only show modal if detected language differs from current or no language was saved
    const savedLang = localStorage.getItem("riseup_language");
    if (!savedLang) {
      setShow(true);
    } else {
      // Already has a saved language, just mark as welcomed
      localStorage.setItem(STORAGE_KEY, "1");
    }
  }, []);

  const handleAccept = () => {
    i18n.changeLanguage(detectedLang);
    localStorage.setItem("riseup_language", detectedLang);
    localStorage.setItem(STORAGE_KEY, "1");
    setShow(false);
  };

  const handleChooseDifferent = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem("riseup_language", code);
    localStorage.setItem(STORAGE_KEY, "1");
    setShow(false);
  };

  if (!show) return null;

  const detected = LANGUAGES.find(l => l.code === detectedLang) || LANGUAGES[0];
  const others = LANGUAGES.filter(l => l.code !== detectedLang);

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4 pb-6 sm:pb-0">
      <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-6 shadow-2xl">
        {/* Logo */}
        <div className="text-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-rose-600 flex items-center justify-center mx-auto mb-3 text-2xl shadow-lg">
            ⚡
          </div>
          <h2 className="text-lg font-bold text-foreground">Welcome to RiseUp</h2>
          <p className="text-sm text-muted-foreground mt-1">
            We detected your language
          </p>
        </div>

        {/* Detected language */}
        <button
          onClick={handleAccept}
          className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-primary bg-primary/10 mb-4 transition-all hover:bg-primary/20"
        >
          <span className="text-3xl">{detected.flag}</span>
          <div className="flex-1 text-left">
            <p className="font-semibold text-foreground">{detected.label}</p>
            <p className="text-xs text-muted-foreground">Continue in this language</p>
          </div>
          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </button>

        {/* Other languages */}
        <p className="text-xs text-muted-foreground text-center mb-3">Or choose another language</p>
        <div className="flex gap-2">
          {others.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleChooseDifferent(lang.code)}
              className="flex-1 flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-card/80 transition-all"
            >
              <span className="text-2xl">{lang.flag}</span>
              <span className="text-xs text-muted-foreground">{lang.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
