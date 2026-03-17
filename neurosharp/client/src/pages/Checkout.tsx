import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { trpc } from "../trpc";

const LIVE_COUNT_BASE = 847;

const FAQ_ITEMS: { emoji: string; question: string; answer: string; tag: string; tagColor: string }[] = [
  { emoji: "🛡️", question: "Is it safe for my health?", answer: "Yes. The exercises are based on neuroscience and do not replace medical care. Consult your doctor if you have specific conditions.", tag: "Safety", tagColor: "#22c55e" },
  { emoji: "📈", question: "When will I see results?", answer: "Many users report improvement within 2 to 4 weeks. The 90-day program is designed for progressive, measurable results.", tag: "Results", tagColor: "#3b82f6" },
  { emoji: "⏱️", question: "How much time per day?", answer: "We recommend 20 to 25 minutes of daily cognitive exercises. You can split it into blocks if you prefer.", tag: "Time", tagColor: "#f59e0b" },
  { emoji: "🧠", question: "Does it help prevent Alzheimer's?", answer: "The program is designed to strengthen memory and cognitive risk factors. Regular cognitive activity is one of the lifestyle recommendations supported by research.", tag: "Alzheimer's", tagColor: "#6366f1" },
  { emoji: "💊", question: "Can I use it with medications?", answer: "The exercises do not replace medications. Consult your doctor about combining with any existing treatment.", tag: "Medications", tagColor: "#8b5cf6" },
  { emoji: "📱", question: "Does it work on my phone?", answer: "Yes. The program can be accessed in your browser on phone, tablet, or computer.", tag: "Devices", tagColor: "#06b6d4" },
  { emoji: "🔄", question: "Can I cancel anytime?", answer: "Yes. You can cancel your subscription at any time. No fees or questions asked.", tag: "Cancel", tagColor: "#ec4899" },
  { emoji: "📧", question: "How do I get my login credentials?", answer: "After payment is confirmed, your access credentials appear on the success page and may be sent by email.", tag: "Access", tagColor: "#14b8a6" },
  { emoji: "❓", question: "Other questions?", answer: "Contact our team through the support form. We respond within 4 business hours.", tag: "Support", tagColor: "#64748b" },
];

