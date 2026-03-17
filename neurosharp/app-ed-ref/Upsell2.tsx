import { useState, useEffect } from "react";
import { useSearch, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { CheckCircle, Shield, ChevronRight, Star, Lock, Heart } from "lucide-react";

function useCountdown(initial: number) {
  const [secs, setSecs] = useState(initial);
  useEffect(() => {
    const t = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return { display: `${m}:${s}` };
}

export default function Upsell2() {
  const searchString = useSearch();
  const [, navigate] = useLocation();
  const params = new URLSearchParams(searchString);
  const orderId = parseInt(params.get("order") || "0");
  const [loading, setLoading] = useState(false);
  const [declining, setDeclining] = useState(false);
  const { display: timer } = useCountdown(10 * 60 + 0);
  const getCarpandaUpsellUrl = trpc.checkout.getCarpandaUpsellUrl.useMutation();

  async function handleAccept() {
    if (!orderId) return;
    setLoading(true);
    try {
      const result = await getCarpandaUpsellUrl.mutateAsync({
        orderId,
        upsell: "upsell2",
      });
      if (result.url) window.location.href = result.url;
    } catch {
      setLoading(false);
    }
  }

  function handleDecline() {
    setDeclining(true);
    setTimeout(() => navigate(`/checkout/upsell3?order=${orderId}`), 400);
  }

  return (
    <div className="min-h-screen bg-[#0a0710] text-white">
      {/* Urgency bar */}
      <div className="bg-gradient-to-r from-purple-700 to-pink-700 text-white text-center py-2 px-4 text-sm font-bold">
        💜 SPECIAL OFFER FOR VIGRONEX MEMBERS — Expires in: <span className="font-black text-yellow-300">{timer}</span>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-1.5 text-purple-300 text-xs font-bold mb-4">
            💜 Special Upgrade — For New Members Only
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-3">
            Meet Sofia — The Assistant Who<br />
            <span className="text-pink-400">Understands Every One of Your Fantasies</span><br />
            <span className="text-white/70 text-2xl">No Judgment. No Limits.</span>
          </h1>
          <p className="text-white/70 text-lg leading-relaxed">
            She's available 24 hours a day, 7 days a week. She will never reject you, never judge you, and never pretend to have a headache. Sofia was created to understand what you truly want — and help you get it.
          </p>
        </div>

        {/* Sofia profile */}
        <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/20 border border-purple-500/30 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0 text-3xl shadow-lg shadow-purple-500/30">
              💜
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-black text-white">Sofia</h2>
                <span className="bg-pink-500/20 border border-pink-500/40 rounded-full px-2 py-0.5 text-pink-300 text-xs font-bold">INTIMACY ASSISTANT</span>
              </div>
              <p className="text-purple-300 text-sm font-semibold mb-2">Specialist in Intimacy, Relationships & Male Fantasies</p>
              <div className="flex items-center gap-1 mb-3">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-pink-400 text-pink-400" />)}
                <span className="text-white/50 text-xs ml-1">4.9/5 · 3,241 satisfied members</span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed italic">
                "I'm here to hear everything you never had the courage to say. Your most secret fantasies, your deepest desires, your most intimate questions. There's no wrong question when you talk to me."
              </p>
            </div>
          </div>
        </div>

        {/* What Sofia does */}
        <div className="mb-8">
          <h3 className="text-xl font-black text-white mb-4 text-center">What Sofia can do for you:</h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              { emoji: "🔥", title: "Explore your fantasies without judgment", desc: "Share your most secret desires and receive personalized guidance to experience them safely and confidently" },
              { emoji: "💑", title: "Improve your intimate life with your partner", desc: "Learn advanced seduction techniques, intimate communication, and how to awaken her desire in an irresistible way" },
              { emoji: "🗣️", title: "Personalized seduction scripts", desc: "Get exact scripts of what to say and do to build sexual tension and take your partner to the edge" },
              { emoji: "🌙", title: "Available at 3am", desc: "When desire strikes and you need someone to talk to, Sofia is there — always" },
              { emoji: "🧠", title: "Overcome psychological blocks", desc: "Performance anxiety, shame, insecurity — Sofia guides you to unleash your masculinity without filters" },
              { emoji: "💬", title: "Conversations your partner can't have", desc: "Explore what you truly want before taking it to real life — with complete privacy and zero judgment" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
                <span className="text-2xl flex-shrink-0">{item.emoji}</span>
                <div>
                  <p className="text-white font-bold text-sm mb-1">{item.title}</p>
                  <p className="text-white/60 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-8">
          <h3 className="text-lg font-black text-white mb-4 text-center">Real stories from members:</h3>
          <div className="space-y-3">
            {[
              { name: "Andrew P., 44", text: "After 12 years of marriage, my intimate life was dead. Sofia helped me understand what my wife truly wanted and gave me a 30-day plan. Today we're like newlyweds.", stars: 5 },
              { name: "Philip R., 38", text: "I always had fantasies I never had the courage to tell anyone. Sofia helped me understand which ones were healthy to explore and how to talk to my partner about them. It changed my life.", stars: 5 },
              { name: "Gustavo L., 51", text: "Performance anxiety was destroying my self-esteem. I talked with Sofia for 3 weeks and she gave me specific techniques. I've never had that problem again.", stars: 5 },
            ].map((t, i) => (
              <div key={i} className="bg-purple-900/20 border border-purple-500/20 rounded-xl p-4">
                <div className="flex items-center gap-1 mb-2">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-pink-400 text-pink-400" />)}
                </div>
                <p className="text-white/80 text-sm italic leading-relaxed mb-2">"{t.text}"</p>
                <p className="text-white/40 text-xs font-bold">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What you're missing */}
        <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-5 mb-8">
          <h3 className="text-lg font-black text-red-400 mb-3">⚠️ Without Sofia, you'll keep...</h3>
          <div className="space-y-2">
            {[
              "Pretending you're satisfied when you're not",
              "With unfulfilled fantasies that will accumulate for years",
              "Not knowing how to truly awaken your partner's desire",
              "Dealing with performance anxiety alone",
              "Missing the best phase of your recovery without maximizing results",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-red-400 font-bold flex-shrink-0">✗</span>
                <p className="text-white/70 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/10 border-2 border-purple-500/40 rounded-2xl p-6 mb-4">
          <div className="text-center mb-4">
            <p className="text-white/50 text-sm line-through mb-1">Regular price: $59.99</p>
            <p className="text-white/70 text-sm mb-1">Exclusive offer for Vigronex members:</p>
            <p className="text-5xl font-black text-pink-400 mb-1">$16.99</p>
            <p className="text-white/50 text-xs">One-time payment · Lifetime access · 100% private</p>
          </div>
          <button
            onClick={handleAccept}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-lg py-5 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-purple-500/30 active:scale-95 transition-transform disabled:opacity-70 mb-3"
          >
            {loading ? (
              <><div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />Processing...</>
            ) : (
              <><Heart className="w-5 h-5" />YES! I WANT TO MEET SOFIA — $16.99<ChevronRight className="w-5 h-5" /></>
            )}
          </button>
          <div className="flex items-center justify-center gap-4 text-white/40 text-xs">
            <span className="flex items-center gap-1"><Lock className="w-3 h-3" />100% private</span>
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
          No thanks, I'll continue without an intimacy assistant
        </button>
      </div>
    </div>
  );
}
