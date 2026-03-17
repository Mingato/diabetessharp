/**
 * Tip of the day — one tip per day (rotates by day of year) to bring users back daily.
 */
const TIPS: string[] = [
  "Drink a glass of water before meals to help with portion control and blood sugar.",
  "A 10-minute walk after lunch can lower your post-meal glucose.",
  "Check your feet daily. Small cuts can become serious if you have diabetes.",
  "Pair carbs with protein or healthy fat to slow the rise in blood sugar.",
  "Write down one thing you're grateful for today — stress affects glucose too.",
  "Fiber-rich vegetables first, then protein, then carbs — order can help your numbers.",
  "Set one small goal today: e.g. one extra vegetable or one walk.",
  "Sleep matters: poor sleep can raise blood sugar. Aim for 7–8 hours.",
  "Stay hydrated. Sometimes thirst feels like hunger and can affect readings.",
  "If you missed a medication dose, don't double up — follow your doctor's plan.",
  "Whole fruits are better than juice: more fiber, less spike.",
  "Take your meter to your next appointment so your doctor sees your log.",
  "Label your carbs: 'slow' (beans, oats) vs 'fast' (white bread) — choose slow more often.",
  "A handful of nuts as a snack can help keep blood sugar stable.",
  "Brush your teeth and floss. Gum disease is more common with diabetes.",
  "Plan tomorrow's breakfast tonight so you start the day on track.",
  "Ask a family member to learn the signs of low blood sugar — they can help in an emergency.",
  "Celebrate small wins. One good day leads to more.",
  "If you're stressed, try 4–7–8 breathing: inhale 4, hold 7, exhale 8.",
  "Read one nutrition label today and check total carbs and fiber.",
  "Eat at regular times when you can — routine helps your body.",
  "Keep fast-acting sugar (juice, glucose tabs) where you can reach it at home.",
  "Write one question for your doctor before your next visit.",
  "Swap one sugary drink for water or unsweetened tea today.",
  "Stand or walk for 2 minutes every hour — it helps glucose after meals.",
  "Track how you feel when you wake up — sleep and stress affect the next day.",
  "Add a non-starchy vegetable to lunch: greens, broccoli, peppers.",
  "If you use insulin, always have a backup plan (extra supplies, snacks).",
  "Share your goals with someone you trust — accountability helps.",
  "One healthy swap today: e.g. brown rice instead of white, or an apple instead of cookies.",
  "Remind yourself: you're not perfect, and that's okay. Progress over perfection.",
  "Prepare a 'low blood sugar' kit: juice, glucose tabs, glucagon if prescribed.",
  "Eat mindfully: put the fork down between bites.",
  "Check the forecast — heat and cold can affect meters and insulin.",
  "Today's focus: one thing you can do to feel more in control.",
  "Portion your plate: half non-starchy veggies, quarter protein, quarter carbs.",
  "If you haven't moved much today, a short walk still counts.",
  "Keep a small notebook or use the app — logging helps you see patterns.",
  "Ask your pharmacist about medication timing with meals.",
  "Choose one new recipe from the app to try this week.",
  "Stay consistent with meal times when possible — it helps medication work better.",
  "Notice when you're hungry vs bored — pause before snacking.",
  "Wear comfortable shoes and check your feet every night.",
  "Plan your next grocery list around vegetables and proteins first.",
  "One positive thing about your routine this week — write it down.",
  "If you travel, pack extra meds and snacks in carry-on.",
  "Today: drink one more glass of water than usual.",
  "Remind yourself why you're managing your diabetes — your 'why' matters.",
  "Share a diabetes-friendly meal with someone you care about.",
  "Rest when you need it — recovery is part of the journey.",
  "You showed up today. That's what counts.",
  "Small steps add up. What's one small step you'll take tomorrow?",
];

/** Returns the tip for today (same tip all day, changes daily by day-of-year) */
export function getTipOfTheDay(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (24 * 60 * 60 * 1000));
  const index = dayOfYear % TIPS.length;
  return TIPS[index];
}
