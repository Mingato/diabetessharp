import { useState } from "react";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Heart, Lock, Sparkles } from "lucide-react";

const POSITION_IMAGES: Record<string, string> = {
  "Missionary": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_missionario_633f90cb.png",
  "Cowgirl": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_cowgirl_ff1903b1.png",
  "Spoon": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_colher_312535ce.png",
  "Lotus": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_lotus_bf6d3c1b.png",
  "Chair": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_cadeira_94251aa4.png",
  "Reverse Cowgirl": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_reversa_cowgirl_e2e04ff2.png",
  "Arch": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_arco_03404d46.png",
  "Amazon": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_amazona_be504808.png",
  "Lion": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_leao_b764416e.png",
  "Perfect Angle": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_angulo_364df25f.png",
  "Little Chair": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_cadeirinha_b2d7f221.png",
  "Butterfly": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_borboleta_0c4eb82a.png",
  "Roller Coaster": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_montanha_russa_4782c758.png",
  "Mermaid": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_sereia_5b212a5e.png",
  "Eternal Embrace": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_abraco_eterno_02587a55.png",
  "Scorpion": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_escorpiao_9eb084de.png",
  "Tantra": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_tantra_603a6cc9.png",
  "Mirror": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_espelho_1df2724a.png",
  "Side by Side": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_lado_a_lado-ZCKtSjJukVtqBxEuGenEnM.png",
  "Slow Cowgirl": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_cowgirl_lenta-BNtjbop9UvFgXefkiQpPse.png",
  "Lying Embrace": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_abraco_deitado-GXAV3rSSerbYLBB86drWQi.png",
  "Elevated Missionary": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_missionario_elevado-gneuooyXdVkofgkzqWU5me.png",
  "Seated Face to Face": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_sentados_frente-WAAteZH8XaMEMqNqnkCZic.png",
  "Relaxed Reclined": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_reclinado-BRqUo7UWGnxzpnzA2t3hYd.png",
  "Progressive Stimulation": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_estimulacao-gRxsUg3uEjTLqWA2TN9rny.png",
  "Forehead to Forehead": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_testa_testa-GwxRyCDhQH5CwCedyCfd3z.png",
  "Sacred Embrace": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_abraco_sagrado-2v9bQEWStBFNng9rYYCQ4N.png",
  "Eye to Eye": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_olhos_olhos-b8iBfvTv4A9jujvnXuEcP5.png",
  "Intimate Dance": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_danca_intima-EGE22gZ79KFRXLTKGX9qEZ.png",
  "Grounding": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_enraizamento-XTL6eibGhCU9T6NbzfdaKd.png",
  "Full Tenderness": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_carinho_total-NuQfpxd9TdUH3ysrfdECYS.png",
  "Shared Breathing": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_respiracao-LbwimZ3N6WFqracvaShfSe.png",
};

const CATEGORY_LABELS: Record<string, string> = {
  classic: "Classic", advanced: "Advanced", intimate: "Intimate",
  playful: "Playful", romantic: "Romantic", sensual: "Sensual",
  ed_friendly: "ED-Friendly", emotional: "Emotional Connection",
};

const REACTION_EMOJIS = ["❤️", "🔥", "😅"] as const;
type ReactionEmoji = typeof REACTION_EMOJIS[number];

const REACTION_LABELS: Record<ReactionEmoji, string> = {
  "❤️": "Love it!",
  "🔥": "Want to try!",
  "😅": "Looks challenging...",
};

function PositionReactionCard({
  position,
  token,
  initialReaction,
}: {
  position: any;
  token: string;
  initialReaction: ReactionEmoji | null;
}) {
  const [selectedEmoji, setSelectedEmoji] = useState<ReactionEmoji | null>(initialReaction);
  const imgUrl = POSITION_IMAGES[position.name];

  const reactMutation = trpc.coupleMode.react.useMutation({
    onSuccess: (res) => {
      if (res.action === "removed") {
        setSelectedEmoji(null);
        toast("Reaction removed");
      } else {
        setSelectedEmoji(res.emoji as ReactionEmoji);
        const label = REACTION_LABELS[res.emoji as ReactionEmoji];
        toast.success(`${res.emoji} ${label}`);
      }
    },
    onError: () => toast.error("Error saving reaction"),
  });

  const handleReact = (emoji: ReactionEmoji) => {
    reactMutation.mutate({ token, positionId: position.id, emoji });
  };

  return (
    <Card className="overflow-hidden border-border bg-card">
      {imgUrl && (
        <div className="aspect-square overflow-hidden bg-[#0a0f1e]">
          <img src={imgUrl} alt={position.name} className="w-full h-full object-cover" />
        </div>
      )}
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-1">
          <h3 className="font-semibold text-sm leading-tight">{position.name}</h3>
          <Badge variant="outline" className="text-[10px] shrink-0 border-amber-500/30 text-amber-400">
            {CATEGORY_LABELS[position.category] || position.category}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">{position.description}</p>

        {/* Reaction buttons */}
        <div className="flex gap-1.5 pt-1">
          {REACTION_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleReact(emoji)}
              disabled={reactMutation.isPending}
              title={REACTION_LABELS[emoji]}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-sm border transition-all ${
                selectedEmoji === emoji
                  ? "bg-amber-500/20 border-amber-500/50 scale-105"
                  : "bg-card border-border hover:bg-accent hover:border-border/80"
              }`}
            >
              <span>{emoji}</span>
            </button>
          ))}
        </div>
        {selectedEmoji && (
          <p className="text-[10px] text-center text-muted-foreground">
            You reacted: {selectedEmoji} · Tap again to remove
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function SharedFavorites() {
  const [, params] = useRoute("/share/:token");
  const token = params?.token ?? "";

  const { data, isLoading, error } = trpc.coupleMode.getSharedFavorites.useQuery(
    { token },
    { enabled: !!token }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading list...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-sm">
          <Lock className="w-12 h-12 text-muted-foreground mx-auto" />
          <h2 className="text-xl font-bold">Invalid or expired link</h2>
          <p className="text-muted-foreground text-sm">
            This link no longer exists. Ask him to generate a new link in the RiseUp app.
          </p>
        </div>
      </div>
    );
  }

  // Build reaction map: positionId → emoji
  const reactionMap: Record<number, ReactionEmoji> = {};
  for (const r of data.reactions ?? []) {
    reactionMap[r.positionId] = r.emoji as ReactionEmoji;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur">
        <div className="max-w-2xl mx-auto px-4 py-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Heart className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="font-bold text-amber-400">{data.label || "Favorites List"}</h1>
            <p className="text-xs text-muted-foreground">Shared via RiseUp · {data.positions.length} positions</p>
          </div>
          <div className="ml-auto">
            <Sparkles className="w-5 h-5 text-amber-400/50" />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {data.positions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Heart className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No favorite positions yet.</p>
          </div>
        ) : (
          <>
            <div className="text-center space-y-1">
              <p className="text-sm text-muted-foreground">
                These are the positions he saved especially for you two 💛
              </p>
              <p className="text-xs text-muted-foreground/70">
                Tap the emojis to react to each position — he will see your response!
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {data.positions.map((pos: any) => (
                <PositionReactionCard
                  key={pos.id}
                  position={pos}
                  token={token}
                  initialReaction={reactionMap[pos.id] ?? null}
                />
              ))}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="text-center pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Created with ❤️ on{" "}
            <a href="/" className="text-amber-400 hover:underline">RiseUp</a>
            {" "}— Male Performance Program
          </p>
        </div>
      </div>
    </div>
  );
}
