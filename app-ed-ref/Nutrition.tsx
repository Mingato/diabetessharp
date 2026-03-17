import { useState, useRef, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Search, Camera, ChefHat, Flame, Zap, Clock, Star,
  Plus, X, CheckCircle2, Info, Loader2, Upload, Leaf,
  BarChart3, Trash2, FlipHorizontal, Salad, TrendingUp,
  Barcode, Target, Bell, BellOff, Settings2
} from "lucide-react";

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "breakfast", label: "Breakfast" },
  { key: "lunch", label: "Lunch" },
  { key: "dinner", label: "Dinner" },
  { key: "snack", label: "Snack" },
  { key: "smoothie", label: "Smoothie" },
  { key: "supplement", label: "Supplement" },
];

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"] as const;
const MEAL_LABELS: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};

function scoreColor(score: number) {
  if (score >= 90) return "text-emerald-400";
  if (score >= 75) return "text-yellow-400";
  return "text-orange-400";
}

function categoryLabel(cat: string) {
  return CATEGORIES.find((c) => c.key === cat)?.label ?? cat;
}

// ─── Camera Modal ─────────────────────────────────────────────────────────────
function CameraModal({ onCapture, onClose }: { onCapture: (dataUrl: string) => void; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [ready, setReady] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");

  const startCamera = useCallback(async (mode: "environment" | "user") => {
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => setReady(true);
      }
    } catch {
      toast.error("Camera access denied. Please allow camera permissions.");
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    startCamera(facingMode);
    return () => { streamRef.current?.getTracks().forEach(t => t.stop()); };
  }, [facingMode, startCamera]);

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const v = videoRef.current;
    const c = canvasRef.current;
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext("2d")!.drawImage(v, 0, 0);
    const dataUrl = c.toDataURL("image/jpeg", 0.92);
    streamRef.current?.getTracks().forEach(t => t.stop());
    onCapture(dataUrl);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="flex items-center justify-between p-3 bg-black/80">
        <button onClick={onClose} className="text-white p-2"><X size={20} /></button>
        <span className="text-white text-sm font-medium">Take Photo</span>
        <button
          onClick={() => setFacingMode(m => m === "environment" ? "user" : "environment")}
          className="text-white p-2 text-xs border border-white/30 rounded-lg px-3 flex items-center gap-1"
        >
          <FlipHorizontal size={14} /> Flip
        </button>
      </div>
      <div className="flex-1 relative flex items-center justify-center bg-black">
        <video ref={videoRef} autoPlay playsInline muted className="max-w-full max-h-full object-contain" />
        {!ready && <div className="absolute text-white text-sm">Starting camera...</div>}
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <div className="p-6 flex justify-center bg-black/80">
        <button
          onClick={capture}
          disabled={!ready}
          className="w-16 h-16 rounded-full bg-white border-4 border-gray-300 disabled:opacity-50 flex items-center justify-center"
        >
          <Camera size={24} className="text-black" />
        </button>
      </div>
    </div>
  );
}

