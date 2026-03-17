/**
 * Memory exercises: benefits, duration, detailed instructions, examples.
 * Each week new exercises are added/updated in the app.
 */
export type Difficulty = "beginner" | "intermediate" | "advanced";

export type MemoryExercise = {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  durationMinutes: number;
  /** Step-by-step how to do the exercise (detailed). */
  instructions: string[];
  /** Concrete example so the user can copy the method. */
  example: string;
  /** Optional short tips for best results. */
  tips?: string[];
  difficulty: Difficulty;
};

export const MEMORY_EXERCISES: MemoryExercise[] = [
  {
    id: "memory_palace",
    name: "Memory Palace",
    description: "You visualize a familiar place (your home, a street, a building) and mentally 'place' each item you want to remember along a path. When you need to recall, you walk the path in your mind and 'see' each item in order. This technique is used by memory champions and is strongly supported by research for encoding lists and sequences.",
    benefits: [
      "Strengthens spatial and visual memory.",
      "Improves long-term recall of lists and sequences.",
      "Evidence-based; used by memory champions.",
    ],
    durationMinutes: 5,
    difficulty: "beginner",
    instructions: [
      "Choose one familiar place (e.g. your home, your route to the shop). You will always use the same path (e.g. front door → hall → kitchen → living room).",
      "Decide what you need to remember (e.g. a shopping list: milk, bread, eggs, apples).",
      "Mentally walk the path. In the first location (e.g. front door), place the first item in a vivid, silly way (e.g. a giant bottle of milk blocking the door).",
      "Move to the next location and place the next item (e.g. a loaf of bread on the hall table, maybe toasting). Continue until all items are placed.",
      "To recall: walk the path again in your mind and 'see' each item. Say or write them in order.",
    ],
    example: "List: keys, phone, wallet. Path: bedroom → bathroom → kitchen. Bedroom: keys hanging from the lamp. Bathroom: phone ringing in the sink. Kitchen: wallet on the stove. To recall, walk the path and note: keys, phone, wallet.",
    tips: ["Use the same path often so it becomes automatic.", "Make images exaggerated or funny — they stick better.", "Practice with 5–7 items first, then increase."],
  },
  {
    id: "chunking",
    name: "Chunking",
    description: "You break long information (numbers, words, names) into small groups of 3–4 units. Your brain holds these chunks more easily than a long string, so you remember more with less effort. Ideal for phone numbers, PINs, and lists.",
    benefits: [
      "Increases working memory capacity.",
      "Makes phone numbers and lists easier to remember.",
      "Reduces cognitive load.",
    ],
    durationMinutes: 4,
    difficulty: "beginner",
    instructions: [
      "Take the information you want to remember (e.g. the number 5829174).",
      "Split it into chunks of 3 or 4: 582 – 917 – 4 or 58 – 29 – 17 – 4.",
      "Say or write each chunk a few times. Then say the full number from memory.",
      "For words or names: group them (e.g. three words per chunk). Repeat each chunk, then the full list.",
      "Practice daily with new numbers or lists; try to recall after a short delay (e.g. 30 seconds).",
    ],
    example: "Phone number 5551234567 → 555 – 123 – 4567. Remember '555' (area), '123' (like counting), '4567' (ascending). Or words: dog, cat, bird, tree, car → (dog, cat, bird) and (tree, car).",
    tips: ["Use chunks that mean something to you (e.g. a year, a birthday).", "Keep chunks to 3–4 items; longer chunks are harder."],
  },
  {
    id: "dual_nback",
    name: "Dual N-Back",
    description: "You see (or hear) a sequence of positions and letters. Your job is to say when the current item is the same as the one from N steps back (e.g. 2-back: same as two steps ago). It targets working memory and is often used in brain-training research.",
    benefits: [
      "Targets working memory and fluid intelligence.",
      "May improve focus and processing speed.",
      "Common in evidence-based brain-training.",
    ],
    durationMinutes: 6,
    difficulty: "intermediate",
    instructions: [
      "Use an app or a grid (e.g. 3×3). You will see a square light up in a cell and/or hear a letter.",
      "For 1-back: press when the current position (or letter) is the same as the previous one. For 2-back: when it matches the one from two steps ago.",
      "Start with 1-back for 2–3 minutes. When it feels easy, switch to 2-back.",
      "Do one session of about 5–6 minutes, 2–3 times per week. Accuracy matters more than speed.",
      "If you get tired, stop; short sessions are more effective than long, fuzzy ones.",
    ],
    example: "2-back positions: A1, B2, A1 → press (A1 matches 2 back). Letters: K, L, K → press (K matches 2 back).",
    tips: ["Practice in a quiet place.", "Increase N only when 1-back or 2-back feels comfortable."],
  },
  {
    id: "spaced_repetition",
    name: "Spaced Repetition",
    description: "You review the same facts at increasing time intervals (e.g. today, in 1 day, in 3 days, in 1 week). This slows down forgetting and helps move information into long-term memory with less total study time.",
    benefits: [
      "Improves long-term retention with less total study time.",
      "Reduces the forgetting curve.",
      "Ideal for names, vocabulary, and facts.",
    ],
    durationMinutes: 5,
    difficulty: "beginner",
    instructions: [
      "Write down 5–10 items you want to remember (e.g. new words, names, or facts). Use index cards or an app if you like.",
      "Day 1: Learn the items. Test yourself: cover and recall. Mark which you got right.",
      "Day 2: Review only the ones you missed or all if you prefer. Test again.",
      "Day 4–5: Review everything. Move items you recall easily to 'next review in 1 week'.",
      "Week 2: Review the '1 week' items. If you recall correctly, space the next review to 2 weeks; if not, bring it back to 3 days.",
    ],
    example: "Words: apple, bridge, calm. Day 1: learn and test. Day 2: review all. Day 5: review; 'bridge' failed → review again in 2 days. Day 7: review 'bridge'. Day 12: review all; if correct, next review in 2 weeks.",
    tips: ["Be honest: only move to a longer interval if you recalled without peeking.", "5–10 items per session is enough; quality over quantity."],
  },
  {
    id: "story_chain",
    name: "Story Chain",
    description: "You link unrelated words or items into one short, vivid story. Each item appears in order in a silly or striking way. To recall, you retell the story and 'read off' the items. This uses narrative and association to make random lists stick.",
    benefits: [
      "Boosts associative and narrative memory.",
      "Makes abstract or random lists easier to recall.",
      "Engages creativity and encoding.",
    ],
    durationMinutes: 4,
    difficulty: "beginner",
    instructions: [
      "Take 5–10 unrelated words (e.g. cloud, shoe, piano, river, key).",
      "Create a short story where the first word appears first, the second word second, and so on. Use vivid, exaggerated or funny images.",
      "Example start: 'A CLOUD dropped a SHOE onto a PIANO by the RIVER; I found a KEY...'",
      "Tell the story once in your head or out loud. Then close the list and recall the words in order by retelling the story.",
      "Check the list. If you missed one, add it more clearly to the story and try again.",
    ],
    example: "List: lamp, fish, book. Story: 'The LAMP fell into a bowl, a FISH jumped out and landed on a BOOK.' To recall: lamp → fish → book.",
    tips: ["The sillier or more vivid the story, the better you remember.", "Keep the story short; one sentence per item is enough."],
  },
  {
    id: "mindfulness_recall",
    name: "Mindfulness Recall",
    description: "You do a short mindfulness exercise (e.g. focusing on your breath), then recall the last few minutes in detail — what you saw, heard, or thought. This combines attention training with episodic memory and helps with detail recall and calm.",
    benefits: [
      "Combines attention training with episodic memory.",
      "Reduces stress and improves focus.",
      "Strengthens detail recall.",
    ],
    durationMinutes: 5,
    difficulty: "beginner",
    instructions: [
      "Sit comfortably. Set a timer for 2 minutes. Close your eyes or soften your gaze.",
      "Focus on your breath: feel the air going in and out. When your mind wanders, gently return to the breath. No need to change how you breathe.",
      "When the timer ends, keep your eyes closed and recall: What did you see in the last 5 minutes (before the 2 min)? What did you hear? What did you think about?",
      "Say or write 3–5 details (e.g. 'I heard a car', 'I thought about lunch', 'I saw the window').",
      "Do this once a day, e.g. after a short walk or after finishing a task.",
    ],
    example: "After 2 min breath focus: 'In the last 5 minutes I saw the red chair, heard the clock tick, thought about my meeting, felt my feet on the floor, noticed the light from the window.'",
    tips: ["Don't judge your recall; the practice of recalling is what helps.", "Same time each day builds a habit."],
  },
  {
    id: "name_face",
    name: "Name & Face",
    description: "When you meet someone, you pick one distinctive feature (glasses, smile, hair) and link their name to it with a visual image or pun. Rehearse once. This improves name and face recall in social situations.",
    benefits: [
      "Improves social memory and name recall.",
      "Uses visual and verbal association.",
      "Builds confidence in conversations.",
    ],
    durationMinutes: 4,
    difficulty: "beginner",
    instructions: [
      "When you hear the person's name, repeat it once ('Nice to meet you, Sarah').",
      "Choose one distinctive feature: glasses, smile, eyebrows, hair colour, etc.",
      "Turn the name into an image or pun. Sarah → a princess; Mike → microphone; Rose → a rose.",
      "Mentally place that image on the feature (e.g. a rose on their hair, a microphone on their glasses).",
      "Rehearse once in your head: 'Sarah, rose in her hair.' Use their name again when you say goodbye.",
    ],
    example: "Meet 'David' with big eyebrows. Image: a giant 'D' (for David) drawn on his eyebrows. Rehearse: 'David, D on eyebrows.'",
    tips: ["One feature and one image per person; keep it simple.", "Use the name again soon in the conversation to reinforce."],
  },
  {
    id: "number_shape",
    name: "Number–Shape",
    description: "You assign a fixed shape or image to each digit 0–9 (e.g. 1 = pencil, 2 = swan). Then you turn numbers (PINs, dates) into a sequence of images or a short scene. This makes numbers easier to remember as pictures.",
    benefits: [
      "Makes numbers easier to remember as images.",
      "Improves recall of PINs, dates, and figures.",
      "Uses visual and semantic encoding.",
    ],
    durationMinutes: 5,
    difficulty: "intermediate",
    instructions: [
      "Create a fixed image for each digit 0–9. Examples: 0=ball, 1=pencil, 2=swan, 3=heart, 4=chair, 5=hook, 6=cherry, 7=cliff, 8=snowman, 9=balloon. Draw or write yours and keep them consistent.",
      "Take a 4–6 digit number (e.g. 2847). Turn it into images: swan, snowman, chair, cliff.",
      "Link the images in a mini story or scene: 'A swan sits on a snowman, next to a chair on a cliff.'",
      "To recall: run through the scene and turn each image back into the digit. 2847.",
      "Practice daily with a new number (e.g. a PIN you want to learn, or a random 4–6 digit number).",
    ],
    example: "PIN 1928: 1=pencil, 9=balloon, 2=swan, 8=snowman. Scene: A pencil pokes a balloon; a swan stands on a snowman. Recall: 1928.",
    tips: ["Use images that are easy for you to picture.", "Same number system every time so it becomes automatic."],
  },
  {
    id: "recall_after_reading",
    name: "Recall After Reading",
    description: "You read one short paragraph once, then close the page and say or write the main idea and 2–3 details from memory. This strengthens reading comprehension, focus, and retrieval.",
    benefits: [
      "Strengthens reading comprehension and retention.",
      "Improves focus while reading.",
      "Trains retrieval and summarization.",
    ],
    durationMinutes: 5,
    difficulty: "beginner",
    instructions: [
      "Choose one short paragraph (3–5 sentences). It can be from a book, article, or any text.",
      "Read it once at a normal pace. Do not re-read. Then close the page or hide the text.",
      "Say out loud or write: (1) the main idea in one sentence, (2) 2–3 specific details (names, numbers, or facts).",
      "Check the text. What did you miss? Re-read only if you want to try again with a new paragraph.",
      "Do 2–3 paragraphs per session. Quality of recall matters more than speed.",
    ],
    example: "Paragraph: 'The brain can form new connections at any age. Studies show that learning a new skill strengthens neural pathways. Even 15 minutes of daily practice can help.' Recall: Main idea — brain can form new connections at any age. Details — new skills strengthen pathways; 15 min daily can help.",
    tips: ["No peeking until you've finished recalling.", "Use different types of text (news, stories, facts) to vary practice."],
  },
  {
    id: "speed_cards",
    name: "Speed Cards (or List)",
    description: "You study a short list (5–10 items: words, numbers, or playing cards) for 1–2 minutes, then put it away and recall the order. You repeat with new items and can try to reduce study time. This trains working memory and encoding speed.",
    benefits: [
      "Trains working memory and speed of encoding.",
      "Builds concentration under time pressure.",
      "Scales from simple lists to cards.",
    ],
    durationMinutes: 5,
    difficulty: "intermediate",
    instructions: [
      "Take 5–10 items: words on paper, numbers, or playing cards in a row. Look at the order for 1–2 minutes.",
      "Cover or remove the items. Write or say them in order from memory.",
      "Check. Count how many you got right in order. Note where you made mistakes.",
      "Repeat with a new list. Optionally, try to reduce study time (e.g. 1 min instead of 2) and see if you can still recall well.",
      "Do 2–3 rounds per session. Keep lists to 5–10 items so you can complete in about 5 minutes.",
    ],
    example: "List: dog, sun, key, tree, cup. Study 90 seconds. Cover. Recall: dog, sun, key, tree, cup. Next round: new list of 6 numbers. Study 1 min. Recall in order.",
    tips: ["Accuracy first; speed comes with practice.", "If you often forget the middle, slow down and pay extra attention to the middle items."],
  },
];
