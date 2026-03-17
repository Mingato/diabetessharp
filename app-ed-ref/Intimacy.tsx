import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Streamdown } from "streamdown";
import { Link } from "wouter";
import {
  Heart,
  Flame,
  Star,
  BookOpen,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Lock,
  Send,
  Filter,
  X,
  ZoomIn,
  MessageSquareHeart,
  Trophy,
  CheckCircle2,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";

// ── Types ─────────────────────────────────────────────────────────────────────
// Map position names to CDN image URLs
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
  // ED-Friendly positions
  "Side by Side": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_lado_a_lado-ZCKtSjJukVtqBxEuGenEnM.png",
  "Slow Cowgirl": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_cowgirl_lenta-BNtjbop9UvFgXefkiQpPse.png",
  "Lying Embrace": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_abraco_deitado-GXAV3rSSerbYLBB86drWQi.png",
  "Elevated Missionary": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_missionario_elevado-gneuooyXdVkofgkzqWU5me.png",
  "Seated Face to Face": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_sentados_frente-WAAteZH8XaMEMqNqnkCZic.png",
  "Relaxed Reclined": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_reclinado-BRqUo7UWGnxzpnzA2t3hYd.png",
  "Progressive Stimulation": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_estimulacao-gRxsUg3uEjTLqWA2TN9rny.png",
  // Emotional Connection positions
  "Forehead to Forehead": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_testa_testa-GwxRyCDhQH5CwCedyCfd3z.png",
  "Sacred Embrace": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_abraco_sagrado-2v9bQEWStBFNng9rYYCQ4N.png",
  "Eye to Eye": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_olhos_olhos-b8iBfvTv4A9jujvnXuEcP5.png",
  "Intimate Dance": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_danca_intima-EGE22gZ79KFRXLTKGX9qEZ.png",
  "Grounding": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_enraizamento-XTL6eibGhCU9T6NbzfdaKd.png",
  "Full Tenderness": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_carinho_total-NuQfpxd9TdUH3ysrfdECYS.png",
  "Shared Breathing": "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/pos_respiracao-LbwimZ3N6WFqracvaShfSe.png",
};

type Position = {
  id: number;
  name: string;
  category: string;
  difficulty: string;
  description: string;
  benefits: string | null;
  tips: string | null;
  programWeekUnlock: number | null;
};

type RomanceTip = {
  id: number;
  category: string;
  title: string;
  content: string;
  actionStep: string | null;
  difficulty: string;
};

// ── Category config ───────────────────────────────────────────────────────────
const POSITION_CATEGORIES = [
  { value: "all", label: "All", icon: "🔥" },
  { value: "classic", label: "Classic", icon: "💫" },
  { value: "romantic", label: "Romantic", icon: "❤️" },
  { value: "intimate", label: "Intimate", icon: "🌙" },
  { value: "sensual", label: "Sensual", icon: "✨" },
  { value: "playful", label: "Playful", icon: "🎭" },
  { value: "advanced", label: "Advanced", icon: "⚡" },
  { value: "ed_friendly", label: "ED-Friendly", icon: "💙" },
  { value: "emotional", label: "Connection", icon: "🫂" },
];

const TIP_CATEGORIES = [
  { value: "all", label: "All" },
  { value: "seduction", label: "Seduction" },
  { value: "romance", label: "Romance" },
  { value: "communication", label: "Communication" },
  { value: "confidence", label: "Confidence" },
  { value: "touch", label: "Touch" },
  { value: "mindset", label: "Mindset" },
  { value: "date_idea", label: "Date Ideas" },
  { value: "morning_ritual", label: "Morning Ritual" },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  intermediate: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  advanced: "bg-red-500/20 text-red-400 border-red-500/30",
  easy: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  bold: "bg-red-500/20 text-red-400 border-red-500/30",
};

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  easy: "Easy",
  medium: "Medium",
  bold: "Bold",
};

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ imageUrl, name, onClose }: { imageUrl: string; name: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
      >
        <X size={20} />
      </button>
      <div
        className="relative max-w-lg w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={name}
          className="w-full max-h-[80vh] object-contain rounded-2xl"
        />
        <div className="text-center mt-3">
          <p className="text-white font-semibold text-lg">{name}</p>
        </div>
      </div>
    </div>
  );
}