// ─── Barcode Scanner ──────────────────────────────────────────────────────────
function BarcodeScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [scanning, setScanning] = useState(false);
  const [manualBarcode, setManualBarcode] = useState("");
  const [product, setProduct] = useState<any>(null);
  const [isLooking, setIsLooking] = useState(false);
  const [scannerReady, setScannerReady] = useState(false);

  const lookupBarcode = trpc.nutrition.lookupBarcode.useMutation();
  const logMeal = trpc.nutrition.logMeal.useMutation();
  const utils = trpc.useUtils();

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setScanning(false);
    setScannerReady(false);
  }, []);

  const startScanner = useCallback(async () => {
    setProduct(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => setScannerReady(true);
      }
      setScanning(true);

      // Dynamically import ZXing for barcode scanning
      const { BrowserMultiFormatReader } = await import("@zxing/library");
      const reader = new BrowserMultiFormatReader();
      if (videoRef.current) {
        reader.decodeFromStream(stream, videoRef.current, async (result, err) => {
          if (result) {
            const code = result.getText();
            reader.reset();
            stopCamera();
            setIsLooking(true);
            try {
              const p = await lookupBarcode.mutateAsync({ barcode: code });
              if (p) {
                setProduct(p);
              } else {
                toast.error(`No product found for barcode: ${code}`);
              }
            } catch {
              toast.error("Error looking up barcode. Try entering it manually.");
            } finally {
              setIsLooking(false);
            }
          }
        });
      }
    } catch {
      toast.error("Camera access denied. Use manual barcode entry below.");
      setScanning(false);
    }
  }, [lookupBarcode, stopCamera]);

  useEffect(() => { return () => stopCamera(); }, [stopCamera]);

  const handleManualLookup = async () => {
    if (!manualBarcode.trim()) return;
    setIsLooking(true);
    setProduct(null);
    try {
      const p = await lookupBarcode.mutateAsync({ barcode: manualBarcode.trim() });
      if (p) setProduct(p);
      else toast.error("No product found for that barcode.");
    } catch {
      toast.error("Error looking up barcode.");
    } finally {
      setIsLooking(false);
    }
  };

  const handleLogProduct = async (mealType: "breakfast" | "lunch" | "dinner" | "snack") => {
    if (!product) return;
    await logMeal.mutateAsync({
      mealType,
      description: `${product.name}${product.brand ? ` (${product.brand})` : ""}`,
      calories: product.calories,
      protein: product.protein,
      carbs: product.carbs,
      fat: product.fat,
    });
    utils.nutrition.getTodayMeals.invalidate();
    toast.success(`${product.name} logged!`);
    setProduct(null);
    setManualBarcode("");
  };

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-br from-blue-500/10 to-primary/10 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Barcode size={20} className="text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Barcode Scanner</h3>
            <p className="text-xs text-muted-foreground">Scan any packaged food to get instant nutrition data</p>
          </div>
        </div>
      </div>

      {/* Camera scanner */}
      {scanning ? (
        <div className="space-y-3">
          <div className="relative rounded-xl overflow-hidden bg-black">
            <video ref={videoRef} autoPlay playsInline muted className="w-full max-h-64 object-cover" />
            {!scannerReady && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="animate-spin text-white" size={24} />
              </div>
            )}
            {/* Scan overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-32 border-2 border-blue-400 rounded-lg relative">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-400 rounded-tl" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-400 rounded-tr" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-400 rounded-bl" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-400 rounded-br" />
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-blue-400/60" />
              </div>
            </div>
          </div>
          <p className="text-xs text-center text-muted-foreground">Point camera at barcode — scanning automatically</p>
          <Button variant="outline" className="w-full border-border" onClick={stopCamera}>
            <X size={14} className="mr-2" /> Cancel Scan
          </Button>
        </div>
      ) : (
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          onClick={startScanner}
          disabled={isLooking}
        >
          <Camera size={16} className="mr-2" /> Start Camera Scan
        </Button>
      )}

      {/* Manual entry */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Or enter barcode manually:</p>
        <div className="flex gap-2">
          <Input
            placeholder="e.g. 0012000161155"
            value={manualBarcode}
            onChange={(e) => setManualBarcode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleManualLookup()}
            className="bg-card border-border text-foreground"
          />
          <Button
            onClick={handleManualLookup}
            disabled={isLooking || !manualBarcode.trim()}
            className="bg-primary text-primary-foreground shrink-0"
          >
            {isLooking ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
          </Button>
        </div>
      </div>

      {/* Loading */}
      {isLooking && (
        <div className="flex items-center justify-center gap-2 py-6">
          <Loader2 className="animate-spin text-primary" size={20} />
          <span className="text-sm text-muted-foreground">Looking up product...</span>
        </div>
      )}

      {/* Product result */}
      {product && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {product.imageUrl && (
            <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-contain bg-white p-2" />
          )}
          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-foreground">{product.name}</h3>
              {product.brand && <p className="text-xs text-muted-foreground">{product.brand}</p>}
              <p className="text-xs text-muted-foreground mt-1">Per serving: {product.servingSize}</p>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Kcal", value: product.calories, color: "text-orange-400" },
                { label: "Protein", value: `${product.protein}g`, color: "text-blue-400" },
                { label: "Carbs", value: `${product.carbs}g`, color: "text-yellow-400" },
                { label: "Fat", value: `${product.fat}g`, color: "text-green-400" },
              ].map(m => (
                <div key={m.label} className="bg-accent/20 rounded-lg p-2 text-center">
                  <p className={`font-bold text-sm ${m.color}`}>{m.value}</p>
                  <p className="text-xs text-muted-foreground">{m.label}</p>
                </div>
              ))}
            </div>

            {(product.fiber > 0 || product.sugar > 0) && (
              <div className="flex gap-3 text-xs text-muted-foreground">
                {product.fiber > 0 && <span>Fiber: {product.fiber}g</span>}
                {product.sugar > 0 && <span>Sugar: {product.sugar}g</span>}
                {product.sodium > 0 && <span>Sodium: {Math.round(product.sodium * 1000)}mg</span>}
              </div>
            )}

            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Log as:</p>
              <div className="grid grid-cols-2 gap-2">
                {MEAL_TYPES.map(mt => (
                  <Button
                    key={mt}
                    variant="outline"
                    size="sm"
                    className="border-border text-xs"
                    onClick={() => handleLogProduct(mt)}
                    disabled={logMeal.isPending}
                  >
                    {MEAL_LABELS[mt]}
                  </Button>
                ))}
              </div>
            </div>

            <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={() => setProduct(null)}>
              <X size={12} className="mr-1" /> Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Calorie History Chart ────────────────────────────────────────────────────
function CalorieHistoryChart() {
  const [period, setPeriod] = useState<"week" | "month">("week");
  const { data: history = [], isLoading } = trpc.nutrition.getCalorieHistory.useQuery({ period });

  const maxCal = Math.max(...history.map(d => d.calories), 2000);
  const totalCal = history.reduce((s, d) => s + d.calories, 0);
  const avgCal = history.length ? Math.round(totalCal / (history.filter(d => d.meals > 0).length || 1)) : 0;
  const totalProtein = history.reduce((s, d) => s + d.protein, 0);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return period === "week"
      ? d.toLocaleDateString("en", { weekday: "short" })
      : d.getDate().toString();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <BarChart3 size={16} className="text-primary" /> Calorie History
        </h3>
        <div className="flex gap-1 bg-accent/30 rounded-lg p-0.5">
          {(["week", "month"] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                period === p ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p === "week" ? "7 Days" : "30 Days"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Kcal", value: totalCal.toLocaleString(), color: "text-orange-400", icon: Flame },
          { label: "Avg/Day", value: `${avgCal}`, color: "text-primary", icon: TrendingUp },
          { label: "Total Protein", value: `${Math.round(totalProtein)}g`, color: "text-blue-400", icon: Zap },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-3 text-center">
            <s.icon size={16} className={`${s.color} mx-auto mb-1`} />
            <p className={`text-base font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary" size={24} /></div>
      ) : (
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-end gap-1 h-32 overflow-x-auto pb-1">
            {history.map((d) => {
              const pct = maxCal > 0 ? (d.calories / maxCal) * 100 : 0;
              const isToday = d.date === new Date().toISOString().split("T")[0];
              return (
                <div key={d.date} className="flex flex-col items-center gap-1 flex-1 min-w-[20px]">
                  <div
                    className="w-full rounded-t-sm transition-all relative group"
                    style={{
                      height: `${Math.max(pct, d.calories > 0 ? 4 : 0)}%`,
                      backgroundColor: isToday ? "hsl(var(--primary))" : d.calories > 0 ? "hsl(var(--primary) / 0.5)" : "hsl(var(--border))",
                      minHeight: d.calories > 0 ? "4px" : "2px",
                    }}
                  >
                    {d.calories > 0 && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-popover border border-border rounded px-1 py-0.5 text-xs text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                        {d.calories} kcal
                      </div>
                    )}
                  </div>
                  <span className={`text-[9px] ${isToday ? "text-primary font-bold" : "text-muted-foreground"}`}>
                    {formatDate(d.date)}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">Hover bars to see daily calories</p>
        </div>
      )}
    </div>
  );
}

// ─── Meal Reminders Settings ──────────────────────────────────────────────────
function MealRemindersSettings() {
  const { data: prefs } = trpc.push.getPreferences.useQuery();
  const updatePrefs = trpc.push.updatePreferences.useMutation();
  const [notifyMeals, setNotifyMeals] = useState(false);
  const [breakfastTime, setBreakfastTime] = useState("08:00");
  const [lunchTime, setLunchTime] = useState("12:30");
  const [dinnerTime, setDinnerTime] = useState("19:00");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (prefs) {
      setNotifyMeals((prefs as any).notifyMeals ?? false);
      setBreakfastTime((prefs as any).breakfastTime ?? "08:00");
      setLunchTime((prefs as any).lunchTime ?? "12:30");
      setDinnerTime((prefs as any).dinnerTime ?? "19:00");
    }
  }, [prefs]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePrefs.mutateAsync({
        notifyMeals,
        breakfastTime,
        lunchTime,
        dinnerTime,
      });
      toast.success("Meal reminders saved!");
    } catch {
      toast.error("Failed to save reminders.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
              <Bell size={16} className="text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">Meal Reminders</p>
              <p className="text-xs text-muted-foreground">Get notified to log your meals</p>
            </div>
          </div>
          <button
            onClick={() => setNotifyMeals(!notifyMeals)}
            className={`relative w-11 h-6 rounded-full transition-colors ${notifyMeals ? "bg-primary" : "bg-muted"}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifyMeals ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
        </div>

        {notifyMeals && (
          <div className="space-y-3 pt-2 border-t border-border">
            {[
              { label: "🌅 Breakfast", value: breakfastTime, onChange: setBreakfastTime },
              { label: "☀️ Lunch", value: lunchTime, onChange: setLunchTime },
              { label: "🌙 Dinner", value: dinnerTime, onChange: setDinnerTime },
            ].map(({ label, value, onChange }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{label}</span>
                <input
                  type="time"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="bg-accent/30 border border-border rounded-lg px-2 py-1 text-sm text-foreground"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <Button
        className="w-full bg-primary text-primary-foreground"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? <Loader2 size={14} className="mr-2 animate-spin" /> : <CheckCircle2 size={14} className="mr-2" />}
        Save Reminders
      </Button>

      {!notifyMeals && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-accent/20 rounded-lg p-3">
          <BellOff size={14} />
          <span>Enable reminders to get push notifications at meal times. Make sure notifications are enabled in your browser settings.</span>
        </div>
      )}
    </div>
  );
}

// ─── Ingredient Scanner ───────────────────────────────────────────────────────
function IngredientScanner() {
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showIngredientList, setShowIngredientList] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const generateFromIngredients = trpc.nutrition.generateFromIngredients.useMutation();
  const logMeal = trpc.nutrition.logMeal.useMutation();
  const utils = trpc.useUtils();

  const handleFile = (f: File) => {
    if (f.size > 16 * 1024 * 1024) { toast.error("Image too large. Max 16MB."); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(f);
    setResult(null);
  };

  const handleGenerate = async () => {
    if (!preview) return;
    setIsGenerating(true);
    try {
      const r = await generateFromIngredients.mutateAsync({ imageUrl: preview });
      setResult(r);
    } catch {
      toast.error("Error analyzing ingredients. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveRecipe = async () => {
    if (!result) return;
    await logMeal.mutateAsync({
      mealType: "lunch",
      description: result.recipeName,
      calories: result.calories,
      protein: result.protein,
      carbs: result.carbs,
      fat: result.fat,
    });
    utils.nutrition.getTodayMeals.invalidate();
    toast.success("Recipe logged to today's meals!");
  };

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-br from-emerald-500/10 to-primary/10 border border-emerald-500/20 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Salad size={20} className="text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Ingredient Scanner</h3>
            <p className="text-xs text-muted-foreground">Photo your ingredients → AI generates a recipe</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {preview ? (
          <div className="relative rounded-xl overflow-hidden">
            <img src={preview} alt="Ingredients" className="w-full max-h-64 object-cover rounded-xl" />
            <button
              className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full p-1.5 border border-border"
              onClick={() => { setPreview(null); setResult(null); }}
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setShowCamera(true)}
              className="flex flex-col items-center gap-3 border-2 border-dashed border-emerald-500/30 rounded-xl p-6 hover:border-emerald-500/60 hover:bg-emerald-500/5 transition-colors"
            >
              <Camera size={28} className="text-emerald-400" />
              <span className="text-sm text-muted-foreground font-medium">Take Photo</span>
            </button>
            <label
              htmlFor="ingredient-file"
              className="flex flex-col items-center gap-3 border-2 border-dashed border-border rounded-xl p-6 hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer"
            >
              <Upload size={28} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground font-medium">Choose File</span>
            </label>
            <input id="ingredient-file" type="file" accept="image/*" className="hidden" ref={fileRef}
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </div>
        )}

        {preview && !result && (
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating
              ? <><Loader2 size={16} className="mr-2 animate-spin" /> Analyzing ingredients...</>
              : <><Salad size={16} className="mr-2" /> Generate Recipe</>
            }
          </Button>
        )}
      </div>

      {result && (
        <div className="space-y-4">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
            <button
              className="flex items-center justify-between w-full"
              onClick={() => setShowIngredientList(!showIngredientList)}
            >
              <span className="text-sm font-medium text-emerald-400 flex items-center gap-2">
                <Leaf size={14} /> {result.detectedIngredients?.length ?? 0} ingredients detected
              </span>
              <span className="text-xs text-muted-foreground">{showIngredientList ? "▲" : "▼"}</span>
            </button>
            {showIngredientList && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(result.detectedIngredients ?? []).map((ing: string, i: number) => (
                  <span key={i} className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full text-xs">{ing}</span>
                ))}
              </div>
            )}
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-primary/20 to-emerald-500/20 p-4 border-b border-border">
              <h3 className="font-display font-bold text-foreground text-lg">{result.recipeName}</h3>
              <p className="text-sm text-muted-foreground mt-1">{result.description}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock size={12} /> {result.prepTimeMinutes}min</span>
                <span className="flex items-center gap-1"><ChefHat size={12} /> {result.servings} servings</span>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "Kcal", value: result.calories, color: "text-orange-400" },
                  { label: "Protein", value: `${result.protein}g`, color: "text-blue-400" },
                  { label: "Carbs", value: `${result.carbs}g`, color: "text-yellow-400" },
                  { label: "Fat", value: `${result.fat}g`, color: "text-green-400" },
                ].map(m => (
                  <div key={m.label} className="bg-accent/20 rounded-lg p-2 text-center">
                    <p className={`font-bold text-sm ${m.color}`}>{m.value}</p>
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                  </div>
                ))}
              </div>

              {result.performanceBenefits && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                  <p className="text-xs font-medium text-primary mb-1">⚡ Performance Benefits</p>
                  <p className="text-xs text-muted-foreground">{result.performanceBenefits}</p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
                  <Leaf size={14} className="text-primary" /> Ingredients
                </h4>
                <ul className="space-y-1">
                  {(result.ingredients ?? []).map((ing: string, i: number) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span> {ing}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Instructions</h4>
                <ol className="space-y-2">
                  {(result.instructions ?? []).map((step: string, i: number) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs flex items-center justify-center shrink-0 font-bold">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {result.missingIngredients?.length > 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                  <p className="text-xs font-medium text-yellow-400 mb-1">💡 Would improve with:</p>
                  <div className="flex flex-wrap gap-1">
                    {result.missingIngredients.map((ing: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-yellow-500/20 text-yellow-300 rounded-full text-xs">{ing}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleSaveRecipe}
                  disabled={logMeal.isPending}
                >
                  <CheckCircle2 size={14} className="mr-1.5" /> Log This Meal
                </Button>
                <Button
                  variant="outline"
                  className="border-border"
                  onClick={() => { setPreview(null); setResult(null); }}
                >
                  <X size={14} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCamera && (
        <CameraModal
          onCapture={(dataUrl) => { setShowCamera(false); setPreview(dataUrl); }}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
}

// ─── Calorie Goal Progress Bar ────────────────────────────────────────────────
function CalorieGoalBar({ todayCalories }: { todayCalories: number }) {
  const { data: goalData } = trpc.nutrition.getCalorieGoal.useQuery();
  const updateGoal = trpc.nutrition.setCalorieGoal.useMutation();
  const [editing, setEditing] = useState(false);
  const [goalInput, setGoalInput] = useState("");

  const goal = goalData?.dailyCalorieGoal ?? 2200;
  const pct = Math.min((todayCalories / goal) * 100, 100);
  const remaining = Math.max(goal - todayCalories, 0);
  const over = todayCalories > goal ? todayCalories - goal : 0;

  const barColor = pct >= 100 ? "bg-red-500" : pct >= 85 ? "bg-yellow-500" : "bg-primary";

  const handleSaveGoal = async () => {
    const val = parseInt(goalInput);
    if (isNaN(val) || val < 500 || val > 10000) { toast.error("Enter a valid goal between 500–10,000 kcal"); return; }
    await updateGoal.mutateAsync({ dailyCalorieGoal: val });
    setEditing(false);
    toast.success("Calorie goal updated!");
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target size={16} className="text-primary" />
          <span className="text-sm font-semibold text-foreground">Daily Calorie Goal</span>
        </div>
        <button
          onClick={() => { setEditing(!editing); setGoalInput(goal.toString()); }}
          className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
        >
          <Settings2 size={12} /> {editing ? "Cancel" : "Edit"}
        </button>
      </div>

      {editing ? (
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="e.g. 2200"
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            className="bg-accent/20 border-border text-foreground"
            onKeyDown={(e) => e.key === "Enter" && handleSaveGoal()}
          />
          <Button size="sm" onClick={handleSaveGoal} disabled={updateGoal.isPending} className="bg-primary text-primary-foreground shrink-0">
            {updateGoal.isPending ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{todayCalories.toLocaleString()} kcal consumed</span>
              <span>{goal.toLocaleString()} kcal goal</span>
            </div>
            <div className="h-3 bg-accent/30 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          <div className="flex justify-between text-xs">
            <span className={`font-medium ${over > 0 ? "text-red-400" : "text-emerald-400"}`}>
              {over > 0 ? `${over} kcal over goal` : `${remaining} kcal remaining`}
            </span>
            <span className="text-muted-foreground">{Math.round(pct)}%</span>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main Nutrition Component ─────────────────────────────────────────────────
export default function Nutrition() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<number | null>(null);
  const [showPhotoAnalyzer, setShowPhotoAnalyzer] = useState(false);
  const [photoMealType, setPhotoMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("lunch");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showIngredientBenefits, setShowIngredientBenefits] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: recipes = [], isLoading } = trpc.nutrition.listRecipes.useQuery({ category, search });
  const { data: recipe } = trpc.nutrition.getRecipe.useQuery(
    { id: selectedRecipe! },
    { enabled: !!selectedRecipe }
  );
  const { data: todayMeals = [] } = trpc.nutrition.getTodayMeals.useQuery();

  const analyzePhoto = trpc.nutrition.analyzePhoto.useMutation();
  const logMeal = trpc.nutrition.logMeal.useMutation();
  const deleteMeal = trpc.nutrition.deleteMeal.useMutation();
  const utils = trpc.useUtils();

  const todayCalories = todayMeals.reduce((s, m) => s + (m.calories ?? 0), 0);
  const todayProtein = todayMeals.reduce((s, m) => s + (m.protein ?? 0), 0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 16 * 1024 * 1024) { toast.error("Image too large. Maximum 16MB."); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    setAnalysisResult(null);
  };

  const handleAnalyze = async () => {
    if (!photoPreview) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzePhoto.mutateAsync({ imageUrl: photoPreview, mealType: photoMealType });
      setAnalysisResult(result);
    } catch {
      toast.error("Error analyzing photo. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLogMeal = async () => {
    if (!analysisResult) return;
    await logMeal.mutateAsync({
      mealType: photoMealType,
      description: analysisResult.description,
      calories: analysisResult.calories,
      protein: analysisResult.protein,
      carbs: analysisResult.carbs,
      fat: analysisResult.fat,
      photoAnalysis: JSON.stringify(analysisResult),
    });
    utils.nutrition.getTodayMeals.invalidate();
    toast.success("Meal logged!");
    setShowPhotoAnalyzer(false);
    setPhotoPreview(null);
    setAnalysisResult(null);
  };

  const handleLogRecipe = async (r: any) => {
    await logMeal.mutateAsync({
      mealType: r.category === "breakfast" || r.category === "smoothie" ? "breakfast" : r.category === "snack" || r.category === "supplement" ? "snack" : r.category as any,
      description: r.name,
      calories: r.calories,
      protein: r.protein,
      carbs: r.carbs,
      fat: r.fat,
      recipeId: r.id,
    });
    utils.nutrition.getTodayMeals.invalidate();
    toast.success(`${r.name} logged!`);
  };

  const handleDeleteMeal = async (id: number) => {
    await deleteMeal.mutateAsync({ id });
    utils.nutrition.getTodayMeals.invalidate();
    toast.success("Meal removed.");
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Nutrition</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Recipes for male performance + calorie analysis by photo
            </p>
          </div>
          <Button
            onClick={() => setShowPhotoAnalyzer(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
          >
            <Camera size={16} className="mr-2" />
            Analyze Photo
          </Button>
        </div>

        {/* Today's Summary */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Today's Calories", value: `${todayCalories} kcal`, icon: Flame, color: "text-orange-400" },
            { label: "Protein", value: `${todayProtein}g`, icon: Zap, color: "text-blue-400" },
            { label: "Meals", value: `${todayMeals.length}`, icon: ChefHat, color: "text-primary" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-3 text-center">
              <stat.icon size={18} className={`${stat.color} mx-auto mb-1`} />
              <p className="text-lg font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Calorie Goal Progress Bar */}
        <CalorieGoalBar todayCalories={todayCalories} />

        <Tabs defaultValue="recipes">
          <TabsList className="bg-card border border-border flex-wrap h-auto gap-1">
            <TabsTrigger value="recipes">Recipes</TabsTrigger>
            <TabsTrigger value="ingredients">
              <Salad size={14} className="mr-1" /> Ingredients
            </TabsTrigger>
            <TabsTrigger value="barcode">
              <Barcode size={14} className="mr-1" /> Barcode
            </TabsTrigger>
            <TabsTrigger value="today">Today ({todayMeals.length})</TabsTrigger>
            <TabsTrigger value="history">
              <BarChart3 size={14} className="mr-1" /> History
            </TabsTrigger>
            <TabsTrigger value="reminders">
              <Bell size={14} className="mr-1" /> Reminders
            </TabsTrigger>
          </TabsList>

          {/* ── Recipes tab ── */}
          <TabsContent value="recipes" className="space-y-4 mt-4">
            <div className="flex gap-3 flex-wrap">
              <div className="relative flex-1 min-w-48">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search recipes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-card border-border text-foreground"
                />
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setCategory(cat.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    category === cat.key
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recipes.map((r) => (
                  <div
                    key={r.id}
                    className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-colors cursor-pointer"
                    onClick={() => setSelectedRecipe(r.id)}
                  >
                    {r.imageUrl && (
                      <div className="relative h-44 overflow-hidden">
                        <img src={r.imageUrl} alt={r.name} className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 text-center">
                          <div className={`text-sm font-bold ${scoreColor(r.performanceScore ?? 0)}`}>{r.performanceScore}</div>
                          <div className="text-xs text-white/70">score</div>
                        </div>
                        <div className="absolute bottom-2 left-3">
                          <h3 className="font-semibold text-white text-sm leading-tight drop-shadow">{r.name}</h3>
                        </div>
                      </div>
                    )}
                    <div className="p-4">
                      {!r.imageUrl && (
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground text-sm leading-tight">{r.name}</h3>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{r.description}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <div className={`text-lg font-bold ${scoreColor(r.performanceScore ?? 0)}`}>{r.performanceScore}</div>
                            <div className="text-xs text-muted-foreground">score</div>
                          </div>
                        </div>
                      )}
                      {r.imageUrl && <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{r.description}</p>}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><Flame size={12} className="text-orange-400" /> {r.calories} kcal</span>
                        <span className="flex items-center gap-1"><Zap size={12} className="text-blue-400" /> {r.protein}g prot</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {r.prepTimeMinutes}min</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs border-border text-muted-foreground">{categoryLabel(r.category)}</Badge>
                        <Button
                          size="sm" variant="outline"
                          className="h-7 text-xs border-primary/40 text-primary hover:bg-primary/10"
                          onClick={(e) => { e.stopPropagation(); handleLogRecipe(r); }}
                        >
                          <Plus size={12} className="mr-1" /> Log
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── Ingredient Scanner tab ── */}
          <TabsContent value="ingredients" className="mt-4">
            <IngredientScanner />
          </TabsContent>

          {/* ── Barcode Scanner tab ── */}
          <TabsContent value="barcode" className="mt-4">
            <BarcodeScanner />
          </TabsContent>

          {/* ── Today tab ── */}
          <TabsContent value="today" className="space-y-3 mt-4">
            {todayMeals.length === 0 ? (
              <div className="text-center py-12">
                <ChefHat size={40} className="text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground">No meals logged today</p>
                <Button className="mt-4 bg-primary text-primary-foreground" onClick={() => setShowPhotoAnalyzer(true)}>
                  <Camera size={16} className="mr-2" /> Analyze Photo
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {todayMeals.map((meal) => (
                  <div key={meal.id} className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm truncate">{meal.description || MEAL_LABELS[meal.mealType]}</p>
                        <p className="text-xs text-muted-foreground">{MEAL_LABELS[meal.mealType]}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-bold text-primary">{meal.calories} kcal</p>
                          <p className="text-xs text-muted-foreground">{meal.protein}g prot</p>
                        </div>
                        <button
                          onClick={() => handleDeleteMeal(meal.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="bg-card border border-primary/20 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-foreground">Daily Total</span>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-orange-400 font-bold">{todayCalories} kcal</span>
                      <span className="text-blue-400">{todayProtein}g protein</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* ── History tab ── */}
          <TabsContent value="history" className="mt-4">
            <CalorieHistoryChart />
          </TabsContent>

          {/* ── Reminders tab ── */}
          <TabsContent value="reminders" className="mt-4">
            <MealRemindersSettings />
          </TabsContent>
        </Tabs>
      </div>

      {/* Recipe Detail Dialog */}
      <Dialog open={!!selectedRecipe} onOpenChange={(o) => !o && setSelectedRecipe(null)}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
          {recipe && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-foreground text-xl">{recipe.name}</DialogTitle>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Flame size={14} className="text-orange-400" /> {recipe.calories} kcal</span>
                  <span className="flex items-center gap-1"><Zap size={14} className="text-blue-400" /> {recipe.protein}g protein</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {recipe.prepTimeMinutes}min</span>
                  <span className={`font-bold ${scoreColor(recipe.performanceScore ?? 0)}`}>
                    <Star size={14} className="inline mr-1" />{recipe.performanceScore}/100
                  </span>
                </div>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">{recipe.description}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: "Calories", value: `${recipe.calories}`, unit: "kcal", color: "text-orange-400" },
                  { label: "Protein", value: `${recipe.protein}`, unit: "g", color: "text-blue-400" },
                  { label: "Carbs", value: `${recipe.carbs}`, unit: "g", color: "text-yellow-400" },
                  { label: "Fat", value: `${recipe.fat}`, unit: "g", color: "text-green-400" },
                ].map((m) => (
                  <div key={m.label} className="bg-accent/30 rounded-lg p-2 text-center">
                    <p className={`text-lg font-bold ${m.color}`}>{m.value}<span className="text-xs">{m.unit}</span></p>
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Leaf size={16} className="text-primary" /> Ingredients
                </h4>
                <ul className="space-y-1">
                  {(recipe.ingredients as string[] ?? []).map((ing, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span> {ing}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Instructions</h4>
                <ol className="space-y-2">
                  {(recipe.instructions as string[] ?? []).map((step, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs flex items-center justify-center shrink-0 font-bold">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <button
                  className="flex items-center gap-2 text-primary font-semibold text-sm mb-3"
                  onClick={() => setShowIngredientBenefits(!showIngredientBenefits)}
                >
                  <Info size={16} />
                  {showIngredientBenefits ? "Hide" : "View"} Benefits by Ingredient
                </button>
                {showIngredientBenefits && (
                  <div className="space-y-3">
                    {Object.entries(recipe.ingredientBenefits as Record<string, string> ?? {}).map(([ingredient, benefit]) => (
                      <div key={ingredient} className="bg-accent/20 rounded-lg p-3 border border-primary/10">
                        <p className="text-sm font-semibold text-primary capitalize mb-1">{ingredient}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{benefit}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => { handleLogRecipe(recipe); setSelectedRecipe(null); }}
              >
                <CheckCircle2 size={16} className="mr-2" /> Log This Meal
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Photo Analyzer Dialog */}
      <Dialog open={showPhotoAnalyzer} onOpenChange={setShowPhotoAnalyzer}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-foreground flex items-center gap-2">
              <Camera size={18} className="text-primary" /> Analyze Meal by Photo
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Take a photo of your meal and AI will estimate calories, macros and performance impact.
            </p>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Meal Type</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {MEAL_TYPES.map((mt) => (
                  <button
                    key={mt}
                    onClick={() => setPhotoMealType(mt)}
                    className={`py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      photoMealType === mt
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent/30 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {MEAL_LABELS[mt]}
                  </button>
                ))}
              </div>
            </div>

            {!photoPreview ? (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowCamera(true)}
                  className="flex flex-col items-center gap-2 border-2 border-dashed border-border rounded-xl p-5 hover:border-primary/50 hover:bg-primary/5 transition-colors"
                >
                  <Camera size={24} className="text-primary" />
                  <span className="text-xs text-muted-foreground">Take Photo</span>
                </button>
                <label
                  htmlFor="meal-photo-file"
                  className="flex flex-col items-center gap-2 border-2 border-dashed border-border rounded-xl p-5 hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer"
                >
                  <Upload size={24} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Choose File</span>
                </label>
                <input id="meal-photo-file" type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
              </div>
            ) : (
              <div className="relative">
                <img src={photoPreview} alt="Preview" className="max-h-48 mx-auto rounded-lg object-contain w-full" />
                <button
                  className="absolute top-1 right-1 bg-background/80 rounded-full p-1"
                  onClick={() => { setPhotoPreview(null); setAnalysisResult(null); }}
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {photoPreview && !analysisResult && (
              <Button
                className="w-full bg-primary text-primary-foreground"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? <><Loader2 size={16} className="mr-2 animate-spin" /> Analyzing...</> : <><Zap size={16} className="mr-2" /> Analyze with AI</>}
              </Button>
            )}

            {analysisResult && (
              <div className="space-y-3">
                <div className="bg-accent/20 rounded-xl p-4 border border-primary/20">
                  <p className="text-sm font-medium text-foreground mb-3">{analysisResult.description}</p>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {[
                      { label: "Kcal", value: analysisResult.calories, color: "text-orange-400" },
                      { label: "Prot", value: `${analysisResult.protein}g`, color: "text-blue-400" },
                      { label: "Carbs", value: `${analysisResult.carbs}g`, color: "text-yellow-400" },
                      { label: "Fat", value: `${analysisResult.fat}g`, color: "text-green-400" },
                    ].map((m) => (
                      <div key={m.label} className="text-center">
                        <p className={`font-bold text-sm ${m.color}`}>{m.value}</p>
                        <p className="text-xs text-muted-foreground">{m.label}</p>
                      </div>
                    ))}
                  </div>
                  {analysisResult.performanceImpact && (
                    <div className="bg-primary/10 rounded-lg p-2 border border-primary/20">
                      <p className="text-xs text-primary font-medium">⚡ Performance Impact</p>
                      <p className="text-xs text-muted-foreground mt-1">{analysisResult.performanceImpact}</p>
                    </div>
                  )}
                  {analysisResult.suggestions?.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Suggestions:</p>
                      {analysisResult.suggestions.map((s: string, i: number) => (
                        <p key={i} className="text-xs text-muted-foreground">• {s}</p>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  className="w-full bg-primary text-primary-foreground"
                  onClick={handleLogMeal}
                  disabled={logMeal.isPending}
                >
                  <CheckCircle2 size={16} className="mr-2" /> Save to Journal
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Camera modal for meal photo */}
      {showCamera && (
        <CameraModal
          onCapture={(dataUrl) => { setShowCamera(false); setPhotoPreview(dataUrl); }}
          onClose={() => setShowCamera(false)}
        />
      )}
    </AppLayout>
  );
}
