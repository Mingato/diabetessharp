/**
 * Diabetes education topics: short lessons and tips for the Education section.
 */
export type DiabetesTopic = {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  category: string;
  tips: string[];
};

export const DIABETES_EDUCATION: DiabetesTopic[] = [
  {
    id: "carbs_basics",
    name: "Understanding carbs",
    description: "Learn how different carbs affect your blood sugar and how to choose better options. Not all carbs are equal — fiber and portion size matter.",
    durationMinutes: 5,
    category: "nutrition",
    tips: ["Pair carbs with protein or healthy fat to slow the spike.", "Prefer whole grains and legumes over refined flour.", "Check labels for total carbs and fiber."],
  },
  {
    id: "glucose_check",
    name: "When and how to check glucose",
    description: "When to test (fasting, before/after meals), how to log results, and what to do with the numbers. Simple patterns that help you and your doctor.",
    durationMinutes: 4,
    category: "monitoring",
    tips: ["Wash hands and dry well for an accurate reading.", "Log in the app with the time and what you ate.", "Share your log with your care team at visits."],
  },
  {
    id: "portion_control",
    name: "Portion control without counting",
    description: "Visual guides: plate method, hand portions, and balanced meals. No scale needed — practical ways to keep portions in check.",
    durationMinutes: 5,
    category: "nutrition",
    tips: ["Half the plate non-starchy veggies, quarter protein, quarter carbs.", "Use your palm for protein, fist for carbs.", "Eat slowly and stop when comfortably full."],
  },
  {
    id: "medication_timing",
    name: "Medication and meal timing",
    description: "Why timing matters for pills and insulin. When to take meds with or without food, and how to avoid hypos when you're active.",
    durationMinutes: 5,
    category: "treatment",
    tips: ["Set a daily alarm for your main meds.", "If you miss a dose, check the leaflet or ask your pharmacist.", "Never skip or double without your doctor's say-so."],
  },
  {
    id: "stress_sleep",
    name: "Stress and sleep and blood sugar",
    description: "How stress and poor sleep can raise glucose and make management harder. Simple habits that help: sleep routine, short walks, breathing.",
    durationMinutes: 6,
    category: "lifestyle",
    tips: ["Aim for 7–8 hours of sleep on most nights.", "Short walks after meals can help lower post-meal spikes.", "Try 5 minutes of deep breathing when stressed."],
  },
  {
    id: "snacks",
    name: "Diabetes-friendly snacks",
    description: "Snack ideas that won't send your sugar soaring: protein + fiber, small portions, and what to avoid. Quick list you can use every day.",
    durationMinutes: 4,
    category: "nutrition",
    tips: ["Nuts, cheese, veggie sticks with hummus.", "Small apple with peanut butter.", "Plain yogurt with berries."],
  },
];
