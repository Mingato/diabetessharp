import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Bot, Brain, Lock, MessageCircle, Send, Sparkles, Stethoscope, Trash2, User } from "lucide-react";
import { Streamdown } from "streamdown";
import { useLocation } from "wouter";

// Follow-up question sets keyed by topic keywords
const FOLLOW_UP_CHIPS: { keywords: string[]; chips: string[] }[] = [
  {
    keywords: ["kegel", "pelvic", "floor"],
    chips: ["How many reps per day?", "How long until I feel results?", "Can I do them anywhere?"],
  },
  {
    keywords: ["testosterone", "hormone", "t-level"],
    chips: ["What foods raise testosterone?", "Does sleep affect testosterone?", "Best supplements for T?"],
  },
  {
    keywords: ["stamina", "endurance", "last longer", "ejaculation"],
    chips: ["What's the squeeze technique?", "Does edging help?", "How fast can I improve?"],
  },
  {
    keywords: ["anxiety", "performance", "nervous", "mental"],
    chips: ["Breathing techniques for anxiety?", "Does meditation help?", "How to stop overthinking?"],
  },
  {
    keywords: ["stress", "cortisol"],
    chips: ["Best stress-reduction habits?", "How fast does stress affect ED?", "Cold showers help?"],
  },
  {
    keywords: ["sleep", "rest", "recovery"],
    chips: ["How many hours do I need?", "Best sleep position for health?", "Does napping help?"],
  },
  {
    keywords: ["food", "diet", "nutrition", "eat"],
    chips: ["Best breakfast for performance?", "Meal timing matters?", "Foods to avoid tonight?"],
  },
  {
    keywords: ["supplement", "vitamin", "zinc", "magnesium"],
    chips: ["Best time to take supplements?", "Any side effects?", "Which brand is best?"],
  },
  {
    keywords: ["alcohol", "drink", "beer", "wine"],
    chips: ["How much is too much?", "Best drink if I must?", "How long to recover?"],
  },
  {
    keywords: ["partner", "relationship", "communicate", "talk"],
    chips: ["How to start the conversation?", "What if she's frustrated?", "How to rebuild intimacy?"],
  },
  {
    keywords: ["libido", "desire", "drive"],
    chips: ["Is low libido normal at my age?", "Fastest way to boost libido?", "Can stress kill libido?"],
  },
  {
    keywords: ["doctor", "medical", "medication", "drug", "pill"],
    chips: ["What tests should I ask for?", "Is Viagra safe long-term?", "Natural alternatives?"],
  },
];

const DEFAULT_FOLLOW_UPS = [
  "What should I focus on today?",
  "How does this affect my program?",
  "What's the fastest improvement I can make?",
];

function getFollowUps(lastMessage: string): string[] {
  const lower = lastMessage.toLowerCase();
  for (const set of FOLLOW_UP_CHIPS) {
    if (set.keywords.some(k => lower.includes(k))) return set.chips;
  }
  return DEFAULT_FOLLOW_UPS;
}

