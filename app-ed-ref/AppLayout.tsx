import { useAuth } from "@/_core/hooks/useAuth";
import { EmailVerificationModal } from "@/components/EmailVerificationModal";
import { getLoginUrl } from "@/const";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";
import { cn } from "@/lib/utils";
import { LANGUAGES } from "@/lib/i18n";
import {
  Activity,
  BookOpen,
  Camera,
  Dumbbell,
  Flame,
  Heart,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  Moon,
  Settings,
  Sparkles,
  Sun,
  TrendingUp,
  User,
  X,
  Zap,
  Salad,
  BarChart3,
  MessageSquareHeart,
  Users,
} from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { PWAInstallButton } from "@/components/PWAInstallBanner";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { useTheme } from "@/contexts/ThemeContext";
function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const currentLang = LANGUAGES.find(l => l.code === i18n.language) ?? LANGUAGES[0];
  const { isAuthenticated } = useAuth();
  const saveLanguageMutation = trpc.auth.saveLanguage.useMutation();

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    setOpen(false);
    if (isAuthenticated) {
      saveLanguageMutation.mutate({ language: code as "en" | "pt-BR" | "es" });
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-accent transition-colors text-sm"
        title="Change language"
      >
        <span className="text-base leading-none">{currentLang.flag}</span>
        <span className="text-xs text-muted-foreground hidden sm:inline">{currentLang.code.toUpperCase().replace("-BR", "")}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[140px]">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-accent transition-colors text-left",
                  i18n.language === lang.code && "text-primary font-medium"
                )}
              >
                <span className="text-base">{lang.flag}</span>
                <span>{lang.label}</span>
                {i18n.language === lang.code && <span className="ml-auto text-primary text-xs">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function BottomNavItem({ href, icon: Icon, label, scrollContainer }: { href: string; icon: typeof Home; label: string; scrollContainer?: React.RefObject<HTMLElement | null> }) {
  const [location, navigate] = useLocation();
  const isActive = location === href;
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isActive && btnRef.current && scrollContainer?.current) {
      const container = scrollContainer.current;
      const btn = btnRef.current;
      const btnLeft = btn.offsetLeft;
      const btnWidth = btn.offsetWidth;
      const containerWidth = container.clientWidth;
      const targetScroll = btnLeft - containerWidth / 2 + btnWidth / 2;
      container.scrollTo({ left: targetScroll, behavior: "smooth" });
    }
  }, [isActive, scrollContainer]);

  return (
    <button
      ref={btnRef}
      onClick={() => navigate(href)}
      className="flex-none px-3 flex flex-col items-center justify-center h-full gap-0.5 transition-colors relative"
    >
      {isActive && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-b-full" />}
      <Icon size={20} className={isActive ? "text-primary" : "text-muted-foreground"} />
      <span className={cn("text-[10px] font-medium leading-none mt-0.5", isActive ? "text-primary" : "text-muted-foreground")}>{label}</span>
    </button>
  );
}

function BottomNav({ items }: { items: { href: string; icon: typeof Home; label: string }[] }) {
  const scrollRef = useRef<HTMLElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      setShowLeftFade(el.scrollLeft > 8);
      setShowRightFade(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
      {/* Left fade */}
      {showLeftFade && (
        <div className="absolute left-0 top-0 bottom-0 w-10 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, hsl(var(--card)) 30%, transparent)" }}
        />
      )}
      {/* Right fade + chevron hint */}
      {showRightFade && (
        <div className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none flex items-center justify-end pr-1"
          style={{ background: "linear-gradient(to left, hsl(var(--card)) 30%, transparent)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground opacity-60">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      )}
      <nav
        ref={scrollRef}
        className="bg-card/95 backdrop-blur-sm border-t border-border h-16 overflow-x-auto overflow-y-hidden"
        style={{ scrollbarWidth: 'none' }}
      >
        <div className="flex items-stretch h-full min-w-max">
          {items.map((item) => (
            <BottomNavItem key={item.href} {...item} scrollContainer={scrollRef} />
          ))}
        </div>
      </nav>
    </div>
  );
}

