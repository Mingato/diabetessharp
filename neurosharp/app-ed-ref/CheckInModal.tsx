import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Activity, Battery, Brain, Heart, Moon, Zap } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const metrics = [
  { key: "energyLevel", label: "Energy Level", icon: Battery, color: "text-yellow-400", desc: "How energized do you feel today?" },
  { key: "moodScore", label: "Mood", icon: Brain, color: "text-purple-400", desc: "How is your overall mood?" },
  { key: "sleepQuality", label: "Sleep Quality", icon: Moon, color: "text-blue-400", desc: "How well did you sleep last night?" },
  { key: "libidoScore", label: "Libido", icon: Heart, color: "text-red-400", desc: "How is your sexual desire today?" },
  { key: "erectionQuality", label: "Erection Quality", icon: Zap, color: "text-green-400", desc: "Rate your erection quality (if applicable)" },
] as const;

type MetricKey = typeof metrics[number]["key"];

export default function CheckInModal({ open, onClose, onSuccess }: Props) {
  const [values, setValues] = useState<Record<MetricKey, number>>({
    energyLevel: 5,
    moodScore: 5,
    sleepQuality: 5,
    libidoScore: 5,
    erectionQuality: 5,
  });
  const [notes, setNotes] = useState("");

  const submitMutation = trpc.checkin.submit.useMutation({
    onSuccess: (data) => {
      toast.success(`Check-in complete! Performance score: ${data.performanceScore}/100`, {
        description: "Keep up the great work!",
      });
      onSuccess();
    },
    onError: (err) => {
      toast.error("Failed to submit check-in: " + err.message);
    },
  });

  const handleSubmit = () => {
    submitMutation.mutate({ ...values, notes: notes || undefined });
  };

  const getLabel = (val: number) => {
    if (val <= 2) return "Very Low";
    if (val <= 4) return "Low";
    if (val <= 6) return "Moderate";
    if (val <= 8) return "Good";
    return "Excellent";
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-foreground">
            <Activity size={20} className="text-primary" />
            Daily Performance Check-In
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {metrics.map((metric) => (
            <div key={metric.key}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <metric.icon size={16} className={metric.color} />
                  <span className="text-sm font-medium text-foreground">{metric.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{getLabel(values[metric.key])}</span>
                  <span className="font-display font-bold text-primary text-lg w-6 text-right">{values[metric.key]}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{metric.desc}</p>
              <Slider
                min={1}
                max={10}
                step={1}
                value={[values[metric.key]]}
                onValueChange={([val]) => setValues((prev) => ({ ...prev, [metric.key]: val }))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>
          ))}

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Notes (optional)</label>
            <Textarea
              placeholder="Any observations about today? Stress, diet, exercise, or anything else..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-accent border-border text-foreground placeholder:text-muted-foreground resize-none h-20"
            />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 border-border text-muted-foreground">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitMutation.isPending}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {submitMutation.isPending ? "Saving..." : "Submit Check-In"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
