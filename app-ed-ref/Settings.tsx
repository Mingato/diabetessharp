import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/_core/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { TOUR_KEY } from "@/components/OnboardingTour";
import { LANGUAGES } from "@/lib/i18n";
import i18n from "@/lib/i18n";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import NotificationSettings from "@/components/NotificationSettings";
import { cn } from "@/lib/utils";
import {
  User,
  Palette,
  Bell,
  Shield,
  Sun,
  Moon,
  RotateCcw,
  LogOut,
  Trash2,
  ChevronRight,
} from "lucide-react";

type Tab = "account" | "appearance" | "notifications" | "privacy";

export default function Settings() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>("account");

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => { window.location.href = "/"; },
  });

  const handleRestartTour = () => {
    localStorage.removeItem(TOUR_KEY);
    toast.success(t("profilePage.tourRestarted"));
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "account", label: t("settings.account", "Account"), icon: User },
    { id: "appearance", label: t("settings.appearance", "Appearance"), icon: Palette },
    { id: "notifications", label: t("settings.notifications", "Notifications"), icon: Bell },
    { id: "privacy", label: t("settings.privacy", "Privacy & Security"), icon: Shield },
  ];

  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) ?? "U";

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          {t("settings.title", "Settings")}
        </h1>
        <p className="text-muted-foreground">
          {t("settings.subtitle", "Manage your account, appearance, and preferences.")}
        </p>
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Sidebar tabs */}
        <aside className="lg:w-56 shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left",
                    activeTab === tab.id
                      ? "bg-primary/15 text-primary border border-primary/20"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon size={16} />
                  {tab.label}
                  {activeTab === tab.id && <ChevronRight size={14} className="ml-auto" />}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* ── ACCOUNT TAB ─────────────────────────────────────── */}
          {activeTab === "account" && (
            <>
              {/* User info card */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  {t("settings.accountInfo", "Account Information")}
                </h2>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center shrink-0">
                    <span className="font-display font-bold text-xl text-primary">{initials}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-lg">{user?.name}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                    <p className="text-xs text-muted-foreground mt-1 capitalize">
                      {t("settings.loginVia", "Login via")} {user?.loginMethod}
                    </p>
                  </div>
                </div>
              </div>

              {/* Language */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  {t("settings.language", "Language")}
                </h2>
                <div className="flex gap-3 flex-wrap">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        i18n.changeLanguage(lang.code);
                        toast.success(t("settings.languageChanged", "Language updated"));
                      }}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all",
                        i18n.language === lang.code
                          ? "bg-primary/15 border-primary/40 text-primary ring-1 ring-primary/30"
                          : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sign out */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  {t("settings.session", "Session")}
                </h2>
                <Button
                  variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 w-full sm:w-auto"
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                >
                  <LogOut size={16} className="mr-2" />
                  {t("nav.logout", "Sign Out")}
                </Button>
              </div>
            </>
          )}

          {/* ── APPEARANCE TAB ──────────────────────────────────── */}
          {activeTab === "appearance" && (
            <>
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  {t("settings.colorTheme", "Color Theme")}
                </h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => theme !== "dark" && toggleTheme?.()}
                    className={cn(
                      "flex-1 flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all",
                      theme === "dark"
                        ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                        : "border-border hover:border-primary/40 hover:bg-accent"
                    )}
                  >
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center">
                      <Moon size={20} className="text-amber-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-foreground">{t("nav.dark", "Dark")}</p>
                      <p className="text-xs text-muted-foreground">{t("settings.darkDesc", "Easy on the eyes")}</p>
                    </div>
                    {theme === "dark" && (
                      <span className="text-xs text-primary font-medium">{t("settings.active", "Active")}</span>
                    )}
                  </button>
                  <button
                    onClick={() => theme !== "light" && toggleTheme?.()}
                    className={cn(
                      "flex-1 flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all",
                      theme === "light"
                        ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                        : "border-border hover:border-primary/40 hover:bg-accent"
                    )}
                  >
                    <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                      <Sun size={20} className="text-amber-600" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-foreground">{t("nav.light", "Light")}</p>
                      <p className="text-xs text-muted-foreground">{t("settings.lightDesc", "Bright and clear")}</p>
                    </div>
                    {theme === "light" && (
                      <span className="text-xs text-primary font-medium">{t("settings.active", "Active")}</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Tour */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  {t("settings.onboarding", "Onboarding")}
                </h2>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{t("profilePage.restartTour", "Restart App Tour")}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t("profilePage.restartTourDesc", "See the welcome tour again")}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleRestartTour}>
                    <RotateCcw size={14} className="mr-2" />
                    {t("settings.restart", "Restart")}
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* ── NOTIFICATIONS TAB ───────────────────────────────── */}
          {activeTab === "notifications" && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                {t("settings.pushNotifications", "Push Notifications")}
              </h2>
              <NotificationSettings />
            </div>
          )}

          {/* ── PRIVACY TAB ─────────────────────────────────────── */}
          {activeTab === "privacy" && (
            <>
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  {t("settings.dataPrivacy", "Data & Privacy")}
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/30">
                    <Shield size={18} className="text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{t("settings.privateTitle", "Your data is private")}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t("settings.privateDesc", "All your health data is encrypted and never shared with third parties. You can delete your account and all associated data at any time.")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="text-sm font-medium text-foreground">{t("settings.loginMethod", "Login Method")}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user?.loginMethod}</p>
                    </div>
                    <span className="text-xs bg-primary/15 text-primary px-2 py-1 rounded-full font-medium">
                      {t("settings.secure", "Secure")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{t("settings.memberSince", "Member Since")}</p>
                      <p className="text-xs text-muted-foreground">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-red-500/20 rounded-xl p-6">
                <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-4">
                  {t("settings.dangerZone", "Danger Zone")}
                </h2>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{t("settings.deleteAccount", "Delete Account")}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t("settings.deleteAccountDesc", "Permanently delete your account and all data. This cannot be undone.")}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10 shrink-0"
                    onClick={() => toast.error(t("settings.deleteContact", "Please contact support to delete your account."))}
                  >
                    <Trash2 size={14} className="mr-2" />
                    {t("settings.delete", "Delete")}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
