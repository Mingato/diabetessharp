import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/_core/hooks/useAuth";
import { TOUR_KEY } from "@/components/OnboardingTour";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Activity,
  Award,
  Calendar,
  CheckCircle,
  LogOut,
  Moon,
  Pill,
  Settings,
  Shield,
  Sun,
  Target,
  User,
  X,
  Zap,
} from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import NotificationSettings from "@/components/NotificationSettings";
import { Bell, Palette, RotateCcw } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function Profile() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const handleRestartTour = () => {
    localStorage.removeItem(TOUR_KEY);
    toast.success(t("profilePage.tourRestarted"));
  };
  const { data: profile, refetch } = trpc.profile.get.useQuery();
  const { data: stats } = trpc.gamification.getStats.useQuery();
  const { data: subscription } = trpc.subscription.getStatus.useQuery();

  const [medications, setMedications] = useState<string[]>([]);
  const [supplements, setSupplements] = useState<string[]>([]);
  const [newMed, setNewMed] = useState("");
  const [newSupp, setNewSupp] = useState("");

  const updateProfileMutation = trpc.profile.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated!");
      refetch();
    },
    onError: (err) => toast.error("Failed to update: " + err.message),
  });

  const handleAddMedication = () => {
    if (!newMed.trim()) return;
    const updated = [...medications, newMed.trim()];
    setMedications(updated);
    setNewMed("");
    updateProfileMutation.mutate({ medications: updated });
  };

  const handleAddSupplement = () => {
    if (!newSupp.trim()) return;
    const updated = [...supplements, newSupp.trim()];
    setSupplements(updated);
    setNewSupp("");
    updateProfileMutation.mutate({ supplements: updated });
  };

  const removeMed = (i: number) => {
    const updated = medications.filter((_, idx) => idx !== i);
    setMedications(updated);
    updateProfileMutation.mutate({ medications: updated });
  };

  const removeSupp = (i: number) => {
    const updated = supplements.filter((_, idx) => idx !== i);
    setSupplements(updated);
    updateProfileMutation.mutate({ supplements: updated });
  };

  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) ?? "U";
  const programDay = profile?.programDay ?? 1;
  const xpLevel = Math.floor((stats?.totalXp ?? 0) / 500) + 1;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Profile</h1>
        <p className="text-muted-foreground">Manage your health profile and account settings.</p>
      </div>

      {/* User card */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center">
            <span className="font-display font-bold text-xl text-primary">{initials}</span>
          </div>
          <div className="flex-1">
            <h2 className="font-display text-xl font-bold text-foreground">{user?.name ?? "User"}</h2>
            <p className="text-muted-foreground text-sm">{user?.email ?? ""}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-primary/15 text-primary border-primary/30 text-xs">
                <Zap size={10} className="mr-1" /> Level {xpLevel}
              </Badge>
              <Badge className="bg-accent text-muted-foreground border-border text-xs">
                <Calendar size={10} className="mr-1" /> Day {programDay} of 90
              </Badge>
              {subscription?.status === "active" && (
                <Badge className="bg-green-500/15 text-green-400 border-green-500/30 text-xs">
                  <CheckCircle size={10} className="mr-1" /> Premium
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Program info */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
          <Target size={18} className="text-primary" />
          Program Details
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Age Group", value: profile?.age ? `${profile.age}` : "—" },
            { label: "ED Severity", value: profile?.edSeverity ? profile.edSeverity.charAt(0).toUpperCase() + profile.edSeverity.slice(1) : "—" },
            { label: "Primary Goal", value: profile?.primaryGoal?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) ?? "—" },
            { label: "Exercise Frequency", value: profile?.exerciseFrequency ?? "—" },
            { label: "Sleep Hours", value: profile?.sleepHours ? `${profile.sleepHours}h` : "—" },
            { label: "Stress Level", value: profile?.stressLevel ? `${profile.stressLevel}/10` : "—" },
          ].map((item) => (
            <div key={item.label} className="bg-accent/30 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">{item.label}</div>
              <div className="font-medium text-foreground text-sm">{item.value}</div>
            </div>
          ))}
        </div>
        <Link href="/onboarding">
          <Button variant="outline" size="sm" className="mt-4 border-border text-muted-foreground">
            <Settings size={14} className="mr-2" /> Update Questionnaire
          </Button>
        </Link>
      </div>

      {/* Medications */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
          <Pill size={18} className="text-primary" />
          Medications
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Track medications you're taking. This helps Dr. Apex provide more relevant guidance.
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {medications.map((med, i) => (
            <Badge key={i} className="bg-accent border-border text-foreground flex items-center gap-1 pr-1">
              {med}
              <button onClick={() => removeMed(i)} className="ml-1 text-muted-foreground hover:text-foreground">
                <X size={12} />
              </button>
            </Badge>
          ))}
          {medications.length === 0 && <p className="text-sm text-muted-foreground">No medications added.</p>}
        </div>
        <div className="flex gap-2">
          <Input
            value={newMed}
            onChange={(e) => setNewMed(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddMedication()}
            placeholder="Add medication..."
            className="bg-accent border-border text-foreground placeholder:text-muted-foreground"
          />
          <Button onClick={handleAddMedication} variant="outline" className="border-border shrink-0">Add</Button>
        </div>
      </div>

      {/* Supplements */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
          <Activity size={18} className="text-primary" />
          Supplements
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Track supplements you're taking to optimize your program.
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {supplements.map((supp, i) => (
            <Badge key={i} className="bg-accent border-border text-foreground flex items-center gap-1 pr-1">
              {supp}
              <button onClick={() => removeSupp(i)} className="ml-1 text-muted-foreground hover:text-foreground">
                <X size={12} />
              </button>
            </Badge>
          ))}
          {supplements.length === 0 && <p className="text-sm text-muted-foreground">No supplements added.</p>}
        </div>
        <div className="flex gap-2">
          <Input
            value={newSupp}
            onChange={(e) => setNewSupp(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddSupplement()}
            placeholder="Add supplement..."
            className="bg-accent border-border text-foreground placeholder:text-muted-foreground"
          />
          <Button onClick={handleAddSupplement} variant="outline" className="border-border shrink-0">Add</Button>
        </div>
      </div>

      {/* Subscription */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
          <Shield size={18} className="text-primary" />
          Subscription
        </h3>
        {subscription?.status === "active" ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center">
              <CheckCircle size={18} className="text-green-400" />
            </div>
            <div>
              <div className="font-semibold text-foreground">Premium Active</div>
              <div className="text-xs text-muted-foreground">
                {subscription.endsAt ? `Renews ${new Date(subscription.endsAt).toLocaleDateString()}` : "Active subscription"}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-semibold text-foreground">Free Plan</div>
              <div className="text-xs text-muted-foreground">Upgrade to unlock all features</div>
            </div>
            <Link href="/app/subscribe">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0">
                Upgrade to Premium
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Achievements summary */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
          <Award size={18} className="text-primary" />
          Stats Summary
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="font-display text-2xl font-bold text-primary">{stats?.totalXp ?? 0}</div>
            <div className="text-xs text-muted-foreground">Total XP</div>
          </div>
          <div>
            <div className="font-display text-2xl font-bold text-orange-400">{stats?.longestStreak ?? 0}</div>
            <div className="text-xs text-muted-foreground">Best Streak</div>
          </div>
          <div>
            <div className="font-display text-2xl font-bold text-foreground">{stats?.totalExercisesCompleted ?? 0}</div>
            <div className="text-xs text-muted-foreground">Exercises Done</div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
          <Bell size={18} className="text-primary" />
          Notifications
        </h3>
        <NotificationSettings />
      </div>

      {/* Appearance */}
      <ThemeToggleSection />

      {/* Restart Tour */}
      <Button
        variant="outline"
        onClick={handleRestartTour}
        className="w-full border-border text-muted-foreground hover:text-foreground mb-3"
      >
        <RotateCcw size={16} className="mr-2" />
        {t("profilePage.restartTour")}
      </Button>

      {/* Sign out */}
      <Button
        variant="outline"
        onClick={logout}
        className="w-full border-border text-muted-foreground hover:text-foreground"
      >
        <LogOut size={16} className="mr-2" />
        Sign Out
      </Button>
    </div>
  );
}

function ThemeToggleSection() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-6">
      <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
        <Palette size={18} className="text-primary" />
        Appearance
      </h3>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">
            {isDark ? "Dark Mode" : "Light Mode"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isDark
              ? "Easy on the eyes in low-light environments"
              : "Clean and bright for daytime use"}
          </p>
        </div>
        <button
          onClick={toggleTheme}
          className={cn(
            "relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
            isDark ? "bg-primary" : "bg-muted border border-border"
          )}
          aria-label="Toggle theme"
        >
          <span
            className={cn(
              "inline-flex h-6 w-6 items-center justify-center rounded-full bg-background shadow-sm transition-transform",
              isDark ? "translate-x-7" : "translate-x-1"
            )}
          >
            {isDark ? (
              <Moon size={12} className="text-primary" />
            ) : (
              <Sun size={12} className="text-yellow-500" />
            )}
          </span>
        </button>
      </div>

      {/* Theme preview chips */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={() => !isDark || toggleTheme?.()}
          className={cn(
            "flex-1 rounded-lg border p-3 text-left transition-all",
            !isDark
              ? "border-primary bg-primary/10 ring-1 ring-primary"
              : "border-border bg-muted/30 hover:border-primary/40"
          )}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <Sun size={14} className="text-yellow-500" />
            <span className="text-xs font-medium text-foreground">Light</span>
          </div>
          <div className="flex gap-1">
            <div className="h-2 w-8 rounded-full bg-gray-200" />
            <div className="h-2 w-5 rounded-full bg-yellow-400" />
            <div className="h-2 w-6 rounded-full bg-gray-300" />
          </div>
        </button>
        <button
          onClick={() => isDark || toggleTheme?.()}
          className={cn(
            "flex-1 rounded-lg border p-3 text-left transition-all",
            isDark
              ? "border-primary bg-primary/10 ring-1 ring-primary"
              : "border-border bg-muted/30 hover:border-primary/40"
          )}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <Moon size={14} className="text-blue-400" />
            <span className="text-xs font-medium text-foreground">Dark</span>
          </div>
          <div className="flex gap-1">
            <div className="h-2 w-8 rounded-full bg-slate-700" />
            <div className="h-2 w-5 rounded-full bg-yellow-400" />
            <div className="h-2 w-6 rounded-full bg-slate-600" />
          </div>
        </button>
      </div>
    </div>
  );
}
