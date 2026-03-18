import { Link } from "react-router-dom";
import { getLoginUrl } from "../const";

const IMG_HERO_BLOOD_SUGAR = "/diabetes_sugar_hero.png";
const IMG_BEFORE = "/diabetic_foot_before.png";
const IMG_AFTER = "/diabetes_before_after_banner.png";
const IMG_PATRICIA = "/patricia_testimonial.png";
const IMG_DOCTOR = "/medico_shark_tank.png";

const STATS = [
  { value: "45,000+", label: "Users Worldwide" },
  { value: "89%", label: "Report Better Control by Week 6" },
  { value: "90", label: "Day Protocol" },
  { value: "4.9★", label: "Average Rating" },
];

const HOOKS_HERO = [
  "Don't wait until complications start — heart, kidneys, eyes, nerves.",
  "Damage to your vessels can start years before you notice.",
  "2 minutes to know your diabetes risk. Free. No commitment.",
];

const FEATURES = [
  {
    title: "Dr. James AI — Q&A 24/7",
    description: "Ask anything about blood sugar, medications, meals, exercise, or your results. Get clear answers day or night — no judgment, no waiting for an appointment.",
    icon: "🤖",
  },
  {
    title: "Sofia — Your Diabetes Companion",
    description: "Gentle reminders, tips, and motivation. Ask her about meal choices, portion sizes, or what to do when you slip. Like having a coach who never gets impatient.",
    icon: "💬",
  },
  {
    title: "Recipes & Meal Plans",
    description: "Low-glycemic, diabetes-friendly recipes, a 7-day meal plan, and a printable shopping list. Science-backed meals that help keep your blood sugar stable.",
    icon: "🥗",
  },
  {
    title: "Blood Sugar Tracking",
    description: "Log your glucose, weight, and how you feel. See your trends over time. The app shows you where you stand so you don't slip back.",
    icon: "📊",
  },
  {
    title: "Smart Shopping List",
    description: "A list built around your meal plan so you buy the right foods and avoid the ones that spike your glucose. Check off as you shop.",
    icon: "📋",
  },
  {
    title: "Photos & Evolution",
    description: "Track your journey with photos and notes. See how your body and energy change over 90 days. Built for the motivation that comes from seeing real progress.",
    icon: "📷",
  },
  {
    title: "Learn Library",
    description: "Articles and guides on diabetes, nutrition, and habits that protect your health. Knowledge and proof in one place.",
    icon: "📚",
  },
  {
    title: "Weekly Report",
    description: "Summary of your check-ins and progress so you and your doctor can see how your numbers are improving.",
    icon: "📈",
  },
];

const TESTIMONIALS = [
  {
    quote: "My HbA1c was 9.2. I was scared of insulin and complications. In 60 days I got it down to 7.1 with the app — recipes, reminders, and someone to answer my questions 24/7. My doctor said he'd never seen such a turn-around.",
    author: "Patricia S., 58",
    location: "Miami, FL",
    badge: "HbA1c 9.2 → 7.1 in 60 Days",
  },
  {
    quote: "Prediabetes was a wake-up call. The recipes and list made it easy. I lost weight and my fasting glucose dropped. No more prediabetes.",
    author: "John S., 58",
    location: "Austin, TX",
    badge: "-12 kg in 90 Days",
  },
  {
    quote: "Having someone to ask about meals and meds at any time changed everything. My doctor is happy with my numbers. I'm not waiting anymore.",
    author: "Ann L., 65",
    location: "Atlanta, GA",
    badge: "24/7 Support When I Need It",
  },
];

const FAQ_ITEMS = [
  { q: "Is DiabetesSharp a substitute for medication or a doctor?", a: "No. DiabetesSharp is a lifestyle and diet program. It does not replace medical advice, diagnosis, or treatment. Always consult your doctor for diabetes or health concerns." },
  { q: "I already have type 2 diabetes. Can this still help?", a: "Yes. The program is designed for people with type 2 diabetes and prediabetes. Many users report better blood sugar control, lower HbA1c, and more confidence with diet and daily habits." },
  { q: "Is my information private and secure?", a: "Yes. Your data is encrypted and stored securely. We do not share your health or usage data with third parties for marketing." },
  { q: "Do I need any equipment?", a: "No. You only need your phone or computer. If your doctor has recommended a glucometer, you can log your readings in the app." },
  { q: "What if the program doesn't work for me?", a: "We offer a 7-day money-back guarantee. If you're not satisfied, contact us for a full refund—no questions asked." },
  { q: "Is this suitable for people with prediabetes?", a: "Yes. DiabetesSharp is designed for people with prediabetes or type 2 diabetes who want to take control of their blood sugar and reduce the risk of complications." },
];

