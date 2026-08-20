import { q, type Question } from "./types";

/** Mixed “十万个为什么” bank — not used by Arena matchmaking. */
export const GENERAL_QUESTIONS: Question[] = [
  q("gen-1-01", 1, "science", "Why is the sky blue?", ["The air scatters sunlight", "The sea paints it", "Birds colour it", "It is painted every morning"], 0, "general"),
  q("gen-1-02", 1, "science", "Which animal is the largest mammal?", ["Elephant", "Blue whale", "Giraffe", "Hippo"], 1, "general"),
  q("gen-1-03", 1, "science", "Why does the Moon appear to shine?", ["It is on fire", "It reflects the Sun", "It has lamps", "Clouds light it"], 1, "general"),
  q("gen-1-04", 1, "science", "Which planet is closest to the Sun?", ["Earth", "Mars", "Mercury", "Venus"], 2, "general"),
  q("gen-1-05", 1, "science", "Why do we have day and night?", ["Earth rotates", "The Sun turns off", "Clouds cover us", "The Moon hides the Sun"], 0, "general"),
  q("gen-1-06", 1, "science", "What do plants need to grow?", ["Only rocks", "Sunlight, water and air", "Only sugar", "Plastic"], 1, "general"),

  q("gen-2-01", 2, "science", "Which planet is known as the Red Planet?", ["Mars", "Venus", "Jupiter", "Saturn"], 0, "general"),
  q("gen-2-02", 2, "science", "Rain comes from…", ["The ground jumping", "Clouds", "The Moon", "Stars"], 1, "general"),
  q("gen-2-03", 2, "science", "We breathe in…", ["Nitrogen only", "Oxygen", "Smoke", "Helium"], 1, "general"),
  q("gen-2-04", 2, "science", "Ice is water that is…", ["Burning", "Frozen", "Boiling", "Salty"], 1, "general"),
  q("gen-2-05", 2, "science", "Bees collect…", ["Leaves", "Nectar", "Stones", "Sand"], 1, "general"),

  q("gen-3-01", 3, "science", "The Earth goes around the…", ["Moon", "Sun", "Mars", "Stars"], 1, "general"),
  q("gen-3-02", 3, "science", "A magnet attracts…", ["Wood", "Iron", "Plastic", "Paper"], 1, "general"),
  q("gen-3-03", 3, "science", "Sounds travel as…", ["Waves", "Colours", "Smells", "Shadows"], 0, "general"),
  q("gen-3-04", 3, "science", "The heart pumps…", ["Air", "Blood", "Water", "Sand"], 1, "general"),
  q("gen-3-05", 3, "science", "Shadows are longest when the Sun is…", ["Overhead", "Low in the sky", "Hidden by the Moon only", "Blue"], 1, "general"),

  q("gen-4-01", 4, "science", "Water boiling becomes…", ["Ice", "Steam", "Salt", "Oil"], 1, "general"),
  q("gen-4-02", 4, "science", "The equator is…", ["A country", "An imaginary line around Earth", "A mountain", "A river"], 1, "general"),
  q("gen-4-03", 4, "science", "Photosynthesis happens in…", ["Animals", "Green plants", "Rocks", "Clouds"], 1, "general"),
  q("gen-4-04", 4, "science", "Lightning is a form of…", ["Electricity", "Wind", "Rain", "Gravity"], 0, "general"),
  q("gen-4-05", 4, "science", "The Pacific is a…", ["Desert", "Ocean", "Mountain", "City"], 1, "general"),

  q("gen-5-01", 5, "science", "Gravity pulls objects…", ["Up", "Towards Earth", "Sideways only", "Into the Moon"], 1, "general"),
  q("gen-5-02", 5, "science", "A year is Earth going once around the…", ["Moon", "Sun", "Mars", "Galaxy core"], 1, "general"),
  q("gen-5-03", 5, "science", "Fossils are usually found in…", ["Clouds", "Rocks", "The ocean surface only", "Fire"], 1, "general"),
  q("gen-5-04", 5, "science", "The smallest unit of matter in this list is…", ["Rock", "Atom", "Planet", "Tree"], 1, "general"),
  q("gen-5-05", 5, "science", "Malaysia’s climate is mostly…", ["Polar", "Tropical", "Desert", "Tundra"], 1, "general"),

  q("gen-6-01", 6, "science", "Earth’s atmosphere is a layer of…", ["Rock", "Gases", "Water only", "Metal"], 1, "general"),
  q("gen-6-02", 6, "science", "Renewable energy example:", ["Coal", "Solar", "Petrol", "Diesel"], 1, "general"),
  q("gen-6-03", 6, "science", "The brain’s job is to…", ["Pump blood", "Control the body", "Digest food", "Make bones"], 1, "general"),
  q("gen-6-04", 6, "science", "Tides are mainly caused by the…", ["Moon", "Clouds", "Windmills", "Fish"], 0, "general"),
  q("gen-6-05", 6, "science", "Plastic in the ocean is harmful because it…", ["Feeds fish well", "Pollutes and can be eaten by animals", "Makes water sweeter", "Cools the sea"], 1, "general"),
];
