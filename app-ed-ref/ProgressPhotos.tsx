import { useState, useRef, useCallback, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Camera,
  Upload,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Lock,
  ImageIcon,
  Scale,
  Loader2,
  X,
  ArrowLeftRight,
  Calendar,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Photo = {
  id: number;
  userId: number;
  s3Key: string;
  s3Url: string;
  programDay: number;
  weekNumber: number;
  note: string | null;
  bodyWeight: number | null;
  takenAt: Date | string;
  createdAt: Date | string;
};

// ─── Camera Modal (getUserMedia for desktop + mobile) ───────────────────────
function CameraModal({ onCapture, onClose }: { onCapture: (file: File) => void; onClose: () => void }) {
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
    c.toBlob(blob => {
      if (!blob) return;
      const f = new File([blob], `photo_${Date.now()}.jpg`, { type: "image/jpeg" });
      streamRef.current?.getTracks().forEach(t => t.stop());
      onCapture(f);
    }, "image/jpeg", 0.92);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="flex items-center justify-between p-3 bg-black/80">
        <button onClick={onClose} className="text-white p-2"><X size={20} /></button>
        <span className="text-white text-sm font-medium">Take Photo</span>
        <button onClick={() => setFacingMode(m => m === "environment" ? "user" : "environment")}
          className="text-white p-2 text-xs border border-white/30 rounded-lg px-3">
          Flip
        </button>
      </div>
      <div className="flex-1 relative flex items-center justify-center bg-black">
        <video ref={videoRef} autoPlay playsInline muted className="max-w-full max-h-full object-contain" />
        {!ready && <div className="absolute text-white text-sm">Starting camera...</div>}
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <div className="p-6 flex justify-center bg-black/80">
        <button onClick={capture} disabled={!ready}
          className="w-16 h-16 rounded-full bg-white border-4 border-gray-300 disabled:opacity-50 flex items-center justify-center">
          <Camera size={24} className="text-black" />
        </button>
      </div>
    </div>
  );
}

