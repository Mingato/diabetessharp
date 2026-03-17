  const existing = await db.select().from(articles).limit(1);
  if (existing.length > 0) return;

  await db.insert(articles).values([
    {
      title: "The Vascular Truth About ED",
      slug: "vascular-truth-about-ed",
      category: "causes",
      summary: "Why 80% of ED cases have a physical, vascular cause — and what you can do about it.",
      content: `Erectile dysfunction is primarily a vascular condition. The penis requires a 6-fold increase in blood flow to achieve an erection, and any impairment in vascular function directly impacts this process.\n\nThe endothelium — the thin layer of cells lining your blood vessels — produces nitric oxide (NO), the molecule responsible for relaxing smooth muscle and allowing blood to flow into the erectile tissue. When endothelial function is impaired (due to smoking, poor diet, inactivity, or cardiovascular disease), NO production drops, and erections become difficult.\n\nThe good news: endothelial function is highly trainable. Regular aerobic exercise, particularly Zone 2 cardio, has been shown in multiple studies to improve endothelial function and increase NO production within 8-12 weeks.`,
      readTimeMinutes: 5,
      isPremium: false,
      programWeek: 1,
    },
    {
      title: "Kegel Exercises: The Science Behind the Practice",
      slug: "kegel-exercises-science",
      category: "treatments",
      summary: "How pelvic floor training directly improves erectile function — backed by clinical research.",
      content: `A landmark 2005 study published in the British Journal of Urology International found that pelvic floor exercises (Kegels) were more effective than lifestyle changes alone for treating ED — with 40% of men achieving normal erectile function after 6 months.\n\nThe mechanism is twofold: First, the ischiocavernosus and bulbocavernosus muscles (your pelvic floor) actively compress the base of the penis during erection, maintaining rigidity. Weak pelvic floor muscles mean blood can escape more easily, reducing hardness.\n\nSecond, these muscles play a critical role in the vascular dynamics of erection. Strengthening them improves the hydraulic efficiency of the erectile mechanism.`,
      readTimeMinutes: 6,
      isPremium: false,
      programWeek: 1,
    },
    {
      title: "Testosterone: What You Actually Need to Know",
      slug: "testosterone-what-you-need-to-know",
      category: "science",
      summary: "Separating testosterone myths from evidence — and the lifestyle factors that actually move the needle.",
      content: `Testosterone levels in American men have been declining by approximately 1% per year since the 1980s. By age 40, most men have significantly lower testosterone than their fathers did at the same age.\n\nWhile low testosterone can contribute to ED, it's rarely the sole cause. More importantly, testosterone levels are highly responsive to lifestyle interventions:\n\nSleep: A University of Chicago study found that just one week of sleeping 5 hours per night reduced testosterone by 15%. Getting 7-9 hours is the single most impactful intervention.\n\nExercise: Resistance training and HIIT both acutely spike testosterone. Chronic aerobic exercise improves testosterone sensitivity.\n\nBody fat: Adipose tissue converts testosterone to estrogen via aromatase. Reducing visceral fat directly increases free testosterone.`,
      readTimeMinutes: 7,
      isPremium: false,
      programWeek: 2,
    },
    {
      title: "The Psychology of ED: Breaking the Anxiety Cycle",
      slug: "psychology-of-ed-anxiety-cycle",
      category: "mindset",
      summary: "How performance anxiety creates a self-fulfilling prophecy — and the proven techniques to break it.",
      content: `For many men, ED begins with a single difficult experience — and then the anxiety about it happening again becomes the primary cause of future episodes. This is the anxiety cycle, and it's one of the most common and treatable causes of ED.\n\nThe mechanism: anxiety activates the sympathetic nervous system (fight-or-flight), which causes vasoconstriction — the opposite of what's needed for an erection. The more anxious you are about performing, the less likely you are to achieve a firm erection, which increases anxiety, creating a vicious cycle.\n\nBreaking this cycle requires two approaches: parasympathetic activation through breathwork, and mindfulness practice to reduce cognitive hypervigilance.`,
      readTimeMinutes: 6,
      isPremium: false,
      programWeek: 2,
    },
    {
      title: "Nutrition for Peak Sexual Performance",
      slug: "nutrition-for-sexual-performance",
      category: "nutrition",
      summary: "The foods that boost nitric oxide, testosterone, and vascular health — and what to avoid.",
      content: `Your diet directly impacts erectile function through multiple pathways: nitric oxide production, testosterone levels, cardiovascular health, and inflammation.\n\nFoods that help: Dark leafy greens (spinach, arugula) are high in nitrates, which convert to nitric oxide. Beets are the most concentrated dietary source of nitrates. Pomegranate has been shown in studies to improve erectile function by 17%. Watermelon contains citrulline, a precursor to arginine and nitric oxide. Oysters are the highest dietary source of zinc, critical for testosterone production.\n\nFoods to minimize: Ultra-processed foods promote inflammation and endothelial dysfunction. Alcohol (more than 2 drinks) acutely impairs erectile function and chronically suppresses testosterone.`,
      readTimeMinutes: 5,
      isPremium: true,
      programWeek: 3,
    },
    {
      title: "Sleep: The Most Underrated Performance Optimizer",
      slug: "sleep-performance-optimizer",
      category: "lifestyle",
      summary: "Why sleep is the foundation of sexual health — and a step-by-step protocol for optimizing yours.",
      content: `70-80% of testosterone is released during sleep, primarily during REM cycles. Poor sleep doesn't just make you tired — it directly suppresses the hormonal foundation of sexual function.\n\nA study from the Journal of the American Medical Association found that men who slept 5 hours per night for one week had testosterone levels equivalent to men 10-15 years older.\n\nThe RiseUp Sleep Protocol: Maintain a consistent wake time every day. Get bright light exposure within 30 minutes of waking. Avoid blue light 2 hours before bed. Sleep in a cool room (65-68°F). Avoid alcohol before bed — even 1-2 drinks fragment REM sleep and suppress testosterone release.`,
      readTimeMinutes: 7,
      isPremium: true,
      programWeek: 4,
    },
  ]);
}

