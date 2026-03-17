import webpush from "web-push";
import { ENV } from "./_core/env";
import { getDb } from "./db";
import { pushSubscriptions, users, weeklyIntimacyChallenges, intimacyPositions, userProfiles } from "../drizzle/schema";
import { and, eq } from "drizzle-orm";

// Configure web-push with VAPID keys
function initWebPush() {
  if (ENV.vapidPublicKey && ENV.vapidPrivateKey) {
    webpush.setVapidDetails(
      "mailto:support@riseup.app",
      ENV.vapidPublicKey,
      ENV.vapidPrivateKey
    );
  }
}

initWebPush();

export interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  url?: string;
}

// ── Multilingual notification strings ────────────────────────────────────────
type Lang = "en" | "pt-BR" | "es";

function getLang(lang: string | null | undefined): Lang {
  if (lang === "pt-BR") return "pt-BR";
  if (lang === "es") return "es";
  return "en";
}

const STRINGS: Record<Lang, {
  dailyCheckin: { title: string; body: string };
  exercise: { title: string; body: string };
  weeklyChallenge: { title: string; bodyPrefix: string };
  partnerReacted: { title: string; body: string };
  partnerReadFantasy: { title: string; body: string };
  mealBreakfast: { title: string; body: string };
  mealLunch: { title: string; body: string };
  mealDinner: { title: string; body: string };
}> = {
  "en": {
    dailyCheckin: { title: "⚡ Daily Check-In Ready", body: "Log your performance score and keep your streak alive!" },
    exercise: { title: "💪 Time to Train", body: "Your daily exercises are waiting. Stay consistent, see results!" },
    weeklyChallenge: { title: "🏆 New Weekly Challenge!", bodyPrefix: "" },
    partnerReacted: { title: "She reacted to your list! 🔥", body: "Your partner reacted to your shared positions. Check it out!" },
    partnerReadFantasy: { title: "She read your fantasy! 💋", body: "Looks like she liked it... 🔥" },
    mealBreakfast: { title: "🍳 Breakfast Time", body: "Fuel your performance — log your breakfast to stay on track!" },
    mealLunch: { title: "🥗 Lunch Reminder", body: "Midday fuel matters. Log your lunch and hit your calorie goal!" },
    mealDinner: { title: "🍽️ Dinner Time", body: "End the day right — log your dinner and review your nutrition." },
  },
  "pt-BR": {
    dailyCheckin: { title: "⚡ Check-In Diário Pronto", body: "Registre sua pontuação e mantenha sua sequência!" },
    exercise: { title: "💪 Hora de Treinar", body: "Seus exercícios diários estão esperando. Seja consistente!" },
    weeklyChallenge: { title: "🏆 Novo Desafio Semanal!", bodyPrefix: "" },
    partnerReacted: { title: "Ela reagiu à sua lista! 🔥", body: "Sua parceira reagiu às posições compartilhadas. Veja agora!" },
    partnerReadFantasy: { title: "Ela leu sua fantasia! 💋", body: "Parece que ela gostou... 🔥" },
    mealBreakfast: { title: "🍳 Hora do Café", body: "Alimente sua performance — registre o café da manhã!" },
    mealLunch: { title: "🥗 Lembrete do Almoço", body: "O combustível do meio-dia importa. Registre seu almoço!" },
    mealDinner: { title: "🍽️ Hora do Jantar", body: "Termine o dia bem — registre o jantar e revise sua nutrição." },
  },
  "es": {
    dailyCheckin: { title: "⚡ Check-In Diario Listo", body: "¡Registra tu puntuación y mantén tu racha!" },
    exercise: { title: "💪 Hora de Entrenar", body: "Tus ejercicios diarios te esperan. ¡Sé constante!" },
    weeklyChallenge: { title: "🏆 ¡Nuevo Desafío Semanal!", bodyPrefix: "" },
    partnerReacted: { title: "¡Ella reaccionó a tu lista! 🔥", body: "Tu pareja reaccionó a las posiciones compartidas. ¡Míralo!" },
    partnerReadFantasy: { title: "¡Ella leyó tu fantasía! 💋", body: "Parece que le gustó... 🔥" },
    mealBreakfast: { title: "🍳 Hora del Desayuno", body: "¡Alimenta tu rendimiento — registra tu desayuno!" },
    mealLunch: { title: "🥗 Recordatorio del Almuerzo", body: "El combustible del mediodía importa. ¡Registra tu almuerzo!" },
    mealDinner: { title: "🍽️ Hora de la Cena", body: "Termina el día bien — registra tu cena y revisa tu nutrición." },
  },
};

