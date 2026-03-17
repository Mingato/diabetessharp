import { articles } from "../drizzle/schema";
import { getDb } from "./db";
import { count } from "drizzle-orm";

type DB = NonNullable<Awaited<ReturnType<typeof getDb>>>;

type ArticleCategory = "lifestyle" | "treatments" | "science" | "mindset" | "nutrition" | "causes";

const NEW_ARTICLES: Array<{
  title: string;
  slug: string;
  category: ArticleCategory;
  summary: string;
  content: string;
  readTimeMinutes: number;
  isPremium: boolean;
  programWeek: number;
}> = [
  // Week 4 — Lifestyle Optimization
  {
    title: "Cold Therapy & Sexual Performance: The Science",
    slug: "cold-therapy-sexual-performance",
    category: "lifestyle",
    summary: "How cold exposure boosts testosterone, dopamine, and vascular health for better sexual function.",
    content: `Cold water immersion and cold showers have been used for centuries, but modern science is now validating their profound effects on male hormonal health.\n\nThe testosterone connection: A study published in Fertility and Sterility found that scrotal temperature directly affects testosterone production. The testes operate optimally at 2-4°C below core body temperature — cold exposure helps maintain this optimal range.\n\nDopamine surge: Cold exposure triggers a 250-300% increase in dopamine levels, according to research from the University of Virginia. This dopamine surge improves motivation, drive, and the neurological components of sexual arousal.\n\nThe RiseUp Cold Protocol: Start with 30 seconds of cold water at the end of your shower. Progress to 2-3 minutes over 4 weeks. Advanced: 10-15 minutes of cold water immersion (50-60°F). The discomfort is the point — learning to stay calm under stress directly trains your nervous system's response to performance pressure.`,
    readTimeMinutes: 6,
    isPremium: true,
    programWeek: 4,
  },
  {
    title: "Zone 2 Cardio: The Most Powerful ED Intervention",
    slug: "zone-2-cardio-ed-intervention",
    category: "treatments",
    summary: "Why sustained moderate-intensity cardio outperforms all other exercise types for erectile function.",
    content: `A 2018 meta-analysis in the Journal of Sexual Medicine analyzed 10 randomized controlled trials and found that aerobic exercise significantly improved erectile function — with effect sizes comparable to PDE5 inhibitors (Viagra/Cialis) for mild-to-moderate ED.\n\nZone 2 cardio (50-70% max heart rate) is the sweet spot. At this intensity, your body primarily uses fat for fuel and maximally stimulates mitochondrial biogenesis and endothelial nitric oxide synthase (eNOS) — the enzyme that produces nitric oxide.\n\nThe protocol: 150 minutes per week minimum. 4 sessions of 30-40 minutes. Brisk walking, cycling, swimming, or rowing. You should be able to hold a conversation but feel slightly breathless. Results appear within 8-12 weeks of consistent training.`,
    readTimeMinutes: 7,
    isPremium: true,
    programWeek: 4,
  },
  // Week 5 — Advanced Techniques
  {
    title: "Nitric Oxide: The Master Molecule of Erections",
    slug: "nitric-oxide-master-molecule",
    category: "science",
    summary: "Understanding the biochemistry of erections and how to naturally maximize nitric oxide production.",
    content: `Every erection begins with a single molecule: nitric oxide (NO). When you become sexually aroused, your nervous system releases NO into the smooth muscle cells of the corpus cavernosum. This triggers a cascade: NO activates guanylyl cyclase → cGMP is produced → smooth muscle relaxes → blood floods in → erection occurs.\n\nPDE5 inhibitors like Viagra work by blocking the enzyme that breaks down cGMP, prolonging the effect of whatever NO you produce. But the better strategy is to produce more NO in the first place.\n\nNatural NO boosters: L-arginine (3-6g/day) is a direct precursor to NO. L-citrulline (found in watermelon) converts to arginine more efficiently. Dietary nitrates from beets and leafy greens convert to NO via oral bacteria. Exercise, particularly Zone 2 cardio, upregulates eNOS enzyme activity. Sunlight exposure on skin produces NO directly.`,
    readTimeMinutes: 8,
    isPremium: true,
    programWeek: 5,
  },
  {
    title: "Advanced Kegel Techniques: Weeks 5-8",
    slug: "advanced-kegel-techniques-weeks-5-8",
    category: "treatments",
    summary: "Progressing your pelvic floor training with advanced protocols for maximum erectile improvement.",
    content: `By week 5, your pelvic floor should be significantly stronger. Now it's time to introduce advanced techniques that target the specific muscles involved in erection rigidity.\n\nThe Reverse Kegel: While standard Kegels contract the pelvic floor, reverse Kegels involve intentionally relaxing and bulging the pelvic floor downward. This is critical because many men with ED actually have hypertonic (overly tight) pelvic floors that restrict blood flow. Alternate 10 standard Kegels with 10 reverse Kegels.\n\nThe Elevator Technique: Imagine your pelvic floor as an elevator. Contract to floor 1 (25%), hold 3 seconds. Contract to floor 2 (50%), hold 3 seconds. Contract to floor 3 (75%), hold 3 seconds. Full contraction (100%), hold 5 seconds. Slowly descend through each floor.\n\nIsometric Integration: Perform Kegels during other exercises — squats, deadlifts, and hip thrusts all engage the pelvic floor synergistically.`,
    readTimeMinutes: 7,
    isPremium: true,
    programWeek: 5,
  },
  // Week 6 — Mindset & Psychology
  {
    title: "Mindfulness and Sexual Performance: The Research",
    slug: "mindfulness-sexual-performance-research",
    category: "mindset",
    summary: "How mindfulness practice rewires the brain's response to sexual stimuli and reduces performance anxiety.",
    content: `Performance anxiety is a cognitive phenomenon — it occurs when your prefrontal cortex (the thinking brain) overrides the limbic system (the feeling brain). Mindfulness practice directly addresses this by training you to observe thoughts without being controlled by them.\n\nA 2021 study in the Journal of Sex Research found that men who completed an 8-week mindfulness program showed significant improvements in erectile function, sexual satisfaction, and reduced performance anxiety.\n\nThe mechanism: Mindfulness strengthens the prefrontal-limbic connection, allowing you to notice anxious thoughts without automatically activating the stress response. This keeps the parasympathetic nervous system dominant — which is required for erection.\n\nThe 5-minute practice: Sit comfortably. Focus on physical sensations in your body. When thoughts arise (especially anxious ones about performance), simply label them "thinking" and return to body sensations. Practice daily, not just before intimacy.`,
    readTimeMinutes: 6,
    isPremium: true,
    programWeek: 6,
  },
  {
    title: "The Dopamine System and Sexual Motivation",
    slug: "dopamine-system-sexual-motivation",
    category: "science",
    summary: "How modern dopamine hijacking reduces sexual desire and what to do about it.",
    content: `Sexual desire begins in the brain, not the genitals. The mesolimbic dopamine system — the brain's reward circuit — is the neurological foundation of sexual motivation. When this system is dysregulated, desire and arousal suffer.\n\nThe modern problem: Pornography, social media, and processed food all deliver supranormal dopamine stimulation. Over time, this downregulates dopamine receptors, requiring more stimulation to feel the same reward. Real intimacy, which provides moderate dopamine stimulation, begins to feel less compelling.\n\nThe reset protocol: 30-day dopamine fast from pornography. Reduce social media to under 30 minutes/day. Increase novelty and challenge in daily life (exercise, learning, cold exposure). This allows dopamine receptor sensitivity to recover, restoring natural sexual motivation within 4-8 weeks.`,
    readTimeMinutes: 7,
    isPremium: true,
    programWeek: 6,
  },
  // Week 7 — Supplements & Optimization
  {
    title: "Evidence-Based Supplements for ED",
    slug: "evidence-based-supplements-ed",
    category: "nutrition",
    summary: "A critical review of supplements with actual clinical evidence for improving erectile function.",
    content: `The supplement industry is full of exaggerated claims. Here's what the evidence actually supports:\n\nStrong evidence: L-citrulline (3-6g/day) — a 2011 RCT found it improved erection hardness in men with mild ED. Panax Ginseng (900mg 3x/day) — multiple meta-analyses show significant improvement in erectile function. Pycnogenol (80-120mg/day) — French maritime pine bark extract, shown to increase nitric oxide production.\n\nModerate evidence: Ashwagandha (300-600mg/day) — reduces cortisol and improves testosterone in stressed men. Zinc (25-45mg/day if deficient) — critical for testosterone production. Magnesium glycinate (400mg/day) — improves sleep quality and reduces cortisol.\n\nWeak or no evidence: Most "testosterone boosters," DHEA (unless confirmed deficient), and most herbal blends. Always consult your physician before starting supplements, especially if taking medications.`,
    readTimeMinutes: 8,
    isPremium: true,
    programWeek: 7,
  },
  {
    title: "Alcohol, Smoking, and ED: The Definitive Guide",
    slug: "alcohol-smoking-ed-definitive-guide",
    category: "lifestyle",
    summary: "The specific mechanisms by which alcohol and smoking damage erectile function — and the timeline for recovery.",
    content: `Smoking is the single most modifiable risk factor for ED. Nicotine causes direct vasoconstriction and damages endothelial cells — the cells that produce nitric oxide. Smokers have a 51% higher risk of ED compared to non-smokers.\n\nThe good news: Endothelial function begins recovering within 2-4 weeks of quitting smoking. By 3 months, NO production is significantly improved. By 1 year, vascular function approaches that of non-smokers.\n\nAlcohol has a dose-dependent relationship with erectile function. 1-2 drinks: minimal acute effect. 3-4 drinks: measurable impairment in erectile response. Chronic heavy drinking: testosterone suppression, liver damage (which impairs testosterone metabolism), and peripheral neuropathy affecting penile sensation.\n\nThe RiseUp recommendation: Zero smoking. Alcohol limited to 1-2 drinks maximum, ideally 0 during the 90-day program.`,
    readTimeMinutes: 6,
    isPremium: true,
    programWeek: 7,
  },
  // Week 8 — Relationship & Communication
  {
    title: "Talking to Your Partner About ED",
    slug: "talking-to-partner-about-ed",
    category: "mindset",
    summary: "A practical guide to having the conversation that most men avoid — and why it's essential for recovery.",
    content: `One of the most powerful interventions for ED is also the most avoided: honest communication with your partner. The shame and secrecy around ED often creates more anxiety than the condition itself.\n\nWhy communication helps: When partners understand what's happening, they stop interpreting ED as lack of attraction or interest. This removes a major source of performance pressure. Partners can also adjust their behavior to reduce anxiety-inducing situations.\n\nHow to have the conversation: Choose a neutral, non-sexual moment. Use "I" statements: "I've been experiencing some difficulty with erections, and I'm working on it." Share what you're doing about it (the RiseUp program). Ask for patience and reassurance. Avoid making it a crisis — frame it as a health optimization you're actively addressing.\n\nResearch shows that couples who communicate openly about sexual challenges have significantly better outcomes than those who avoid the topic.`,
    readTimeMinutes: 6,
    isPremium: true,
    programWeek: 8,
  },
  {
    title: "Stress, Cortisol, and the Testosterone-Cortisol Seesaw",
    slug: "stress-cortisol-testosterone-seesaw",
    category: "science",
    summary: "How chronic stress directly suppresses testosterone and sexual function — and the evidence-based stress management protocol.",
    content: `Cortisol and testosterone have an inverse relationship. When cortisol is chronically elevated (due to work stress, poor sleep, overtraining, or psychological stress), testosterone production is suppressed at multiple levels: the hypothalamus reduces GnRH secretion, the pituitary reduces LH secretion, and the testes reduce testosterone synthesis.\n\nThe modern stress epidemic: Cortisol is designed for acute threats (predators, physical danger). Chronic psychological stress keeps cortisol elevated for days, weeks, or months — directly suppressing the hormonal foundation of sexual function.\n\nEvidence-based cortisol reduction: Zone 2 exercise (paradoxically, while acute exercise spikes cortisol, chronic moderate exercise reduces baseline cortisol). Ashwagandha (KSM-66 extract, 300mg twice daily) reduced cortisol by 27% in a 2012 RCT. Social connection — loneliness is one of the strongest cortisol elevators. Cold exposure — builds stress resilience through hormetic stress.`,
    readTimeMinutes: 7,
    isPremium: true,
    programWeek: 8,
  },
  // Week 9-10 — Advanced Program
  {
    title: "Weeks 9-10: Consolidating Your Gains",
    slug: "weeks-9-10-consolidating-gains",
    category: "treatments",
    summary: "How to assess your progress at the halfway point and adjust your protocol for maximum results in the final 6 weeks.",
    content: `By week 9, you've completed the foundational phase of the RiseUp program. Your pelvic floor is significantly stronger, your cardiovascular fitness has improved, and you've established the daily habits that drive long-term change.\n\nAssessing your progress: Compare your current performance score to your week 1 baseline. Most men see a 15-30 point improvement by week 9. If your improvement is less than 10 points, review the following: Sleep quality (are you consistently getting 7-9 hours?), Exercise consistency (have you completed 80%+ of sessions?), Alcohol intake (even moderate drinking significantly blunts progress).\n\nAdjusting the protocol: If making excellent progress, add a 4th weekly cardio session. If progress is slower than expected, prioritize sleep above all other interventions — it has the highest ROI. Consider consulting a urologist if you haven't already — a blood panel (testosterone, estradiol, prolactin, thyroid) can identify treatable underlying causes.`,
    readTimeMinutes: 7,
    isPremium: true,
    programWeek: 9,
  },
  {
    title: "Resistance Training for Testosterone Optimization",
    slug: "resistance-training-testosterone-optimization",
    category: "lifestyle",
    summary: "The specific resistance training protocols proven to maximize testosterone production and sexual health.",
    content: `Resistance training is one of the most potent natural testosterone boosters available. The key is training the right way.\n\nThe testosterone-maximizing protocol: Focus on compound movements (squats, deadlifts, bench press, rows). Train 3-4 days per week. Use moderate-to-heavy loads (70-85% of 1RM). Keep sessions to 45-60 minutes — beyond this, cortisol begins to dominate. Prioritize leg training — the legs contain the largest muscle groups and produce the greatest hormonal response.\n\nThe research: A 2012 study in the European Journal of Applied Physiology found that men who performed heavy compound resistance training had significantly higher testosterone levels than those who performed isolation exercises or cardio only.\n\nCritical note: Overtraining suppresses testosterone. More is not better. Two rest days per week are essential. Sleep is when testosterone is produced — training without adequate sleep is counterproductive.`,
    readTimeMinutes: 6,
    isPremium: true,
    programWeek: 10,
  },
  // Week 11-12 — Final Phase
  {
    title: "When to See a Doctor: Medical Treatments for ED",
    slug: "when-to-see-doctor-medical-treatments",
    category: "treatments",
    summary: "A clear guide to when lifestyle interventions are sufficient and when medical treatment should be considered.",
    content: `The RiseUp program addresses the lifestyle and psychological components of ED, which account for the majority of cases. However, there are situations where medical evaluation is important.\n\nSee a doctor if: ED developed suddenly (rather than gradually), you have cardiovascular risk factors (hypertension, diabetes, high cholesterol), you have no morning erections (suggests vascular or hormonal cause), you're under 40 with severe ED (may indicate underlying cardiovascular disease), or lifestyle interventions haven't produced improvement after 12 weeks.\n\nMedical options: PDE5 inhibitors (Viagra, Cialis, Levitra) — highly effective for most men, work by enhancing the effects of nitric oxide. Testosterone replacement therapy — only appropriate if testosterone is clinically low. Penile injections (alprostadil) — effective when oral medications fail. Vacuum erection devices — mechanical option with no systemic side effects. Penile implants — surgical option for severe, refractory ED.\n\nImportant: ED is often the first symptom of cardiovascular disease. A thorough cardiovascular workup is warranted for any man with persistent ED.`,
    readTimeMinutes: 8,
    isPremium: false,
    programWeek: 11,
  },
  {
    title: "The 90-Day Transformation: What to Expect",
    slug: "90-day-transformation-what-to-expect",
    category: "mindset",
    summary: "A realistic timeline of improvements and how to maintain your gains after completing the program.",
    content: `The RiseUp 90-day program is designed to produce measurable, lasting change. Here's what the research and clinical experience suggest you can expect:\n\nWeeks 1-3 (Foundation): Pelvic floor strength begins improving. Sleep quality often improves first. Reduced baseline anxiety. Performance scores may not change dramatically yet.\n\nWeeks 4-6 (Momentum): Noticeable improvement in morning erections. Increased libido and sexual motivation. Improved cardiovascular fitness. First measurable improvements in performance scores.\n\nWeeks 7-9 (Acceleration): Significant pelvic floor strength gains. Improved erection quality and duration. Reduced performance anxiety. Performance scores typically 15-25 points above baseline.\n\nWeeks 10-12 (Consolidation): Maximum gains from the program. Established habits that will maintain results long-term. Many men report returning to their 20s-level function.\n\nMaintaining your gains: The habits you've built — exercise, sleep, nutrition, stress management — are the medicine. Continuing them maintains your results indefinitely.`,
    readTimeMinutes: 7,
    isPremium: false,
    programWeek: 12,
  },
  {
    title: "Advanced Breathwork: Pranayama for Sexual Health",
    slug: "advanced-breathwork-pranayama-sexual-health",
    category: "treatments",
    summary: "Ancient breathing techniques validated by modern science for improving sexual function and reducing anxiety.",
    content: `Pranayama — the yogic science of breath control — has been practiced for thousands of years to regulate the nervous system. Modern neuroscience is now explaining exactly why these techniques work.\n\nThe physiological mechanism: Breathing is the only autonomic function you can consciously control. By deliberately slowing and deepening your breath, you directly stimulate the vagus nerve, activating the parasympathetic nervous system. This is the state required for sexual arousal and erection.\n\nThe Bhramari (Humming Bee) Breath: Inhale deeply. On the exhale, make a humming sound with mouth closed. The vibration stimulates the vagus nerve and produces nitric oxide in the sinuses, which is absorbed into the bloodstream. Practice 10 rounds before intimate activity.\n\nAlternate Nostril Breathing (Nadi Shodhana): Close right nostril, inhale left. Close left, exhale right. Inhale right. Close right, exhale left. This balances the sympathetic and parasympathetic nervous systems and has been shown to reduce cortisol and improve heart rate variability.`,
    readTimeMinutes: 7,
    isPremium: true,
    programWeek: 9,
  },
  {
    title: "Heart Rate Variability: Your Body's Performance Indicator",
    slug: "heart-rate-variability-performance-indicator",
    category: "science",
    summary: "How HRV predicts sexual performance, recovery, and overall health — and how to improve it.",
    content: `Heart rate variability (HRV) — the variation in time between heartbeats — is one of the most powerful biomarkers of autonomic nervous system health. High HRV indicates a well-functioning parasympathetic system; low HRV indicates chronic stress and sympathetic dominance.\n\nThe ED connection: Multiple studies have found that men with ED have significantly lower HRV than men without ED. This makes physiological sense — both erection and high HRV require parasympathetic dominance.\n\nMeasuring HRV: Use a chest strap (Polar H10) or wrist device (Apple Watch, Garmin, WHOOP) with an HRV app. Measure first thing in the morning before getting out of bed for the most accurate reading.\n\nImproving HRV: The same interventions that improve erectile function improve HRV: Zone 2 cardio, cold exposure, breathwork, sleep optimization, and stress reduction. HRV improvement typically precedes improvements in erectile function by 2-4 weeks — making it an excellent early indicator of program effectiveness.`,
    readTimeMinutes: 7,
    isPremium: true,
    programWeek: 10,
  },
  {
    title: "Gut Health and Sexual Performance",
    slug: "gut-health-sexual-performance",
    category: "nutrition",
    summary: "The surprising connection between your microbiome, testosterone, and erectile function.",
    content: `The gut-hormone axis is an emerging area of research with significant implications for male sexual health. Your gut microbiome produces and metabolizes hormones, including testosterone and estrogen.\n\nThe testosterone connection: Certain gut bacteria produce enzymes that convert testosterone precursors into active testosterone. Dysbiosis (imbalanced gut bacteria) can impair this conversion. Additionally, gut inflammation increases systemic inflammation, which directly suppresses testosterone production.\n\nThe estrogen connection: The gut microbiome (specifically the "estrobolome") regulates estrogen metabolism. Poor gut health can lead to estrogen accumulation, which suppresses testosterone.\n\nOptimizing gut health for sexual performance: Eat 30+ different plant foods per week (diversity drives microbiome diversity). Include fermented foods daily (yogurt, kefir, kimchi, sauerkraut). Minimize ultra-processed foods and artificial sweeteners. Consider a high-quality probiotic with Lactobacillus and Bifidobacterium strains. Fiber is the food your gut bacteria need — aim for 35-40g per day.`,
    readTimeMinutes: 6,
    isPremium: true,
    programWeek: 11,
  },
  {
    title: "Building Your Lifelong Performance Protocol",
    slug: "lifelong-performance-protocol",
    category: "lifestyle",
    summary: "How to maintain and continue improving your sexual health beyond the 90-day program.",
    content: `Completing the RiseUp 90-day program is not an endpoint — it's the beginning of a sustainable lifestyle that supports peak sexual health for decades.\n\nThe minimum effective dose for maintenance: 150 minutes of Zone 2 cardio per week. 3 sets of Kegel exercises daily (takes 5 minutes). 7-9 hours of sleep consistently. Alcohol limited to 1-2 drinks maximum. Daily stress management practice (breathwork, meditation, or cold exposure).\n\nContinuing to improve: After 90 days, most men benefit from adding resistance training 3x/week. Advanced breathwork practices (pranayama, Wim Hof method). Annual blood panels to monitor testosterone, metabolic markers, and cardiovascular health.\n\nThe mindset shift: Sexual health is not separate from overall health — it's a reflection of it. Every investment in your cardiovascular fitness, sleep, nutrition, and stress management pays dividends in sexual function. The men who maintain their results are those who internalize this connection and make these habits non-negotiable.`,
    readTimeMinutes: 7,
    isPremium: false,
    programWeek: 12,
  },
];

export async function seedExpandedArticles(db: DB) {
  // Check current article count
  const result = await db.select({ total: count() }).from(articles);
  const currentCount = result[0]?.total ?? 0;

  if (currentCount >= 20) {
    console.log(`[Seed] Already have ${currentCount} articles, skipping expanded seed`);
    return;
  }

  console.log(`[Seed] Adding ${NEW_ARTICLES.length} expanded articles...`);
  await db.insert(articles).values(NEW_ARTICLES);
  console.log(`[Seed] Expanded articles seeded successfully`);
}