const TOPIC_CATEGORIES = [
  {
    category: "🏋️ Performance",
    color: "amber",
    topics: [
      { emoji: "⚡", label: "Kegel exercises", message: "How do Kegel exercises improve erectile function and how should I do them correctly?" },
      { emoji: "💪", label: "Testosterone boost", message: "What are the most effective natural ways to boost testosterone levels?" },
      { emoji: "🔥", label: "Stamina training", message: "What exercises and habits will most improve my sexual stamina and endurance?" },
      { emoji: "🎯", label: "Program results", message: "How long until I see real results from the Vigronex program, and what milestones should I expect?" },
    ],
  },
  {
    category: "🧠 Mental & Stress",
    color: "blue",
    topics: [
      { emoji: "😰", label: "Performance anxiety", message: "I get nervous and lose my erection due to anxiety. How can I overcome performance anxiety?" },
      { emoji: "🧘", label: "Stress & ED", message: "How does chronic stress affect erections and what can I do to manage it?" },
      { emoji: "💭", label: "Mental blocks", message: "I have mental blocks that affect my sexual confidence. What techniques help with this?" },
      { emoji: "😴", label: "Sleep & libido", message: "How does sleep quality affect testosterone and sexual performance?" },
    ],
  },
  {
    category: "🥗 Nutrition",
    color: "green",
    topics: [
      { emoji: "🥩", label: "Best foods for ED", message: "What are the best foods to eat to improve erectile function and sexual health?" },
      { emoji: "🚫", label: "Foods to avoid", message: "What foods and drinks should I avoid that negatively impact sexual performance?" },
      { emoji: "💊", label: "Supplements", message: "Which supplements are scientifically proven to help with erectile dysfunction and sexual health?" },
      { emoji: "🍷", label: "Alcohol & ED", message: "How does alcohol affect erectile function, and is it okay to drink occasionally?" },
    ],
  },
  {
    category: "❤️ Intimacy",
    color: "pink",
    topics: [
      { emoji: "⏱️", label: "Last longer", message: "What techniques can help me last longer in bed and control ejaculation better?" },
      { emoji: "🔄", label: "Recovery time", message: "How can I reduce my refractory period and recover faster between sessions?" },
      { emoji: "💑", label: "Partner communication", message: "How do I talk to my partner about ED without feeling embarrassed or hurting the relationship?" },
      { emoji: "🌡️", label: "Low libido", message: "My libido has been low lately. What are the most common causes and how can I fix it?" },
    ],
  },
  {
    category: "💊 Medical",
    color: "purple",
    topics: [
      { emoji: "💉", label: "Medications & ED", message: "Can I do this program if I'm taking medications? Are there any interactions I should know about?" },
      { emoji: "🩺", label: "When to see a doctor", message: "When should ED be a concern that requires seeing a real doctor, and what tests should I ask for?" },
      { emoji: "🔬", label: "Causes of ED", message: "What are the most common physical and psychological causes of erectile dysfunction?" },
      { emoji: "📈", label: "Tracking progress", message: "How should I track my progress with ED recovery? What metrics and signs should I monitor?" },
    ],
  },
];