export async function generateDailyTasks(db: DB, userId: number, programDay: number) {
  const existing = await db
    .select()
    .from(dailyTasks)
    .where(and(eq(dailyTasks.userId, userId), eq(dailyTasks.programDay, programDay)))
    .limit(1);
  if (existing.length > 0) return;

  const week = Math.ceil(programDay / 7);
  const allExercises = await db.select().from(exercises).where(
    and(eq(exercises.isActive, true), sql`programWeek <= ${week}`)
  );

  const tasks: Parameters<typeof db.insert<typeof dailyTasks>>[0] extends { values: (v: infer V) => unknown } ? V[] : never[] = [];

  // Always include check-in
  (tasks as Array<{userId: number; programDay: number; taskType: "checkin" | "exercise" | "education" | "mindset"; title: string; description?: string; exerciseId?: number}>).push({
    userId,
    programDay,
    taskType: "checkin",
    title: "Daily Performance Check-In",
    description: "Rate your energy, mood, sleep, libido, and erection quality to track your progress.",
  });

  const kegels = allExercises.filter((e) => e.category === "kegel");
  const breathwork = allExercises.filter((e) => e.category === "breathwork");
  const cardio = allExercises.filter((e) => e.category === "cardio");
  const cold = allExercises.filter((e) => e.category === "cold_therapy");

  type TaskInsert = { userId: number; programDay: number; taskType: "checkin" | "exercise" | "education" | "mindset"; title: string; description?: string; exerciseId?: number };
  const taskList: TaskInsert[] = [{
    userId,
    programDay,
    taskType: "checkin",
    title: "Daily Performance Check-In",
    description: "Rate your energy, mood, sleep, libido, and erection quality to track your progress.",
  }];

  if (kegels.length > 0) {
    const ex = kegels[Math.min(Math.floor(week / 3), kegels.length - 1)];
    taskList.push({ userId, programDay, exerciseId: ex.id, taskType: "exercise", title: ex.name, description: ex.description ?? undefined });
  }
  if (breathwork.length > 0) {
    const ex = breathwork[programDay % 2 === 0 ? 0 : Math.min(1, breathwork.length - 1)];
    taskList.push({ userId, programDay, exerciseId: ex.id, taskType: "exercise", title: ex.name, description: ex.description ?? undefined });
  }
  if (cardio.length > 0 && programDay % 2 !== 0) {
    const ex = cardio[0];
    taskList.push({ userId, programDay, exerciseId: ex.id, taskType: "exercise", title: ex.name, description: ex.description ?? undefined });
  }
  if (cold.length > 0 && week >= 2) {
    const ex = cold[0];
    taskList.push({ userId, programDay, exerciseId: ex.id, taskType: "exercise", title: ex.name, description: ex.description ?? undefined });
  }
  taskList.push({ userId, programDay, taskType: "education", title: "Read Today's Article", description: "Expand your knowledge with today's educational content." });