function NavItem({ href, icon: Icon, label, onClick }: { href: string; icon: typeof Home; label: string; onClick?: () => void }) {
  const [location, navigate] = useLocation();
  const isActive = location === href;
  return (
    <button
      onClick={() => { navigate(href); onClick?.(); }}
      className="w-full text-left"
    >
      <div
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group",
          isActive
            ? "bg-primary/15 text-primary border border-primary/30"
            : "text-muted-foreground hover:text-foreground hover:bg-accent"
        )}
      >
        <Icon
          size={18}
          className={cn(
            "shrink-0 transition-colors",
            isActive ? "text-primary" : "group-hover:text-foreground"
          )}
        />
        <span className="text-sm font-medium">{label}</span>
        {isActive && (
          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
        )}
      </div>
    </button>
  );
}

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, loading, isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [emailVerified, setEmailVerified] = useState<boolean | null>(null);

  // Check email verification status for authenticated users
  const verificationQuery = trpc.authExt.getVerificationStatus.useQuery(
    { userId: user?.id ?? 0 },
    { enabled: !!user?.id && !!user?.email, staleTime: 60_000 }
  );

  // Once we know the status, store it
  useEffect(() => {
    if (verificationQuery.data !== undefined) {
      setEmailVerified(verificationQuery.data.verified);
    }
  }, [verificationQuery.data]);

  const showVerificationModal =
    isAuthenticated &&
    !!user?.email &&
    emailVerified === false &&
    !loading &&
    verificationQuery.isFetched;
  const [, navigate] = useLocation();
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  useSwipeNavigation();
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => { window.location.href = "/"; },
  });

  const navItems = [
    { href: "/app", icon: Home, label: t("nav.dashboard") },
    { href: "/app/exercises", icon: Dumbbell, label: t("nav.exercises") },
    { href: "/app/dr-apex", icon: MessageCircle, label: t("nav.drApex") },
    { href: "/app/nutrition", icon: Salad, label: t("nav.nutrition") },
    { href: "/app/progress", icon: TrendingUp, label: t("nav.progress") },
    { href: "/app/learn", icon: BookOpen, label: t("nav.learn") },
    { href: "/app/weekly-report", icon: BarChart3, label: t("nav.weeklyReport") },
    { href: "/app/photos", icon: Camera, label: t("nav.photos") },
    { href: "/app/intimacy", icon: Heart, label: t("nav.intimacy") },
    { href: "/app/romance-plan", icon: Sparkles, label: t("nav.romancePlan") },
    { href: "/app/sofia", icon: MessageSquareHeart, label: t("nav.sofia") },
    { href: "/app/couple", icon: Users, label: t("nav.coupleMode") },
    { href: "/app/fantasia", icon: Flame, label: t("nav.fantasia") },
    { href: "/app/profile", icon: User, label: t("nav.profile") },
    { href: "/app/settings", icon: Settings, label: t("nav.settings", "Settings") },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground text-sm">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = getLoginUrl();
    return null;
  }


  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-sidebar-border">
        <button onClick={() => navigate("/app")} className="w-full text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center glow-gold-sm">
              <Zap size={16} className="text-primary-foreground" fill="currentColor" />
            </div>
            <div>
              <span className="font-display font-bold text-foreground text-base tracking-tight">Vigronex</span>
              <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Performance Program</p>
            </div>
          </div>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} onClick={() => setMobileOpen(false)} />
        ))}
      </nav>

      {/* Language switcher + User footer */}
      <div className="px-3 py-4 border-t border-sidebar-border space-y-3">
        {/* Theme toggle */}
        <div className="px-1 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{t("nav.theme", "Theme")}</span>
          <button
            onClick={toggleTheme}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all",
              theme === "dark"
                ? "bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700"
                : "bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100"
            )}
            title={theme === "dark" ? t("nav.switchLight", "Switch to light mode") : t("nav.switchDark", "Switch to dark mode")}
          >
            {theme === "dark" ? (
              <><Sun size={12} /><span>{t("nav.light", "Light")}</span></>
            ) : (
              <><Moon size={12} /><span>{t("nav.dark", "Dark")}</span></>
            )}
          </button>
        </div>
        {/* Language selector */}
        <div className="px-1 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Language</span>
          <div className="flex gap-1">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => i18n.changeLanguage(lang.code)}
                title={lang.label}
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center text-base transition-all",
                  i18n.language === lang.code
                    ? "bg-primary/20 border border-primary/40 ring-1 ring-primary/30"
                    : "hover:bg-accent opacity-60 hover:opacity-100"
                )}
              >
                {lang.flag}
              </button>
            ))}
          </div>
        </div>
        <div className="px-1">
          <PWAInstallButton />
        </div>
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-accent/50">
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-primary">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{user?.name || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email || ""}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={() => logoutMutation.mutate()}
            title={t("nav.logout")}
          >
            <LogOut size={14} />
          </Button>
        </div>
      </div>
    </div>
  );

  // Bottom nav items for mobile — all dashboard items, scrollable
  const bottomNavItems = [
    { href: "/app", icon: Home, label: t("nav.dashboard") },
    { href: "/app/exercises", icon: Dumbbell, label: t("nav.exercises") },
    { href: "/app/dr-apex", icon: MessageCircle, label: t("nav.drApex") },
    { href: "/app/nutrition", icon: Salad, label: t("nav.nutrition") },
    { href: "/app/progress", icon: TrendingUp, label: t("nav.progress") },
    { href: "/app/learn", icon: BookOpen, label: t("nav.learn") },
    { href: "/app/weekly-report", icon: BarChart3, label: t("nav.weeklyReport") },
    { href: "/app/photos", icon: Camera, label: t("nav.photos") },
    { href: "/app/intimacy", icon: Heart, label: t("nav.intimacy") },
    { href: "/app/romance-plan", icon: Sparkles, label: t("nav.romancePlan") },
    { href: "/app/sofia", icon: MessageSquareHeart, label: t("nav.sofia") },
    { href: "/app/couple", icon: Users, label: t("nav.coupleMode") },
    { href: "/app/fantasia", icon: Flame, label: t("nav.fantasia") },
    { href: "/app/profile", icon: User, label: t("nav.profile") },
    { href: "/app/settings", icon: Settings, label: t("nav.settings", "Settings") },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Email verification modal for new users */}
      {showVerificationModal && user && (
        <EmailVerificationModal
          open={true}
          userId={user.id}
          email={user.email!}
          name={user.name ?? undefined}
          onVerified={() => setEmailVerified(true)}
        />
      )}
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-sidebar border-r border-sidebar-border">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-sidebar border-r border-sidebar-border overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-4 border-b border-sidebar-border">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                  <Zap size={14} className="text-primary-foreground" fill="currentColor" />
                </div>
                <span className="font-display font-bold text-foreground">Vigronex</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                <X size={18} />
              </Button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card shrink-0">
          <Button variant="ghost" size="icon" className="-ml-2" onClick={() => setMobileOpen(true)}>
            <Menu size={20} />
          </Button>
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-primary" fill="currentColor" />
            <span className="font-display font-bold text-foreground">Vigronex</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleTheme}
              className={cn(
                "w-8 h-8 rounded-lg border flex items-center justify-center transition-all",
                theme === "dark"
                  ? "bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700"
                  : "bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100"
              )}
              title={theme === "dark" ? t("nav.switchLight") : t("nav.switchDark")}
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <LanguageSwitcher />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
          {children}
        </main>

        {/* Mobile bottom navigation bar */}
        <BottomNav items={bottomNavItems} />
      </div>
    </div>
  );
}
