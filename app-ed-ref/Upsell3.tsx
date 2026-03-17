import { useState, useEffect } from "react";
import { useSearch, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { CheckCircle, Shield, ChevronRight, Star, Lock, Zap } from "lucide-react";

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

const RECIPES = [
  { emoji: "🥩", name: "Wagyu Steak with Herb Butter", macro: "+18% free testosterone", tag: "Member Favorite" },
  { emoji: "🥚", name: "6-Egg Omelette with Spinach & Garlic", macro: "+Zinc & Vitamin D", tag: "Breakfast" },
  { emoji: "🐟", name: "Grilled Salmon with Avocado & Lemon", macro: "+Omega-3 & DHT", tag: "Lunch" },
  { emoji: "🌰", name: "Mixed Nuts with Raw Honey", macro: "+Selenium & Magnesium", tag: "Snack" },
  { emoji: "🥦", name: "Broccoli Sautéed in Extra Virgin Olive Oil", macro: "Blocks estrogen", tag: "Anti-Estrogen" },
  { emoji: "🍳", name: "Beef Liver with Caramelized Onions", macro: "+Vitamin A & Iron", tag: "Superfood" },
  { emoji: "🫐", name: "Blueberry Protein Smoothie with Ginger", macro: "+Antioxidants & Free-T", tag: "Pre-Workout" },
  { emoji: "🧄", name: "Black Garlic Chicken with Quinoa", macro: "+Allicin & Protein", tag: "Dinner" },
];

export default function Upsell3() {
  const searchString = useSearch();
  const [, navigate] = useLocation();
  const params = new URLSearchParams(searchString);
  const orderId = parseInt(params.get("order") || "0");
  const [loading, setLoading] = useState(false);
  const [declining, setDeclining] = useState(false);
  const { display: timer } = useCountdown(8 * 60 + 0);
  const getCarpandaUpsellUrl = trpc.checkout.getCarpandaUpsellUrl.useMutation();

  async function handleAccept() {
    if (!orderId) return;
    setLoading(true);
    try {
      const result = await getCarpandaUpsellUrl.mutateAsync({
        orderId,
        upsell: "upsell3",
      });
      if (result.url) window.location.href = result.url;
    } catch {
      setLoading(false);
    }
  }

  function handleDecline() {
    setDeclining(true);
    setTimeout(() => navigate(`/checkout/thankyou?order=${orderId}`), 400);
  }

  return (
    <div className="min-h-screen bg-[#060a07] text-white">
      {/* Urgency bar */}
      <div className="bg-gradient-to-r from-green-800 to-emerald-700 text-white text-center py-2 px-4 text-sm font-bold">
        🔥 FINAL SPECIAL OFFER — Expires in: <span className="font-black text-yellow-300">{timer}</span>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-1.5 text-green-400 text-xs font-bold mb-4">
            🍽️ Last Exclusive Offer — Vigronex Members
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-3">
            87 Recipes That Naturally Spike Your<br />
            <span className="text-green-400">Testosterone</span><br />
            <span className="text-white/60 text-xl">No Supplements. No TRT. Just Real Food.</span>
          </h1>
          <p className="text-white/70 text-lg leading-relaxed">
            Harvard researchers found that men who optimize their diet for testosterone have levels <strong className="text-white">47% higher</strong> than men with the same genetics who eat randomly. The difference is on your plate.
          </p>
        </div>

        {/* Book mockup */}
        <div className="bg-gradient-to-br from-green-900/40 to-emerald-800/20 border border-green-500/30 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-5">
            <div className="w-24 h-32 bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl flex flex-col items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/30 text-center p-2">
              <span className="text-3xl mb-1">🍽️</span>
              <p className="text-white font-black text-xs leading-tight">TESTOSTERONE BOOST RECIPE BIBLE</p>
            </div>
            <div>
              <h2 className="text-xl font-black text-white mb-2">Testosterone Boost Recipe Bible</h2>
              <p className="text-green-300 text-sm font-semibold mb-3">87 recipes · 12 categories · 90-day plan</p>
              <div className="space-y-1.5">
                {[
                  "87 scientifically validated recipes",
                  "90-day meal plan synced with your protocol",
                  "Weekly shopping list ready to use",
                  "Guide to testosterone-destroying foods (avoid these!)",
                  "Quick versions (under 15 min) for busy days",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <p className="text-white/80 text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recipe preview */}
        <div className="mb-8">
          <h3 className="text-xl font-black text-white mb-4 text-center">Preview of included recipes:</h3>
          <div className="grid grid-cols-1 gap-2">
            {RECIPES.map((recipe, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                <span className="text-2xl flex-shrink-0">{recipe.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm truncate">{recipe.name}</p>
                  <p className="text-green-400 text-xs">{recipe.macro}</p>
                </div>
                <span className="bg-green-500/10 border border-green-500/30 rounded-full px-2 py-0.5 text-green-400 text-xs font-bold flex-shrink-0">{recipe.tag}</span>
              </div>
            ))}
            <div className="text-center text-white/40 text-sm py-2">+ 79 additional recipes...</div>
          </div>
        </div>

        {/* Science section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8">
          <h3 className="text-lg font-black text-white mb-3">The science behind the recipes:</h3>
          <div className="space-y-3">
            {[
              { nutrient: "Zinc", effect: "Increases free testosterone by up to 40%", foods: "Oysters, red meat, pumpkin seeds" },
              { nutrient: "Vitamin D3", effect: "Deficient men have 65% less testosterone", foods: "Salmon, egg yolk, beef liver" },
              { nutrient: "Magnesium", effect: "Reduces SHBG, releasing more free testosterone", foods: "Spinach, almonds, black beans" },
              { nutrient: "Saturated Fats", effect: "Direct substrate for testosterone synthesis", foods: "Ghee butter, coconut, fatty meat" },
              { nutrient: "DIM (Diindolylmethane)", effect: "Blocks testosterone-to-estrogen conversion", foods: "Broccoli, cauliflower, kale" },
            ].map((item, i) => (
              <div key={i} className="border-b border-white/5 pb-3 last:border-0 last:pb-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-amber-400 font-black text-sm">{item.nutrient}</p>
                  <p className="text-green-400 text-xs font-bold text-right">{item.effect}</p>
                </div>
                <p className="text-white/50 text-xs">Sources: {item.foods}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-8">
          <div className="space-y-3">
            {[
              { name: "Edward S., 45", text: "My testosterone went from 310 to 580 in 90 days just by changing my diet with these recipes. My doctor was shocked. Said he'd never seen that without TRT.", stars: 5 },
              { name: "Paul M., 39", text: "I lost 18 lbs and my energy tripled. But the best part was realizing my libido came back after years. My wife is loving it.", stars: 5 },
            ].map((t, i) => (
              <div key={i} className="bg-green-900/20 border border-green-500/20 rounded-xl p-4">
                <div className="flex items-center gap-1 mb-2">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-white/80 text-sm italic leading-relaxed mb-2">"{t.text}"</p>
                <p className="text-white/40 text-xs font-bold">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/10 border-2 border-green-500/40 rounded-2xl p-6 mb-4">
          <div className="text-center mb-4">
            <p className="text-white/50 text-sm line-through mb-1">Regular price: $39.99</p>
            <p className="text-white/70 text-sm mb-1">Last exclusive offer for Vigronex members:</p>
            <p className="text-5xl font-black text-green-400 mb-1">$9.99</p>
            <p className="text-white/50 text-xs">Instant download · Lifetime access · PDF + App</p>
          </div>
          <button
            onClick={handleAccept}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-black text-lg py-5 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-green-500/30 active:scale-95 transition-transform disabled:opacity-70 mb-3"
          >
            {loading ? (
              <><div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />Processing...</>
            ) : (
              <><Zap className="w-5 h-5" />YES! I WANT ALL 87 RECIPES — $9.99<ChevronRight className="w-5 h-5" /></>
            )}
          </button>
          <div className="flex items-center justify-center gap-4 text-white/40 text-xs">
            <span className="flex items-center gap-1"><Lock className="w-3 h-3" />Secure payment</span>
            <span className="flex items-center gap-1"><Shield className="w-3 h-3" />30-day guarantee</span>
            <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" />Instant download</span>
          </div>
        </div>

        {/* Decline */}
        <button
          onClick={handleDecline}
          disabled={declining}
          className="w-full text-white/25 text-xs py-3 text-center hover:text-white/40 transition-colors"
        >
          No thanks, I'll continue without optimizing my diet for testosterone
        </button>
      </div>
    </div>
  );
}