// Romance tip messages — multilingual
const ROMANCE_MESSAGES: Record<Lang, { title: string; body: string }[]> = {
  "en": [
    { title: "❤️ Romance Tip from Dr. Apex", body: "Send a heartfelt message now. Small gestures create big connections." },
    { title: "🔥 Seduction Mission", body: "Give a specific compliment today. Not generic — something only you noticed about her." },
    { title: "💫 Evening Ritual", body: "Before bed, write one thing you admire about her. Tomorrow, say it out loud." },
    { title: "🌹 Dr. Apex Reminds You", body: "Romance is not an accident — it's intention. What special thing will you do today?" },
    { title: "✨ Connection Challenge", body: "Ask a deep question today. Emotional connection is the greatest aphrodisiac." },
    { title: "🎯 High-Impact Action", body: "Plan a small surprise for this week. Anticipation is powerful." },
    { title: "💪 Confidence in Action", body: "Today: hold eye contact for 3 extra seconds. Confidence is trained." },
  ],
  "pt-BR": [
    { title: "❤️ Dica de Romance do Dr. Apex", body: "Envie uma mensagem carinhosa agora. Pequenos gestos criam grandes conexões." },
    { title: "🔥 Missão de Sedução", body: "Faça um elogio específico hoje. Não genérico — algo que só você notou nela." },
    { title: "💫 Ritual Noturno", body: "Antes de dormir, escreva uma coisa que admira nela. Amanhã, diga em voz alta." },
    { title: "🌹 Dr. Apex Lembra", body: "Romance não é acidente — é intenção. O que você vai fazer de especial hoje?" },
    { title: "✨ Desafio de Conexão", body: "Faça uma pergunta profunda hoje. Conexão emocional é o maior afrodisíaco." },
    { title: "🎯 Ação de Alto Impacto", body: "Planeje uma surpresa pequena para esta semana. Antecipação é poderosa." },
    { title: "💪 Confiança em Ação", body: "Hoje: mantenha contato visual por 3 segundos a mais. Confiança se treina." },
  ],
  "es": [
    { title: "❤️ Consejo de Romance del Dr. Apex", body: "Envía un mensaje cariñoso ahora. Los pequeños gestos crean grandes conexiones." },
    { title: "🔥 Misión de Seducción", body: "Haz un cumplido específico hoy. No genérico — algo que solo tú notaste en ella." },
    { title: "💫 Ritual Nocturno", body: "Antes de dormir, escribe algo que admiras en ella. Mañana, dilo en voz alta." },
    { title: "🌹 El Dr. Apex Recuerda", body: "El romance no es accidente — es intención. ¿Qué cosa especial harás hoy?" },
    { title: "✨ Desafío de Conexión", body: "Haz una pregunta profunda hoy. La conexión emocional es el mayor afrodisíaco." },
    { title: "🎯 Acción de Alto Impacto", body: "Planea una pequeña sorpresa para esta semana. La anticipación es poderosa." },
    { title: "💪 Confianza en Acción", body: "Hoy: mantén el contacto visual 3 segundos más. La confianza se entrena." },
  ],
};

export async function sendPushToUser(
  userId: number,
  payload: PushPayload
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const subs = await db
    .select()
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.userId, userId))
    .limit(1);

  if (!subs.length) return false;

  const sub = subs[0];
  const pushSubscription = {
    endpoint: sub.endpoint,
    keys: {
      p256dh: sub.p256dh,
      auth: sub.auth,
    },
  };

  try {
    await webpush.sendNotification(
      pushSubscription,
      JSON.stringify({
        title: payload.title,
        body: payload.body,
        icon: payload.icon ?? "/icon-192.png",
        badge: payload.badge ?? "/badge-72.png",
        tag: payload.tag ?? "riseup-notification",
        data: { url: payload.url ?? "/app" },
      })
    );
    return true;
  } catch (err: unknown) {
    const error = err as { statusCode?: number; message?: string };
    if (error.statusCode === 410 || error.statusCode === 404) {
      await db.delete(pushSubscriptions).where(eq(pushSubscriptions.userId, userId));
    }
    console.error("[Push] Failed to send notification:", error.message);
    return false;
  }
}

