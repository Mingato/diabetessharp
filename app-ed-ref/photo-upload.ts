import { Router } from "express";
import multer from "multer";
import { nanoid } from "nanoid";
import { storagePut, storageGet } from "./storage";
import { getDb } from "./db";
import { progressPhotos } from "../drizzle/schema";
import { and, desc, eq } from "drizzle-orm";
import { sdk } from "./_core/sdk";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 16 * 1024 * 1024 }, // 16MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

export const photoRouter = Router();

// POST /api/photos/upload — upload a progress photo
photoRouter.post("/upload", upload.single("photo"), async (req, res) => {
  try {
    let user;
    try { user = await sdk.authenticateRequest(req as any); } catch { return res.status(401).json({ error: "Unauthorized" }); }

    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database unavailable" });
    }

    const ext = req.file.mimetype.split("/")[1] ?? "jpg";
    const fileKey = `progress-photos/${user.id}/${nanoid()}.${ext}`;

    const { url } = await storagePut(fileKey, req.file.buffer, req.file.mimetype);

    const programDay = parseInt(req.body.programDay ?? "1", 10);
    const weekNumber = Math.ceil(programDay / 7);
    const note = req.body.note ?? null;
    const bodyWeight = req.body.bodyWeight ? parseFloat(req.body.bodyWeight) : null;

    await db.insert(progressPhotos).values({
      userId: user.id,
      s3Key: fileKey,
      s3Url: url,
      programDay,
      weekNumber,
      note,
      bodyWeight,
      takenAt: new Date(),
    });

    return res.json({ success: true, url, key: fileKey });
  } catch (err) {
    console.error("[PhotoUpload] Error:", err);
    return res.status(500).json({ error: "Upload failed" });
  }
});

// GET /api/photos/list — list user's progress photos with fresh signed URLs
photoRouter.get("/list", async (req, res) => {
  try {
    let user;
    try { user = await sdk.authenticateRequest(req as any); } catch { return res.status(401).json({ error: "Unauthorized" }); }

    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database unavailable" });
    }

    const photos = await db
      .select()
      .from(progressPhotos)
      .where(eq(progressPhotos.userId, user.id))
      .orderBy(desc(progressPhotos.takenAt));

    // Refresh signed URLs for each photo
    const photosWithUrls = await Promise.all(
      photos.map(async (photo) => {
        try {
          const { url } = await storageGet(photo.s3Key);
          return { ...photo, s3Url: url };
        } catch {
          return photo; // fallback to stored URL if refresh fails
        }
      })
    );

    return res.json(photosWithUrls);
  } catch (err) {
    console.error("[PhotoList] Error:", err);
    return res.status(500).json({ error: "Failed to list photos" });
  }
});

// DELETE /api/photos/:id — delete a progress photo
photoRouter.delete("/:id", async (req, res) => {
  try {
    let user;
    try { user = await sdk.authenticateRequest(req as any); } catch { return res.status(401).json({ error: "Unauthorized" }); }

    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database unavailable" });
    }

    const photoId = parseInt(req.params.id, 10);
    if (isNaN(photoId)) {
      return res.status(400).json({ error: "Invalid photo ID" });
    }

    await db
      .delete(progressPhotos)
      .where(and(eq(progressPhotos.id, photoId), eq(progressPhotos.userId, user.id)));

    return res.json({ success: true });
  } catch (err) {
    console.error("[PhotoDelete] Error:", err);
    return res.status(500).json({ error: "Delete failed" });
  }
});
