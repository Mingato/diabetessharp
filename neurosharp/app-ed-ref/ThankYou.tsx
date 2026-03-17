import { useEffect, useState } from "react";
import { useSearch, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { CheckCircle, ChevronRight, Loader2, Star, Zap } from "lucide-react";

export default function ThankYou() {
  const searchString = useSearch();
  const [, navigate] = useLocation();
  const params = new URLSearchParams(searchString);
  const orderId = parseInt(params.get("order") || "0");

  const { data: order, isLoading } = trpc.checkout.getOrderSummary.useQuery(
    { orderId },
    { enabled: !!orderId, retry: 2 }
  );

  const totalItems = [
    { id: "main", label: "Vigronex 90-Day Recovery Program", price: order?.totalPaid ? null : 2999, always: true, emoji: "⚡", color: "amber" },
    { id: "upsell1", label: "Dr. Apex 24h — Personal AI Physician", price: 1499, always: false, emoji: "🩺", color: "blue" },
    { id: "upsell2", label: "Sofia — Fantasy & Intimacy Assistant", price: 1699, always: false, emoji: "💜", color: "purple" },
    { id: "upsell3", label: "Testosterone Boost Recipe Bible (87 recipes)", price: 999, always: false, emoji: "🍽️", color: "green" },
  ];

  const purchasedItems = totalItems.filter(item =>
    item.always ||
    (item.id === "upsell1" && order?.upsell1) ||
    (item.id === "upsell2" && order?.upsell2) ||
    (item.id === "upsell3" && order?.upsell3)
  );

  const totalValue = (order?.totalPaid ?? 0) / 100;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080810] text-white flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
        <p className="text-white/50 text-sm">Loading your order summary...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      {/* Confetti-style header */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-500 text-black text-center py-3 px-4 font-black text-sm">
        🎉 CONGRATULATIONS! Your transformation starts NOW — Check your email!
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Big checkmark */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500/40 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-1.5 text-green-400 text-xs font-bold mb-4">
            ✅ ORDER CONFIRMED & ACTIVE
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
            Welcome to Vigronex,<br />
            <span className="text-amber-400">{order?.firstName || "Member"}! 🎉</span>
          </h1>
          <p className="text-white/60 text-base leading-relaxed max-w-md mx-auto">
            Your login credentials have been sent to <strong className="text-white">{order?.email}</strong>. Check your inbox (and spam folder) — it will arrive within 2 minutes.
          </p>
        </div>

        {/* Order summary */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8">
          <h2 className="text-lg font-black text-white mb-4">📦 Your order summary:</h2>
          <div className="space-y-3 mb-4">
            {purchasedItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <span className="text-2xl flex-shrink-0">{item.emoji}</span>
                <div className="flex-1">
                  <p className="text-white font-bold text-sm">{item.label}</p>
                  <p className="text-green-400 text-xs">✓ Active and ready to use</p>
                </div>
                <div className="text-right">
                  {item.price && <p className="text-white/40 text-xs line-through">${(item.price / 100).toFixed(2)}</p>}
                  <p className="text-green-400 text-sm font-bold">INCLUDED</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <p className="text-white font-black">Total invested today:</p>
            <p className="text-amber-400 font-black text-xl">${totalValue.toFixed(2)}</p>
          </div>
        </div>

        {/* What's unlocked */}
        <div className="mb-8">
          <h2 className="text-lg font-black text-white mb-4">🔓 What you've unlocked:</h2>
          <div className="space-y-3">
            {[
              { emoji: "⚡", title: "90-Day Protocol", desc: "Daily exercises, breathing techniques, and vascular recovery protocols — all synced with your risk level" },
              { emoji: "🤖", title: "Dr. Apex AI Coach", desc: "Your male performance coach available 24/7 to answer any question about your progress" },
              ...(order?.upsell1 ? [{ emoji: "🩺", title: "Dr. Apex 24h — Personal Physician", desc: "Unlimited medical consultations on sexual health, medications, lab tests, and personalized protocols" }] : []),
              ...(order?.upsell2 ? [{ emoji: "💜", title: "Sofia — Intimacy Assistant", desc: "Your personal assistant to explore fantasies, improve your intimate life, and overcome psychological blocks" }] : []),
              ...(order?.upsell3 ? [{ emoji: "🍽️", title: "87 Testosterone Boost Recipes", desc: "Complete 90-day meal plan to naturally maximize your testosterone with real food" }] : []),
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
                <span className="text-2xl flex-shrink-0">{item.emoji}</span>
                <div>
                  <p className="text-white font-bold text-sm">{item.title}</p>
                  <p className="text-white/60 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next steps */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 mb-8">
          <h2 className="text-lg font-black text-amber-400 mb-4">🚀 Your next steps (do this now):</h2>
          <div className="space-y-3">
            {[
              { num: "1", text: "Check your email and click the access link sent to " + (order?.email || "your email") },
              { num: "2", text: "Log in to the Vigronex platform and complete your health profile (5 minutes)" },
              { num: "3", text: "Watch Dr. Apex's welcome video — he'll explain your personalized protocol" },
              { num: "4", text: "Complete Day 1 of the protocol — the first 7 days are the most important" },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-amber-500 text-black font-black text-sm flex items-center justify-center flex-shrink-0">
                  {step.num}
                </div>
                <p className="text-white/80 text-sm leading-relaxed pt-0.5">{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Social proof */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8">
          <div className="flex items-center gap-2 mb-3">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
            <span className="text-white/50 text-xs">4.9/5 · 2,847 active members</span>
          </div>
          <p className="text-white/70 text-sm italic leading-relaxed">
            "I started Vigronex without much belief. In 30 days my erections were like I was 25 again. In 90 days my partner asked what I was taking. I wasn't taking anything — just following the protocol."
          </p>
          <p className="text-white/40 text-xs font-bold mt-2">— Richard A., 48</p>
        </div>

        {/* CTA button */}
        <button
          onClick={() => navigate("/app")}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-400 text-black font-black text-lg py-5 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-amber-500/30 active:scale-95 transition-transform mb-4"
        >
          <Zap className="w-5 h-5" />
          ACCESS MY PROGRAM NOW
          <ChevronRight className="w-5 h-5" />
        </button>
        <p className="text-center text-white/30 text-xs">
          Didn't receive the email? Check your spam folder or{" "}
          <button className="text-amber-400 underline" onClick={() => navigate("/app")}>
            access directly here
          </button>
        </p>
      </div>
    </div>
  );
}
