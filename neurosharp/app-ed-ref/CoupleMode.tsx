import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Heart, Link2, Copy, Trash2, Eye, Clock, Plus, Share2, Users, ChevronDown, ChevronUp } from "lucide-react";

const COUPLE_SHARE_BASE = `${window.location.origin}/share/`;

const REACTION_LABELS: Record<string, string> = {
  "❤️": "Loved it",
  "🔥": "Wants to try",
  "😅": "Seems difficult",
};

function LinkReactions({ tokenId }: { tokenId: number }) {
  const { data: reactions, isLoading } = trpc.coupleMode.getReactionsForLink.useQuery(
    { tokenId },
    { staleTime: 30_000 }
  );

  if (isLoading) return <p className="text-xs text-muted-foreground">Loading reactions...</p>;
  if (!reactions || reactions.length === 0) {
    return (
      <p className="text-xs text-muted-foreground italic">
        She hasn't reacted to any position yet. Share the link!
      </p>
    );
  }

  // Group by emoji
  const grouped: Record<string, string[]> = {};
  for (const r of reactions) {
    if (!grouped[r.emoji]) grouped[r.emoji] = [];
    grouped[r.emoji].push(r.positionName);
  }

  return (
    <div className="space-y-2">
      {Object.entries(grouped).map(([emoji, names]) => (
        <div key={emoji} className="flex items-start gap-2">
          <span className="text-base shrink-0">{emoji}</span>
          <div className="flex-1">
            <span className="text-xs font-medium text-foreground">{REACTION_LABELS[emoji] || emoji}:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {names.map((name) => (
                <Badge
                  key={name}
                  variant="outline"
                  className="text-[10px] border-amber-500/30 text-amber-400 bg-amber-500/5"
                >
                  {name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function LinkCard({
  link,
  copiedToken,
  onCopy,
  onShare,
  onDeactivate,
}: {
  link: any;
  copiedToken: string | null;
  onCopy: (token: string) => void;
  onShare: (token: string) => void;
  onDeactivate: (id: number) => void;
}) {
  const [showReactions, setShowReactions] = useState(false);

  const formatExpiry = (date: Date | null) => {
    if (!date) return "No expiration";
    return new Date(date).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <Card className="border-border">
      <CardContent className="pt-4 pb-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-medium text-sm truncate">{link.label || "My favorites list"}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {link.viewCount} views
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Expires {formatExpiry(link.expiresAt)}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <code className="text-xs bg-muted px-2 py-1 rounded truncate max-w-[200px] block">
                {COUPLE_SHARE_BASE}{link.token}
              </code>
            </div>
          </div>
          <div className="flex gap-1 shrink-0">
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8"
              onClick={() => onShare(link.token)}
              title="Share"
            >
              <Share2 className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8"
              onClick={() => onCopy(link.token)}
              title="Copy link"
            >
              {copiedToken === link.token ? (
                <span className="text-xs text-green-400">✓</span>
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 text-red-400 hover:text-red-300"
              onClick={() => onDeactivate(link.id)}
              title="Deactivate link"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Partner reactions section */}
        <div className="border-t border-border pt-3">
          <button
            onClick={() => setShowReactions(!showReactions)}
            className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors w-full"
          >
            <span className="text-base">💌</span>
              <span>Her Reactions</span>
            {showReactions ? (
              <ChevronUp className="w-3 h-3 ml-auto" />
            ) : (
              <ChevronDown className="w-3 h-3 ml-auto" />
            )}
          </button>
          {showReactions && (
            <div className="mt-3">
              <LinkReactions tokenId={link.id} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function CoupleMode() {
  const [labelInput, setLabelInput] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const { data: links, refetch } = trpc.coupleMode.getMyLinks.useQuery();

  const createLink = trpc.coupleMode.createShareLink.useMutation({
    onSuccess: () => {
      toast.success("Link created! Valid for 30 days.");
      setLabelInput("");
      setShowCreate(false);
      refetch();
    },
    onError: () => toast.error("Error creating link"),
  });

  const deactivateLink = trpc.coupleMode.deactivateLink.useMutation({
    onSuccess: () => {
      toast.success("Link deactivated");
      refetch();
    },
  });

  const handleCopy = (token: string) => {
    const url = `${COUPLE_SHARE_BASE}${token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    toast.success("Link copied!");
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleShare = async (token: string) => {
    const url = `${COUPLE_SHARE_BASE}${token}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My favorite positions list — RiseUp",
          text: "Check out the positions I saved for us 💛",
          url,
        });
      } catch {}
    } else {
      handleCopy(token);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20">
          <Users className="w-8 h-8 text-amber-400" />
        </div>
        <h1 className="text-3xl font-bold text-amber-400">Couple Mode</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Share your favorite positions list with your partner. She can view it without creating an account — and react to each position!
        </p>
      </div>

      {/* How it works */}
      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardContent className="pt-5">
          <div className="grid grid-cols-4 gap-3 text-center text-xs">
            <div className="space-y-2">
              <div className="text-2xl">❤️</div>
              <p className="text-muted-foreground">Save positions in Intimacy</p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl">🔗</div>
              <p className="text-muted-foreground">Create an exclusive link</p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl">💌</div>
              <p className="text-muted-foreground">Send via WhatsApp</p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl">🔥</div>
              <p className="text-muted-foreground">See her reactions here</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create new link */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-400" />
            Create new link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!showCreate ? (
            <Button
              onClick={() => setShowCreate(true)}
              className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold"
            >
              <Link2 className="w-4 h-4 mr-2" />
              Generate sharing link
            </Button>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Link name (optional)</label>
                <Input
                  placeholder='E.g. "For Anna" or "November list"'
                  value={labelInput}
                  onChange={(e) => setLabelInput(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => createLink.mutate({ label: labelInput || undefined })}
                  disabled={createLink.isPending}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                >
                  {createLink.isPending ? "Creating..." : "Create link"}
                </Button>
                <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              </div>
              <p className="text-xs text-muted-foreground">
                The link expires in 30 days. She can react with ❤️ 🔥 😅 to each position.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Existing links */}
      {links && links.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Your active links</h2>
          {links.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              copiedToken={copiedToken}
              onCopy={handleCopy}
              onShare={handleShare}
              onDeactivate={(id) => deactivateLink.mutate({ tokenId: id })}
            />
          ))}
        </div>
      )}

      {links && links.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Heart className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No links created yet.</p>
          <p className="text-xs mt-1">Create a link above to share with your partner.</p>
        </div>
      )}
    </div>
  );
}