// ── Position Card ─────────────────────────────────────────────────────────────
function PositionCard({ position, isSaved, onToggleSave }: {
  position: Position;
  isSaved: boolean;
  onToggleSave: (id: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const imageUrl = POSITION_IMAGES[position.name];

  return (
    <>
      {lightboxOpen && imageUrl && (
        <Lightbox imageUrl={imageUrl} name={position.name} onClose={() => setLightboxOpen(false)} />
      )}
      <div className="bg-card border border-border rounded-xl overflow-hidden transition-all duration-200 hover:border-primary/40">
        {/* Position illustration */}
        {imageUrl && (
          <div
            className="relative w-full bg-[#0a0f1e] overflow-hidden cursor-pointer group"
            style={{ height: '200px' }}
            onClick={() => setLightboxOpen(true)}
          >
            <img
              src={imageUrl}
              alt={position.name}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent pointer-events-none" />
            {/* Zoom hint */}
            <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn size={14} className="text-white" />
            </div>
          </div>
        )}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-base leading-tight">{position.name}</h3>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${DIFFICULTY_COLORS[position.difficulty]}`}>
                  {DIFFICULTY_LABELS[position.difficulty]}
                </span>
                <span className="text-xs text-muted-foreground capitalize">{position.category.replace(/_/g, ' ')}</span>
              </div>
            </div>
            <button
              onClick={() => onToggleSave(position.id)}
              className={`shrink-0 p-1.5 rounded-lg transition-colors ${isSaved ? "text-rose-400 bg-rose-500/10" : "text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10"}`}
            >
              <Heart size={16} fill={isSaved ? "currentColor" : "none"} />
            </button>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{position.description}</p>

          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 mt-3 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? "Less details" : "View full details"}
          </button>
        </div>

        {expanded && (
          <div className="px-5 pb-5 space-y-4 border-t border-border/50 pt-4">
            {imageUrl && (
              <button
                onClick={() => setLightboxOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
              >
                <ZoomIn size={14} /> View illustration fullscreen
              </button>
            )}
            <div>
              <p className="text-sm text-foreground leading-relaxed">{position.description}</p>
            </div>
            {position.benefits && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                <p className="text-xs font-semibold text-primary mb-1.5 flex items-center gap-1.5">
                  <Star size={12} /> Benefits
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">{position.benefits}</p>
              </div>
            )}
            {position.tips && (
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3">
                <p className="text-xs font-semibold text-amber-400 mb-1.5 flex items-center gap-1.5">
                  <Flame size={12} /> Dr. Apex Tips
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">{position.tips}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

// ── Romance Tip Card ──────────────────────────────────────────────────────────
function RomanceTipCard({ tip, isSaved, onToggleSave }: {
  tip: RomanceTip;
  isSaved: boolean;
  onToggleSave: (id: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-all duration-200">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-semibold text-foreground text-sm leading-tight flex-1">{tip.title}</h3>
          <button
            onClick={() => onToggleSave(tip.id)}
            className={`shrink-0 p-1.5 rounded-lg transition-colors ${isSaved ? "text-rose-400 bg-rose-500/10" : "text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10"}`}
          >
            <Heart size={14} fill={isSaved ? "currentColor" : "none"} />
          </button>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${DIFFICULTY_COLORS[tip.difficulty]}`}>
            {DIFFICULTY_LABELS[tip.difficulty]}
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{tip.content}</p>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 mt-2 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
        >
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {expanded ? "Less" : "Read full + action"}
        </button>
      </div>
      {expanded && (
        <div className="px-5 pb-5 border-t border-border/50 pt-4 space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">{tip.content}</p>
          {tip.actionStep && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
              <p className="text-xs font-semibold text-primary mb-1 flex items-center gap-1.5">
                <Sparkles size={12} /> Today's Action
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">{tip.actionStep}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Favorites Gallery Card ────────────────────────────────────────────────────
function FavoritePositionGalleryCard({ position, onToggleSave }: {
  position: Position;
  onToggleSave: (id: number) => void;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const imageUrl = POSITION_IMAGES[position.name];

  return (
    <>
      {lightboxOpen && imageUrl && (
        <Lightbox imageUrl={imageUrl} name={position.name} onClose={() => setLightboxOpen(false)} />
      )}
      <div className="bg-card border border-rose-500/20 rounded-xl overflow-hidden group">
        {/* Image */}
        <div
          className="relative bg-[#0a0f1e] cursor-pointer"
          style={{ height: '160px' }}
          onClick={() => imageUrl && setLightboxOpen(true)}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={position.name}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">❤️</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {imageUrl && (
            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn size={12} className="text-white" />
            </div>
          )}
          <div className="absolute bottom-2 left-3 right-3">
            <p className="text-white font-semibold text-sm leading-tight">{position.name}</p>
            <span className={`text-xs px-1.5 py-0.5 rounded-full border font-medium mt-1 inline-block ${DIFFICULTY_COLORS[position.difficulty]}`}>
              {DIFFICULTY_LABELS[position.difficulty]}
            </span>
          </div>
        </div>
        {/* Remove button */}
        <div className="px-3 py-2 flex items-center justify-between">
          <p className="text-xs text-muted-foreground truncate flex-1">{position.description.slice(0, 50)}...</p>
          <button
            onClick={() => onToggleSave(position.id)}
            className="ml-2 p-1 rounded text-rose-400 hover:text-rose-300 transition-colors"
            title="Remove from favorites"
          >
            <Heart size={14} fill="currentColor" />
          </button>
        </div>
      </div>
    </>
  );
}

// ── AI Advice Panel ───────────────────────────────────────────────────────────
function AIAdvicePanel() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);

  const adviceMutation = trpc.intimacy.getAIAdvice.useMutation({
    onSuccess: (data) => setAnswer(data.answer),
    onError: () => toast.error("Error getting advice. Please try again."),
  });

  const handleAsk = () => {
    if (!question.trim() || question.length < 5) return;
    adviceMutation.mutate({ question });
  };

  return (
    <div className="space-y-4">
      {/* Sofia CTA */}
      <Link href="/app/sofia">
        <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20 hover:border-pink-500/40 transition-all cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-2xl flex-shrink-0">
            💃
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground text-sm">Practice with Sofia AI</p>
            <p className="text-xs text-muted-foreground">Simulate real conversations and get feedback from Dr. Apex</p>
          </div>
          <MessageSquareHeart size={18} className="text-pink-400 flex-shrink-0" />
        </div>
      </Link>

      <div className="bg-gradient-to-br from-primary/10 to-rose-500/5 border border-primary/20 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
            <MessageCircle size={18} className="text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">Dr. Apex — Intimacy Advisor</p>
            <p className="text-xs text-muted-foreground">Ask about romance, seduction, or relationships</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              "How to create more sexual tension?",
              "How to be more romantic every day?",
              "How to improve intimate communication?",
              "How to reignite her interest?",
            ].map((q) => (
              <button
                key={q}
                onClick={() => setQuestion(q)}
                className="text-left text-xs px-3 py-2 rounded-lg bg-card border border-border hover:border-primary/40 text-muted-foreground hover:text-foreground transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask Dr. Apex your question..."
              className="flex-1 bg-background text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            />
            <Button
              onClick={handleAsk}
              disabled={adviceMutation.isPending || question.length < 5}
              size="sm"
              className="shrink-0"
            >
              {adviceMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <Send size={14} />
              )}
            </Button>
          </div>
        </div>
      </div>

      {answer && (
        <div className="bg-card border border-primary/20 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
              <MessageCircle size={12} className="text-primary" />
            </div>
            <p className="text-xs font-semibold text-primary">Dr. Apex replies:</p>
          </div>
          <div className="text-sm text-foreground leading-relaxed">
            <Streamdown>{answer}</Streamdown>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Weekly Challenge Widget ──────────────────────────────────────────────────
function WeeklyChallengeWidget() {
  const [note, setNote] = useState("");
  const [showNote, setShowNote] = useState(false);
  const { data, refetch } = trpc.weeklyChallenge.getCurrent.useQuery(undefined, { staleTime: 60_000 });
  const completeMutation = trpc.weeklyChallenge.complete.useMutation({
    onSuccess: (res) => {
      if (res.alreadyCompleted) {
        toast.info("You already completed this challenge this week!");
      } else {
        toast.success(`Challenge completed! +${res.xpEarned} XP 🏆`);
      }
      refetch();
      setShowNote(false);
      setNote("");
    },
    onError: () => toast.error("Error recording completion."),
  });

  if (!data || !data.challenge) return null;

  const { challenge, completed, position } = data;
  const imageUrl = position ? POSITION_IMAGES[position.name] : null;

  return (
    <div className="mb-8 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-yellow-500/5 overflow-hidden">
      <div className="flex items-center gap-2 px-5 pt-4 pb-2">
        <Trophy size={16} className="text-amber-400" />
        <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Weekly Challenge</span>
        {completed && (
          <Badge className="ml-auto bg-green-500/20 text-green-400 border-green-500/30 text-xs">
            <CheckCircle2 size={10} className="mr-1" /> Completed
          </Badge>
        )}
      </div>
      <div className="px-5 pb-5 flex gap-4">
        {imageUrl && (
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#0a0f1e] shrink-0">
            <img src={imageUrl} alt={position?.name} className="w-full h-full object-contain" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-sm leading-tight mb-1">{challenge.title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{challenge.description}</p>
          {!completed && (
            <div className="mt-3 space-y-2">
              {showNote ? (
                <>
                  <Input
                    placeholder="How did it go? (optional)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="text-xs h-8 bg-background"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="h-7 text-xs bg-amber-500 hover:bg-amber-600 text-black"
                      onClick={() => completeMutation.mutate({ challengeId: challenge.id, note: note || undefined })}
                      disabled={completeMutation.isPending}
                    >
                      {completeMutation.isPending ? "..." : "✓ Confirm"}
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setShowNote(false)}>Cancel</Button>
                  </div>
                </>
              ) : (
                <Button
                  size="sm"
                  className="h-7 text-xs bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                  onClick={() => setShowNote(true)}
                >
                  Mark as Done 🏆
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Intimacy() {
  const { t } = useTranslation();
  const [positionCategory, setPositionCategory] = useState("all");
  const [positionDifficulty, setPositionDifficulty] = useState("all");
  const [tipCategory, setTipCategory] = useState("all");

  const { data: positions = [], isLoading: posLoading } = trpc.intimacy.listPositions.useQuery(
    { category: positionCategory, difficulty: positionDifficulty },
    { staleTime: 60_000 }
  );
  const { data: allPositions = [] } = trpc.intimacy.listPositions.useQuery(
    { category: "all", difficulty: "all" },
    { staleTime: 60_000 }
  );
  const { data: tips = [], isLoading: tipsLoading } = trpc.intimacy.listTips.useQuery(
    { category: tipCategory },
    { staleTime: 60_000 }
  );
  const { data: allTips = [] } = trpc.intimacy.listTips.useQuery(
    { category: "all" },
    { staleTime: 60_000 }
  );
  const currentLang = i18n.language;
  const tipLang = (currentLang === "en" || currentLang === "pt-BR" || currentLang === "es") ? currentLang : ("pt-BR" as const);
  const { data: dailyTip } = trpc.intimacy.getDailyTip.useQuery({ language: tipLang }, { staleTime: 3_600_000 });
  const { data: savedIds, refetch: refetchSaved } = trpc.intimacy.getSavedIds.useQuery(undefined, { staleTime: 30_000 });

  const toggleSaveMutation = trpc.intimacy.toggleSaved.useMutation({
    onSuccess: () => refetchSaved(),
  });

  const savedPositionIds = new Set(savedIds?.positionIds ?? []);
  const savedTipIds = new Set(savedIds?.tipIds ?? []);

  const savedPositions = allPositions.filter(p => savedPositionIds.has(p.id));
  const savedTips = allTips.filter(t => savedTipIds.has(t.id));

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
              <Heart size={20} className="text-rose-400" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">{t("intimacy.title", "Intimacy & Romance")}</h1>
              <p className="text-sm text-muted-foreground">{t("intimacy.subtitle", "Positions guide, seduction tips and Dr. Apex advice")}</p>
            </div>
          </div>
        </div>

        {/* Weekly Challenge Widget */}
        <WeeklyChallengeWidget />

        {/* Couple Mode CTA */}
        <Link href="/app/couple">
          <div className="mb-6 flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-rose-500/20 hover:border-rose-500/40 transition-all cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
              <Users size={18} className="text-rose-400" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground text-sm">{t("intimacy.coupleMode", "Couple Mode")}</p>
              <p className="text-xs text-muted-foreground">{t("intimacy.coupleModeDesc", "Share your favorites with your partner via link")}</p>
            </div>
            <Heart size={16} className="text-rose-400 shrink-0" fill="currentColor" />
          </div>
        </Link>

        {/* Daily Romance Tip Banner */}
        {dailyTip && (
          <div className="mb-8 bg-gradient-to-r from-rose-500/10 via-primary/10 to-amber-500/10 border border-rose-500/20 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-amber-400" />
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">{t("intimacy.tipOfDay", "Tip of the Day")}</span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">{dailyTip.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{dailyTip.content}</p>
            {dailyTip.actionStep && (
              <div className="bg-black/20 rounded-lg px-3 py-2">
                <p className="text-xs text-primary font-medium">⚡ {t("romance.action", "Action")}: {dailyTip.actionStep}</p>
              </div>
            )}
          </div>
        )}

        {/* Main Tabs */}
        <Tabs defaultValue="positions">
          <TabsList className="mb-6 bg-card border border-border flex flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="positions" className="flex items-center gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs">
              <Flame size={12} /> {t("intimacy.positions", "Positions")}
            </TabsTrigger>
            <TabsTrigger value="tips" className="flex items-center gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs">
              <BookOpen size={12} /> {t("intimacy.tips", "Tips")}
            </TabsTrigger>
            <TabsTrigger value="advisor" className="flex items-center gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs">
              <MessageCircle size={12} /> {t("nav.drApex", "Dr. Apex")}
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs">
              <Heart size={12} /> {t("intimacy.tabFavorites", "Favorites")}
              {(savedPositionIds.size + savedTipIds.size) > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs h-4 px-1">
                  {savedPositionIds.size + savedTipIds.size}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs">
              <Trophy size={12} /> {t("intimacy.history", "History")}
            </TabsTrigger>
          </TabsList>

          {/* ── Positions Tab ── */}
          <TabsContent value="positions" className="space-y-6">
            {/* Category filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {POSITION_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setPositionCategory(cat.value)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    positionCategory === cat.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:border-primary/40"
                  }`}
                >
                  <span>{cat.icon}</span> {cat.label}
                </button>
              ))}
            </div>

            {/* Difficulty filter */}
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-muted-foreground shrink-0" />
              {["all", "beginner", "intermediate", "advanced"].map((d) => (
                <button
                  key={d}
                  onClick={() => setPositionDifficulty(d)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    positionDifficulty === d
                      ? "bg-primary/20 text-primary border-primary/40"
                      : "bg-card text-muted-foreground border-border hover:border-primary/40"
                  }`}
                >
                  {d === "all" ? t("common.all", "All") : DIFFICULTY_LABELS[d]}
                </button>
              ))}
            </div>

            {posLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-40 bg-card rounded-xl animate-pulse border border-border" />
                ))}
              </div>
            ) : positions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Lock size={32} className="mx-auto mb-3 opacity-40" />
                <p>{t("intimacy.noPositions", "No positions found for this filter.")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {positions.map((pos) => (
                  <PositionCard
                    key={pos.id}
                    position={pos}
                    isSaved={savedPositionIds.has(pos.id)}
                    onToggleSave={(id) => toggleSaveMutation.mutate({ positionId: id })}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── Tips Tab ── */}
          <TabsContent value="tips" className="space-y-6">
            {/* Category filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {TIP_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setTipCategory(cat.value)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    tipCategory === cat.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:border-primary/40"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {tipsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-32 bg-card rounded-xl animate-pulse border border-border" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tips.map((tip) => (
                  <RomanceTipCard
                    key={tip.id}
                    tip={tip}
                    isSaved={savedTipIds.has(tip.id)}
                    onToggleSave={(id) => toggleSaveMutation.mutate({ romanceTipId: id })}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── AI Advisor Tab ── */}
          <TabsContent value="advisor">
            <AIAdvicePanel />
          </TabsContent>

          {/* ── Saved/Favorites Tab ── */}
          <TabsContent value="saved" className="space-y-6">
            {savedPositionIds.size === 0 && savedTipIds.size === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Heart size={40} className="mx-auto mb-4 opacity-30" />
                <p className="font-medium text-foreground mb-1">No favorites yet</p>
                <p className="text-sm">Save positions and tips by clicking ❤️ to access them quickly here.</p>
              </div>
            ) : (
              <>
                {savedPositions.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Flame size={14} className="text-primary" /> Saved Positions ({savedPositions.length})
                    </h3>
                    {/* Gallery grid for positions */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {savedPositions.map((pos) => (
                        <FavoritePositionGalleryCard
                          key={pos.id}
                          position={pos}
                          onToggleSave={(id) => toggleSaveMutation.mutate({ positionId: id })}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {savedTips.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <BookOpen size={14} className="text-primary" /> Saved Tips ({savedTips.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {savedTips.map((tip) => (
                        <RomanceTipCard
                          key={tip.id}
                          tip={tip}
                          isSaved={true}
                          onToggleSave={(id) => toggleSaveMutation.mutate({ romanceTipId: id })}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* ── History Tab ── */}
          <TabsContent value="history" className="space-y-4">
            <RomanceHistoryTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function RomanceHistoryTab() {
  const { t } = useTranslation();
  const lang = i18n.language as "en" | "pt-BR" | "es";
  const validLang = (lang === "en" || lang === "pt-BR" || lang === "es") ? lang : ("pt-BR" as const);
  const { data: history, isLoading } = trpc.intimacy.getTipHistory.useQuery({ language: validLang });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-card rounded-xl animate-pulse border border-border" />
        ))}
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <Trophy size={40} className="mx-auto mb-4 opacity-30" />
            <p className="font-medium text-foreground mb-1">{t("intimacy.historyEmpty", "No completed romances yet")}</p>
            <p className="text-sm text-muted-foreground">{t("intimacy.historyEmptyDesc", "Complete the daily romance on the Dashboard to see your history here.")}</p>
          </div>
    );
  }

  return (
    <div className="space-y-3">
        <p className="text-xs text-muted-foreground">{t("intimacy.historyCount", "{{count}} romance(s) completed", { count: history.length })}</p>
      {history.map((item) => (
        <div key={item.id} className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl">
          <div className="w-9 h-9 rounded-lg bg-rose-500/20 flex items-center justify-center shrink-0">
            <Heart size={16} className="text-rose-400" fill="currentColor" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{item.tipTitle}</p>
            <p className="text-xs text-muted-foreground capitalize">{item.tipCategory} • {new Date(item.completedAt).toLocaleDateString()}</p>
          </div>
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
        </div>
      ))}
    </div>
  );
}