// Helper: check if current time is within a user's DND window
function isInDndWindow(dndEnabled: boolean | null, dndStart: string | null, dndEnd: string | null): boolean {
  if (!dndEnabled) return false;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [startH, startM] = (dndStart ?? "22:00").split(":").map(Number);
  const [endH, endM] = (dndEnd ?? "07:00").split(":").map(Number);
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;
  // Handle overnight windows (e.g. 22:00 → 07:00)
  if (startMinutes > endMinutes) {
    return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
  }
  return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
}

// Helper: get user's preferred language
async function getUserLang(userId: number): Promise<Lang> {
  const db = await getDb();
  if (!db) return "en";
  const [user] = await db.select({ preferredLanguage: users.preferredLanguage }).from(users).where(eq(users.id, userId)).limit(1);
  return getLang(user?.preferredLanguage);
}

export async function sendDailyCheckinReminders(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();

  const subs = await db.select().from(pushSubscriptions).where(eq(pushSubscriptions.notifyCheckin, true));

  let sent = 0;
  for (const sub of subs) {
    // Skip if user is in DND window
    if (isInDndWindow(sub.dndEnabled, sub.dndStart, sub.dndEnd)) continue;
    // Respect user's preferred check-in time (default 08:00)
    const prefTime = sub.checkinTime ?? "08:00";
    const [prefHour, prefMin] = prefTime.split(":").map(Number);
    if (hour !== prefHour || minute > prefMin + 4) continue;
    const lang = await getUserLang(sub.userId);
    const s = STRINGS[lang].dailyCheckin;
    const success = await sendPushToUser(sub.userId, {
      title: s.title,
      body: s.body,
      tag: "daily-checkin",
      url: "/app",
    });
    if (success) sent++;
  }
  return sent;
}

export async function sendExerciseReminders(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();

  const subs = await db.select().from(pushSubscriptions).where(eq(pushSubscriptions.notifyExercise, true));

  let sent = 0;
  for (const sub of subs) {
    // Skip if user is in DND window
    if (isInDndWindow(sub.dndEnabled, sub.dndStart, sub.dndEnd)) continue;
    // Respect user's preferred exercise time (default 07:00)
    const prefTime = sub.exerciseTime ?? "07:00";
    const [prefHour, prefMin] = prefTime.split(":").map(Number);
    if (hour !== prefHour || minute > prefMin + 4) continue;
    const lang = await getUserLang(sub.userId);
    const s = STRINGS[lang].exercise;
    const success = await sendPushToUser(sub.userId, {
      title: s.title,
      body: s.body,
      tag: "exercise-reminder",
      url: "/app/exercises",
    });
    if (success) sent++;
  }
  return sent;
}

export async function sendRomanceReminders(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const subs = await db.select().from(pushSubscriptions);
  const dayOfYear = Math.floor(Date.now() / 86400000) % 7;

  let sent = 0;
  for (const sub of subs) {
    if (isInDndWindow(sub.dndEnabled, sub.dndStart, sub.dndEnd)) continue;
    const lang = await getUserLang(sub.userId);
    const msgs = ROMANCE_MESSAGES[lang];
    const msg = msgs[dayOfYear];
    const success = await sendPushToUser(sub.userId, {
      title: msg.title,
      body: msg.body,
      tag: "romance-reminder",
      url: "/app/intimacy",
    });
    if (success) sent++;
  }
  return sent;
}