export default function DrApex() {
  const [, navigate] = useLocation();
  const { data: upsellStatus, isLoading: upsellLoading } = trpc.checkout.getMyUpsellStatus.useQuery();

  if (upsellLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!upsellStatus?.upsell1) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center mb-6">
          <Lock className="w-9 h-9 text-amber-400" />
        </div>
        <h2 className="text-xl font-black text-foreground mb-3">Dr. Apex — Your Personal 24h Physician</h2>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
          You don't have access to Dr. Apex yet. Activate now and have a personal performance physician available 24 hours a day — ask questions about sexual health, fine-tune your protocol, and receive personalized medical guidance anytime.
        </p>
        <div className="bg-card border border-border rounded-2xl p-5 w-full mb-6 text-left">
          <div className="flex items-center gap-2 mb-3">
            <Stethoscope className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-foreground">What you get:</span>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">✓</span> Unlimited consultations with AI specialized in men's sexual health</li>
            <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">✓</span> Personalized protocols based on your health profile</li>
            <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">✓</span> Answers about medications, supplements, and lab tests</li>
            <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">✓</span> Discreet, judgment-free, available 24/7</li>
          </ul>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-muted-foreground text-sm line-through">$97.00</span>
          <span className="text-amber-400 font-black text-2xl">$14.99</span>
          <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded-full">85% OFF</span>
        </div>
        <Button
          onClick={() => navigate("/checkout/upsell1")}
          className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black text-base py-6"
        >
          <Stethoscope className="w-5 h-5 mr-2" />
          Activate Dr. Apex Now
        </Button>
        <p className="text-xs text-muted-foreground mt-3">Lifetime access — pay once, use forever</p>
      </div>
    );
  }

  const [message, setMessage] = useState("");
  const [localMessages, setLocalMessages] = useState<{ role: "user" | "assistant"; content: string; id: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: history, isLoading: historyLoading } = trpc.chat.getHistory.useQuery();
  const { data: memory, refetch: refetchMemory } = trpc.chat.getMemory.useQuery();
  const [showMemory, setShowMemory] = useState(false);
  const utils = trpc.useUtils();

  const clearMemoryMutation = trpc.chat.clearMemory.useMutation({
    onSuccess: () => {
      toast.success("Dr. Apex's memory cleared.");
      utils.chat.getMemory.invalidate();
    },
  });

  const sendMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: (data) => {
      setLocalMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply, id: Date.now().toString() },
      ]);
    },
    onError: (err) => {
      toast.error("Dr. Apex is unavailable: " + err.message);
      setLocalMessages((prev) => prev.slice(0, -1));
    },
    onSettled: () => {
      // Refresh memory after each exchange
      refetchMemory();
    },
  });

  // Merge server history with local messages
  const allMessages = [
    ...(history?.map((m) => ({ role: m.role as "user" | "assistant", content: m.content, id: m.id.toString() })) ?? []),
    ...localMessages,
  ];

  // Deduplicate by content (local messages are already in history after refetch)
  const displayMessages = allMessages.reduce((acc, msg) => {
    const exists = acc.some((m) => m.content === msg.content && m.role === msg.role);
    if (!exists) acc.push(msg);
    return acc;
  }, [] as typeof allMessages);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayMessages.length]);

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed || sendMutation.isPending) return;

    const userMsg = { role: "user" as const, content: trimmed, id: Date.now().toString() };
    setLocalMessages((prev) => [...prev, userMsg]);
    setMessage("");
    sendMutation.mutate({ message: trimmed });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTopicClick = (msg: string) => {
    if (sendMutation.isPending) return;
    const userMsg = { role: "user" as const, content: msg, id: Date.now().toString() };
    setLocalMessages((prev) => [...prev, userMsg]);
    sendMutation.mutate({ message: msg });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)] max-w-3xl mx-auto">
      {/* Header */}
      <div className="p-4 pb-3 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/30 flex items-center justify-center glow-gold-sm">
            <Bot size={22} className="text-primary" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">Dr. Apex</h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-muted-foreground">Virtual Men's Health Physician</span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {memory && (
              <button
                onClick={() => setShowMemory(v => !v)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs hover:bg-blue-500/20 transition-colors"
                title="Dr. Apex remembers details from your past conversations"
              >
                <Brain size={11} />
                <span className="hidden sm:inline">Memory active</span>
              </button>
            )}
            <Badge className="bg-primary/15 text-primary border-primary/30 text-xs">
              <Sparkles size={10} className="mr-1" /> AI-Powered
            </Badge>
          </div>
        </div>
        {/* Memory panel */}
        {showMemory && memory && (
          <div className="mt-3 p-3 rounded-xl bg-blue-500/5 border border-blue-500/15 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-blue-400 flex items-center gap-1"><Brain size={11} /> Dr. Apex remembers</span>
              <button
                onClick={() => clearMemoryMutation.mutate()}
                className="flex items-center gap-1 text-muted-foreground hover:text-destructive transition-colors"
                title="Clear memory"
              >
                <Trash2 size={11} /> Clear
              </button>
            </div>
            {(memory.facts as string[])?.length > 0 && (
              <div><span className="text-muted-foreground">Facts: </span><span className="text-foreground">{(memory.facts as string[]).join(" · ")}</span></div>
            )}
            {(memory.healthConcerns as string[])?.length > 0 && (
              <div><span className="text-muted-foreground">Concerns: </span><span className="text-foreground">{(memory.healthConcerns as string[]).join(" · ")}</span></div>
            )}
            {(memory.topics as string[])?.length > 0 && (
              <div><span className="text-muted-foreground">Topics: </span><span className="text-foreground">{(memory.topics as string[]).join(", ")}</span></div>
            )}
            {memory.lifestyleContext && (
              <div><span className="text-muted-foreground">Lifestyle: </span><span className="text-foreground">{memory.lifestyleContext}</span></div>
            )}
            {memory.medicationsContext && (
              <div><span className="text-muted-foreground">Medications: </span><span className="text-foreground">{memory.medicationsContext}</span></div>
            )}
            <div className="text-muted-foreground pt-1 border-t border-blue-500/10">{memory.totalMessages} messages across sessions</div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Welcome message */}
        {displayMessages.length === 0 && !historyLoading && (
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
                <Bot size={16} className="text-primary" />
              </div>
              <div className="bg-card border border-border rounded-xl rounded-tl-sm p-4 max-w-lg">
                <p className="text-sm text-foreground leading-relaxed">
                  Hello! I'm Dr. Apex, your virtual men's health physician. I'm here to answer your questions about sexual health, performance optimization, and guide you through the Vigronex program.
                </p>
                <p className="text-sm text-foreground leading-relaxed mt-2">
                  Everything you share with me is completely private. What's on your mind?
                </p>
              </div>
            </div>

            {/* Topic Categories */}
            <div className="space-y-4 mt-2">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Choose a topic to start instantly:</p>
              {TOPIC_CATEGORIES.map((cat) => (
                <div key={cat.category}>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">{cat.category}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {cat.topics.map((topic) => (
                      <button
                        key={topic.label}
                        onClick={() => handleTopicClick(topic.message)}
                        disabled={sendMutation.isPending}
                        className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-card hover:bg-accent hover:border-primary/40 transition-all text-left group disabled:opacity-50"
                      >
                        <span className="text-xl flex-shrink-0">{topic.emoji}</span>
                        <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors leading-tight">{topic.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {historyLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {displayMessages.map((msg, i) => (
          <div
            key={msg.id || i}
            className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary/15 border border-primary/30"
              )}
            >
              {msg.role === "user" ? <User size={14} /> : <Bot size={14} className="text-primary" />}
            </div>
            <div
              className={cn(
                "rounded-xl p-4 max-w-lg text-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                  : "bg-card border border-border text-foreground rounded-tl-sm"
              )}
            >
              {msg.role === "assistant" ? (
                <Streamdown className="prose prose-sm prose-invert max-w-none [&>p]:mb-2 [&>p:last-child]:mb-0">
                  {msg.content}
                </Streamdown>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}

        {/* Follow-up chips after last assistant message */}
        {!sendMutation.isPending && displayMessages.length > 0 && displayMessages[displayMessages.length - 1].role === "assistant" && (() => {
          const lastAssistant = displayMessages[displayMessages.length - 1];
          const chips = getFollowUps(lastAssistant.content);
          return (
            <div className="pl-11">
              <p className="text-xs text-muted-foreground mb-2">Continue with:</p>
              <div className="flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleTopicClick(chip)}
                    disabled={sendMutation.isPending}
                    className="text-xs px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 hover:border-primary/50 transition-all disabled:opacity-50"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          );
        })()}

        {sendMutation.isPending && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
              <Bot size={14} className="text-primary" />
            </div>
            <div className="bg-card border border-border rounded-xl rounded-tl-sm p-4">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Disclaimer */}
      <div className="px-6 py-2 shrink-0">
        <p className="text-xs text-muted-foreground text-center">
          Dr. Apex provides educational information only — not medical advice. Consult a licensed physician for diagnosis or treatment.
        </p>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border shrink-0">
        <div className="flex gap-3 items-end">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Dr. Apex anything about your health..."
            className="flex-1 bg-accent border-border text-foreground placeholder:text-muted-foreground resize-none min-h-[44px] max-h-32"
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={!message.trim() || sendMutation.isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 w-11 p-0 shrink-0"
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
