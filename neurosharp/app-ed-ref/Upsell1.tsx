import { useState, useEffect } from "react";
import { useSearch, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { CheckCircle, Shield, Stethoscope, ChevronRight, Star, Lock } from "lucide-react";

function useCountdown(initial: number) {
  const [secs, setSecs] = useState(initial);
  useEffect(() => {
    const t = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return { display: `${m}:${s}`, expired: secs === 0 };
}

export default function Upsell1() {
  const searchString = useSearch();
  const [, navigate] = useLocation();
  const params = new URLSearchParams(searchString);
  const orderId = parseInt(params.get("order") || "0");
  const [loading, setLoading] = useState(false);
  const [declining, setDeclining] = useState(false);
  const { display: timer } = useCountdown(12 * 60 + 0);
  const getCarpandaUpsellUrl = trpc.checkout.getCarpandaUpsellUrl.useMutation();

  async function handleAccept() {
    if (!orderId) return;
    setLoading(true);
    try {
      const result = await getCarpandaUpsellUrl.mutateAsync({
        orderId,
        upsell: "upsell1",
      });
      if (result.url) {
        window.location.href = result.url;
      }
    } catch {
      setLoading(false);
    }
  }

  function handleDecline() {
    setDeclining(true);
    setTimeout(() => navigate(`/checkout/upsell2?order=${orderId}`), 400);
  }

  return (
    <div className="min-h-screen bg-[#07070f] text-white">
      {/* Urgency bar */}
      <div className="bg-red-600 text-white text-center py-2 px-4 text-sm font-bold">
        ⚠️ EXCLUSIVE OFFER FOR NEW MEMBERS — Expires in: <span className="font-black text-yellow-300">{timer}</span>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-1.5 text-green-400 text-xs font-bold mb-4">
            ✅ Your program is activated — Wait! You have a special gift
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-3">
            Your Personal Physician Specialized in<br />
            <span className="text-amber-400">Male Performance — 24 Hours a Day</span>
          </h1>
          <p className="text-white/70 text-lg leading-relaxed">
            Imagine having a specialist in men's sexual health available at any hour — at 3am when anxiety hits, in the middle of the day when you have an urgent question, or before an important night.
          </p>
        </div>

        {/* Doctor profile card */}
        <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0 text-3xl shadow-lg shadow-blue-500/30">
              🩺
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-black text-white">Dr. Apex</h2>
                <span className="bg-blue-500/20 border border-blue-500/40 rounded-full px-2 py-0.5 text-blue-300 text-xs font-bold">AI PHYSICIAN</span>
              </div>
              <p className="text-blue-300 text-sm font-semibold mb-2">Specialist in Men's Sexual Health & Urology</p>
              <div className="flex items-center gap-1 mb-3">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                <span className="text-white/50 text-xs ml-1">4.9/5 · 2,847 consultations completed</span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                "I'm trained on the most advanced protocols in men's sexual medicine. I can answer any question about erectile dysfunction, testosterone, performance, medications, lab tests, and much more — no judgment, no embarrassment."
              </p>
            </div>
          </div>
        </div>

        {/* Pain points */}
        <div className="mb-8">
          <h3 className="text-xl font-black text-white mb-4 text-center">Have you ever experienced this?</h3>
          <div className="space-y-3">
            {[
              { emoji: "😰", text: "Had a medical question at 2am and had no one to ask?" },
              { emoji: "😳", text: "Felt too embarrassed to ask your doctor about performance issues?" },
              { emoji: "⏳", text: "Waited weeks for an appointment for a question that could be answered in 2 minutes?" },
              { emoji: "💸", text: "Paid $150+ for a urology consultation just to hear 'everything looks fine, it's stress'?" },
              { emoji: "🤔", text: "Got confused about which supplement or medication is safe to combine with your protocol?" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
                <span className="text-2xl flex-shrink-0">{item.emoji}</span>
                <p className="text-white/80 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What you get */}
        <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/30 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-black text-amber-400 mb-4">With Dr. Apex 24h you get access to:</h3>
          <div className="space-y-3">
            {[
              { icon: "🩺", title: "Unlimited consultations, 24/7", desc: "Ask anything about your sexual health — no message limit, no waiting queue" },
              { icon: "💊", title: "Medication guidance", desc: "Know exactly what's safe to take, correct dosages, interactions, and side effects" },
              { icon: "🔬", title: "Lab result interpretation", desc: "Send your testosterone, PSA, and hormone results and receive a detailed analysis" },
              { icon: "📋", title: "Personalized protocols", desc: "Receive medical recommendations based on your health profile and quiz risk level" },
              { icon: "🚨", title: "Emergency triage", desc: "Know when your symptoms need urgent medical attention vs. when it's something normal" },
              { icon: "🔒", title: "100% confidential", desc: "Your most intimate questions stay between you and Dr. Apex — no judgment, no shared history" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
                <div>
                  <p className="text-white font-bold text-sm">{item.title}</p>
                  <p className="text-white/60 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-8">
          <h3 className="text-lg font-black text-white mb-4 text-center">What members are saying:</h3>
          <div className="space-y-3">
            {[
              { name: "Marcus T., 47", text: "I asked Dr. Apex about combining the Vigronex protocol with my blood pressure medication. In 2 minutes I had a complete answer that my doctor would have taken weeks to give me. Worth every penny.", stars: 5 },
              { name: "Robert A., 52", text: "At 11pm I had a question about a symptom that was worrying me. Dr. Apex reassured me, explained what it was, and told me when I'd actually need to see a doctor. I slept in peace.", stars: 5 },
              { name: "Carlos M., 39", text: "My testosterone was at 280. I asked Dr. Apex what to do. He gave me a complete 90-day protocol. Today I'm at 620. No TRT, no medication.", stars: 5 },
            ].map((t, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-1 mb-2">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-white/80 text-sm italic leading-relaxed mb-2">"{t.text}"</p>
                <p className="text-white/40 text-xs font-bold">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Price comparison */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-black text-white mb-4 text-center">Compare the cost:</h3>
          <div className="space-y-2 mb-4">
            {[
              { label: "Private urologist consultation", price: "$150–$400", crossed: true },
              { label: "Monthly health insurance", price: "$200–$500/mo", crossed: true },
              { label: "Telemedicine per consultation", price: "$50–$100/visit", crossed: true },
              { label: "Dr. Apex 24h — lifetime access", price: "$14.99", crossed: false, highlight: true },
            ].map((item, i) => (
              <div key={i} className={`flex items-center justify-between py-2 px-3 rounded-lg ${item.highlight ? "bg-amber-500/10 border border-amber-500/30" : ""}`}>
                <span className={`text-sm ${item.crossed ? "text-white/40 line-through" : item.highlight ? "text-white font-bold" : "text-white/70"}`}>{item.label}</span>
                <span className={`font-black text-sm ${item.crossed ? "text-white/30" : item.highlight ? "text-amber-400 text-lg" : "text-white/50"}`}>{item.price}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-white/50 text-xs">Lifetime access — pay once, use forever</p>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/10 border-2 border-blue-500/40 rounded-2xl p-6 mb-4">
          <div className="text-center mb-4">
            <p className="text-white/50 text-sm line-through mb-1">Regular price: $49.99</p>
            <p className="text-white/70 text-sm mb-1">Exclusive discount for new members:</p>
            <p className="text-5xl font-black text-amber-400 mb-1">$14.99</p>
            <p className="text-white/50 text-xs">One-time payment · Lifetime access · No subscription</p>
          </div>
          <button
            onClick={handleAccept}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-black text-lg py-5 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-blue-500/30 active:scale-95 transition-transform disabled:opacity-70 mb-3"
          >
            {loading ? (
              <><div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />Processing...</>
            ) : (
              <><Stethoscope className="w-5 h-5" />YES! I WANT MY 24H PHYSICIAN — $14.99<ChevronRight className="w-5 h-5" /></>
            )}
          </button>
          <div className="flex items-center justify-center gap-4 text-white/40 text-xs">
            <span className="flex items-center gap-1"><Lock className="w-3 h-3" />Secure payment</span>
            <span className="flex items-center gap-1"><Shield className="w-3 h-3" />30-day guarantee</span>
            <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" />Immediate access</span>
          </div>
        </div>

        {/* Decline */}
        <button
          onClick={handleDecline}
          disabled={declining}
          className="w-full text-white/25 text-xs py-3 text-center hover:text-white/40 transition-colors"
        >
          No thanks, I'll continue without specialized medical guidance
        </button>
      </div>
    </div>
  );
}
