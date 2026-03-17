import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Streamdown } from "streamdown";
import { toast } from "sonner";
import {
  RefreshCw, BookOpen, Flame, Heart, Zap, Sparkles, Lock,
  Bookmark, BookMarked, Share2, Trash2, ChevronDown, ChevronUp,
  Pencil, Library, Wand2, Eye, Volume2, VolumeX, Pause, Play,
  Maximize2, X, Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

type Category = "romance" | "aventura" | "fantasia" | "proibido" | "surpresa";

const CATEGORIES_DATA: { id: Category; emoji: string; icon: React.ElementType }[] = [
  { id: "surpresa", emoji: "🎲", icon: Sparkles },
  { id: "romance", emoji: "💕", icon: Heart },
  { id: "aventura", emoji: "🌊", icon: Zap },
  { id: "fantasia", emoji: "🔮", icon: BookOpen },
  { id: "proibido", emoji: "🔥", icon: Flame },
];

const CATEGORY_LABELS: Record<string, string> = {
  surpresa: "🎲 Surprise", romance: "💕 Romance", aventura: "🌊 Adventure",
  fantasia: "🔮 Fantasy", proibido: "🔥 Forbidden",
};

const DAILY_SEED_KEY = "fantasia_daily_seed";
const DAILY_STORY_KEY = "fantasia_daily_story";
const DAILY_CATEGORY_KEY = "fantasia_daily_category";

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function extractTitle(story: string): string {
  const lines = story.trim().split("\n");
  const first = lines[0].replace(/^#+\s*/, "").replace(/\*\*/g, "").trim();
  return first.length > 0 && first.length < 100 ? first : "Sofia's Fantasy";
}

// ── Library item component ──────────────────────────────────────────────────
function LibraryItem({
  item,
  onDelete,
  onShare,
  onImmersive,
}: {
  item: { id: number; title: string; story: string; category: string; sharedToken?: string | null; createdAt: number; readCount?: number | null; isMostRead?: boolean };
  onDelete: (id: number) => void;
  onShare: (id: number) => void;
  onImmersive: (story: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [sharing, setSharing] = useState(false);
  const shareUrl = item.sharedToken ? `${window.location.origin}/fantasy/${item.sharedToken}` : null;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-accent/30 transition-colors"
      >
              <div className="flex items-center gap-2 min-w-0">
            <span className="text-base shrink-0">{item.isMostRead ? "🏆" : "📖"}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold text-foreground truncate">{item.title}</p>
                {item.isMostRead && (
                  <span className="inline-flex items-center gap-0.5 text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full px-1.5 py-0.5 font-medium shrink-0">
                    🏆 Most read
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground">
                  {CATEGORY_LABELS[item.category] ?? item.category} · {new Date(item.createdAt).toLocaleDateString("en-US")}
                </p>
                {(item.readCount ?? 0) > 0 && (
                  <span className="inline-flex items-center gap-0.5 text-xs text-pink-400 font-medium">
                    <Eye size={10} />{item.readCount} read{(item.readCount ?? 0) !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          </div>
        {expanded ? <ChevronUp size={16} className="text-muted-foreground shrink-0" /> : <ChevronDown size={16} className="text-muted-foreground shrink-0" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-border/50">
          <div className="prose prose-sm dark:prose-invert max-w-none text-foreground leading-relaxed py-3">
            <Streamdown>{item.story}</Streamdown>
          </div>
          <div className="flex gap-2 pt-2">
            {shareUrl ? (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-green-500/30 text-green-400 hover:bg-green-500/10 text-xs"
                onClick={() => { navigator.clipboard.writeText(shareUrl); toast.success("Link copied! 💋"); }}
              >
                <Share2 size={12} className="mr-1" /> Copy Link
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs"
                disabled={sharing}
                onClick={async () => { setSharing(true); await onShare(item.id); setSharing(false); }}
              >
                {sharing ? <RefreshCw size={12} className="mr-1 animate-spin" /> : <Share2 size={12} className="mr-1" />}
                Share
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 text-xs"
              onClick={() => onImmersive(item.story)}
              title="Immersive Mode"
            >
              <Maximize2 size={12} />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-destructive/30 text-destructive hover:bg-destructive/10 text-xs"
              onClick={() => onDelete(item.id)}
            >
              <Trash2 size={12} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Audio Player Hook ──────────────────────────────────────────────────────
function useAudioNarration() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState<number>(() => {
    const saved = localStorage.getItem("fantasia_narration_speed");
    return saved ? parseFloat(saved) : 1.0;
  });
  const utteranceRef = { current: null as SpeechSynthesisUtterance | null };
  const currentTextRef = { current: "" };

  const stripMarkdown = (text: string) =>
    text.replace(/#{1,6}\s*/g, "").replace(/\*{1,2}([^*]+)\*{1,2}/g, "$1").replace(/\n{2,}/g, ". ").replace(/\n/g, " ").trim();

  const play = (text: string, rateOverride?: number) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const cleanText = stripMarkdown(text);
    currentTextRef.current = cleanText;
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "en-US";
    utterance.rate = rateOverride ?? speed;
    utterance.pitch = 1.1;
    // Try to pick a female voice
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(v => v.lang.startsWith("pt") && /female|feminina|woman/i.test(v.name))
      || voices.find(v => v.lang.startsWith("pt"));
    if (femaleVoice) utterance.voice = femaleVoice;
    utterance.onstart = () => { setIsPlaying(true); setIsPaused(false); };
    utterance.onend = () => { setIsPlaying(false); setIsPaused(false); };
    utterance.onerror = () => { setIsPlaying(false); setIsPaused(false); };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const changeSpeed = (newSpeed: number, currentText?: string) => {
    setSpeed(newSpeed);
    // If currently playing, restart with new speed
    if (isPlaying && currentText) {
      play(currentText, newSpeed);
    }
  };

  const pause = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  return { isPlaying, isPaused, speed, play, pause, resume, stop, changeSpeed };
}

// ── Main component ──────────────────────────────────────────────────────────
export default function Fantasia() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<Category>("surpresa");
  const [story, setStory] = useState<string | null>(null);
  const [storyCategory, setStoryCategory] = useState<string | null>(null);
  const [generatedAt, setGeneratedAt] = useState<Date | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [savedId, setSavedId] = useState<number | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [activeTab, setActiveTab] = useState("gerar");
  const [immersiveMode, setImmersiveMode] = useState(false);
  const [immersiveStory, setImmersiveStory] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<number>(() => {
    const saved = localStorage.getItem("fantasia_font_size");
    return saved ? parseInt(saved, 10) : 18;
  });
  const audio = useAudioNarration();

  // Persist speed preference
  useEffect(() => {
    localStorage.setItem("fantasia_narration_speed", String(audio.speed));
  }, [audio.speed]);

  const openImmersive = (text: string) => {
    setImmersiveStory(text);
    setImmersiveMode(true);
  };

  const changeFontSize = (delta: number) => {
    setFontSize(prev => {
      const next = Math.min(28, Math.max(14, prev + delta));
      localStorage.setItem("fantasia_font_size", String(next));
      return next;
    });
  };

  const generateMutation = trpc.dailyFantasy.generate.useMutation();
  const saveMutation = trpc.fantasyLibrary.save.useMutation();
  const deleteMutation = trpc.fantasyLibrary.delete.useMutation();
  const shareMutation = trpc.fantasyLibrary.share.useMutation();
  const libraryQuery = trpc.fantasyLibrary.list.useQuery(undefined, { enabled: activeTab === "biblioteca" });
  const utils = trpc.useUtils();

  // Load today's story from localStorage on mount
  useEffect(() => {
    const todayKey = getTodayKey();
    const savedKey = localStorage.getItem(DAILY_SEED_KEY);
    if (savedKey === todayKey) {
      const savedStory = localStorage.getItem(DAILY_STORY_KEY);
      const savedCat = localStorage.getItem(DAILY_CATEGORY_KEY);
      if (savedStory) {
        setStory(savedStory);
        setStoryCategory(savedCat || "surpresa");
        setGeneratedAt(new Date());
      }
    }
  }, []);

  const handleGenerate = async (forceNew = false) => {
    try {
      setIsSaved(false);
      setSavedId(null);

      // Build the custom category prompt if user typed one
      const categoryToSend = useCustom && customPrompt.trim() ? "surpresa" : selectedCategory;

      const result = await generateMutation.mutateAsync({
        category: categoryToSend,
        forceNew,
        ...(useCustom && customPrompt.trim() ? { customScenario: customPrompt.trim() } as any : {}),
      });

      setStory(result.story);
      setStoryCategory(result.category);
      setGeneratedAt(result.generatedAt);

      // Save to localStorage for the day
      localStorage.setItem(DAILY_SEED_KEY, getTodayKey());
      localStorage.setItem(DAILY_STORY_KEY, result.story);
      localStorage.setItem(DAILY_CATEGORY_KEY, result.category);

      toast.success("New fantasy generated! 🔥");
    } catch {
      toast.error("Failed to generate fantasy. Please try again.");
    }
  };

  const handleSave = async () => {
    if (!story) return;
    try {
      const title = extractTitle(story);
      const result = await saveMutation.mutateAsync({
        title,
        story,
        category: storyCategory || "surpresa",
        customPrompt: useCustom ? customPrompt : undefined,
      });
      setIsSaved(true);
      setSavedId(result.id);
      toast.success("Fantasy saved to library! 📚");
      utils.fantasyLibrary.list.invalidate();
    } catch {
      toast.error("Error saving. Please try again.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Fantasy removed.");
      utils.fantasyLibrary.list.invalidate();
    } catch {
      toast.error("Error removing.");
    }
  };

  const handleShare = async (id: number) => {
    try {
      const result = await shareMutation.mutateAsync({ id });
      const url = `${window.location.origin}/fantasy/${result.token}`;
      await navigator.clipboard.writeText(url);
      toast.success("Link copied! Share it with her 💋");
      utils.fantasyLibrary.list.invalidate();
    } catch {
      toast.error("Error generating link.");
    }
  };

  const handleShareCurrent = async () => {
    if (!savedId) {
      // Save first then share
      if (!story) return;
      try {
        const title = extractTitle(story);
        const result = await saveMutation.mutateAsync({
          title, story, category: storyCategory || "surpresa",
          customPrompt: useCustom ? customPrompt : undefined,
        });
        setIsSaved(true);
        setSavedId(result.id);
        utils.fantasyLibrary.list.invalidate();
        await handleShare(result.id);
      } catch {
        toast.error("Error sharing.");
      }
    } else {
      await handleShare(savedId);
    }
  };

  const CATEGORIES = CATEGORIES_DATA.map(c => ({
    ...c,
    label: t(`fantasia.categories.${c.id}`),
    description: t(`fantasia.categoryDesc.${c.id}`),
  }));
  const selectedCat = CATEGORIES.find(c => c.id === selectedCategory)!;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Immersive Reading Overlay ── */}
      {immersiveMode && (story || immersiveStory) && (
        <div
          className="fixed inset-0 z-50 bg-black flex flex-col"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Moon size={16} className="text-rose-400" />
              <span className="text-sm font-semibold text-white/80">{t("fantasia.immersiveTitle")}</span>
              {storyCategory && (
                <span className="text-xs text-white/40 ml-1">{CATEGORY_LABELS[storyCategory] ?? storyCategory}</span>
              )}
            </div>
            {/* Font size controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => changeFontSize(-2)}
                className="w-7 h-7 rounded-lg border border-white/20 text-white/60 hover:text-white hover:border-white/40 flex items-center justify-center text-sm font-bold transition-colors"
                title="Diminuir fonte"
              >A-</button>
              <span className="text-xs text-white/40 w-8 text-center">{fontSize}px</span>
              <button
                onClick={() => changeFontSize(2)}
                className="w-7 h-7 rounded-lg border border-white/20 text-white/60 hover:text-white hover:border-white/40 flex items-center justify-center text-sm font-bold transition-colors"
                title="Aumentar fonte"
              >A+</button>
              <button onClick={() => { setImmersiveMode(false); setImmersiveStory(null); }} className="text-white/50 hover:text-white/90 p-1 ml-2">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Story text */}
          <div className="flex-1 overflow-y-auto px-6 py-8 md:px-16 lg:px-32">
            <div className="max-w-2xl mx-auto">
              <div
                className="text-white/90 leading-[1.9] whitespace-pre-wrap"
                style={{ fontSize: `${fontSize}px` }}
              >
                {(immersiveStory || story)!.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/#{1,6}\s*/g, "")}
              </div>
            </div>
          </div>

          {/* Bottom audio controls */}
          <div className="border-t border-white/10 px-6 py-4">
            <div className="max-w-2xl mx-auto flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-sm shrink-0">🎤</div>
              <div className="flex-1 flex items-center gap-3">
                {!audio.isPlaying ? (
                  <Button size="sm" variant="outline" onClick={() => audio.play((immersiveStory || story)!)}
                    className="border-purple-500/40 text-purple-300 hover:bg-purple-500/20 h-8 px-3 text-xs">
                    <Play size={12} className="mr-1" />{t("fantasia.listen")}
                  </Button>
                ) : audio.isPaused ? (
                  <Button size="sm" variant="outline" onClick={audio.resume}
                    className="border-purple-500/40 text-purple-300 hover:bg-purple-500/20 h-8 px-3 text-xs">
                    <Play size={12} className="mr-1" />{t("fantasia.resume")}
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={audio.pause}
                    className="border-purple-500/40 text-purple-300 hover:bg-purple-500/20 h-8 px-3 text-xs">
                    <Pause size={12} className="mr-1" />{t("fantasia.pause")}
                  </Button>
                )}
                {audio.isPlaying && (
                  <Button size="sm" variant="outline" onClick={audio.stop}
                    className="border-red-500/40 text-red-400 hover:bg-red-500/20 h-8 px-2">
                    <VolumeX size={12} />
                  </Button>
                )}
                <input
                  type="range" min={0.5} max={2} step={0.25}
                  value={audio.speed}
                  onChange={e => audio.changeSpeed(parseFloat(e.target.value), (immersiveStory || story) ?? undefined)}
                  className="flex-1 h-1 accent-purple-500 cursor-pointer"
                />
                <span className="text-xs text-purple-400 font-mono w-8 shrink-0">{audio.speed.toFixed(2).replace(".00", "x").replace(/0$/, "x")}</span>
              </div>
              <p className="text-xs text-white/30">{audio.isPlaying ? (audio.isPaused ? t("fantasia.narrationStatus.paused") : t("fantasia.narrationStatus.playing")) : t("fantasia.narrate")}</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg">
            <span className="text-2xl">🔥</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t("fantasia.title")}</h1>
            <p className="text-sm text-muted-foreground">{t("fantasia.subtitle")}</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-6">
            <TabsTrigger value="gerar" className="flex-1 gap-2">
              <Wand2 size={14} /> {t("fantasia.tabGenerate")}
            </TabsTrigger>
            <TabsTrigger value="personalizada" className="flex-1 gap-2">
              <Pencil size={14} /> {t("fantasia.tabCustom")}
            </TabsTrigger>
            <TabsTrigger value="biblioteca" className="flex-1 gap-2">
              <Library size={14} /> {t("fantasia.tabLibrary")}
            </TabsTrigger>
          </TabsList>

          {/* ── TAB: Gerar ── */}
          <TabsContent value="gerar" className="space-y-4">
            {/* Category selector */}
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">{t("fantasia.chooseTheme")}</h2>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); setUseCustom(false); }}
                    className={cn(
                      "flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center",
                      selectedCategory === cat.id && !useCustom
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:border-primary/40"
                    )}
                  >
                    <span className="text-xl">{cat.emoji}</span>
                    <span className={cn("text-xs font-medium leading-tight", selectedCategory === cat.id && !useCustom ? "text-primary" : "text-muted-foreground")}>
                      {cat.label}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center italic">{selectedCat.description}</p>
            </div>

            {/* Generate button */}
            <Button
              onClick={() => { setUseCustom(false); handleGenerate(true); }}
              disabled={generateMutation.isPending}
              size="lg"
              className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold py-6 text-base rounded-xl"
            >
              {generateMutation.isPending ? (
                <><RefreshCw size={16} className="mr-2 animate-spin" />{t("fantasia.generating")}</>
              ) : (
                <><Flame size={16} className="mr-2" />{t("fantasia.generateBtn")} {selectedCat.emoji}</>
              )}
            </Button>

            {/* Story display */}
            {story && !generateMutation.isPending && (
              <div className="space-y-3">
                <div className="bg-gradient-to-br from-rose-500/5 via-card to-card border border-rose-500/20 rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border/50">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-sm">💃</div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">Sofia</p>
                        <p className="text-xs text-muted-foreground">{generatedAt ? new Date(generatedAt).toLocaleDateString() : "Today"}</p>
                      </div>
                    </div>
                    {storyCategory && (
                      <Badge variant="outline" className="border-rose-500/30 text-rose-400 text-xs">
                        {CATEGORY_LABELS[storyCategory] ?? storyCategory}
                      </Badge>
                    )}
                  </div>
                  <div className="px-5 py-4">
                    <div className="prose prose-sm dark:prose-invert max-w-none text-foreground leading-relaxed">
                      <Streamdown>{story}</Streamdown>
                    </div>
                  </div>
                </div>

                {/* Audio narration bar */}
                <div className="bg-card border border-purple-500/20 rounded-xl px-4 py-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-sm shrink-0">🎙️</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground">Sofia's Narration</p>
                      <p className="text-xs text-muted-foreground">{audio.isPlaying ? (audio.isPaused ? "Paused" : "Narrating...") : "Listen to the story aloud"}</p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      {!audio.isPlaying ? (
                        <Button size="sm" variant="outline" onClick={() => story && audio.play(story)}
                          className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 h-8 px-3 text-xs">
                          <Play size={12} className="mr-1" />Listen
                        </Button>
                      ) : audio.isPaused ? (
                        <Button size="sm" variant="outline" onClick={audio.resume}
                          className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 h-8 px-3 text-xs">
                          <Play size={12} className="mr-1" />Resume
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={audio.pause}
                          className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 h-8 px-3 text-xs">
                          <Pause size={12} className="mr-1" />Pause
                        </Button>
                      )}
                      {audio.isPlaying && (
                        <Button size="sm" variant="outline" onClick={audio.stop}
                          className="border-destructive/30 text-destructive hover:bg-destructive/10 h-8 px-2">
                          <VolumeX size={12} />
                        </Button>
                      )}
                    </div>
                  </div>
                  {/* Speed slider */}
                  <div className="flex items-center gap-3 pt-0.5">
                    <Volume2 size={12} className="text-muted-foreground shrink-0" />
                    <input
                      type="range" min={0.5} max={2} step={0.25}
                      value={audio.speed}
                      onChange={e => audio.changeSpeed(parseFloat(e.target.value), story ?? undefined)}
                      className="flex-1 h-1.5 accent-purple-500 cursor-pointer"
                    />
                    <span className="text-xs text-purple-400 font-mono w-8 text-right shrink-0">{audio.speed.toFixed(2).replace(".00", "x").replace(/0$/, "x")}</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <Button
                    onClick={handleSave}
                    disabled={saveMutation.isPending || isSaved}
                    variant="outline"
                    size="sm"
                    className={cn(
                      "border-amber-500/30 text-amber-400 hover:bg-amber-500/10 text-xs",
                      isSaved && "border-amber-500 bg-amber-500/20 text-amber-300"
                    )}
                  >
                    {isSaved ? <><BookMarked size={12} className="mr-1" />{t("common.saved")}</> : <><Bookmark size={12} className="mr-1" />{t("fantasia.saveFantasy")}</>}
                  </Button>
                  <Button
                    onClick={handleShareCurrent}
                    disabled={shareMutation.isPending || saveMutation.isPending}
                    variant="outline"
                    size="sm"
                    className="border-green-500/30 text-green-400 hover:bg-green-500/10 text-xs"
                  >
                    {shareMutation.isPending ? <RefreshCw size={12} className="mr-1 animate-spin" /> : <Share2 size={12} className="mr-1" />}
                    Enviar
                  </Button>
                  <Button
                    onClick={() => handleGenerate(true)}
                    disabled={generateMutation.isPending}
                    variant="outline"
                    size="sm"
                    className="border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs"
                  >
                    <RefreshCw size={12} className="mr-1" />New
                  </Button>
                  <Button
                    onClick={() => setImmersiveMode(true)}
                    variant="outline"
                    size="sm"
                    className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 text-xs"
                  >
                    <Maximize2 size={12} className="mr-1" />Immersive
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  <Lock size={10} className="inline mr-1" />Private content exclusive to subscribers
                </p>
              </div>
            )}

            {generateMutation.isPending && (
              <div className="text-center py-6">
                <div className="flex justify-center gap-1 mb-3">
                  {[0, 150, 300].map(d => (
                    <span key={d} className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground italic">Sofia is writing your fantasy... 💋</p>
              </div>
            )}

            {!story && !generateMutation.isPending && (
              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { emoji: "📖", title: "Complete Stories", desc: "400-600 words" },
                  { emoji: "🎲", title: "Generate as Many as You Want", desc: "No daily limit" },
                  { emoji: "🔒", title: "100% Private", desc: "Only you have access" },
                ].map(item => (
                  <div key={item.title} className="bg-card border border-border rounded-xl p-3 text-center">
                    <div className="text-2xl mb-1">{item.emoji}</div>
                    <p className="text-xs font-semibold text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── TAB: Personalizada ── */}
          <TabsContent value="personalizada" className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-base">✍️</div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Describe your fantasy</p>
                  <p className="text-xs text-muted-foreground">Sofia will write exactly what you imagine</p>
                </div>
              </div>
              <Textarea
                value={customPrompt}
                onChange={e => setCustomPrompt(e.target.value)}
                placeholder="Ex: Office after hours, boss and secretary, weeks of built-up tension, she wears a red dress..."
                className="min-h-[120px] text-sm resize-none border-border/60 focus:border-primary/50 bg-background"
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-muted-foreground">{customPrompt.length}/500 characters</p>
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <span>Suggestions:</span>
                  {["Beach at sunset", "Luxury hotel", "Forbidden neighbor"].map(s => (
                    <button key={s} onClick={() => setCustomPrompt(s)} className="text-primary hover:underline">{s}</button>
                  ))}
                </div>
              </div>
            </div>

            <Button
              onClick={() => { setUseCustom(true); handleGenerate(true); }}
              disabled={generateMutation.isPending || customPrompt.trim().length < 10}
              size="lg"
              className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold py-6 text-base rounded-xl"
            >
              {generateMutation.isPending ? (
                <><RefreshCw size={16} className="mr-2 animate-spin" />{t("fantasia.generating")}</>
              ) : (
                <><Wand2 size={16} className="mr-2" />Create My Fantasy</>
              )}
            </Button>

            {customPrompt.trim().length < 10 && customPrompt.length > 0 && (
              <p className="text-xs text-muted-foreground text-center">Describe a bit more (minimum 10 characters)</p>
            )}

            {/* Story display for custom */}
            {story && useCustom && !generateMutation.isPending && (
              <div className="space-y-3">
                <div className="bg-gradient-to-br from-violet-500/5 via-card to-card border border-violet-500/20 rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border/50">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-sm">💃</div>
                      <p className="text-sm font-semibold text-foreground">Sofia — Custom Fantasy</p>
                    </div>
                    <Badge variant="outline" className="border-violet-500/30 text-violet-400 text-xs">✍️ Custom</Badge>
                  </div>
                  <div className="px-5 py-4">
                    <div className="prose prose-sm dark:prose-invert max-w-none text-foreground leading-relaxed">
                      <Streamdown>{story}</Streamdown>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Button onClick={handleSave} disabled={saveMutation.isPending || isSaved} variant="outline" size="sm"
                    className={cn("border-amber-500/30 text-amber-400 hover:bg-amber-500/10 text-xs", isSaved && "border-amber-500 bg-amber-500/20")}>
                    {isSaved ? <><BookMarked size={12} className="mr-1" />{t("common.saved")}</> : <><Bookmark size={12} className="mr-1" />{t("fantasia.saveFantasy")}</>}
                  </Button>
                  <Button onClick={handleShareCurrent} disabled={shareMutation.isPending} variant="outline" size="sm"
                    className="border-green-500/30 text-green-400 hover:bg-green-500/10 text-xs">
                    <Share2 size={12} className="mr-1" />Share
                  </Button>
                  <Button onClick={() => { setUseCustom(true); handleGenerate(true); }} disabled={generateMutation.isPending} variant="outline" size="sm"
                    className="border-violet-500/30 text-violet-400 hover:bg-violet-500/10 text-xs">
                    <RefreshCw size={12} className="mr-1" />New
                  </Button>
                </div>
              </div>
            )}

            {generateMutation.isPending && (
              <div className="text-center py-6">
                <div className="flex justify-center gap-1 mb-3">
                  {[0, 150, 300].map(d => (
                    <span key={d} className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground italic">Sofia is creating your personalized fantasy... 💋</p>
              </div>
            )}
          </TabsContent>

          {/* ── TAB: Biblioteca ── */}
          <TabsContent value="biblioteca" className="space-y-3">
            {libraryQuery.isLoading ? (
              <div className="text-center py-8 text-muted-foreground text-sm">Loading your library...</div>
            ) : !libraryQuery.data || libraryQuery.data.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">📚</div>
                <p className="text-foreground font-semibold mb-1">Empty library</p>
                <p className="text-sm text-muted-foreground">Generate a fantasy and click "Save" to add it here.</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">{libraryQuery.data.length} saved fantas{libraryQuery.data.length !== 1 ? "ies" : "y"}</p>
                {(() => {
                  // Find most-read this week (last 7 days)
                  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
                  const thisWeek = libraryQuery.data.filter(i => i.createdAt >= oneWeekAgo);
                  const mostReadId = thisWeek.length > 0
                    ? thisWeek.reduce((a, b) => (b.readCount ?? 0) > (a.readCount ?? 0) ? b : a).id
                    : null;
                  const topReadCount = mostReadId ? (libraryQuery.data.find(i => i.id === mostReadId)?.readCount ?? 0) : 0;
                  return libraryQuery.data.map(item => (
                    <LibraryItem
                      key={item.id}
                      item={{ ...item, isMostRead: item.id === mostReadId && topReadCount > 0 }}
                      onDelete={handleDelete}
                      onShare={handleShare}
                      onImmersive={openImmersive}
                    />
                  ));
                })()}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
