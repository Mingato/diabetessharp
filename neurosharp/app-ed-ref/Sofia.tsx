import { useState, useRef, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Streamdown } from "streamdown";
import { Heart, History, Lock, Trash2, ChevronRight, MessageSquare, Clock, ArrowLeft, Brain, X, Sparkles } from "lucide-react";
import { useLocation } from "wouter";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Personality = "playful" | "intellectual" | "romantic" | "independent" | "shy";
type Scenario = {
  id: string;
  label: string;
  description: string;
  emoji: string;
};

const PERSONALITIES: { id: Personality; label: string; emoji: string; description: string }[] = [
  { id: "playful", label: "Playful", emoji: "😄", description: "Loves humor and light challenges" },
  { id: "intellectual", label: "Intellectual", emoji: "🧠", description: "Appreciates deep conversations" },
  { id: "romantic", label: "Romantic", emoji: "💕", description: "Values gentle gestures" },
  { id: "independent", label: "Independent", emoji: "💪", description: "Self-sufficient and confident" },
  { id: "shy", label: "Shy", emoji: "🌸", description: "Reserved, but opens up gradually" },
];

const SCENARIOS: Scenario[] = [
  { id: "cafe", label: "Coffee Shop", emoji: "☕", description: "You met at a coffee shop and are talking for the first time." },
  { id: "app", label: "Dating App", emoji: "📱", description: "You matched on an app and are chatting before the first date." },
  { id: "work", label: "Work", emoji: "💼", description: "You work at the same company and want to ask her out." },
  { id: "gym", label: "Gym", emoji: "🏋️", description: "You see each other regularly at the gym and want to start a conversation." },
  { id: "party", label: "Party", emoji: "🎉", description: "You met at a mutual friend's party." },
  { id: "reconnect", label: "Reconnect", emoji: "🔄", description: "You knew each other years ago and just ran into each other again." },
];

const PERSONA_MAP: Record<Personality, string> = {
  playful: "classic", intellectual: "classic", romantic: "emotional",
  independent: "bold", shy: "emotional",
};

const SOFIA_QUICK_TOPICS = [
  {
    category: "🔥 Flirting Practice",
    topics: [
      { emoji: "😏", label: "Win her over", personality: "playful" as Personality, scenario: "cafe", firstMessage: "Teach me how to win you over, Sofia. What would make you interested in a guy?" },
      { emoji: "💬", label: "First message", personality: "shy" as Personality, scenario: "app", firstMessage: "Sofia, what's the perfect first message to send on a dating app that actually gets a response?" },
      { emoji: "👀", label: "Eye contact", personality: "romantic" as Personality, scenario: "cafe", firstMessage: "I've been making eye contact with you for a while... what are you thinking right now?" },
      { emoji: "😂", label: "Make her laugh", personality: "playful" as Personality, scenario: "party", firstMessage: "I want to make you laugh. Give me a chance — what kind of humor do you like?" },
    ],
  },
  {
    category: "💋 Seduction & Intimacy",
    topics: [
      { emoji: "🌙", label: "Build tension", personality: "romantic" as Personality, scenario: "reconnect", firstMessage: "Sofia, how do I build sexual tension without being too obvious or pushy?" },
      { emoji: "🔥", label: "Your fantasies", personality: "playful" as Personality, scenario: "app", firstMessage: "Hey Sofia, tell me one of your deepest fantasies... I'm curious 🔥" },
      { emoji: "📖", label: "Erotic story", personality: "romantic" as Personality, scenario: "cafe", firstMessage: "Can you write me a short, sensual erotic story? I want to see your imagination..." },
      { emoji: "💌", label: "Seductive text", personality: "independent" as Personality, scenario: "app", firstMessage: "Write me the most seductive text message you'd love to receive from a man." },
    ],
  },
  {
    category: "🧠 Deep Connection",
    topics: [
      { emoji: "💭", label: "Deep talk", personality: "intellectual" as Personality, scenario: "cafe", firstMessage: "Sofia, what's something you've never told anyone but wish someone would ask you about?" },
      { emoji: "❤️", label: "Emotional bond", personality: "romantic" as Personality, scenario: "reconnect", firstMessage: "What makes you feel truly emotionally connected to someone? What does that look like for you?" },
      { emoji: "🎯", label: "What she wants", personality: "independent" as Personality, scenario: "gym", firstMessage: "Be honest with me — what do women actually want in a man that they never say out loud?" },
      { emoji: "🌹", label: "Romance tips", personality: "romantic" as Personality, scenario: "app", firstMessage: "What's the most romantic thing a man has ever done for you, or what would make you fall for someone?" },
    ],
  },
  {
    category: "💪 Confidence Building",
    topics: [
      { emoji: "😤", label: "Rejection practice", personality: "independent" as Personality, scenario: "party", firstMessage: "Sofia, I want to practice handling rejection gracefully. Reject me and I'll try to respond well." },
      { emoji: "🎤", label: "Approach anxiety", personality: "shy" as Personality, scenario: "gym", firstMessage: "I'm nervous to approach women. Can you help me practice? Pretend I just walked up to you." },
      { emoji: "🏆", label: "Be more alpha", personality: "playful" as Personality, scenario: "work", firstMessage: "What's the difference between a confident man and a desperate one? Show me what confidence looks like." },
      { emoji: "🪞", label: "Self-improvement", personality: "intellectual" as Personality, scenario: "cafe", firstMessage: "What qualities in a man do you find most attractive, and how can I develop them?" },
    ],
  },
];

