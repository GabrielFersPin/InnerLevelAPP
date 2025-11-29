import { Card, CharacterClass } from '../types/index';

/**
 * Starter cards for each character class
 * These are given to new users when they create their character
 */

// Helper to generate unique card IDs
const generateCardId = (className: string, index: number) =>
  `starter-${className}-${index}-${Date.now()}`;

// STRATEGIST Starter Cards - Focus on planning, analysis, and optimization
const strategistCards: Omit<Card, 'id' | 'createdAt'>[] = [
  {
    name: "Morning Strategy Session",
    description: "Spend 30 minutes planning your day with clear priorities and time blocks. Review your goals and identify the most important tasks.",
    type: "action",
    rarity: "common",
    classTypes: ["strategist"],
    energyCost: 15,
    duration: 0.5,
    impact: 20,
    skillBonus: [{ skillName: "Strategy", xpBonus: 15 }],
    requirements: {},
    conditions: {},
    tags: ["planning", "productivity", "morning"],
    forged: false,
    usageCount: 0,
    isOnCooldown: false,
    cooldown: 24
  },
  {
    name: "Data Analysis Deep Dive",
    description: "Dedicate 1 hour to analyzing metrics, tracking progress, or reviewing data related to your goals. Use insights to optimize your approach.",
    type: "power",
    rarity: "uncommon",
    classTypes: ["strategist"],
    energyCost: 25,
    duration: 1,
    impact: 30,
    skillBonus: [{ skillName: "Analytics", xpBonus: 25 }],
    requirements: {},
    conditions: {},
    tags: ["analysis", "optimization", "growth"],
    forged: false,
    usageCount: 0,
    isOnCooldown: false,
    cooldown: 24
  },
  {
    name: "Strategic Learning Sprint",
    description: "Spend 45 minutes learning a new skill or technique that aligns with your long-term strategy. Focus on practical application.",
    type: "action",
    rarity: "common",
    classTypes: ["strategist"],
    energyCost: 20,
    duration: 0.75,
    impact: 25,
    skillBonus: [{ skillName: "Intelligence", xpBonus: 20 }],
    requirements: {},
    conditions: {},
    tags: ["learning", "skill-building", "strategy"],
    forged: false,
    usageCount: 0,
    isOnCooldown: false,
    cooldown: 24
  }
];

// WARRIOR Starter Cards - Focus on discipline, consistency, and challenges
const warriorCards: Omit<Card, 'id' | 'createdAt'>[] = [
  {
    name: "Dawn Training Ritual",
    description: "Complete a 30-minute physical workout or exercise routine. Build strength, endurance, and mental toughness through consistent practice.",
    type: "action",
    rarity: "common",
    classTypes: ["warrior"],
    energyCost: 20,
    duration: 0.5,
    impact: 25,
    skillBonus: [{ skillName: "Strength", xpBonus: 20 }],
    requirements: {},
    conditions: {},
    tags: ["fitness", "discipline", "morning"],
    forged: false,
    usageCount: 0,
    isOnCooldown: false,
    cooldown: 24
  },
  {
    name: "Challenge Accepted",
    description: "Take on the hardest task on your list. Push through resistance and prove your determination. No excuses, just action.",
    type: "power",
    rarity: "uncommon",
    classTypes: ["warrior"],
    energyCost: 30,
    duration: 1.5,
    impact: 35,
    skillBonus: [{ skillName: "Willpower", xpBonus: 30 }],
    requirements: {},
    conditions: {},
    tags: ["challenge", "discipline", "growth"],
    forged: false,
    usageCount: 0,
    isOnCooldown: false,
    cooldown: 24
  },
  {
    name: "Habit Forge",
    description: "Practice a daily habit you're building for 20 minutes. Consistency over intensity. Track your streak and celebrate small wins.",
    type: "action",
    rarity: "common",
    classTypes: ["warrior"],
    energyCost: 15,
    duration: 0.33,
    impact: 20,
    skillBonus: [{ skillName: "Discipline", xpBonus: 15 }],
    requirements: {},
    conditions: {},
    tags: ["habits", "consistency", "discipline"],
    forged: false,
    usageCount: 0,
    isOnCooldown: false,
    cooldown: 24
  }
];

// CREATOR Starter Cards - Focus on creativity, innovation, and expression
const creatorCards: Omit<Card, 'id' | 'createdAt'>[] = [
  {
    name: "Creative Flow Session",
    description: "Dedicate 1 hour to pure creative work - write, draw, design, or build something. Let your imagination run wild without judgment.",
    type: "action",
    rarity: "common",
    classTypes: ["creator"],
    energyCost: 25,
    duration: 1,
    impact: 30,
    skillBonus: [{ skillName: "Creativity", xpBonus: 25 }],
    requirements: {},
    conditions: {},
    tags: ["creativity", "flow", "creation"],
    forged: false,
    usageCount: 0,
    isOnCooldown: false,
    cooldown: 24
  },
  {
    name: "Inspiration Hunt",
    description: "Spend 30 minutes exploring new ideas, browsing inspiration sources, or experiencing something novel. Fill your creative well.",
    type: "power",
    rarity: "uncommon",
    classTypes: ["creator"],
    energyCost: 15,
    duration: 0.5,
    impact: 20,
    skillBonus: [{ skillName: "Innovation", xpBonus: 20 }],
    requirements: {},
    conditions: {},
    tags: ["inspiration", "exploration", "creativity"],
    forged: false,
    usageCount: 0,
    isOnCooldown: false,
    cooldown: 24
  },
  {
    name: "Prototype & Experiment",
    description: "Create a quick prototype or experiment with a new technique. Focus on learning through making, not perfection.",
    type: "action",
    rarity: "common",
    classTypes: ["creator"],
    energyCost: 20,
    duration: 1,
    impact: 25,
    skillBonus: [{ skillName: "Expression", xpBonus: 20 }],
    requirements: {},
    conditions: {},
    tags: ["experimentation", "prototyping", "learning"],
    forged: false,
    usageCount: 0,
    isOnCooldown: false,
    cooldown: 24
  }
];