// ─── Upload Panel ────────────────────────────────────────────────────────────
function UploadPanel({
  programDay,
  onUploaded,
}: {
  programDay: number;
  onUploaded: () => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const [weight, setWeight] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    if (f.size > 16 * 1024 * 1024) {
      toast.error("Image must be under 16 MB.");
      return;
    }
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("photo", file);
      formData.append("programDay", programDay.toString());
      if (note) formData.append("note", note);
      if (weight) formData.append("bodyWeight", weight);

      const res = await fetch("/api/photos/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Upload failed" }));
        throw new Error(err.error ?? "Upload failed");
      }

      toast.success("Photo saved to your private journal!");
      setPreview(null);
      setFile(null);
      setNote("");
      setWeight("");
      onUploaded();
    } catch (err: any) {
      toast.error(err.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Camera size={18} className="text-primary" />
        <h2 className="font-semibold text-foreground">Add Progress Photo</h2>
        <Badge className="ml-auto bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs">
          <Lock size={10} className="mr-1" /> Private
        </Badge>
      </div>

      {/* Privacy notice */}
      <div className="flex items-start gap-2 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
        <Info size={14} className="text-blue-400 mt-0.5 shrink-0" />
        <p className="text-xs text-blue-300">
          Your photos are stored privately and securely. Only you can see them — they are never shared or used for any other purpose.
        </p>
      </div>

      {preview ? (
        <div className="space-y-3">
          <div className="relative rounded-lg overflow-hidden bg-muted aspect-[3/4] max-h-64 flex items-center justify-center">
            <img src={preview} alt="Preview" className="object-contain w-full h-full" />
            <button
              onClick={() => { setPreview(null); setFile(null); }}
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
            >
              <X size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Body weight (kg)</label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 82.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Program day</label>
              <input
                type="text"
                value={`Day ${programDay}`}
                readOnly
                className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-muted-foreground"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Note (optional)</label>
            <textarea
              placeholder="How are you feeling? Any observations..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>
          <Button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {uploading ? (
              <><Loader2 size={16} className="mr-2 animate-spin" /> Saving...</>
            ) : (
              <><Upload size={16} className="mr-2" /> Save to Journal</>
            )}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {/* Camera - opens getUserMedia modal on all devices */}
          <button
            onClick={() => setShowCamera(true)}
            className="flex flex-col items-center gap-2 border-2 border-dashed border-border rounded-xl p-5 hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer"
          >
            <Camera size={24} className="text-primary" />
            <span className="text-xs text-muted-foreground">Take Photo</span>
          </button>
          {/* File picker */}
          <label
            htmlFor="file-picker-input"
            className="flex flex-col items-center gap-2 border-2 border-dashed border-border rounded-xl p-5 hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer"
          >
            <ImageIcon size={24} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Choose File</span>
          </label>
          <input
            id="file-picker-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>
      )}
      {showCamera && (
        <CameraModal
          onCapture={(f) => { setShowCamera(false); handleFile(f); }}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
}

// ─── Before/After Comparison ─────────────────────────────────────────────────
function BeforeAfterComparison({ photos }: { photos: Photo[] }) {
  const [beforeIdx, setBeforeIdx] = useState(0);
  const [afterIdx, setAfterIdx] = useState(Math.max(photos.length - 1, 0));

  if (photos.length < 2) {
    return (
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <ArrowLeftRight size={18} className="text-primary" />
          <h2 className="font-semibold text-foreground">Before / After</h2>
        </div>
        <div className="text-center py-8 text-muted-foreground text-sm">
          Upload at least 2 photos to enable before/after comparison
        </div>
      </div>
    );
  }

  const before = photos[beforeIdx];
  const after = photos[afterIdx];

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <ArrowLeftRight size={18} className="text-primary" />
        <h2 className="font-semibold text-foreground">Before / After</h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {/* Before */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Before</span>
            <select
              value={beforeIdx}
              onChange={(e) => setBeforeIdx(Number(e.target.value))}
              className="text-xs bg-muted border border-border rounded px-2 py-1 text-foreground"
            >
              {photos.map((p, i) => (
                <option key={p.id} value={i}>
                  Week {p.weekNumber} · Day {p.programDay}
                </option>
              ))}
            </select>
          </div>
          <div className="rounded-lg overflow-hidden bg-muted aspect-[3/4] flex items-center justify-center">
            {before ? (
              <img src={before.s3Url} alt="Before" className="object-cover w-full h-full" />
            ) : (
              <ImageIcon size={32} className="text-muted-foreground" />
            )}
          </div>
          {before?.bodyWeight && (
            <p className="text-xs text-center text-muted-foreground mt-1">
              <Scale size={10} className="inline mr-1" />{before.bodyWeight} kg
            </p>
          )}
        </div>
        {/* After */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-primary uppercase tracking-wide">After</span>
            <select
              value={afterIdx}
              onChange={(e) => setAfterIdx(Number(e.target.value))}
              className="text-xs bg-muted border border-border rounded px-2 py-1 text-foreground"
            >
              {photos.map((p, i) => (
                <option key={p.id} value={i}>
                  Week {p.weekNumber} · Day {p.programDay}
                </option>
              ))}
            </select>
          </div>
          <div className="rounded-lg overflow-hidden bg-muted aspect-[3/4] flex items-center justify-center">
            {after ? (
              <img src={after.s3Url} alt="After" className="object-cover w-full h-full" />
            ) : (
              <ImageIcon size={32} className="text-muted-foreground" />
            )}
          </div>
          {after?.bodyWeight && (
            <p className="text-xs text-center text-muted-foreground mt-1">
              <Scale size={10} className="inline mr-1" />{after.bodyWeight} kg
            </p>
          )}
        </div>
      </div>
      {/* Weight delta */}
      {before?.bodyWeight && after?.bodyWeight && (
        <div className={cn(
          "mt-3 rounded-lg p-3 text-center text-sm font-medium",
          after.bodyWeight < before.bodyWeight
            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            : after.bodyWeight > before.bodyWeight
            ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
            : "bg-muted text-muted-foreground"
        )}>
          Weight change: {after.bodyWeight > before.bodyWeight ? "+" : ""}
          {(after.bodyWeight - before.bodyWeight).toFixed(1)} kg
        </div>
      )}
    </div>
  );
}

// ─── Photo Timeline ───────────────────────────────────────────────────────────
function PhotoTimeline({
  photos,
  onDelete,
}: {
  photos: Photo[];
  onDelete: (id: number) => void;
}) {
  const [lightbox, setLightbox] = useState<Photo | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Group by week
  const byWeek = photos.reduce<Record<number, Photo[]>>((acc, p) => {
    const w = p.weekNumber;
    if (!acc[w]) acc[w] = [];
    acc[w].push(p);
    return acc;
  }, {});

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/photos/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Delete failed");
      onDelete(id);
      toast.success("Photo deleted");
      if (lightbox?.id === id) setLightbox(null);
    } catch {
      toast.error("Could not delete photo");
    } finally {
      setDeletingId(null);
    }
  };

  if (photos.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <ImageIcon size={40} className="text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">No photos yet.</p>
        <p className="text-xs text-muted-foreground mt-1">Upload your first progress photo above to start your visual journal.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {Object.entries(byWeek)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([week, weekPhotos]) => (
            <div key={week}>
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={14} className="text-primary" />
                <span className="text-sm font-semibold text-foreground">Week {week}</span>
                <span className="text-xs text-muted-foreground">({weekPhotos.length} photo{weekPhotos.length !== 1 ? "s" : ""})</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {weekPhotos.map((photo) => (
                  <div key={photo.id} className="relative group rounded-lg overflow-hidden bg-muted aspect-square">
                    <img
                      src={photo.s3Url}
                      alt={`Day ${photo.programDay}`}
                      className="object-cover w-full h-full cursor-pointer"
                      onClick={() => setLightbox(photo)}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end justify-between p-1.5 opacity-0 group-hover:opacity-100">
                      <span className="text-white text-xs font-medium">Day {photo.programDay}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(photo.id); }}
                        disabled={deletingId === photo.id}
                        className="bg-red-500/80 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        {deletingId === photo.id ? <Loader2 size={10} className="animate-spin" /> : <Trash2 size={10} />}
                      </button>
                    </div>
                    {photo.bodyWeight && (
                      <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] rounded px-1 py-0.5">
                        {photo.bodyWeight}kg
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white"
            >
              <X size={24} />
            </button>
            <img
              src={lightbox.s3Url}
              alt={`Day ${lightbox.programDay}`}
              className="w-full rounded-xl object-contain max-h-[70vh]"
            />
            <div className="mt-3 bg-black/60 rounded-lg p-3 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-white text-sm font-medium">
                  Week {lightbox.weekNumber} · Day {lightbox.programDay}
                </span>
                {lightbox.bodyWeight && (
                  <span className="text-white/70 text-xs">
                    <Scale size={10} className="inline mr-1" />{lightbox.bodyWeight} kg
                  </span>
                )}
              </div>
              {lightbox.note && (
                <p className="text-white/70 text-xs">{lightbox.note}</p>
              )}
              <p className="text-white/50 text-xs">
                {new Date(lightbox.takenAt).toLocaleDateString()}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelete(lightbox.id)}
              disabled={deletingId === lightbox.id}
              className="mt-2 w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              <Trash2 size={14} className="mr-2" />
              Delete Photo
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProgressPhotos() {
  const [photos, setPhotos] = useState<Photo[] | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: profile } = trpc.profile.get.useQuery();

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/photos/list", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setPhotos(data);
    } catch {
      toast.error("Could not load photos");
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount
  useState(() => { fetchPhotos(); });

  const handleDelete = (id: number) => {
    setPhotos((prev) => prev?.filter((p) => p.id !== id) ?? null);
  };

  const programDay = profile?.programDay ?? 1;

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <Camera size={22} className="text-primary" />
            Progress Journal
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your physical transformation week by week — all photos are private and encrypted.
          </p>
        </div>

        {/* Stats bar */}
        {photos && photos.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-card border border-border rounded-xl p-3 text-center">
              <p className="text-xl font-display font-bold text-primary">{photos.length}</p>
              <p className="text-xs text-muted-foreground">Photos</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-3 text-center">
              <p className="text-xl font-display font-bold text-foreground">
                {Math.max(...photos.map((p) => p.weekNumber))}
              </p>
              <p className="text-xs text-muted-foreground">Weeks tracked</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-3 text-center">
              <p className="text-xl font-display font-bold text-foreground">
                {photos.filter((p) => p.bodyWeight).length}
              </p>
              <p className="text-xs text-muted-foreground">With weight</p>
            </div>
          </div>
        )}

        {/* Upload */}
        <UploadPanel programDay={programDay} onUploaded={fetchPhotos} />

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="animate-spin text-primary" size={28} />
          </div>
        )}

        {/* Before/After */}
        {!loading && photos && photos.length > 0 && (
          <BeforeAfterComparison photos={[...photos].reverse()} />
        )}

        {/* Timeline */}
        {!loading && photos !== null && (
          <>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-display font-semibold text-foreground">Photo Timeline</h2>
              {photos.length > 0 && (
                <Badge className="bg-primary/15 text-primary border-primary/30 text-xs">
                  {photos.length} total
                </Badge>
              )}
            </div>
            <PhotoTimeline photos={[...photos].reverse()} onDelete={handleDelete} />
          </>
        )}
      </div>
    </AppLayout>
  );
}