export default function Sofia() {
  const [, navigate] = useLocation();
  const { data: upsellStatus, isLoading: upsellLoading } = trpc.checkout.getMyUpsellStatus.useQuery();

  if (upsellLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!upsellStatus?.upsell2) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-20 h-20 rounded-full bg-pink-500/10 border-2 border-pink-500/30 flex items-center justify-center mb-6">
          <Lock className="w-9 h-9 text-pink-400" />
        </div>
        <h2 className="text-xl font-black text-foreground mb-3">Sofia — Fantasy & Intimacy Assistant</h2>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
          You don't have access to Sofia yet. Activate now and have a personal assistant who understands every one of your fantasies — no judgment, no limits, available any hour of the day or night.
        </p>
        <div className="bg-card border border-border rounded-2xl p-5 w-full mb-6 text-left">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-pink-400" />
            <span className="font-bold text-foreground">What you get:</span>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-pink-400 mt-0.5">♥</span> Unlimited intimate conversations with personalized AI</li>
            <li className="flex items-start gap-2"><span className="text-pink-400 mt-0.5">♥</span> Fantasy exploration without judgment or shame</li>
            <li className="flex items-start gap-2"><span className="text-pink-400 mt-0.5">♥</span> Personalized seduction and intimacy tips just for you</li>
            <li className="flex items-start gap-2"><span className="text-pink-400 mt-0.5">♥</span> Available 24/7 — whenever you need her</li>
          </ul>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-muted-foreground text-sm line-through">$97.00</span>
          <span className="text-pink-400 font-black text-2xl">$16.99</span>
          <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded-full">83% OFF</span>
        </div>
        <Button
          onClick={() => navigate("/checkout/upsell2")}
          className="w-full bg-pink-500 hover:bg-pink-400 text-white font-black text-base py-6"
        >
          <Heart className="w-5 h-5 mr-2" />
          Activate Sofia Now
        </Button>
        <p className="text-xs text-muted-foreground mt-3">Lifetime access — pay once, use forever</p>
      </div>
    );
  }

  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedPersonality, setSelectedPersonality] = useState<Personality>("playful");
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(SCENARIOS[0]);
  const [phase, setPhase] = useState<"setup" | "history" | "chat" | "feedback">("setup");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [showMemoryPanel, setShowMemoryPanel] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatMutation = trpc.sofia.chat.useMutation();
  const feedbackMutation = trpc.sofia.feedback.useMutation();
  const createSessionMutation = trpc.sofiaHistory.createSession.useMutation();
  const saveMessageMutation = trpc.sofiaHistory.saveMessage.useMutation();
  const deleteSessionMutation = trpc.sofiaHistory.deleteSession.useMutation();
  const extractMemoryMutation = trpc.sofiaMemory.extractAndSave.useMutation();
  const clearMemoryMutation = trpc.sofiaMemory.clearMemory.useMutation();
  const markTopicTriedMutation = trpc.sofiaMemory.markTopicTried.useMutation();

  const { data: sessions, refetch: refetchSessions } = trpc.sofiaHistory.listSessions.useQuery();
  const { data: memory, refetch: refetchMemory } = trpc.sofiaMemory.getMemory.useQuery();

  // Derive tried topics set from memory for O(1) lookup
  const triedTopics = useMemo(() => new Set<string>((memory?.triedTopics as string[]) ?? []), [memory]);

  // Compute personalized recommendation: first untried topic across all categories
  const recommendedTopic = useMemo(() => {
    for (const cat of SOFIA_QUICK_TOPICS) {
      for (const topic of cat.topics) {
        if (!triedTopics.has(topic.label)) return topic;
      }
    }
    return null; // all tried!
  }, [triedTopics]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getOpeningMessage = (personality: Personality, scenarioId: string): string => {
    const openings: Record<string, Record<Personality, string>> = {
      cafe: {
        playful: "Hey! 😄 You've been eyeing my coffee for a while... Want to try it? Just kidding! But seriously, can I help you with something?",
        intellectual: "Hello. I'm rereading this book for the third time — each reading reveals something new. Do you usually reread books?",
        romantic: "What a beautiful day, right? There's something special about cafes like this, with this light... Do you come here often?",
        independent: "Hi. *glances briefly from phone* Did you need something?",
        shy: "*smiles shyly* Oh, hi... Do you like this cafe too? It's my favorite spot.",
      },
      app: {
        playful: "Finally! I thought you'd disappeared 😂 I'm curious to see if you're as funny in person as in your messages.",
        intellectual: "Hi! I read your profile carefully. You mentioned you traveled to Japan — what impacted you most culturally there?",
        romantic: "Hi! I got excited when you messaged. I'm curious: what's the last thing that made you genuinely smile?",
        independent: "Hi. I'll be direct: I don't have much time for small talk. Tell me something interesting about yourself.",
        shy: "Hi... 🌸 I always get nervous at this part of starting a conversation. Do you too?",
      },
      work: {
        playful: "Hey, colleague! 😄 You always look so focused on those spreadsheets. Do you have a secret life I don't know about?",
        intellectual: "Hi! I was thinking about today's presentation — do you think their approach makes strategic sense?",
        romantic: "Good morning! *smiles* I always notice when you arrive. You have this calm way about you that's... different. How was your weekend?",
        independent: "Hi. I need your professional opinion on something. Do you have 5 minutes?",
        shy: "Oh, hi! *scratches head* I... wanted to ask you something for a while. Do you like working here?",
      },
      gym: {
        playful: "Hey! Did you come to steal my favorite equipment again? 😂 I'm watching you!",
        intellectual: "Hi! I noticed you have a very structured routine. Do you follow a specific training method?",
        romantic: "Hello! You always look so focused... There's something admirable about that. How long have you been training here?",
        independent: "Hi. Can you help me with my form on this exercise? I prefer to learn correctly from the start.",
        shy: "*waves shyly* Hi... Have you been training here long? I'm still getting used to the routine.",
      },
      party: {
        playful: "Hey! You're friends with Alex too? Small world! 😄 Since we're 'almost friends', tell me: do you dance?",
        intellectual: "Hello! I was needing a more interesting conversation. Do you know the host well?",
        romantic: "Hi! This party is great, but I confess I prefer more intimate conversations. You also seem a bit out of your element here.",
        independent: "Hi. You seem to be one of the few people here who isn't on autopilot. What brought you?",
        shy: "Hi... *smiles nervously* I don't know many people here. Are you friends with Alex too?",
      },
      reconnect: {
        playful: "Wow! It's been so long! 😄 You look different — or am I just nostalgic? Tell me everything, what have you been up to?",
        intellectual: "What a surprise! It's been years... You've changed a lot. What experiences have transformed you the most in that time?",
        romantic: "Wow... *pause* I didn't expect to see you. How are you? It feels like yesterday and an eternity at the same time.",
        independent: "Hi! What a coincidence. Are you doing well? Has life treated you well these years?",
        shy: "*blushes* Wow, what a surprise... I've thought about you other times, but never imagined that... How are you?",
      },
    };
    return openings[scenarioId]?.[personality] || "Hi! How are you?";
  };

  const startChat = async () => {
    const openingMsg = getOpeningMessage(selectedPersonality, selectedScenario.id);
    const initialMessage: Message = { role: "assistant", content: openingMsg };
    setMessages([initialMessage]);
    setPhase("chat");

    try {
      const result = await createSessionMutation.mutateAsync({
        personaId: PERSONA_MAP[selectedPersonality],
        firstMessage: `${selectedScenario.label} · ${PERSONALITIES.find(p => p.id === selectedPersonality)?.label}`,
      });
      setCurrentSessionId(result.sessionId);
      await saveMessageMutation.mutateAsync({
        sessionId: result.sessionId,
        role: "assistant",
        content: openingMsg,
      });
    } catch {
      // Non-critical — chat still works without history
    }
  };

  const quickStartChat = async (personality: Personality, scenarioId: string, firstMessage: string, topicLabel?: string) => {
    // Track this topic as tried
    if (topicLabel) {
      markTopicTriedMutation.mutate({ topicLabel }, { onSuccess: () => refetchMemory() });
    }
    // Set personality and scenario
    setSelectedPersonality(personality);
    const scenario = SCENARIOS.find(s => s.id === scenarioId) || SCENARIOS[0];
    setSelectedScenario(scenario);

    // Build opening + first user message
    const openingMsg = getOpeningMessage(personality, scenarioId);
    const initialAssistant: Message = { role: "assistant", content: openingMsg };
    const userMsg: Message = { role: "user", content: firstMessage };
    const initialMessages = [initialAssistant, userMsg];
    setMessages(initialMessages);
    setPhase("chat");

    // Create session
    let sessionId: number | null = null;
    try {
      const result = await createSessionMutation.mutateAsync({
        personaId: PERSONA_MAP[personality],
        firstMessage: `${scenario.label} · ${PERSONALITIES.find(p => p.id === personality)?.label}`,
      });
      sessionId = result.sessionId;
      setCurrentSessionId(result.sessionId);
      saveMessageMutation.mutate({ sessionId: result.sessionId, role: "assistant", content: openingMsg });
      saveMessageMutation.mutate({ sessionId: result.sessionId, role: "user", content: firstMessage });
    } catch {
      // Non-critical
    }

    // Send user message to AI
    try {
      const result = await chatMutation.mutateAsync({
        messages: initialMessages,
        scenario: scenario.description,
        partnerPersonality: personality,
        language: i18n.language as "en" | "pt-BR" | "es",
      });
      const assistantReply: Message = { role: "assistant", content: result.reply };
      setMessages([...initialMessages, assistantReply]);
      if (sessionId) {
        saveMessageMutation.mutate({ sessionId, role: "assistant", content: result.reply });
      }
    } catch {
      toast.error("Failed to connect to Sofia. Please try again.");
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || chatMutation.isPending) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");

    if (currentSessionId) {
      saveMessageMutation.mutate({ sessionId: currentSessionId, role: "user", content: userMessage.content });
    }

    try {
      const result = await chatMutation.mutateAsync({
        messages: newMessages,
        scenario: selectedScenario.description,
        partnerPersonality: selectedPersonality,
        language: i18n.language as "en" | "pt-BR" | "es",
      });
      const assistantMsg: Message = { role: "assistant", content: result.reply };
      setMessages([...newMessages, assistantMsg]);

      if (currentSessionId) {
        saveMessageMutation.mutate({ sessionId: currentSessionId, role: "assistant", content: result.reply });
      }
    } catch {
      toast.error("Failed to send message. Please try again.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const requestFeedback = async () => {
    if (messages.length < 4) {
      toast.error("Keep chatting a bit more before requesting feedback.");
      return;
    }
    try {
      const result = await feedbackMutation.mutateAsync({ conversation: messages, language: i18n.language as "en" | "pt-BR" | "es" });
      setFeedback(result.feedback);
      setPhase("feedback");
      if (currentSessionId) {
        saveMessageMutation.mutate({ sessionId: currentSessionId, role: "feedback", content: result.feedback });
      }
      // Extract and save memory from this conversation
      if (currentSessionId && messages.length >= 4) {
        extractMemoryMutation.mutate({
          sessionId: currentSessionId,
          conversation: messages.filter(m => m.role === "user" || m.role === "assistant"),
          partnerPersonality: selectedPersonality,
          scenario: selectedScenario.label,
        }, {
          onSuccess: () => refetchMemory(),
        });
      }
      refetchSessions();
    } catch {
      toast.error("Failed to generate feedback.");
    }
  };

  const resetChat = () => {
    // Extract memory when ending a chat with enough messages (even without feedback)
    if (currentSessionId && messages.filter(m => m.role === "user").length >= 4) {
      extractMemoryMutation.mutate({
        sessionId: currentSessionId,
        conversation: messages.filter(m => m.role === "user" || m.role === "assistant"),
        partnerPersonality: selectedPersonality,
        scenario: selectedScenario.label,
      }, {
        onSuccess: () => refetchMemory(),
      });
    }
    setMessages([]);
    setFeedback(null);
    setCurrentSessionId(null);
    setPhase("setup");
    refetchSessions();
  };

  const handleDeleteSession = async (sessionId: number) => {
    await deleteSessionMutation.mutateAsync({ sessionId });
    refetchSessions();
    toast.success("Session deleted");
  };

  const handleClearMemory = async () => {
    await clearMemoryMutation.mutateAsync();
    refetchMemory();
    toast.success("Sofia's memory cleared");
    setShowMemoryPanel(false);
  };

  const userMessageCount = messages.filter(m => m.role === "user").length;
  const hasMemory = memory && (memory.userName || (memory.facts as string[])?.length > 0 || (memory.topics as string[])?.length > 0);

  // ── Memory Panel Modal ────────────────────────────────────────────────────
  const MemoryPanel = () => (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4 pb-4 sm:pb-0">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-pink-400" />
            <h2 className="font-bold text-foreground text-lg">Sofia's Memory</h2>
          </div>
          <button onClick={() => setShowMemoryPanel(false)} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!hasMemory ? (
          <div className="text-center py-6 text-muted-foreground">
            <Brain className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Sofia doesn't remember anything yet.</p>
            <p className="text-xs mt-1 opacity-70">After a few conversations, she'll start remembering details about you.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {memory?.userName && (
              <div>
                <p className="text-xs font-semibold text-pink-400 uppercase tracking-wider mb-1.5">Your Name</p>
                <p className="text-sm text-foreground bg-pink-500/10 rounded-lg px-3 py-2 border border-pink-500/20">{memory.userName}</p>
              </div>
            )}

            {(memory?.facts as string[])?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-pink-400 uppercase tracking-wider mb-1.5">Things She Knows About You</p>
                <div className="space-y-1.5">
                  {(memory.facts as string[]).map((fact, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="text-pink-400 mt-0.5">•</span>
                      <span>{fact}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(memory?.topics as string[])?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-pink-400 uppercase tracking-wider mb-1.5">Topics You've Discussed</p>
                <div className="flex flex-wrap gap-2">
                  {(memory.topics as string[]).map((topic, i) => (
                    <Badge key={i} variant="secondary" className="text-xs bg-pink-500/10 text-pink-300 border-pink-500/20">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {memory?.relationshipContext && (
              <div>
                <p className="text-xs font-semibold text-pink-400 uppercase tracking-wider mb-1.5">Your Dynamic</p>
                <p className="text-sm text-muted-foreground italic bg-card border border-border rounded-lg px-3 py-2">{memory.relationshipContext}</p>
              </div>
            )}

            <div className="flex items-center gap-3 pt-1 text-xs text-muted-foreground border-t border-border">
              <span>🗓️ {memory?.totalSessions ?? 0} sessions</span>
              <span>💬 {memory?.totalMessages ?? 0} messages</span>
              {memory?.preferredPersonality && <span>🎭 Prefers {memory.preferredPersonality}</span>}
            </div>
          </div>
        )}

        {hasMemory && (
          <Button
            onClick={handleClearMemory}
            disabled={clearMemoryMutation.isPending}
            variant="outline"
            className="w-full text-red-400 border-red-400/30 hover:bg-red-400/10"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {clearMemoryMutation.isPending ? "Clearing..." : "Clear Sofia's Memory"}
          </Button>
        )}
      </div>
    </div>
  );

  // ── History View ──────────────────────────────────────────────────────────
  if (phase === "history") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setPhase("setup")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">{t("sofia.sessionHistory", "Session History")}</h1>
        </div>

        {!sessions || sessions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>{t("sofia.noSessions", "No saved sessions yet.")}</p>
            <p className="text-xs mt-1">{t("sofia.noSessionsDesc", "Your conversations with Sofia will appear here.")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <Card key={session.id} className="border-border">
                <div className="flex items-center gap-3 p-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-xl flex-shrink-0">
                    💃
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{session.title || "Untitled session"}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {session.messageCount} messages
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(session.lastMessageAt).toLocaleDateString("en-US", { day: "2-digit", month: "short" })}
                      </span>
                      <Badge variant="outline" className="text-[10px] border-pink-500/30 text-pink-400">
                        {session.personaId}
                      </Badge>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteSession(session.id)}
                    className="text-muted-foreground hover:text-red-400 transition-colors p-1"
                    title="Delete session"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Button
          onClick={() => setPhase("setup")}
          className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white"
        >
          {t("sofia.newChat", "New Conversation")} 💬
        </Button>
      </div>
    );
  }

  // ── Setup View ────────────────────────────────────────────────────────────
  if (phase === "setup") {
    return (
      <div className="min-h-screen bg-background">
        {showMemoryPanel && <MemoryPanel />}
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg">
                💃
              </div>
              {hasMemory && (
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-md" title="Sofia remembers you">
                  <Brain className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{t("sofia.title", "Practice with Sofia")}</h1>
            <p className="text-muted-foreground text-base">
              {t("sofia.subtitle", "Practice your seduction skills with Sofia, an AI that simulates real conversations.")}
            </p>
          </div>

          {/* Memory Banner */}
          {hasMemory && (
            <button
              onClick={() => setShowMemoryPanel(true)}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/15 mb-4 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <Brain className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-emerald-400">
                  Sofia remembers you{memory?.userName ? `, ${memory.userName}` : ""}! ✨
                </p>
                <p className="text-xs text-muted-foreground">
                  {(memory?.facts as string[])?.length ?? 0} facts · {(memory?.topics as string[])?.length ?? 0} topics · {memory?.totalSessions ?? 0} sessions
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          )}

          {/* History button */}
          {sessions && sessions.length > 0 && (
            <button
              onClick={() => setPhase("history")}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-card/80 mb-6 transition-colors"
            >
              <History className="w-5 h-5 text-pink-400" />
              <span className="text-sm font-medium flex-1 text-left">{t("sofia.viewHistory", "View session history")}</span>
              <span className="text-xs text-muted-foreground">{sessions.length} sessions</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          )}

          {/* Personality Selection */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <span>🎭</span> {t("sofia.choosePersonality", "Choose a Personality")}
            </h2>
            {memory?.preferredPersonality && (
              <p className="text-xs text-pink-400 mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Sofia remembers you prefer <strong>{memory.preferredPersonality}</strong> — pre-selected for you
              </p>
            )}
            <div className="grid grid-cols-1 gap-3">
              {PERSONALITIES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPersonality(p.id)}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                    selectedPersonality === p.id
                      ? "border-pink-500 bg-pink-500/10"
                      : "border-border bg-card hover:border-pink-300"
                  }`}
                >
                  <span className="text-3xl">{p.emoji}</span>
                  <div>
                    <div className="font-semibold text-foreground">{p.label}</div>
                    <div className="text-sm text-muted-foreground">{p.description}</div>
                  </div>
                  {selectedPersonality === p.id && (
                    <span className="ml-auto text-pink-500 text-xl">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Scenario Selection */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <span>🎬</span> Scenario
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedScenario(s)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center ${
                    selectedScenario.id === s.id
                      ? "border-pink-500 bg-pink-500/10"
                      : "border-border bg-card hover:border-pink-300"
                  }`}
                >
                  <span className="text-3xl">{s.emoji}</span>
                  <span className="font-semibold text-foreground text-sm">{s.label}</span>
                </button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-3 text-center italic">
              {selectedScenario.description}
            </p>
          </div>

          {/* Quick Start Topics */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-semibold text-foreground">⚡ Quick Start</h2>
              <Badge variant="secondary" className="text-xs bg-pink-500/10 text-pink-400 border-pink-500/20">Tap to start instantly</Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Choose a topic and Sofia will respond immediately — no setup needed.</p>

            {/* Personalized recommendation banner */}
            {recommendedTopic && triedTopics.size > 0 && (
              <div
                onClick={() => quickStartChat(recommendedTopic.personality, recommendedTopic.scenario, recommendedTopic.firstMessage, recommendedTopic.label)}
                className="flex items-center gap-3 p-3 mb-4 rounded-xl border border-pink-500/40 bg-gradient-to-r from-pink-500/10 to-rose-500/5 cursor-pointer hover:border-pink-400 transition-all"
              >
                <span className="text-2xl">{recommendedTopic.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-pink-400 mb-0.5">✨ Suggested for you</p>
                  <p className="text-sm font-medium text-foreground truncate">{recommendedTopic.label}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-pink-400 flex-shrink-0" />
              </div>
            )}

            {triedTopics.size > 0 && (
              <p className="text-xs text-muted-foreground mb-3">✅ {triedTopics.size} topic{triedTopics.size !== 1 ? 's' : ''} tried — keep exploring!</p>
            )}

            <div className="space-y-5">
              {SOFIA_QUICK_TOPICS.map((cat) => (
                <div key={cat.category}>
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">{cat.category}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {cat.topics.map((topic) => {
                      const tried = triedTopics.has(topic.label);
                      return (
                        <button
                          key={topic.label}
                          onClick={() => quickStartChat(topic.personality, topic.scenario, topic.firstMessage, topic.label)}
                          disabled={chatMutation.isPending || createSessionMutation.isPending}
                          className={`relative flex items-center gap-2.5 p-3 rounded-xl border transition-all text-left group disabled:opacity-50 ${
                            tried
                              ? 'border-green-500/30 bg-green-500/5 hover:bg-green-500/10'
                              : 'border-border bg-card hover:bg-pink-500/10 hover:border-pink-400/50'
                          }`}
                        >
                          <span className="text-xl flex-shrink-0">{topic.emoji}</span>
                          <span className={`text-xs font-medium transition-colors leading-tight ${
                            tried ? 'text-muted-foreground' : 'text-foreground group-hover:text-pink-300'
                          }`}>{topic.label}</span>
                          {tried && (
                            <span className="absolute top-1.5 right-1.5 text-green-400 text-[10px] font-bold">✓</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or customize below</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Tips */}
          <Card className="p-4 mb-6 bg-amber-500/10 border-amber-500/30">
            <h3 className="font-semibold text-amber-600 dark:text-amber-400 mb-2">💡 How to start</h3>
            <p className="text-sm text-muted-foreground mb-3">Sofia is completely free — you can talk about seduction, request erotic stories, explore fantasies or practice flirting. Examples:</p>
            <div className="space-y-2">
              {[
                { emoji: "💬", text: "\"Hey Sofia, tell me one of your fantasies...\"" },
                { emoji: "📖", text: "\"Can you write an erotic story for me?\"" },
                { emoji: "🔥", text: "\"What would you do if we were alone right now?\"" },
                { emoji: "😏", text: "\"Teach me how to win you over...\"" },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span>{s.emoji}</span>
                  <span className="text-muted-foreground italic">{s.text}</span>
                </div>
              ))}
            </div>
          </Card>

          <Button
            onClick={startChat}
            className="w-full py-6 text-lg bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-semibold rounded-xl"
          >
            Start Conversation 💬
          </Button>
        </div>
      </div>
    );
  }

  // ── Feedback View ─────────────────────────────────────────────────────────
  if (phase === "feedback") {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">📊</div>
            <h1 className="text-2xl font-bold text-foreground">Dr. Apex Feedback</h1>
            <p className="text-muted-foreground">Analysis of your conversation with Sofia</p>
          </div>

          {extractMemoryMutation.isPending && (
            <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 mb-4">
              <Brain className="w-4 h-4 animate-pulse" />
              <span>Sofia is saving what she learned about you...</span>
            </div>
          )}

          {extractMemoryMutation.isSuccess && (
            <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 mb-4">
              <Brain className="w-4 h-4" />
              <span>✨ Sofia updated her memory — she'll remember this conversation!</span>
            </div>
          )}

          <Card className="p-6 mb-6 bg-card">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <Streamdown>{feedback || ""}</Streamdown>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button
              onClick={resetChat}
              className="flex-1 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white"
            >
              New Conversation 🔄
            </Button>
            <Button onClick={() => setPhase("chat")} variant="outline" className="flex-1">
              Continue Conversation
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Chat View ─────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Chat Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card/50 backdrop-blur-sm">
        <button onClick={resetChat} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-xl">
          💃
        </div>
        <div className="flex-1">
          <div className="font-semibold text-foreground flex items-center gap-2">
            Sofia
            {hasMemory && (
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5 flex items-center gap-1">
                <Brain className="w-2.5 h-2.5" /> Remembers you
              </span>
            )}
            <Badge variant="secondary" className="text-xs">
              {PERSONALITIES.find(p => p.id === selectedPersonality)?.emoji}{" "}
              {PERSONALITIES.find(p => p.id === selectedPersonality)?.label}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground">{selectedScenario.emoji} {selectedScenario.label}</div>
        </div>
        {userMessageCount >= 4 && (
          <Button
            onClick={requestFeedback}
            disabled={feedbackMutation.isPending}
            size="sm"
            className="bg-amber-500 hover:bg-amber-600 text-white text-xs"
          >
            {feedbackMutation.isPending ? "..." : "📊 Feedback"}
          </Button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-base flex-shrink-0 mt-1">
                💃
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                  : "bg-card border border-border text-foreground rounded-tl-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {chatMutation.isPending && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-base flex-shrink-0">
              💃
            </div>
            <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Feedback prompt after 5 messages */}
      {userMessageCount === 5 && (
        <div className="px-4 py-2 bg-amber-500/10 border-t border-amber-500/20 text-center">
          <p className="text-xs text-amber-600 dark:text-amber-400">
            💡 You now have enough messages to receive feedback from Dr. Apex!
          </p>
        </div>
      )}

      {/* Starter suggestions - show only when 1 message (opening) */}
      {messages.length === 1 && !chatMutation.isPending && (
        <div className="px-4 py-2 border-t border-border/30">
          <p className="text-xs text-muted-foreground mb-2">Suggestions to start:</p>
          <div className="flex flex-wrap gap-2">
            {[
              "Hey Sofia, tell me one of your fantasies 🔥",
              "Can you write an erotic story for me?",
              "What would you do if we were alone?",
              "Teach me how to win you over...",
              "What's your biggest fantasy?",
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => { setInput(suggestion); }}
                className="text-xs px-3 py-1.5 rounded-full border border-pink-500/30 bg-pink-500/5 text-pink-400 hover:bg-pink-500/15 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="flex gap-2 items-end">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Talk to Sofia... (flirting, erotic stories, fantasies, etc.)"
            className="flex-1 min-h-[44px] max-h-[120px] resize-none rounded-xl border-border bg-background text-sm"
            rows={1}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || chatMutation.isPending}
            className="h-11 w-11 p-0 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white flex-shrink-0"
          >
            ➤
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
