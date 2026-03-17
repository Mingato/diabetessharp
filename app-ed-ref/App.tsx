import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Exercises from "./pages/Exercises";
import DrApex from "./pages/DrApex";
import Progress from "./pages/Progress";
import Learn from "./pages/Learn";
import Profile from "./pages/Profile";
import Subscribe from "./pages/Subscribe";
import Nutrition from "./pages/Nutrition";
import WeeklyReport from "./pages/WeeklyReport";
import ProgressPhotos from "./pages/ProgressPhotos";
import Intimacy from "./pages/Intimacy";
import RomancePlan from "./pages/RomancePlan";
import Sofia from "./pages/Sofia";
import CoupleMode from "./pages/CoupleMode";
import SharedFavorites from "./pages/SharedFavorites";
import Fantasia from "./pages/Fantasia";
import SharedFantasy from "./pages/SharedFantasy";
import Settings from "./pages/Settings";
import AppLayout from "./components/AppLayout";
import { PWAInstallBanner } from "./components/PWAInstallBanner";
import LanguageWelcomeModal from "./components/LanguageWelcomeModal";
import { SplashScreen, shouldShowSplash } from "./components/SplashScreen";
import { useState } from "react";
// Admin panel
import { AdminProvider } from "./contexts/AdminContext";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminUserDetail from "./pages/admin/AdminUserDetail";
import AdminAuditLog from "./pages/admin/AdminAuditLog";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminSupport from "./pages/admin/AdminSupport";
// Auth utility pages
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
// Sales funnel quiz + funnel pages
import Quiz from "./pages/Quiz";
import Advertorial from "./pages/Advertorial";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import Upsell1 from "./pages/Upsell1";
import Upsell2 from "./pages/Upsell2";
import Upsell3 from "./pages/Upsell3";
import UpsellSuccess from "./pages/UpsellSuccess";
import UpsellSkip from "./pages/UpsellSkip";
import ThankYou from "./pages/ThankYou";
import Reviews from "./pages/Reviews";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import RefundPolicy from "./pages/RefundPolicy";
import Contact from "./pages/Contact";

// Wrap each app page with the shared AppLayout
function AppPage({ component: Component }: { component: React.ComponentType }) {
  return (
    <AppLayout>
      <Component />
    </AppLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/subscribe" component={Subscribe} />
      {/* Auth utility routes */}
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      {/* Sales funnel — advertorial → quiz → checkout */}
      <Route path="/advertorial" component={Advertorial} />
      <Route path="/quiz" component={Quiz} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/checkout/success" component={CheckoutSuccess} />
      {/* Upsell funnel */}
      <Route path="/checkout/upsell1" component={Upsell1} />
      <Route path="/checkout/upsell2" component={Upsell2} />
      <Route path="/checkout/upsell3" component={Upsell3} />
      <Route path="/checkout/upsell-success" component={UpsellSuccess} />
      <Route path="/checkout/upsell-skip" component={UpsellSkip} />
      <Route path="/checkout/thankyou" component={ThankYou} />
      <Route path="/reviews" component={Reviews} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/terms" component={TermsOfUse} />
      <Route path="/refund-policy" component={RefundPolicy} />
      <Route path="/contact" component={Contact} />
      {/* Admin routes */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/admin/users/:id" component={AdminUserDetail} />
      <Route path="/admin/audit" component={AdminAuditLog} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route path="/admin/support" component={AdminSupport} />
      {/* App routes — each registered individually so wouter can match them */}
      <Route path="/app" component={() => <AppPage component={Dashboard} />} />
      <Route path="/app/exercises" component={() => <AppPage component={Exercises} />} />
      <Route path="/app/dr-apex" component={() => <AppPage component={DrApex} />} />
      <Route path="/app/progress" component={() => <AppPage component={Progress} />} />
      <Route path="/app/learn" component={() => <AppPage component={Learn} />} />
      <Route path="/app/nutrition" component={() => <AppPage component={Nutrition} />} />
      <Route path="/app/profile" component={() => <AppPage component={Profile} />} />
      <Route path="/app/weekly-report" component={() => <AppPage component={WeeklyReport} />} />
      <Route path="/app/photos" component={() => <AppPage component={ProgressPhotos} />} />
      <Route path="/app/intimacy" component={() => <AppPage component={Intimacy} />} />
      <Route path="/app/romance-plan" component={() => <AppPage component={RomancePlan} />} />
      <Route path="/app/sofia" component={() => <AppPage component={Sofia} />} />
      <Route path="/app/couple" component={() => <AppPage component={CoupleMode} />} />
      <Route path="/app/fantasia" component={() => <AppPage component={Fantasia} />} />
      <Route path="/app/settings" component={() => <AppPage component={Settings} />} />
      <Route path="/share/:token" component={SharedFavorites} />
      <Route path="/fantasy/:token" component={SharedFantasy} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(() => shouldShowSplash());

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable>
        <AdminProvider>
          <TooltipProvider>
            <Toaster richColors position="top-right" />
            {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}
            <Router />
            <PWAInstallBanner />
            <LanguageWelcomeModal />
          </TooltipProvider>
        </AdminProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
