#!/usr/bin/env node
/**
 * Gera vídeos placeholder próprios para os 10 exercícios de memória.
 * Requer ffmpeg instalado: https://ffmpeg.org/
 *
 * Uso (na raiz do projeto): node scripts/generate-placeholder-videos.js
 * Saída: client/public/videos/{id}.mp4
 */

const { spawnSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const EXERCISES = [
  { id: "memory_palace", name: "Memory Palace" },
  { id: "chunking", name: "Chunking" },
  { id: "dual_nback", name: "Dual N-Back" },
  { id: "spaced_repetition", name: "Spaced Repetition" },
  { id: "story_chain", name: "Story Chain" },
  { id: "mindfulness_recall", name: "Mindfulness Recall" },
  { id: "name_face", name: "Name & Face" },
  { id: "number_shape", name: "Number–Shape" },
  { id: "recall_after_reading", name: "Recall After Reading" },
  { id: "speed_cards", name: "Speed Cards" },
];

const OUT_DIR = path.join(__dirname, "..", "client", "public", "videos");
const DURATION = 6; // segundos
const SIZE = "1280x720";

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  console.log("Pasta criada:", OUT_DIR);
}

const ffmpeg = spawnSync("ffmpeg", ["-version"], { encoding: "utf8" });
if (ffmpeg.status !== 0) {
  console.error("ffmpeg não encontrado. Instale: https://ffmpeg.org/");
  process.exit(1);
}

for (const ex of EXERCISES) {
  const outFile = path.join(OUT_DIR, `${ex.id}.mp4`);
  const safeText = ex.name.replace(/'/g, "'\\''");
  const filter = `drawtext=text='${safeText}':fontsize=52:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2:enable='between(t,0,${DURATION})'`;
  const args = [
    "-y",
    "-f", "lavfi",
    "-i", `color=c=#1e3a5f:s=${SIZE}:d=${DURATION}`,
    "-vf", filter,
    "-t", String(DURATION),
    outFile,
  ];
  const result = spawnSync("ffmpeg", args, { encoding: "utf8" });
  if (result.status === 0) {
    console.log("OK:", ex.id + ".mp4");
  } else {
    console.error("Erro", ex.id, result.stderr.slice(-200));
  }
}

console.log("\nPronto. Vídeos em:", OUT_DIR);
console.log("Substitua pelos seus vídeos reais quando gravar.");
