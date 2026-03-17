import { trpc } from "@/lib/trpc";
import { Loader2, Stethoscope, CheckCheck } from "lucide-react";
import { Link } from "wouter";

export function DrApexTipWidget() {
  const { data: tips = [], isLoading } = trpc.tips.getToday.useQuery();
  const markRead = trpc.tips.markRead.useMutation();
  const utils = trpc.useUtils();

  const unreadTip = tips.find((t) => !t.isRead);
  const tip = unreadTip ?? tips[0];

  const handleRead = () => {
    if (tip && !tip.isRead) {
      markRead.mutate({ id: tip.id });
      utils.tips.getToday.invalidate();
    }
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
        <Loader2 size={16} className="animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Dr. Apex is preparing your tip...</span>
      </div>
    );
  }

  if (!tip) return null;

  return (
    <div
      className={`bg-card border rounded-xl p-4 cursor-pointer transition-all hover:border-purple-500/40 ${
        !tip.isRead ? "border-purple-500/30 bg-purple-500/5" : "border-border"
      }`}
      onClick={handleRead}
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shrink-0">
          <Stethoscope size={16} className="text-purple-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-semibold text-purple-400">Dr. Apex</span>
            {!tip.isRead && (
              <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
            )}
          </div>
          <p className="text-sm text-foreground leading-relaxed">{tip.content}</p>
          <Link href="/app/dr-apex">
            <span className="text-xs text-purple-400 hover:text-purple-300 mt-2 inline-flex items-center gap-1 transition-colors">
              <CheckCheck size={12} /> Chat with Dr. Apex →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
