import { useEffect } from "react";
import { useSearch, useLocation } from "wouter";

const NEXT_UPSELL: Record<string, string> = {
  upsell1: "upsell2",
  upsell2: "upsell3",
  upsell3: "thankyou",
};

export default function UpsellSkip() {
  const searchString = useSearch();
  const [, navigate] = useLocation();
  const params = new URLSearchParams(searchString);
  const orderId = params.get("order") || "0";
  const upsell = params.get("upsell") || "upsell1";
  const bump = params.get("bump") === "1"; // recipe bump already purchased

  useEffect(() => {
    let next = NEXT_UPSELL[upsell] || "thankyou";
    // If recipe bump was already purchased as order bump, skip upsell3
    if (next === "upsell3" && bump) next = "thankyou";
    const bumpParam = bump ? "&bump=1" : "";
    navigate(`/checkout/${next}?order=${orderId}${bumpParam}`);
  }, []);

  return (
    <div className="min-h-screen bg-[#080810] text-white flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
    </div>
  );
}
