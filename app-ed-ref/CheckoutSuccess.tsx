import { useEffect, useState } from "react";
import { useSearch, useLocation } from "wouter";
import { CheckCircle, ChevronRight, Loader2, AlertTriangle } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function CheckoutSuccess() {
  const searchString = useSearch();
  const [, navigate] = useLocation();
  const params = new URLSearchParams(searchString);
  // Carpanda redirects with ?order=ID&bump=1 (optional)
  const orderId = parseInt(params.get("order") || "0");
  const bump = params.get("bump") === "1";

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [orderData, setOrderData] = useState<{ email: string; firstName: string; orderId?: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const confirmPayment = trpc.checkout.confirmCarpandaPayment.useMutation();

  useEffect(() => {
    if (!orderId) {
      setStatus("error");
      setErrorMsg("No order found. Please contact support.");
      return;
    }
    confirmPayment.mutateAsync({
      orderId,
      origin: window.location.origin,
      includeRecipeBump: bump,
    }).then((result) => {
      setOrderData({ email: result.email, firstName: result.firstName, orderId: result.orderId });
      // Auto-redirect to upsell funnel after 2 seconds
      const bumpParam = result.recipeBumpIncluded ? "&bump=1" : "";
      setTimeout(() => {
        navigate(`/checkout/upsell1?order=${result.orderId}${bumpParam}`);
      }, 2000);
      setStatus("success");
    }).catch((err) => {
      setErrorMsg(err?.message || "Could not confirm your payment. Please contact support.");
      setStatus("error");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#080810] text-white flex flex-col items-center justify-center gap-6 px-4">
        <Loader2 className="w-12 h-12 text-amber-400 animate-spin" />
        <div className="text-center">
          <h2 className="text-xl font-black text-white mb-2">Confirming your payment...</h2>
          <p className="text-white/50 text-sm">This takes just a few seconds. Do not close this page.</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-[#080810] text-white flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500/40 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>
        <div className="text-center max-w-sm">
          <h2 className="text-xl font-black text-white mb-2">Something went wrong</h2>
          <p className="text-white/50 text-sm mb-6">{errorMsg}</p>
          <p className="text-white/40 text-xs">If your payment was charged, please email <strong className="text-white">support@vigronex.com</strong> with your order details and we'll sort it out within 1 hour.</p>
        </div>
        <button
          onClick={() => navigate("/checkout")}
          className="bg-amber-500 text-black font-black px-8 py-3 rounded-xl"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080810] text-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        {/* Checkmark */}
        <div className="w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500/40 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-400" />
        </div>
        <div className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-1.5 text-green-400 text-xs font-bold mb-4">
          ✅ PAYMENT CONFIRMED
        </div>
        <h1 className="text-3xl font-black text-white mb-3">
          Welcome to Vigronex,<br />
          <span className="text-amber-400">{orderData?.firstName}! 🎉</span>
        </h1>
        <p className="text-white/60 text-sm leading-relaxed mb-6">
          Your 90-day recovery program is now active. Login credentials sent to{" "}
          <strong className="text-white">{orderData?.email}</strong> — check your inbox within 2 minutes.
        </p>

        {/* Checklist */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 text-left space-y-3">
          {[
            { done: true, text: "Payment confirmed & processed" },
            { done: true, text: "Login credentials sent to your email" },
            { done: false, text: "Log in to your Vigronex dashboard" },
            { done: false, text: "Complete your health profile (5 min)" },
            { done: false, text: "Start Day 1 of your 90-day protocol" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${item.done ? "bg-green-500 text-white" : "bg-white/10 text-white/40"}`}>
                {item.done ? "✓" : String(i + 1)}
              </div>
              <p className={`text-sm ${item.done ? "text-white" : "text-white/60"}`}>{item.text}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate("/app")}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-400 text-black font-black text-base py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 active:scale-95 transition-transform"
        >
          ACCESS MY PROGRAM NOW
          <ChevronRight className="w-5 h-5" />
        </button>
        <p className="text-white/30 text-xs mt-3">Check spam if email doesn't arrive within 5 minutes.</p>
      </div>
    </div>
  );
}