// ── Weekly Challenge Notification (Monday 9 AM) ──────────────────────────────
export async function sendWeeklyChallengeNotifications(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / 86400000);
  const weekNumber = Math.ceil((dayOfYear + startOfYear.getDay() + 1) / 7);
  const year = now.getFullYear();

  let [challenge] = await db
    .select()
    .from(weeklyIntimacyChallenges)
    .where(and(eq(weeklyIntimacyChallenges.weekNumber, weekNumber), eq(weeklyIntimacyChallenges.year, year)))
    .limit(1);

  if (!challenge) {
    const positions = await db.select().from(intimacyPositions).where(eq(intimacyPositions.isActive, true));
    if (positions.length > 0) {
      const pos = positions[Math.floor(Math.random() * positions.length)];
      const [inserted] = await db.insert(weeklyIntimacyChallenges).values({
        weekNumber, year,
        challengeType: "position",
        positionId: pos.id,
        title: `Weekly Challenge: ${pos.name}`,
        description: pos.description,
      });
      const insertId = (inserted as any).insertId;
      [challenge] = await db.select().from(weeklyIntimacyChallenges).where(eq(weeklyIntimacyChallenges.id, insertId)).limit(1);
    }
  }

  if (!challenge) return 0;

  const subs = await db.select().from(pushSubscriptions);

  let sent = 0;
  for (const sub of subs) {
    const lang = await getUserLang(sub.userId);
    const s = STRINGS[lang].weeklyChallenge;
    const success = await sendPushToUser(sub.userId, {
      title: s.title,
      body: challenge.title,
      tag: "weekly-challenge",
      url: "/app/intimacy",
    });
    if (success) sent++;
  }

  console.log(`[Push] Sent weekly challenge notification to ${sent} users (week ${weekNumber}/${year})`);
  return sent;
}

// ── Partner Reaction Notification ────────────────────────────────────────────
export async function sendPartnerReactionNotification(userId: number): Promise<boolean> {
  const lang = await getUserLang(userId);
  const s = STRINGS[lang].partnerReacted;
  return sendPushToUser(userId, {
    title: s.title,
    body: s.body,
    tag: "partner-reaction",
    url: "/app/couple",
  });
}

// ── Meal Reminder Notifications ─────────────────────────────────────────────
// Called every 5 minutes by the scheduler; checks each user's saved meal reminder times
export async function sendMealReminders(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();

  // Fetch all users who have meal reminders enabled
  const profiles = await db
    .select({ userId: userProfiles.userId, mealReminders: userProfiles.mealReminders })
    .from(userProfiles);

  let sent = 0;
  for (const profile of profiles) {
    const reminders = profile.mealReminders as { breakfast?: string; lunch?: string; dinner?: string; enabled: boolean } | null;
    if (!reminders?.enabled) continue;

    // Check if user has a push subscription
    const [sub] = await db.select().from(pushSubscriptions).where(eq(pushSubscriptions.userId, profile.userId)).limit(1);
    if (!sub) continue;
    if (isInDndWindow(sub.dndEnabled, sub.dndStart, sub.dndEnd)) continue;

    const lang = await getUserLang(profile.userId);
    const s = STRINGS[lang];

    const mealSlots: { time?: string; key: "mealBreakfast" | "mealLunch" | "mealDinner"; tag: string; url: string }[] = [
      { time: reminders.breakfast, key: "mealBreakfast", tag: "meal-breakfast", url: "/app/nutrition" },
      { time: reminders.lunch,     key: "mealLunch",     tag: "meal-lunch",     url: "/app/nutrition" },
      { time: reminders.dinner,    key: "mealDinner",    tag: "meal-dinner",    url: "/app/nutrition" },
    ];

    for (const slot of mealSlots) {
      if (!slot.time) continue;
      const [slotHour, slotMin] = slot.time.split(":").map(Number);
      if (hour !== slotHour || minute > slotMin + 4) continue;
      const success = await sendPushToUser(profile.userId, {
        title: s[slot.key].title,
        body: s[slot.key].body,
        tag: slot.tag,
        url: slot.url,
      });
      if (success) sent++;
    }
  }
  return sent;
}

// ── Partner Read Fantasy Notification ────────────────────────────────────────
export async function sendPartnerReadFantasyNotification(userId: number): Promise<boolean> {
  const lang = await getUserLang(userId);
  const s = STRINGS[lang].partnerReadFantasy;
  return sendPushToUser(userId, {
    title: s.title,
    body: s.body,
    tag: "partner-read-fantasy",
    url: "/app/fantasia",
  });
}
