import type { MealType } from "./memoryRecipes";

export const CHECKLIST_BY_MEAL: { meal: MealType; label: string; items: { id: string; name: string; benefit: string }[] }[] = [
  {
    meal: "breakfast",
    label: "Breakfast",
    items: [
      { id: "b1", name: "Oatmeal or whole grains", benefit: "Slow-release energy, B vitamins" },
      { id: "b2", name: "Berries (blueberries, strawberries)", benefit: "Antioxidants, flavonoids" },
      { id: "b3", name: "Eggs", benefit: "Choline for memory" },
      { id: "b4", name: "Walnuts or almonds", benefit: "Omega-3, vitamin E" },
      { id: "b5", name: "Greek yogurt", benefit: "Protein, probiotics" },
      { id: "b6", name: "Avocado", benefit: "Healthy fats, vitamin E" },
      { id: "b7", name: "Green tea", benefit: "EGCG, L-theanine" },
      { id: "b8", name: "Leafy greens (spinach, kale)", benefit: "Folate, vitamin K" },
    ],
  },
  {
    meal: "lunch",
    label: "Lunch",
    items: [
      { id: "l1", name: "Leafy greens (kale, spinach, arugula)", benefit: "Folate, vitamin K" },
      { id: "l2", name: "Fatty fish (salmon, sardines)", benefit: "Omega-3 DHA" },
      { id: "l3", name: "Broccoli or cruciferous veggies", benefit: "Vitamin K, sulforaphane" },
      { id: "l4", name: "Quinoa or whole grains", benefit: "B vitamins, fiber" },
      { id: "l5", name: "Olive oil (in dressing)", benefit: "Monounsaturated fats" },
      { id: "l6", name: "Nuts or seeds", benefit: "Vitamin E, omega-3" },
      { id: "l7", name: "Legumes (lentils, chickpeas)", benefit: "Fiber, plant protein" },
      { id: "l8", name: "Tomatoes", benefit: "Lycopene, vitamin C" },
    ],
  },
  {
    meal: "dinner",
    label: "Dinner",
    items: [
      { id: "d1", name: "Salmon, trout, or mackerel", benefit: "Omega-3 for brain cells" },
      { id: "d2", name: "Dark leafy greens", benefit: "Folate, vitamin K" },
      { id: "d3", name: "Turmeric (in dishes)", benefit: "Curcumin, anti-inflammatory" },
      { id: "d4", name: "Olive oil", benefit: "Healthy fats" },
      { id: "d5", name: "Vegetables (broccoli, peppers)", benefit: "Antioxidants" },
      { id: "d6", name: "Legumes or beans", benefit: "Fiber, magnesium" },
      { id: "d7", name: "Garlic", benefit: "Allicin, circulation" },
      { id: "d8", name: "Sweet potato or squash", benefit: "Beta-carotene, fiber" },
    ],
  },
  {
    meal: "snack",
    label: "Snacks",
    items: [
      { id: "s1", name: "Handful of walnuts or almonds", benefit: "Omega-3, vitamin E" },
      { id: "s2", name: "Blueberries or berries", benefit: "Antioxidants" },
      { id: "s3", name: "Dark chocolate (70%+)", benefit: "Flavonoids" },
      { id: "s4", name: "Apple with nut butter", benefit: "Fiber, healthy fats" },
      { id: "s5", name: "Green tea", benefit: "EGCG, focus" },
      { id: "s6", name: "Hummus with veggie sticks", benefit: "Protein, fiber" },
      { id: "s7", name: "Pumpkin seeds", benefit: "Zinc, magnesium" },
      { id: "s8", name: "Plain Greek yogurt", benefit: "Protein, probiotics" },
    ],
  },
];
