import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  BookOpen,
  Brain,
  Clock,
  Dumbbell,
  Heart,
  Lock,
  Salad,
  Moon,
  Sparkles,
  X,
} from "lucide-react";
import { Link } from "wouter";
import { Streamdown } from "streamdown";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "causes", label: "Causes" },
  { id: "treatments", label: "Treatments" },
  { id: "science", label: "Science" },
  { id: "mindset", label: "Mindset" },
  { id: "nutrition", label: "Nutrition" },
  { id: "lifestyle", label: "Lifestyle" },
];

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  causes: Heart,
  treatments: Dumbbell,
  science: Brain,
  mindset: Sparkles,
  nutrition: Salad,
  lifestyle: Moon,
};

type Article = {
  id: number;
  title: string;
  slug: string;
  category: string;
  summary?: string | null;
  content?: string | null;
  readTimeMinutes?: number | null;
  isPremium?: boolean | null;
  locked?: boolean | null;
};

export default function Learn() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const { data: articles } = trpc.content.getArticles.useQuery(
    { category: activeCategory === "all" ? undefined : activeCategory }
  );
  const { data: subscription } = trpc.subscription.getStatus.useQuery();

  const markReadMutation = trpc.content.markRead.useMutation({
    onSuccess: () => toast.success("Article read! +5 XP"),
  });

  const filteredArticles = articles?.filter(
    (a) => activeCategory === "all" || a.category === activeCategory
  );

  const handleOpenArticle = (article: Article) => {
    if (article.locked) {
      toast.error("This article requires a Premium subscription.", {
        description: "Upgrade to unlock all content.",
        action: { label: "Upgrade", onClick: () => window.location.href = "/app/subscribe" },
      });
      return;
    }
    setSelectedArticle(article);
    markReadMutation.mutate({ articleId: article.id });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Learn</h1>
        <p className="text-muted-foreground">Evidence-based education on men's health and performance.</p>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border",
              activeCategory === cat.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-border/80"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Articles grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredArticles?.map((article) => {
          const Icon = CATEGORY_ICONS[article.category] ?? BookOpen;
          return (
            <div
              key={article.id}
              onClick={() => handleOpenArticle(article)}
              className={cn(
                "bg-card border border-border rounded-xl p-5 cursor-pointer transition-all",
                article.locked ? "opacity-70" : "card-hover"
              )}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-primary" />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {article.isPremium && (
                    <Badge className={cn(
                      "text-xs",
                      article.locked
                        ? "bg-muted text-muted-foreground border-border"
                        : "bg-primary/15 text-primary border-primary/30"
                    )}>
                      {article.locked ? <Lock size={10} className="mr-1" /> : <Sparkles size={10} className="mr-1" />}
                      Premium
                    </Badge>
                  )}
                  {article.readTimeMinutes && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock size={11} /> {article.readTimeMinutes}m
                    </span>
                  )}
                </div>
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2 leading-snug">{article.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{article.summary}</p>
              <div className="mt-3">
                <Badge className="bg-accent text-muted-foreground border-border text-xs capitalize">
                  {article.category}
                </Badge>
              </div>
            </div>
          );
        })}
        {(!filteredArticles || filteredArticles.length === 0) && (
          <div className="col-span-2 text-center py-16 text-muted-foreground">
            <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
            <p>No articles in this category yet.</p>
          </div>
        )}
      </div>

      {/* Upgrade prompt if not subscribed */}
      {subscription?.status !== "active" && (
        <div className="mt-8 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-semibold text-foreground mb-1">Unlock All Premium Articles</h3>
            <p className="text-sm text-muted-foreground">Get access to our full library of evidence-based content.</p>
          </div>
          <Link href="/app/subscribe">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0">
              Upgrade Now
            </Button>
          </Link>
        </div>
      )}

      {/* Article reader modal */}
      <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between gap-3">
              <DialogTitle className="font-display text-foreground leading-snug pr-4">
                {selectedArticle?.title}
              </DialogTitle>
              <Button variant="ghost" size="sm" onClick={() => setSelectedArticle(null)} className="text-muted-foreground h-8 w-8 p-0 shrink-0">
                <X size={16} />
              </Button>
            </div>
            {selectedArticle && (
              <div className="flex items-center gap-2 pt-1">
                <Badge className="bg-accent text-muted-foreground border-border text-xs capitalize">
                  {selectedArticle.category}
                </Badge>
                {selectedArticle.readTimeMinutes && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock size={11} /> {selectedArticle.readTimeMinutes} min read
                  </span>
                )}
              </div>
            )}
          </DialogHeader>
          {selectedArticle?.content && (
            <div className="pt-2">
              <Streamdown className="prose prose-sm prose-invert max-w-none [&>p]:mb-4 [&>h2]:font-display [&>h2]:text-foreground [&>h2]:font-bold [&>h2]:mt-6 [&>h2]:mb-3 [&>ul]:space-y-2 [&>ul>li]:text-muted-foreground [&>strong]:text-foreground">
                {selectedArticle.content}
              </Streamdown>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