export default function Home() {
  return (
    <div className="min-h-screen min-h-[100dvh] app-bg text-[var(--color-text)]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur-xl pt-[env(safe-area-inset-top,0px)]">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2">
          <Link to="/home" className="flex items-center gap-2 min-h-[44px] items-center touch-manipulation">
            <img src="/diabetessharp-logo.png" alt="DiabetesSharp" className="h-7 w-7 sm:h-8 sm:w-8 object-contain" />
            <span className="font-display font-bold text-base sm:text-lg text-[var(--color-text)]">DiabetesSharp</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/app"
              className="text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] min-h-[44px] flex items-center px-2 touch-manipulation"
            >
              Acessar App
            </Link>
            <Link
              to="/quiz"
              className="text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] min-h-[44px] flex items-center px-2 touch-manipulation"
            >
              Free Assessment
            </Link>
            <Link
              to="/app"
              className="text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] min-h-[44px] flex items-center px-2 touch-manipulation"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <main className="pb-[env(safe-area-inset-bottom,0px)]">
        {/* Hero — with image and aggressive hooks */}
        <section className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--color-accent-soft),transparent)] pointer-events-none" />
          <div className="relative grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">
            <div className="text-center lg:text-left order-2 lg:order-1">
              <p className="text-xs sm:text-sm font-semibold text-[var(--color-accent)] mb-2 sm:mb-3 uppercase tracking-wider">
                Trusted by 45,000+ Users Worldwide
              </p>
              <h1 className="font-display font-bold text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-4 sm:mb-5">
                Take Control of Your Blood Sugar.
                <br />
                <span className="gradient-text">Protect Your Health.</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-[var(--color-text-muted)] max-w-xl mx-auto lg:mx-0 mb-4 sm:mb-6 leading-relaxed">
                The science-backed 90-day protocol that helps you stabilize glucose, improve HbA1c, and reduce the risk of complications — with the right diet, tracking, and 24/7 support.
              </p>
              <ul className="text-left max-w-md mx-auto lg:mx-0 space-y-1.5 sm:space-y-2 mb-6 sm:mb-8 text-[var(--color-text-muted)] text-xs sm:text-sm">
                {HOOKS_HERO.map((hook) => (
                  <li key={hook} className="flex items-start gap-2">
                    <span className="text-[var(--color-accent)] shrink-0">⚠</span>
                    <span>{hook}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-4">
                <Link
                  to="/quiz"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 min-h-[52px] rounded-xl bg-[var(--gradient-accent)] text-[var(--color-accent-text)] font-bold text-base sm:text-lg shadow-lg hover:opacity-95 transition-opacity border-2 border-transparent hover:border-[var(--color-accent-hover)] touch-manipulation active:scale-[0.98]"
                >
                  <span>🩸</span> Check My Diabetes Risk — Free (2 Min)
                </Link>
                <Link
                  to="/advertorial"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-5 sm:px-6 py-3.5 sm:py-4 min-h-[52px] rounded-xl border-2 border-[var(--color-border)] text-[var(--color-text)] font-semibold hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-surface-hover)] transition-all touch-manipulation active:scale-[0.98]"
                >
                  Read the Science
                </Link>
              </div>
              <p className="text-xs sm:text-sm text-[var(--color-text-muted)]">
                100% private · 7-day money-back guarantee · Cancel anytime
              </p>
            </div>
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-2xl max-w-md w-full aspect-[4/3] bg-[var(--color-card)]">
                <img
                  src={IMG_HERO_BLOOD_SUGAR}
                  alt="Blood sugar monitoring and diabetes care"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white text-sm font-medium">
                  Early action can protect your heart, kidneys, and eyes. Don&apos;t wait.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Urgency strip */}
        <section className="border-y border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)]/30 py-2.5 sm:py-3">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-xs sm:text-sm font-semibold text-[var(--color-text)] px-1">
              🩸 Free diabetes risk assessment in 2 minutes. No credit card. <Link to="/quiz" className="text-[var(--color-accent)] underline hover:no-underline">Check now →</Link>
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)]/50">
          <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-[var(--color-accent)]">{s.value}</div>
                  <div className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What's Inside */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 md:py-24">
          <h2 className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-center mb-3 sm:mb-4">What's Inside</h2>
          <p className="text-center text-[var(--color-text-muted)] max-w-2xl mx-auto mb-3 sm:mb-4 text-sm sm:text-base">
            A complete system designed by doctors and engineers for real, lasting results.
          </p>
          <p className="text-center text-[var(--color-accent)] font-semibold text-xs sm:text-sm mb-8 sm:mb-12">
            Stop guessing. Check your diabetes risk and get a personalized plan in 2 minutes.
          </p>
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="glass-card p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-colors"
              >
                <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{f.icon}</div>
                <h3 className="font-display font-bold text-base sm:text-lg text-[var(--color-text)] mb-1.5 sm:mb-2">{f.title}</h3>
                <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 sm:mt-12 text-center">
            <Link
              to="/quiz"
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-8 py-3.5 sm:py-4 min-h-[52px] rounded-xl bg-[var(--gradient-accent)] text-[var(--color-accent-text)] font-bold text-sm sm:text-base shadow-lg hover:opacity-95 transition-opacity touch-manipulation active:scale-[0.98]"
            >
              🩸 Yes, I Want to Take Control of My Blood Sugar — Start Free
            </Link>
          </div>
        </section>

        {/* Before & After — transformation */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 md:py-24">
          <h2 className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-center mb-2">The 90-Day Transformation</h2>
          <p className="text-center text-[var(--color-text-muted)] mb-6 sm:mb-10 max-w-2xl mx-auto text-sm sm:text-base">
            Real people who took control of their blood sugar. The window to act is now — don&apos;t wait until complications start.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 items-center">
            <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-xl">
              <img src={IMG_BEFORE} alt="Before — uncontrolled blood sugar" className="w-full aspect-[4/3] object-cover" />
              <div className="p-4 bg-[var(--color-card)] border-t border-[var(--color-border)]">
                <p className="text-sm font-semibold text-[var(--color-text)]">Before</p>
                <p className="text-xs text-[var(--color-text-muted)]">Uncontrolled numbers, confusion about what to eat, fear of complications. Many people with diabetes have been there.</p>
              </div>
            </div>
            <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-[var(--color-accent)]/40 shadow-xl">
              <img src={IMG_AFTER} alt="After 90 days — better control" className="w-full aspect-[4/3] object-cover" />
              <div className="p-4 bg-[var(--color-card)] border-t border-[var(--color-border)]">
                <p className="text-sm font-semibold text-[var(--color-accent)]">After 90 Days</p>
                <p className="text-xs text-[var(--color-text-muted)]">Better blood sugar, clearer plan, and a sense of control. Real results from DiabetesSharp users.</p>
              </div>
            </div>
          </div>
          <div className="mt-8 sm:mt-10 text-center">
            <Link to="/quiz" className="inline-flex items-center justify-center gap-2 px-5 sm:px-8 py-3.5 sm:py-4 min-h-[52px] rounded-xl bg-[var(--gradient-accent)] text-[var(--color-accent-text)] font-bold text-sm sm:text-base shadow-lg hover:opacity-95 transition-opacity touch-manipulation active:scale-[0.98]">
              🩸 Check My Risk — See My Personalized Plan
            </Link>
          </div>
        </section>

        {/* The App */}
        <section className="bg-[var(--color-surface)]/50 border-y border-[var(--color-border)] py-10 sm:py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="font-display font-bold text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4">The App</h2>
            <p className="text-base sm:text-xl text-[var(--color-text-muted)] mb-6 sm:mb-10">
              Built for Privacy. Designed for Results.
            </p>
            <p className="text-[var(--color-text-muted)] mb-8 max-w-2xl mx-auto">
              A premium dark-themed app that feels as private as your journal and as powerful as a personal diabetes coach — recipes, tracking, and 24/7 support in one place.
            </p>
            <ul className="text-left max-w-md mx-auto space-y-3 text-sm text-[var(--color-text-muted)]">
              <li className="flex items-center gap-2">✓ All data encrypted and stored securely</li>
              <li className="flex items-center gap-2">✓ Works on phone, tablet, or desktop</li>
              <li className="flex items-center gap-2">✓ Daily reminders keep you on track</li>
              <li className="flex items-center gap-2">✓ Dark, discreet interface</li>
            </ul>
          </div>
        </section>

        {/* Testimonials */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 md:py-24">
          <h2 className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-center mb-3 sm:mb-4">Real Transformations</h2>
          <p className="text-center text-[var(--color-text-muted)] mb-3 sm:mb-4 max-w-2xl mx-auto text-sm sm:text-base">
            People who took control of their blood sugar. Individual results may vary.
          </p>
          <p className="text-center text-[var(--color-accent)] font-semibold text-xs sm:text-sm mb-6 sm:mb-10">
            Join them. Check your diabetes risk — 2 minutes. No credit card.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.author} className="glass-card p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-[var(--color-border)]">
                {i === 0 ? (
                  <div className="flex justify-center mb-4">
                    <img src={IMG_PATRICIA} alt={t.author} className="w-16 h-16 rounded-full object-cover border-2 border-[var(--color-accent)]/50" />
                  </div>
                ) : (
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-[var(--color-surface)] border-2 border-[var(--color-border)] flex items-center justify-center text-2xl text-[var(--color-text-muted)] font-bold">
                      {t.author.charAt(0)}
                    </div>
                  </div>
                )}
                <p className="text-[var(--color-text)] mb-4 italic text-sm">&quot;{t.quote}&quot;</p>
                <p className="text-xs font-semibold text-[var(--color-accent)] mb-1">{t.badge}</p>
                <p className="text-sm font-medium text-[var(--color-text)]">{t.author}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{t.location}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 sm:mt-10 text-center">
            <Link to="/quiz" className="inline-flex items-center justify-center gap-2 px-5 sm:px-8 py-3.5 sm:py-4 min-h-[52px] rounded-xl bg-[var(--gradient-accent)] text-[var(--color-accent-text)] font-bold text-sm sm:text-base shadow-lg hover:opacity-95 transition-opacity touch-manipulation active:scale-[0.98]">
              🩸 Check My Diabetes Risk Now
            </Link>
          </div>
        </section>

        {/* Guarantee */}
        <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)]/50 py-10 sm:py-16 md:py-20">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="font-display font-bold text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4">Zero Risk</h2>
            <p className="text-base sm:text-xl text-[var(--color-text-muted)] mb-3 sm:mb-4">7-Day Money-Back Guarantee</p>
            <p className="text-[var(--color-text-muted)] mb-6">
              We're so confident in DiabetesSharp that we offer a complete, no-questions-asked refund within the first 7 days. If you don't feel a difference, you pay nothing.
            </p>
            <ul className="text-left max-w-sm mx-auto space-y-2 text-sm text-[var(--color-text-muted)] mb-8">
              <li>✓ Full refund within 7 days</li>
              <li>✓ No questions asked</li>
              <li>✓ Cancel anytime after that</li>
            </ul>
            <p className="text-[var(--color-accent)] font-semibold text-xs sm:text-sm mb-4 sm:mb-6">Nothing to lose. Everything to gain. Start your free assessment below.</p>
            <Link to="/quiz" className="inline-flex items-center justify-center gap-2 px-5 sm:px-8 py-3.5 sm:py-4 min-h-[52px] rounded-xl bg-[var(--gradient-accent)] text-[var(--color-accent-text)] font-bold text-sm sm:text-base shadow-lg hover:opacity-95 transition-opacity touch-manipulation active:scale-[0.98]">
              🩸 Check My Diabetes Risk — 2 Min
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 md:py-24">
          <h2 className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-center mb-3 sm:mb-4">FAQ</h2>
          <p className="text-center text-[var(--color-text-muted)] text-xs sm:text-sm mb-6 sm:mb-10">Still unsure? Take the free 2-minute assessment — no commitment.</p>
          <div className="space-y-4 sm:space-y-6">
            {FAQ_ITEMS.map((faq) => (
              <div key={faq.q} className="glass-card p-4 sm:p-5 rounded-xl border border-[var(--color-border)]">
                <h3 className="font-semibold text-[var(--color-text)] mb-2">{faq.q}</h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 sm:mt-10 text-center">
            <Link to="/quiz" className="inline-flex items-center justify-center gap-2 px-5 sm:px-8 py-3.5 sm:py-4 min-h-[52px] rounded-xl bg-[var(--gradient-accent)] text-[var(--color-accent-text)] font-bold text-sm sm:text-base shadow-lg hover:opacity-95 transition-opacity touch-manipulation active:scale-[0.98]">
              🩸 Check My Diabetes Risk
            </Link>
          </div>
        </section>

        {/* Our Story */}
        <section className="bg-[var(--color-surface)]/50 border-y border-[var(--color-border)] py-10 sm:py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-center mb-6 sm:mb-8">Our Story</h2>
            <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-start">
              <div className="w-full max-w-[240px] mx-auto md:mx-0 md:w-64 shrink-0">
                <img src={IMG_DOCTOR} alt="Medical expertise behind DiabetesSharp" className="w-full rounded-2xl border border-[var(--color-border)] shadow-lg aspect-square object-cover" />
                <p className="text-center text-xs text-[var(--color-text-muted)] mt-2">Built by doctors & engineers</p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[var(--color-text-muted)] leading-relaxed mb-6">
                  DiabetesSharp was built by endocrinologists and nutritionists who refused to accept that blood sugar control had to be confusing. Dr. Elena Rodriguez — an endocrinologist focused on diabetes care — saw too many patients with blood sugar out of control and no clear plan. The standard response was a prescription and a pamphlet. But the research showed that with the right diet, tracking, and support, many people can significantly improve their numbers and reduce the risk of complications.
                </p>
                <p className="text-[var(--color-text-muted)] leading-relaxed mb-6">
                  Today, DiabetesSharp has helped over 45,000 people in 32 countries improve their blood sugar control and feel more confident with their diet and routine — including many who already had type 2 or prediabetes and saw real improvement.
                </p>
                <p className="text-[var(--color-accent)] font-semibold">Take the first step: free diabetes risk assessment, 2 minutes, no obligation.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,var(--color-accent-soft),transparent)] pointer-events-none" />
          <div className="relative">
            <h2 className="font-display font-bold text-xl sm:text-2xl md:text-4xl mb-3 sm:mb-4">Take Control Now — Whether You Have Prediabetes or Type 2</h2>
            <p className="text-base sm:text-lg text-[var(--color-text-muted)] mb-3 sm:mb-4 max-w-2xl mx-auto">
              Don&apos;t wait until complications start. The best time to protect your health is now.
            </p>
            <p className="text-[var(--color-text-muted)] mb-6 sm:mb-8 max-w-xl mx-auto text-xs sm:text-sm">
              Join 45,000+ who took control. Free diabetes risk assessment — 2 minutes. No credit card. 7-day money-back guarantee.
            </p>
            <Link
              to="/quiz"
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-10 py-4 sm:py-5 min-h-[52px] rounded-xl bg-[var(--gradient-accent)] text-[var(--color-accent-text)] font-bold text-base sm:text-lg shadow-lg hover:opacity-95 transition-opacity border-2 border-transparent hover:border-[var(--color-accent-hover)] touch-manipulation active:scale-[0.98]"
            >
              🩸 Yes — I Want to Check My Diabetes Risk (Free)
            </Link>
            <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-4 sm:mt-6">100% private · Cancel anytime</p>
          </div>
        </section>

        {/* Sign In / Already a member */}
        <section className="border-t border-[var(--color-border)] py-10 sm:py-16 bg-[var(--color-surface)]/30">
          <div className="max-w-xl mx-auto px-4 text-center">
            <h2 className="font-display font-bold text-lg sm:text-xl mb-3 sm:mb-4">Already a Member?</h2>
            <p className="text-[var(--color-text-muted)] text-xs sm:text-sm mb-4 sm:mb-6">
              Access your personalized program, track your progress, and continue your journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/app"
                className="inline-flex items-center justify-center px-5 sm:px-8 py-3 min-h-[48px] rounded-xl bg-[var(--gradient-accent)] text-[var(--color-accent-text)] font-semibold hover:opacity-95 transition-opacity touch-manipulation active:scale-[0.98]"
              >
                Acessar App
              </Link>
              <a
                href={getLoginUrl()}
                className="inline-flex items-center justify-center px-5 sm:px-8 py-3 min-h-[48px] rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-text)] font-semibold hover:bg-[var(--color-surface-hover)] transition-colors touch-manipulation active:scale-[0.98]"
              >
                Sign In to My Account
              </a>
            </div>
            <p className="text-sm text-[var(--color-text-muted)] mt-6">
              Don&apos;t have an account? <Link to="/quiz" className="text-[var(--color-accent)] font-semibold hover:underline">Take the free assessment and start your program →</Link>
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-6 sm:py-8 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))]">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-[var(--color-text-muted)]">
          <Link to="/privacy" className="hover:text-[var(--color-text)] py-2 touch-manipulation">Privacy</Link>
          <Link to="/terms" className="hover:text-[var(--color-text)] py-2 touch-manipulation">Terms</Link>
          <Link to="/contact" className="hover:text-[var(--color-text)] py-2 touch-manipulation">Contact</Link>
        </div>
      </footer>
    </div>
  );
}
