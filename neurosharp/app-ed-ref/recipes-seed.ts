export const PERFORMANCE_RECIPES = [
  {
    name: "Testosterone Boost Smoothie",
    category: "smoothie" as const,
    description: "A powerful morning smoothie packed with zinc, vitamin D, and adaptogens to naturally support testosterone production.",
    prepTimeMinutes: 5,
    calories: 380,
    protein: 28,
    carbs: 42,
    fat: 12,
    performanceScore: 95,
    programWeek: 1,
    tags: JSON.stringify(["testosterone", "morning", "quick", "beginner"]),
    ingredients: JSON.stringify([
      "1 cup whole milk or oat milk",
      "1 scoop whey protein (vanilla)",
      "1 banana (frozen)",
      "2 tbsp pumpkin seeds",
      "1 tbsp honey",
      "1/2 tsp ashwagandha powder",
      "1/4 tsp cinnamon",
      "5 ice cubes"
    ]),
    instructions: JSON.stringify([
      "Add all ingredients to a blender",
      "Blend on high for 60 seconds until smooth",
      "Pour into a large glass and drink immediately",
      "Best consumed within 30 minutes of waking"
    ]),
    ingredientBenefits: JSON.stringify({
      "pumpkin seeds": "Rich in zinc — the #1 mineral for testosterone synthesis. Just 2 tbsp provides 20% of your daily zinc needs.",
      "ashwagandha powder": "Clinical studies show ashwagandha increases testosterone by 15-17% and reduces cortisol (the testosterone killer) by 27%.",
      "banana": "Contains bromelain enzyme that boosts testosterone, plus potassium for heart health and blood flow.",
      "whey protein": "Provides leucine and BCAAs that stimulate muscle protein synthesis and support healthy hormone levels.",
      "cinnamon": "Improves insulin sensitivity, which directly supports testosterone production and reduces fat storage.",
      "honey": "Contains boron, a trace mineral that can increase free testosterone by up to 29% in studies."
    }),
  },
  {
    name: "Nitric Oxide Power Bowl",
    category: "lunch" as const,
    description: "A beet and arugula bowl that maximizes nitric oxide production for improved blood flow and stronger erections.",
    prepTimeMinutes: 15,
    calories: 520,
    protein: 35,
    carbs: 48,
    fat: 18,
    performanceScore: 92,
    programWeek: 1,
    tags: JSON.stringify(["nitric oxide", "blood flow", "erection quality", "lunch"]),
    ingredients: JSON.stringify([
      "150g grilled chicken breast",
      "2 medium beets (roasted or canned)",
      "2 cups arugula",
      "1/2 cup pomegranate seeds",
      "2 tbsp olive oil",
      "1 tbsp balsamic vinegar",
      "30g walnuts",
      "Salt and pepper to taste"
    ]),
    instructions: JSON.stringify([
      "Slice roasted beets into wedges",
      "Arrange arugula as base in a bowl",
      "Add beets, pomegranate seeds, and walnuts",
      "Top with sliced grilled chicken",
      "Drizzle with olive oil and balsamic",
      "Season with salt and pepper"
    ]),
    ingredientBenefits: JSON.stringify({
      "beets": "Highest dietary source of nitrates, which convert to nitric oxide in the body. NO relaxes blood vessels, improving blood flow to the penis by up to 40%.",
      "arugula": "Contains natural nitrates and erucic acid that boost nitric oxide production. Ancient Romans called it 'rocket' for its aphrodisiac properties.",
      "pomegranate seeds": "Pomegranate juice has been shown to increase testosterone by 24% and improve erectile function. Rich in antioxidants that protect blood vessels.",
      "walnuts": "Rich in L-arginine, the direct precursor to nitric oxide. Also contains omega-3s that reduce inflammation and improve cardiovascular health.",
      "olive oil": "Monounsaturated fats support testosterone production. Mediterranean diet studies show 19% higher testosterone in men who consume olive oil regularly.",
      "chicken breast": "High-quality protein with all essential amino acids. Lean protein supports muscle mass and healthy testosterone levels."
    }),
  },
  {
    name: "Oyster & Garlic Pasta",
    category: "dinner" as const,
    description: "The ultimate testosterone dinner — oysters are nature's most potent zinc source, paired with garlic for cardiovascular health.",
    prepTimeMinutes: 25,
    calories: 680,
    protein: 42,
    carbs: 65,
    fat: 22,
    performanceScore: 98,
    programWeek: 2,
    tags: JSON.stringify(["zinc", "testosterone", "dinner", "libido", "advanced"]),
    ingredients: JSON.stringify([
      "200g whole wheat pasta",
      "12 fresh oysters (or 1 can smoked oysters)",
      "6 cloves garlic, minced",
      "3 tbsp olive oil",
      "1/2 cup white wine",
      "Juice of 1 lemon",
      "Fresh parsley",
      "Red pepper flakes",
      "Parmesan cheese"
    ]),
    instructions: JSON.stringify([
      "Cook pasta al dente according to package instructions",
      "Heat olive oil in a large pan over medium heat",
      "Sauté garlic and red pepper flakes for 2 minutes",
      "Add white wine and reduce by half",
      "Add oysters and cook for 3-4 minutes",
      "Toss with pasta, lemon juice, and parsley",
      "Finish with parmesan and serve immediately"
    ]),
    ingredientBenefits: JSON.stringify({
      "oysters": "Contain more zinc per serving than any other food — 6 oysters provide 500% of your daily zinc needs. Zinc is essential for testosterone production and sperm quality. Oysters also contain D-aspartic acid, an amino acid that stimulates testosterone release.",
      "garlic": "Contains allicin which reduces cortisol levels, allowing testosterone to function more effectively. Studies show garlic supplementation increases testosterone in men on high-protein diets.",
      "olive oil": "Supports Leydig cell function in the testes, which are responsible for testosterone production.",
      "whole wheat pasta": "Complex carbohydrates provide sustained energy and support healthy insulin levels, which is crucial for testosterone production.",
      "lemon": "Vitamin C reduces cortisol and protects testosterone-producing cells from oxidative stress.",
      "parsley": "Contains apigenin, a flavonoid that stimulates testosterone production in testicular cells."
    }),
  },
  {
    name: "Morning Wood Oatmeal",
    category: "breakfast" as const,
    description: "A hearty breakfast designed to boost morning testosterone levels and provide sustained energy for your daily program.",
    prepTimeMinutes: 10,
    calories: 450,
    protein: 22,
    carbs: 58,
    fat: 16,
    performanceScore: 88,
    programWeek: 1,
    tags: JSON.stringify(["breakfast", "testosterone", "energy", "daily"]),
    ingredients: JSON.stringify([
      "1 cup rolled oats",
      "2 cups whole milk",
      "1 tbsp almond butter",
      "1 tbsp flaxseeds (ground)",
      "1/2 cup blueberries",
      "1 tbsp dark honey",
      "1/4 tsp turmeric",
      "Pinch of black pepper"
    ]),
    instructions: JSON.stringify([
      "Cook oats in whole milk over medium heat for 5 minutes",
      "Stir in almond butter and ground flaxseeds",
      "Add turmeric and black pepper (pepper activates turmeric)",
      "Top with blueberries and drizzle with honey",
      "Let cool slightly before eating"
    ]),
    ingredientBenefits: JSON.stringify({
      "oats": "Contain avenacosides that free up bound testosterone, making more bioavailable testosterone available. Also provide beta-glucan for heart health.",
      "flaxseeds": "Rich in lignans that balance estrogen levels, and omega-3 fatty acids that reduce inflammation. Ground flaxseeds are 3x more bioavailable than whole.",
      "blueberries": "Pterostilbene in blueberries has been shown to increase testosterone by reducing aromatase (the enzyme that converts testosterone to estrogen).",
      "turmeric": "Curcumin reduces inflammation and has been shown to increase testosterone by 257% in animal studies. Black pepper increases absorption by 2000%.",
      "almond butter": "Rich in vitamin E, which protects testosterone-producing cells from oxidative damage. Also provides healthy monounsaturated fats.",
      "whole milk": "Contains saturated fats necessary for testosterone synthesis. Full-fat dairy is associated with higher testosterone than low-fat alternatives."
    }),
  },
  {
    name: "Salmon & Avocado Power Plate",
    category: "dinner" as const,
    description: "Omega-3 rich salmon with avocado — the perfect combination for cardiovascular health, testosterone, and anti-inflammation.",
    prepTimeMinutes: 20,
    calories: 620,
    protein: 48,
    carbs: 22,
    fat: 38,
    performanceScore: 96,
    programWeek: 1,
    tags: JSON.stringify(["omega-3", "testosterone", "heart health", "anti-inflammatory"]),
    ingredients: JSON.stringify([
      "200g wild salmon fillet",
      "1 ripe avocado",
      "1 cup quinoa (cooked)",
      "2 cups spinach",
      "1 lemon",
      "2 tbsp olive oil",
      "1 tsp garlic powder",
      "Fresh dill",
      "Salt and pepper"
    ]),
    instructions: JSON.stringify([
      "Season salmon with garlic powder, salt, pepper, and dill",
      "Pan-sear salmon in olive oil for 4 minutes each side",
      "Wilt spinach in the same pan for 1 minute",
      "Slice avocado and arrange with quinoa",
      "Plate salmon over spinach and quinoa",
      "Top with avocado and squeeze lemon over everything"
    ]),
    ingredientBenefits: JSON.stringify({
      "salmon": "Highest source of omega-3 fatty acids (EPA/DHA) which reduce inflammation that blocks testosterone receptors. Also rich in vitamin D — men with optimal vitamin D have 90% higher testosterone.",
      "avocado": "Contains healthy monounsaturated fats that are the building blocks of testosterone. Also rich in boron which increases free testosterone and reduces SHBG (sex hormone binding globulin).",
      "spinach": "High in magnesium, which is directly correlated with testosterone levels. Men with higher magnesium intake have significantly higher testosterone.",
      "quinoa": "Complete protein with all 9 essential amino acids. Provides zinc and magnesium for testosterone support.",
      "olive oil": "Oleic acid in olive oil supports Leydig cell function — these are the cells in your testes that produce testosterone.",
      "lemon": "Vitamin C is a powerful antioxidant that protects testosterone from oxidative stress and reduces cortisol."
    }),
  },
  {
    name: "Brazil Nut & Dark Chocolate Snack",
    category: "snack" as const,
    description: "The ultimate performance snack — just 3 Brazil nuts provide your entire daily selenium needs for testosterone production.",
    prepTimeMinutes: 2,
    calories: 280,
    protein: 6,
    carbs: 18,
    fat: 22,
    performanceScore: 90,
    programWeek: 1,
    tags: JSON.stringify(["selenium", "testosterone", "quick snack", "daily"]),
    ingredients: JSON.stringify([
      "3 Brazil nuts",
      "30g dark chocolate (85%+ cacao)",
      "1 tbsp almond butter",
      "Optional: pinch of sea salt"
    ]),
    instructions: JSON.stringify([
      "Eat Brazil nuts first (do not exceed 4 per day)",
      "Pair with dark chocolate squares",
      "Dip chocolate in almond butter if desired",
      "Best consumed mid-afternoon to maintain energy"
    ]),
    ingredientBenefits: JSON.stringify({
      "Brazil nuts": "The richest dietary source of selenium — just 3 nuts provide 300% of your daily needs. Selenium is essential for testosterone production and sperm motility. Selenium deficiency is directly linked to low testosterone.",
      "dark chocolate": "Contains phenylethylamine (the 'love chemical') and flavanols that improve blood flow. Studies show dark chocolate increases nitric oxide production by 21%. Also contains magnesium and zinc.",
      "almond butter": "Rich in vitamin E and L-arginine. L-arginine is the direct precursor to nitric oxide, which is essential for achieving and maintaining erections."
    }),
  },
  {
    name: "Garlic Egg Scramble",
    category: "breakfast" as const,
    description: "Whole eggs are one of the most complete testosterone foods — the yolk contains cholesterol, the direct precursor to testosterone.",
    prepTimeMinutes: 8,
    calories: 420,
    protein: 30,
    carbs: 12,
    fat: 28,
    performanceScore: 91,
    programWeek: 1,
    tags: JSON.stringify(["testosterone", "cholesterol", "breakfast", "quick"]),
    ingredients: JSON.stringify([
      "3 whole eggs (not just whites!)",
      "3 cloves garlic, minced",
      "1 cup spinach",
      "1/4 cup cherry tomatoes",
      "1 tbsp butter",
      "Fresh herbs (chives, parsley)",
      "Salt and pepper"
    ]),
    instructions: JSON.stringify([
      "Melt butter in a pan over medium-low heat",
      "Sauté garlic for 1 minute until fragrant",
      "Add spinach and tomatoes, cook 2 minutes",
      "Whisk eggs and pour over vegetables",
      "Gently scramble with a spatula until just set",
      "Top with fresh herbs and serve immediately"
    ]),
    ingredientBenefits: JSON.stringify({
      "whole eggs": "The yolk contains cholesterol — the direct molecular precursor to testosterone. Men who eat whole eggs have significantly higher testosterone than those who eat only whites. Also rich in vitamin D, zinc, and B vitamins.",
      "garlic": "Allicin in garlic inhibits cortisol production in the adrenal glands. Since cortisol and testosterone compete for the same precursor (pregnenolone), lower cortisol = higher testosterone.",
      "spinach": "Ecdysterone in spinach has anabolic properties similar to steroids but without side effects. Rich in magnesium which is directly correlated with free testosterone levels.",
      "butter": "Saturated fat from butter provides the raw material for testosterone synthesis. Low-fat diets are consistently associated with lower testosterone.",
      "tomatoes": "Lycopene in tomatoes protects prostate health and reduces oxidative stress that can impair testosterone production."
    }),
  },
  {
    name: "Pomegranate & Ginger Recovery Smoothie",
    category: "smoothie" as const,
    description: "Post-workout recovery smoothie that reduces inflammation, boosts testosterone, and accelerates muscle recovery.",
    prepTimeMinutes: 5,
    calories: 320,
    protein: 20,
    carbs: 48,
    fat: 6,
    performanceScore: 87,
    programWeek: 2,
    tags: JSON.stringify(["recovery", "anti-inflammatory", "post-workout", "testosterone"]),
    ingredients: JSON.stringify([
      "1 cup pomegranate juice (100% pure)",
      "1 scoop vanilla protein powder",
      "1 inch fresh ginger",
      "1/2 cup frozen tart cherries",
      "1 tbsp honey",
      "1/2 cup water",
      "Ice cubes"
    ]),
    instructions: JSON.stringify([
      "Peel and roughly chop fresh ginger",
      "Add all ingredients to blender",
      "Blend until smooth, about 45 seconds",
      "Drink within 30 minutes post-workout for best results"
    ]),
    ingredientBenefits: JSON.stringify({
      "pomegranate juice": "A 2012 study found that drinking pomegranate juice daily for 2 weeks increased testosterone by 24% and improved mood and self-confidence. Rich in ellagic acid which inhibits aromatase.",
      "ginger": "Clinical trials show ginger supplementation increases testosterone by 17.7% and improves sperm quality. Reduces oxidative stress in the testes.",
      "tart cherries": "Contain melatonin which improves sleep quality. Since 95% of testosterone is produced during deep sleep, better sleep = more testosterone.",
      "protein powder": "Post-workout protein synthesis window. Leucine in whey protein directly stimulates testosterone production in muscle cells."
    }),
  },
  {
    name: "Mediterranean Lamb Bowl",
    category: "dinner" as const,
    description: "Red meat is one of the most testosterone-supportive foods — lamb is especially rich in zinc, iron, and saturated fats.",
    prepTimeMinutes: 30,
    calories: 720,
    protein: 52,
    carbs: 38,
    fat: 35,
    performanceScore: 94,
    programWeek: 3,
    tags: JSON.stringify(["red meat", "zinc", "testosterone", "dinner", "advanced"]),
    ingredients: JSON.stringify([
      "200g lamb leg (cubed)",
      "1 cup brown rice",
      "1/2 cup hummus",
      "1 cup cucumber, diced",
      "1 cup cherry tomatoes",
      "Fresh mint and parsley",
      "2 tbsp olive oil",
      "1 tsp cumin",
      "1 tsp paprika",
      "Lemon juice"
    ]),
    instructions: JSON.stringify([
      "Marinate lamb in olive oil, cumin, paprika, and lemon for 15 min",
      "Cook brown rice according to package instructions",
      "Sear lamb in a hot pan for 3-4 minutes per side",
      "Let rest for 5 minutes before slicing",
      "Assemble bowl: rice base, lamb, hummus, cucumber, tomatoes",
      "Top with fresh herbs and lemon juice"
    ]),
    ingredientBenefits: JSON.stringify({
      "lamb": "One of the richest sources of zinc and heme iron. Zinc is the most important mineral for testosterone production. Lamb also contains conjugated linoleic acid (CLA) which supports lean muscle mass.",
      "hummus": "Chickpeas contain zinc and manganese. The tahini (sesame paste) in hummus is rich in zinc and healthy fats that support testosterone.",
      "brown rice": "Complex carbohydrates support insulin sensitivity. Insulin resistance is one of the leading causes of low testosterone.",
      "cucumber": "Contains cucurbitacins which inhibit aromatase, reducing the conversion of testosterone to estrogen.",
      "cumin": "Contains luteolin, a flavonoid that inhibits aromatase and increases testosterone bioavailability.",
      "olive oil": "Oleocanthal in olive oil has anti-inflammatory properties that protect testosterone-producing cells."
    }),
  },
  {
    name: "Maca & Cacao Energy Balls",
    category: "snack" as const,
    description: "No-bake energy balls with maca root — the Peruvian superfood used for centuries to boost libido and sexual performance.",
    prepTimeMinutes: 15,
    calories: 180,
    protein: 5,
    carbs: 22,
    fat: 9,
    performanceScore: 85,
    programWeek: 2,
    tags: JSON.stringify(["maca", "libido", "energy", "snack", "no-bake"]),
    ingredients: JSON.stringify([
      "1 cup Medjool dates (pitted)",
      "1/2 cup rolled oats",
      "2 tbsp maca powder",
      "2 tbsp raw cacao powder",
      "2 tbsp almond butter",
      "1 tbsp chia seeds",
      "Pinch of sea salt",
      "Desiccated coconut for rolling"
    ]),
    instructions: JSON.stringify([
      "Blend dates in food processor until paste forms",
      "Add oats, maca, cacao, almond butter, chia seeds, and salt",
      "Pulse until mixture comes together",
      "Roll into 12 balls (about 1 tbsp each)",
      "Roll in desiccated coconut",
      "Refrigerate for 30 minutes before eating",
      "Store in fridge for up to 1 week"
    ]),
    ingredientBenefits: JSON.stringify({
      "maca powder": "Peruvian adaptogen with 40+ years of research. Increases libido in 42% of men within 8 weeks. Improves sperm count, motility, and volume. Does not directly affect testosterone but improves sexual desire through different pathways.",
      "raw cacao": "Contains phenylethylamine (PEA) — the same chemical released during sexual arousal. Also rich in magnesium and flavanols that improve blood flow.",
      "chia seeds": "Rich in omega-3 fatty acids and zinc. Omega-3s reduce inflammation that can impair testosterone receptor sensitivity.",
      "dates": "Natural sugars provide quick energy. Rich in boron which increases free testosterone. Also contain estrone, a natural estrogen that paradoxically helps balance hormones.",
      "almond butter": "Vitamin E content protects sperm from oxidative damage. L-arginine supports nitric oxide production for improved blood flow."
    }),
  },
  {
    name: "Ashwagandha Golden Milk",
    category: "supplement" as const,
    description: "An ancient Ayurvedic evening drink that reduces cortisol, improves sleep quality, and supports testosterone production overnight.",
    prepTimeMinutes: 5,
    calories: 180,
    protein: 8,
    carbs: 18,
    fat: 8,
    performanceScore: 93,
    programWeek: 1,
    tags: JSON.stringify(["ashwagandha", "sleep", "cortisol", "evening", "daily"]),
    ingredients: JSON.stringify([
      "1 cup whole milk (or oat milk)",
      "1 tsp ashwagandha powder",
      "1 tsp turmeric",
      "1/2 tsp cinnamon",
      "1/4 tsp ginger powder",
      "1 tbsp honey",
      "Pinch of black pepper",
      "Optional: 1/4 tsp cardamom"
    ]),
    instructions: JSON.stringify([
      "Heat milk in a small saucepan over medium heat",
      "Whisk in ashwagandha, turmeric, cinnamon, and ginger",
      "Add black pepper (crucial for turmeric absorption)",
      "Heat until steaming but not boiling",
      "Pour into a mug and stir in honey",
      "Drink 30-60 minutes before bed"
    ]),
    ingredientBenefits: JSON.stringify({
      "ashwagandha": "The most studied adaptogen for testosterone. Clinical trials show 15-17% increase in testosterone and 27% reduction in cortisol. Also improves sleep quality, which is when 95% of testosterone is produced.",
      "turmeric": "Curcumin reduces systemic inflammation that can impair testosterone receptor sensitivity. Anti-inflammatory effects also improve sleep quality.",
      "cinnamon": "Improves insulin sensitivity overnight, which supports healthy testosterone levels. Also has mild sedative properties for better sleep.",
      "whole milk": "Tryptophan in milk converts to serotonin and then melatonin, supporting deep sleep. Saturated fats provide substrate for overnight testosterone production.",
      "honey": "Contains boron and nitric oxide precursors. Small amount of sugar before bed can support growth hormone release during sleep.",
      "black pepper": "Piperine increases curcumin bioavailability by 2000%. Without black pepper, most turmeric passes through unabsorbed."
    }),
  },
  {
    name: "Tuna & Avocado Rice Bowl",
    category: "lunch" as const,
    description: "A quick, high-protein lunch that combines vitamin D from tuna with healthy fats from avocado for optimal testosterone support.",
    prepTimeMinutes: 10,
    calories: 560,
    protein: 45,
    carbs: 42,
    fat: 22,
    performanceScore: 89,
    programWeek: 1,
    tags: JSON.stringify(["vitamin D", "quick", "lunch", "testosterone", "beginner"]),
    ingredients: JSON.stringify([
      "1 can tuna in olive oil (160g)",
      "1 cup cooked white rice",
      "1 ripe avocado",
      "1/2 cucumber",
      "1 tbsp soy sauce",
      "1 tsp sesame oil",
      "1 tsp rice vinegar",
      "Sesame seeds",
      "Green onions"
    ]),
    instructions: JSON.stringify([
      "Cook rice and let cool slightly",
      "Drain tuna and flake with a fork",
      "Slice avocado and cucumber",
      "Mix soy sauce, sesame oil, and rice vinegar",
      "Assemble bowl: rice, tuna, avocado, cucumber",
      "Drizzle with sauce and top with sesame seeds and green onions"
    ]),
    ingredientBenefits: JSON.stringify({
      "tuna": "One of the highest dietary sources of vitamin D — men with optimal vitamin D have 90% higher testosterone than deficient men. Also rich in omega-3s and selenium.",
      "avocado": "Boron content reduces SHBG (sex hormone binding globulin), freeing up more testosterone to be biologically active. Healthy fats support hormone production.",
      "sesame oil": "Rich in sesamin, a lignan that inhibits aromatase (the enzyme that converts testosterone to estrogen), keeping testosterone levels higher.",
      "rice": "Provides easily digestible carbohydrates that replenish glycogen and support healthy insulin levels for optimal testosterone.",
      "green onions": "Contain quercetin which has been shown to increase testosterone production in testicular cells in multiple studies."
    }),
  },
];

export async function seedRecipes(db: any) {
  const schemaModule = await import("../drizzle/schema");
  const { recipes } = schemaModule;
  const { eq } = await import("drizzle-orm");
  
  const existing = await db.select().from(recipes).limit(1);
  if (existing.length > 0) return; // Already seeded
  
  for (const recipe of PERFORMANCE_RECIPES) {
    await db.insert(recipes).values(recipe);
  }
  console.log(`Seeded ${PERFORMANCE_RECIPES.length} recipes`);
}
