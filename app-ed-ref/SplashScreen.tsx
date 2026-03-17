import { useEffect, useState } from "react";

const SPLASH_KEY = "vigronex_splash_shown";
const SPLASH_DURATION = 2200; // ms

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    // Enter → hold after 400ms
    const t1 = setTimeout(() => setPhase("hold"), 400);
    // Hold → exit after SPLASH_DURATION
    const t2 = setTimeout(() => setPhase("exit"), SPLASH_DURATION - 400);
    // Call onDone after full duration
    const t3 = setTimeout(() => onDone(), SPLASH_DURATION);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "oklch(0.13 0.025 240)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px",
        transition: "opacity 0.4s ease",
        opacity: phase === "exit" ? 0 : 1,
        pointerEvents: phase === "exit" ? "none" : "all",
      }}
    >
      {/* Logo icon */}
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: 24,
          background: "oklch(0.78 0.15 75)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 40px oklch(0.78 0.15 75 / 0.5)",
          transform: phase === "enter" ? "scale(0.6)" : "scale(1)",
          opacity: phase === "enter" ? 0 : 1,
          transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease",
        }}
      >
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
          <path
            d="M13 2L4.09 12.11a1 1 0 0 0 .77 1.64H11l-1 8 8.91-10.11a1 1 0 0 0-.77-1.64H13l1-8z"
            fill="oklch(0.13 0.025 240)"
            stroke="oklch(0.13 0.025 240)"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Brand name */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          transform: phase === "enter" ? "translateY(16px)" : "translateY(0)",
          opacity: phase === "enter" ? 0 : 1,
          transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s, opacity 0.4s ease 0.1s",
        }}
      >
        <span
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 900,
            fontSize: 32,
            color: "oklch(0.95 0.01 240)",
            letterSpacing: "-0.02em",
          }}
        >
          Vigronex
        </span>
        <span
          style={{
            fontSize: 12,
            color: "oklch(0.78 0.15 75)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          Performance Program
        </span>
      </div>

      {/* Loading dots */}
      <div
        style={{
          display: "flex",
          gap: 6,
          marginTop: 8,
          opacity: phase === "enter" ? 0 : 1,
          transition: "opacity 0.4s ease 0.3s",
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "oklch(0.78 0.15 75)",
              animation: `splashDot 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes splashDot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/**
 * Returns true if the splash screen should be shown.
 * Shows on first visit and on PWA standalone launches.
 */
export function shouldShowSplash(): boolean {
  // Always show in PWA standalone mode
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

  if (isStandalone) return true;

  // Show once per session on mobile browsers
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  if (!isMobile) return false;

  const shown = sessionStorage.getItem(SPLASH_KEY);
  if (!shown) {
    sessionStorage.setItem(SPLASH_KEY, "1");
    return true;
  }
  return false;
}
