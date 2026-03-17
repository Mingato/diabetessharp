import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  Dumbbell, Brain, TrendingUp, Heart, Apple, MessageCircle,
  Users, Calendar, Shield, CheckCircle, ChevronDown, ChevronUp,
  Star, ArrowRight, Quote, Zap
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

const BEFORE_AFTER_1 = "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/vigronex_before_after_1_b0ee2a58.jpg";
const BEFORE_AFTER_2 = "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/vigronex_before_after_2_610d03ed.jpg";
const TEAM_PHOTO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/vigronex_team_03417fa0.jpg";
const APP_MOCKUP = "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/vigronex_app_mockup_bc752225.jpg";
const TESTIMONIAL_1 = "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/vigronex_testimonial_1_ee8ad789.jpg";
const TESTIMONIAL_2 = "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/vigronex_testimonial_2_41e4aa6d.jpg";
const TESTIMONIAL_3 = "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/vigronex_testimonial_3_b218f64b.jpg";

const CARTPANDA_URL = "#"; // TODO: replace with CartPanda URL

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-5 text-left bg-white/5 hover:bg-white/10 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-white pr-4">{question}</span>
        {open
          ? <ChevronUp className="w-5 h-5 text-amber-400 shrink-0" />
          : <ChevronDown className="w-5 h-5 text-amber-400 shrink-0" />}
      </button>
      {open && (
        <div className="p-5 bg-white/[0.02] text-gray-300 leading-relaxed border-t border-white/10">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();

  // Auto-redirect authenticated users to /app
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/app");
    }
  }, [isAuthenticated, loading, navigate]);

  const features = [
    { icon: Dumbbell, key: "f1", color: "text-amber-400" },
    { icon: Brain, key: "f2", color: "text-blue-400" },
    { icon: TrendingUp, key: "f3", color: "text-green-400" },
    { icon: Heart, key: "f4", color: "text-rose-400" },
    { icon: Apple, key: "f5", color: "text-emerald-400" },
    { icon: MessageCircle, key: "f6", color: "text-purple-400" },
    { icon: Users, key: "f7", color: "text-pink-400" },
    { icon: Calendar, key: "f8", color: "text-cyan-400" },
  ];

  const faqs = ["q1", "q2", "q3", "q4", "q5", "q6"];

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("vigronex_lang", lang);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-black" fill="currentColor" />
            </div>
            <span className="font-black text-xl tracking-tight">Vigronex</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">{t("landing.nav.features")}</a>
            <a href="#results" className="hover:text-white transition-colors">{t("landing.nav.results")}</a>
            <a href="#about" className="hover:text-white transition-colors">{t("landing.nav.about")}</a>
            <a href="#faq" className="hover:text-white transition-colors">{t("landing.nav.faq")}</a>
          </div>

          <div className="flex items-center gap-3">
            {/* Language flags */}
            <div className="flex items-center gap-1">
              <button onClick={() => changeLanguage("en")} className={`text-lg hover:scale-110 transition-transform ${i18n.language === "en" ? "opacity-100" : "opacity-40"}`} title="English">🇺🇸</button>
              <button onClick={() => changeLanguage("pt-BR")} className={`text-lg hover:scale-110 transition-transform ${i18n.language === "pt-BR" ? "opacity-100" : "opacity-40"}`} title="Português">🇧🇷</button>
              <button onClick={() => changeLanguage("es")} className={`text-lg hover:scale-110 transition-transform ${i18n.language === "es" ? "opacity-100" : "opacity-40"}`} title="Español">🇪🇸</button>
            </div>
            {isAuthenticated ? (
              <Link href="/app">
                <Button size="sm" className="bg-amber-500 hover:bg-amber-400 text-black font-bold">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <a href={getLoginUrl()}>
                  <Button size="sm" variant="outline" className="border-amber-500/40 text-amber-400 hover:bg-amber-500/10 font-semibold">
                    {t("landing.nav.login")}
                  </Button>
                </a>
                <Link href="/advertorial">
                  <Button size="sm" className="bg-amber-500 hover:bg-amber-400 text-black font-bold">
                    {t("landing.nav.cta")}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 mb-8">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-amber-300 text-sm font-medium">{t("landing.hero.badge")}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-tight mb-6">
            {t("landing.hero.title1")}{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              {t("landing.hero.titleHighlight")}
            </span>
            <br />
            {t("landing.hero.title2")}
          </h1>
          <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            {t("landing.hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            {isAuthenticated ? (
              <Link href="/app">
                <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-black text-base md:text-lg px-6 md:px-10 py-4 md:py-6 rounded-2xl shadow-2xl shadow-amber-500/30">
                  Dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/advertorial">
                  <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-black text-base md:text-lg px-6 md:px-10 py-4 md:py-6 rounded-2xl shadow-2xl shadow-amber-500/30 animate-pulse">
                    🔥 TAKE THE FREE ASSESSMENT
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <a href={getLoginUrl()}>
                  <Button size="lg" variant="outline" className="border-amber-500/40 text-amber-300 hover:bg-amber-500/10 font-semibold text-base md:text-lg px-6 md:px-8 py-4 md:py-6 rounded-2xl bg-transparent">
                    {t("loginSection.signIn")}
                  </Button>
                </a>
              </>
            )}
          </div>
          <p className="text-sm text-gray-500">{t("landing.hero.trust")}</p>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 px-4 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {(["s1", "s2", "s3", "s4"] as const).map((k) => (
            <div key={k}>
              <div className="text-4xl font-black text-amber-400 mb-2">{t(`landing.stats.${k}`)}</div>
              <div className="text-sm text-gray-400">{t(`landing.stats.${k}Label`)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 mb-4">{t("landing.features.badge")}</Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">{t("landing.features.title")}</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">{t("landing.features.subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, key, color }) => (
              <div key={key} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.06] transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3 className="font-bold text-white mb-2">{t(`landing.features.${key}Title`)}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{t(`landing.features.${key}Desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APP SHOWCASE ── */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent via-amber-950/10 to-transparent">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 mb-4">{t("landing.appShowcase.badge")}</Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 leading-tight">{t("landing.appShowcase.title")}</h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">{t("landing.appShowcase.subtitle")}</p>
            <ul className="space-y-4">
              {(["p1", "p2", "p3", "p4"] as const).map((k) => (
                <li key={k} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                  <span className="text-gray-300">{t(`landing.appShowcase.${k}`)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-600/20 rounded-3xl blur-3xl" />
            <img src={APP_MOCKUP} alt="Vigronex App" className="relative z-10 rounded-3xl shadow-2xl w-full object-contain max-h-[500px]" />
          </div>
        </div>
      </section>

      {/* ── BEFORE & AFTER ── */}
      <section id="results" className="py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 mb-4">{t("landing.beforeAfter.badge")}</Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">{t("landing.beforeAfter.title")}</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">{t("landing.beforeAfter.subtitle")}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { img: BEFORE_AFTER_1, nameKey: "case1Name", descKey: "case1Desc" },
              { img: BEFORE_AFTER_2, nameKey: "case2Name", descKey: "case2Desc" },
            ].map(({ img, nameKey, descKey }) => (
              <div key={nameKey} className="bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden">
                <div className="relative">
                  <img src={img} alt={t(`landing.beforeAfter.${nameKey}`)} className="w-full h-72 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                    <span className="bg-red-500/80 text-white text-xs font-bold px-3 py-1 rounded-full">{t("landing.beforeAfter.before")}</span>
                    <span className="bg-amber-500/80 text-black text-xs font-bold px-3 py-1 rounded-full">{t("landing.beforeAfter.days")}</span>
                    <span className="bg-green-500/80 text-white text-xs font-bold px-3 py-1 rounded-full">{t("landing.beforeAfter.after")}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-white text-lg mb-2">{t(`landing.beforeAfter.${nameKey}`)}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{t(`landing.beforeAfter.${descKey}`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-4 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 mb-4">{t("landing.results.badge")}</Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">{t("landing.results.title")}</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">{t("landing.results.subtitle")}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { img: TESTIMONIAL_1, n: "t1" },
              { img: TESTIMONIAL_2, n: "t2" },
              { img: TESTIMONIAL_3, n: "t3" },
            ].map(({ img, n }) => (
              <div key={n} className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 flex flex-col">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <Quote className="w-8 h-8 text-amber-400/30 mb-3" />
                <p className="text-gray-300 text-sm leading-relaxed flex-1 mb-6 italic">"{t(`landing.results.${n}Text`)}"</p>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2 mb-4">
                  <span className="text-amber-400 text-sm font-bold">{t(`landing.results.${n}Result`)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <img src={img} alt={t(`landing.results.${n}Name`)} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <div className="font-bold text-white text-sm">{t(`landing.results.${n}Name`)}</div>
                    <div className="text-gray-500 text-xs">{t(`landing.results.${n}Location`)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GUARANTEE ── */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-amber-950/40 to-orange-950/40 border border-amber-500/20 rounded-3xl p-10 text-center">
            <div className="w-20 h-20 bg-amber-500/10 border-2 border-amber-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-amber-400" />
            </div>
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 mb-4">{t("landing.guarantee.badge")}</Badge>
            <h2 className="text-4xl font-black mb-4">{t("landing.guarantee.title")}</h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">{t("landing.guarantee.subtitle")}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {(["p1", "p2", "p3", "p4"] as const).map((k) => (
                <div key={k} className="flex items-center gap-2 bg-white/5 rounded-xl p-3">
                  <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                  <span className="text-sm text-gray-300">{t(`landing.guarantee.${k}`)}</span>
                </div>
              ))}
            </div>
            <Link href="/quiz">
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-black text-base md:text-lg px-8 md:px-12 py-4 md:py-6 rounded-2xl shadow-2xl shadow-amber-500/30">
                🔥 TAKE THE FREE ASSESSMENT
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 px-4 bg-white/[0.02]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 mb-4">{t("landing.faq.badge")}</Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black">{t("landing.faq.title")}</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((key) => (
              <FAQItem
                key={key}
                question={t(`landing.faq.${key}`)}
                answer={t(`landing.faq.a${key.slice(1)}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT US ── */}
      <section id="about" className="py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 mb-4">{t("landing.about.badge")}</Badge>
            <h2 className="text-4xl sm:text-5xl font-black mb-6 max-w-3xl mx-auto leading-tight">{t("landing.about.title")}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">{t("landing.about.story")}</p>
              <p className="text-gray-300 leading-relaxed">{t("landing.about.story2")}</p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-600/10 rounded-3xl blur-2xl" />
              <img src={TEAM_PHOTO} alt={t("landing.about.teamPhoto")} className="relative z-10 rounded-3xl shadow-2xl w-full object-cover max-h-[400px]" />
              <div className="absolute bottom-4 left-4 right-4 z-20 bg-black/60 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
                <span className="text-amber-400 text-sm font-medium">{t("landing.about.teamPhoto")}</span>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { nameKey: "m1Name", roleKey: "m1Role", initials: "MC", color: "from-blue-500 to-cyan-600" },
              { nameKey: "m2Name", roleKey: "m2Role", initials: "SO", color: "from-purple-500 to-pink-600" },
              { nameKey: "m3Name", roleKey: "m3Role", initials: "AR", color: "from-amber-500 to-orange-600" },
            ].map(({ nameKey, roleKey, initials, color }) => (
              <div key={nameKey} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-center">
                <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-white font-black text-xl">{initials}</span>
                </div>
                <h3 className="font-bold text-white mb-1">{t(`landing.about.${nameKey}`)}</h3>
                <p className="text-gray-400 text-sm">{t(`landing.about.${roleKey}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent to-amber-950/20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl sm:text-6xl font-black mb-6 leading-tight">{t("landing.finalCta.title")}</h2>
          <p className="text-gray-400 text-xl mb-10 leading-relaxed">{t("landing.finalCta.subtitle")}</p>
          <Link href="/quiz">
            <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-black text-xl px-14 py-7 rounded-2xl shadow-2xl shadow-amber-500/30 animate-pulse">
              🔥 TAKE THE FREE ASSESSMENT NOW
              <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
          </Link>
          <p className="text-sm text-gray-500 mt-6">{t("landing.finalCta.trust")}</p>
        </div>
      </section>

      {/* ── LOGIN SECTION ── */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-amber-400 text-sm font-semibold">{t("loginSection.title")}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">{t("loginSection.title")}</h2>
          <p className="text-gray-400 mb-8 text-lg">{t("loginSection.subtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href={getLoginUrl()}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-bold px-8 py-6 text-lg rounded-2xl shadow-lg shadow-amber-500/25 w-full sm:w-auto"
              >
                {t("loginSection.signIn")}
              </Button>
            </a>
          </div>
          <p className="text-gray-600 text-sm mt-6">
            {t("loginSection.noAccount")}{" "}
            <Link href="/quiz" className="text-amber-400 hover:text-amber-300 underline transition-colors">
              {t("loginSection.startNow")}
            </Link>
          </p>
          <p className="text-gray-600 text-sm mt-3">
            <a href="/forgot-password" className="text-white/40 hover:text-white/70 transition-colors">
              Forgot your password?
            </a>
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-4 border-t border-white/5 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-600 rounded-md flex items-center justify-center">
              <span className="text-black font-black text-xs">V</span>
            </div>
            <span className="font-black text-lg">Vigronex</span>
          </div>
          <p className="text-gray-600 text-sm mb-2">{t("landing.footer.disclaimer")}</p>
          <p className="text-gray-700 text-xs">© {new Date().getFullYear()} Vigronex. {t("landing.footer.rights")}</p>
        </div>
      </footer>
    </div>
  );
}
