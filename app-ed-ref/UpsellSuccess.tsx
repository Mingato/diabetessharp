import { useEffect } from "react";
import { useSearch, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

const NEXT_UPSELL: Record<string, string> = {
  upsell1: "upsell2",
  upsell2: "upsell3",
  upsell3: "thankyou",
};

export default function UpsellSuccess() {
  const searchString = useSearch();
  const [, navigate] = useLocation();
  const params = new URLSearchParams(searchString);
  const orderId = parseInt(params.get("order") || "0");
  const upsell = params.get("upsell") as "upsell1" | "upsell2" | "upsell3" | null;
  const bump = params.get("bump") === "1"; // recipe bump already purchased as order bump

  const confirmUpsell = trpc.checkout.confirmCarpandaUpsell.useMutation();

  useEffect(() => {
    if (!orderId || !upsell) return;
    const bumpParam = bump ? "&bump=1" : "";
    confirmUpsell.mutateAsync({ orderId, upsell })
      .then(() => {
        let next = NEXT_UPSELL[upsell] || "thankyou";
        if (next === "upsell3" && bump) next = "thankyou";
        navigate(`/checkout/${next}?order=${orderId}${bumpParam}`);
      })
      .catch(() => {
        let next = NEXT_UPSELL[upsell] || "thankyou";
        if (next === "upsell3" && bump) next = "thankyou";
        navigate(`/checkout/${next}?order=${orderId}${bumpParam}`);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[#080810] text-white flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
      <p className="text-white/50 text-sm">Confirming your payment...</p>
    </div>
  );
}
