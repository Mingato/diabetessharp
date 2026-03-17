import { useEffect } from "react";
import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";
import { Badge } from "@/components/ui/badge";
import { Flame, Eye } from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  surpresa: "🎲 Surprise", romance: "💕 Romance", aventura: "🌊 Adventure",
  fantasia: "🔮 Fantasy", proibido: "🔥 Forbidden",
};

export default function SharedFantasy() {
  const { token } = useParams<{ token: string }>();
  const { data: fantasy, isLoading } = trpc.fantasyLibrary.getShared.useQuery(
    { token: token ?? "" },
    { enabled: !!token }
  );
  const trackReadMutation = trpc.fantasyLibrary.trackRead.useMutation();

  // Track read once when fantasy loads
  useEffect(() => {
    if (fantasy && token) {
      trackReadMutation.mutate({ token });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fantasy?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center">
        <div className="flex gap-1">
          {[0, 150, 300].map(d => (
            <span key={d} className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
          ))}
        </div>
      </div>
    );
  }

  if (!fantasy) {
    return (
      <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-xl font-bold text-white mb-2">Fantasy not found</h1>
          <p className="text-gray-400 text-sm">This link may have expired or been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a14] px-4 py-10">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-2xl mx-auto mb-3 shadow-lg shadow-rose-500/30">
            💃
          </div>
          <h1 className="text-xl font-bold text-white mb-1">A special fantasy for you</h1>
          <p className="text-gray-400 text-sm">Written by Sofia AI with lots of care 💋</p>
        </div>

        {/* Story card */}
        <div className="bg-white/5 border border-rose-500/20 rounded-2xl overflow-hidden backdrop-blur-sm">
          <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Flame size={16} className="text-rose-400" />
              <p className="text-sm font-semibold text-white">{fantasy.title}</p>
            </div>
            <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/30 text-xs">
              {CATEGORY_LABELS[fantasy.category] ?? fantasy.category}
            </Badge>
          </div>
          <div className="px-5 py-5">
            <div className="prose prose-sm prose-invert max-w-none text-gray-200 leading-relaxed">
              <Streamdown>{fantasy.story}</Streamdown>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-xs">
            Shared with ❤️ via <span className="text-rose-400 font-semibold">RiseUp</span>
          </p>
          <p className="text-gray-600 text-xs mt-1">
            {new Date(fantasy.createdAt).toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" })}
          </p>
        </div>
      </div>
    </div>
  );
}