export function Checkout() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("sessionId") ?? "";
  const discountParam = searchParams.get("discount");
  const refCode = searchParams.get("ref") ?? undefined;

  const [firstName, setFirstName] = useState(searchParams.get("firstName") ?? "");
  const [lastName, setLastName] = useState(searchParams.get("lastName") ?? "");
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [phone, setPhone] = useState("");
  const [liveCount, setLiveCount] = useState(LIVE_COUNT_BASE);
  const [faqOpen, setFaqOpen] = useState<number>(0);

  const createOrder = trpc.funnel.createCarpandaOrder.useMutation({
    onSuccess: (data) => {
      window.location.href = data.url;
    },
  });

  useEffect(() => {
    const t = setInterval(() => {
      setLiveCount((c) => c + Math.floor(Math.random() * 3) + 1);
    }, 60000);
    return () => clearInterval(t);
  }, []);

  const discountApplied = discountParam === "20" ? 20 : 0;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOrder.mutate({
      firstName,
      lastName,
      email,
      phone: phone || undefined,
      cognitiveProfile: "memory_loss",
      symptomSeverity: "occasional",
      familyHistory: false,
      quizSessionId: sessionId || undefined,
      cognitiveRiskScore: searchParams.get("score") ? Number(searchParams.get("score")) : undefined,
      discountApplied,
      refCode,
    });
  };

  return (
    <div className="checkout-page min-h-[100dvh] pb-[env(safe-area-inset-bottom,0px)]">
      <div className="container max-w-[640px] mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-16 sm:pb-12">
        <Link to="/home" className="flex items-center gap-2 mb-6">
          <img src="/neurosharp-logo.png" alt="NeuroSharp" className="h-10 w-10 object-contain" />
          <span className="font-display font-bold text-lg text-[var(--color-text)]">NeuroSharp</span>
        </Link>
        <div className="live-counter">
          <span className="live-dot" /> {liveCount} people bought NeuroSharp in the last 24 hours
        </div>

        <h1 style={{ fontFamily: "var(--font-serif)", marginBottom: "0.5rem" }}>
          Your 90-Day Cognitive Transformation Starts Here
        </h1>
        <p style={{ color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
          NeuroSharp 90-Day Program — $29.99/mo
          {discountApplied === 20 && (
            <span style={{ color: "var(--color-success)", marginLeft: "0.5rem" }}>
              (20% off applied)
            </span>
          )}
        </p>

        <div className="trust-badges" style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
          <span className="badge">Neuroscience-Based</span>
          <span className="badge">Clinically Designed</span>
          <span className="badge">7-Day Guarantee</span>
          <span className="badge">45,000+ Users</span>
        </div>

        <div className="program-phases" style={{ background: "var(--color-card)", padding: "1.5rem", borderRadius: "var(--radius)", marginBottom: "2rem" }}>
          <h3 style={{ marginBottom: "0.75rem" }}>The 3 phases of the program</h3>
          <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "var(--color-text-muted)" }}>
            <li>Phase 1 (Days 1-30): Memory Foundation</li>
            <li>Phase 2 (Days 31-60): Memory Expansion</li>
            <li>Phase 3 (Days 61-90): Memory Mastery</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:gap-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="form-label">First name</label>
                <input
                  type="text"
                  className="form-input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  placeholder="First name"
                />
              </div>
              <div>
                <label className="form-label">Last name</label>
                <input
                  type="text"
                  className="form-input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  placeholder="Last name"
                />
              </div>
            </div>
            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label className="form-label">Phone (optional)</label>
              <input
                type="tel"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <label className="order-bump" style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", padding: "1rem", background: "var(--color-surface)", borderRadius: "var(--radius)" }}>
            <input type="checkbox" defaultChecked />
            <span>Add Cognitive Optimization Playbook — $9.99 (recommended)</span>
          </label>

          <button type="submit" className="btn btn-primary w-full py-4 min-h-[52px] rounded-xl touch-manipulation active:scale-[0.98] transition-transform" disabled={createOrder.isPending}>
            {createOrder.isPending ? "Redirecting..." : "Complete My Cognitive Recovery"}
          </button>
        </form>

        {createOrder.isError && (
          <p style={{ color: "var(--color-warning)", marginTop: "1rem" }}>Error creating order. Please try again.</p>
        )}

        <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", marginTop: "1.5rem" }}>
          By clicking you will be redirected to our secure payment page.
        </p>

        <section className="checkout-faq" style={{ marginTop: "2.5rem" }}>
          <h2 style={{ marginBottom: "1rem", fontSize: "1.25rem" }}>Frequently asked questions</h2>
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              className={`faq-item ${faqOpen === i ? "faq-item-active" : ""}`}
              style={{
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius)",
                marginBottom: "0.5rem",
                overflow: "hidden",
                background: faqOpen === i ? "rgba(245, 158, 11, 0.08)" : "var(--color-card)",
              }}
            >
              <button
                type="button"
                className="faq-trigger"
                onClick={() => setFaqOpen(faqOpen === i ? -1 : i)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.75rem",
                  padding: "1rem 1.25rem",
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  color: "var(--color-text)",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: "1rem",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span>{item.emoji}</span>
                  <span>{item.question}</span>
                  <span
                    className="faq-tag"
                    style={{
                      fontSize: "0.7rem",
                      padding: "0.2rem 0.5rem",
                      borderRadius: 6,
                      background: item.tagColor,
                      color: "#fff",
                      marginLeft: "0.25rem",
                    }}
                  >
                    {item.tag}
                  </span>
                </span>
                <span
                  className="faq-chevron"
                  style={{
                    transform: faqOpen === i ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                    flexShrink: 0,
                  }}
                >
                  ▼
                </span>
              </button>
              {faqOpen === i && (
                <div style={{ padding: "0 1.25rem 1rem", paddingTop: 0 }}>
                  <p style={{ margin: 0, color: "var(--color-text-muted)", fontSize: "0.95rem", lineHeight: 1.5 }}>
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
          <p style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
            <Link to="/contact" style={{ color: "var(--color-accent)" }}>Contact support</Link>
          </p>
        </section>
      </div>

      <style>{`
        .live-counter { display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 1rem; }
        .live-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--color-success); animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .badge { font-size: 0.8rem; padding: 0.25rem 0.5rem; background: var(--color-surface); border-radius: 6px; }
        .form-label { display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.25rem; }
        .form-input { width: 100%; padding: 0.75rem; border-radius: var(--radius); border: 1px solid var(--color-border); background: var(--color-bg); color: var(--color-text); }
      `}</style>
    </div>
  );
}