// CONNECTOR Starter Cards - Focus on relationships, networking, and collaboration
const connectorCards: Omit<Card, 'id' | 'createdAt'>[] = [
  {
    name: "Meaningful Connection",
    description: "Have a genuine 30-minute conversation with someone. Listen deeply, share authentically, and strengthen your relationship.",
    type: "action",
    rarity: "common",
    classTypes: ["connector"],
    energyCost: 20,
    duration: 0.5,
    impact: 25,
    skillBonus: [{ skillName: "Empathy", xpBonus: 20 }],
    requirements: {},
    conditions: {},
    tags: ["relationships", "connection", "social"],
    forged: false,
    usageCount: 0,
    isOnCooldown: false,
    cooldown: 24
  },
  {
    name: "Network Weaver",
    description: "Reach out to 3 people in your network. Share value, offer help, or simply check in. Build bridges and strengthen bonds.",
    type: "power",
    rarity: "uncommon",
    classTypes: ["connector"],
    energyCost: 25,
    duration: 1,
    impact: 30,
    skillBonus: [{ skillName: "Communication", xpBonus: 25 }],
    requirements: {},
    conditions: {},
    tags: ["networking", "outreach", "relationships"],
    forged: false,
    usageCount: 0,
    isOnCooldown: false,
    cooldown: 24
  },
  {
    name: "Collaborative Session",
    description: "Work with others on a shared goal for 1 hour. Practice teamwork, active listening, and collective problem-solving.",
    type: "action",
    rarity: "common",
    classTypes: ["connector"],
    energyCost: 20,
    duration: 1,
    impact: 25,
    skillBonus: [{ skillName: "Collaboration", xpBonus: 20 }],
    requirements: {},
    conditions: {},
    tags: ["teamwork", "collaboration", "social"],
    forged: false,
    usageCount: 0,
    isOnCooldown: false,
    cooldown: 24
  }
];

// SAGE Starter Cards - Focus on wisdom, mindfulness, and balance
const sageCards: Omit<Card, 'id' | 'createdAt'>[] = [
  {
    name: "Mindful Meditation",
    description: "Practice 20 minutes of meditation or mindfulness. Observe your thoughts without judgment and cultivate inner peace.",
    type: "recovery",
    rarity: "common",
    classTypes: ["sage"],
    energyCost: 10,
    duration: 0.33,
    impact: 20,
    skillBonus: [{ skillName: "Mindfulness", xpBonus: 20 }],
    requirements: {},
    conditions: {},
    tags: ["meditation", "mindfulness", "recovery"],
    forged: false,
    usageCount: 0,
    isOnCooldown: false,
    cooldown: 24
  },
  {
    name: "Wisdom Seeking",
    description: "Spend 45 minutes reading philosophy, journaling insights, or reflecting deeply on life lessons. Integrate knowledge into wisdom.",
    type: "power",
    rarity: "uncommon",
    classTypes: ["sage"],
    energyCost: 20,
    duration: 0.75,
    impact: 30,
    skillBonus: [{ skillName: "Wisdom", xpBonus: 25 }],
    requirements: {},
    conditions: {},
    tags: ["reflection", "wisdom", "learning"],
    forged: false,
    usageCount: 0,
    isOnCooldown: false,
    cooldown: 24
  },
  {
    name: "Balance Restoration",
    description: "Take 30 minutes for self-care - walk in nature, gentle yoga, or any activity that restores your equilibrium. Honor your needs.",
    type: "recovery",
    rarity: "common",
    classTypes: ["sage"],
    energyCost: 15,
    duration: 0.5,
    impact: 25,
    skillBonus: [{ skillName: "Balance", xpBonus: 15 }],
    requirements: {},
    conditions: {},
    tags: ["self-care", "balance", "wellness"],
    forged: false,
    usageCount: 0,
    isOnCooldown: false,
    cooldown: 24
  }
];

// Map of class to starter cards
export const starterCardsByClass: Record<CharacterClass, Omit<Card, 'id' | 'createdAt'>[]> = {
  strategist: strategistCards,
  warrior: warriorCards,
  creator: creatorCards,
  connector: connectorCards,
  sage: sageCards
};

/**
 * Get starter cards for a specific character class
 */
export function getStarterCards(characterClass: CharacterClass): Card[] {
  const templates = starterCardsByClass[characterClass] || strategistCards;

  return templates.map((template, index) => ({
    ...template,
    id: generateCardId(characterClass, index),
    createdAt: new Date()
  }));
}

/**
 * Get all starter cards (for testing or admin purposes)
 */
export function getAllStarterCards(): Card[] {
  const allCards: Card[] = [];

  Object.entries(starterCardsByClass).forEach(([className, templates]) => {
    templates.forEach((template, index) => {
      allCards.push({
        ...template,
        id: generateCardId(className, index),
        createdAt: new Date()
      });
    });
  });

  return allCards;
}
