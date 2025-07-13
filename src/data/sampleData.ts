import { Card, Quest } from '../types';

// Sample Cards with RPG Theme
export const sampleCards: Card[] = [
  // Common Cards (Daily Activities)
  {
    id: 'card-morning-ritual',
    name: '🌅 Morning Awakening Ritual',
    description: 'Start your day with intention: meditation, journaling, and setting daily goals',
    type: 'action',
    rarity: 'common',
    energyCost: 15,
    duration: 0.5,
    impact: 15,
    conditions: {
      timeRequired: 'morning'
    },
    effects: [
      {
        type: 'energy',
        target: 'regeneration',
        value: 5,
        duration: 8
      }
    ],
    tags: ['morning', 'mindfulness', 'productivity'],
    createdAt: new Date(),
    aiGenerated: false,
    usageCount: 0,
    isOnCooldown: false
  },
  {
    id: 'card-focused-work',
    name: '⚔️ Focused Combat Session',
    description: 'Enter battle mode: 25 minutes of deep, focused work on your most important task',
    type: 'action',
    rarity: 'common',
    energyCost: 25,
    duration: 1,
    impact: 30,
    cooldown: 2,
    tags: ['productivity', 'focus', 'work'],
    createdAt: new Date(),
    aiGenerated: false,
    usageCount: 0,
    isOnCooldown: false
  },
  {
    id: 'card-skill-training',
    name: '📚 Skill Mastery Training',
    description: 'Dedicate time to learning and practicing a specific skill for personal growth',
    type: 'action',
    rarity: 'common',
    energyCost: 20,
    duration: 1,
    impact: 25,
    tags: ['learning', 'skills', 'growth'],
    createdAt: new Date(),
    aiGenerated: false,
    usageCount: 0,
    isOnCooldown: false
  },

  // Uncommon Cards (Enhanced Activities)
  {
    id: 'card-energy-crystal',
    name: '💎 Energy Crystal Meditation',
    description: 'Harness the power of mindful meditation to restore your mental energy',
    type: 'recovery',
    rarity: 'uncommon',
    energyCost: 10,
    duration: 0.5,
    impact: 15,
    effects: [
      {
        type: 'energy',
        target: 'current',
        value: 20
      }
    ],
    tags: ['recovery', 'meditation', 'energy'],
    createdAt: new Date(),
    aiGenerated: false,
    usageCount: 0,
    isOnCooldown: false
  },
  {
    id: 'card-network-quest',
    name: '🤝 Professional Network Quest',
    description: 'Reach out to 3 professional contacts or make new connections in your field',
    type: 'action',
    rarity: 'uncommon',
    energyCost: 30,
    duration: 1,
    impact: 35,
    conditions: {
      requiredEnergyLevel: '> 50%'
    },
    tags: ['networking', 'career', 'professional'],
    createdAt: new Date(),
    aiGenerated: false,
    usageCount: 0,
    isOnCooldown: false
  },
  {
    id: 'card-creative-burst',
    name: '🎨 Creative Lightning Burst',
    description: 'Channel your creative energy into a passion project or artistic expression',
    type: 'action',
    rarity: 'uncommon',
    energyCost: 25,
    duration: 1.5,
    impact: 40,
    effects: [
      {
        type: 'multiplier',
        target: 'creative',
        value: 1.5,
        duration: 24
      }
    ],
    tags: ['creativity', 'passion', 'art'],
    createdAt: new Date(),
    aiGenerated: false,
    usageCount: 0,
    isOnCooldown: false
  },

  // Rare Cards (Powerful Activities)
  {
    id: 'card-productivity-armor',
    name: '🛡️ Productivity Armor',
    description: 'Eliminate all distractions and enter a state of peak productivity for 2 hours',
    type: 'power',
    rarity: 'rare',
    energyCost: 40,
    duration: 2,
    impact: 60,
    cooldown: 4,
    conditions: {
      requiredEnergyLevel: '> 70%'
    },
    effects: [
      {
        type: 'multiplier',
        target: 'productivity',
        value: 2.0,
        duration: 2
      }
    ],
    tags: ['productivity', 'focus', 'deep work'],
    createdAt: new Date(),
    aiGenerated: false,
    usageCount: 0,
    isOnCooldown: false
  },
  {
    id: 'card-wisdom-scroll',
    name: '📜 Ancient Wisdom Scroll',
    description: 'Dive deep into reading and studying something that expands your knowledge',
    type: 'action',
    rarity: 'rare',
    energyCost: 35,
    duration: 2,
    impact: 50,
    effects: [
      {
        type: 'unlock',
        target: 'knowledge',
        value: 1
      }
    ],
    tags: ['learning', 'wisdom', 'knowledge'],
    createdAt: new Date(),
    aiGenerated: false,
    usageCount: 0,
    isOnCooldown: false
  },

  // Epic Cards (Major Activities)
  {
    id: 'card-transformation-ritual',
    name: '⚡ Personal Transformation Ritual',
    description: 'Dedicate a full session to planning major life changes and taking first steps',
    type: 'event',
    rarity: 'epic',
    energyCost: 50,
    duration: 3,
    impact: 100,
    cooldown: 24,
    conditions: {
      requiredEnergyLevel: '> 80%'
    },
    effects: [
      {
        type: 'unlock',
        target: 'transformation',
        value: 1
      },
      {
        type: 'multiplier',
        target: 'all',
        value: 1.25,
        duration: 48
      }
    ],
    tags: ['transformation', 'planning', 'major change'],
    createdAt: new Date(),
    aiGenerated: false,
    usageCount: 0,
    isOnCooldown: false
  },

  // Legendary Cards (Life-Changing Activities)
  {
    id: 'card-legendary-breakthrough',
    name: '👑 Legendary Breakthrough Quest',
    description: 'Take a major leap toward your biggest goal - the kind of action that changes everything',
    type: 'event',
    rarity: 'legendary',
    energyCost: 80,
    duration: 4,
    impact: 200,
    cooldown: 168, // 1 week
    conditions: {
      requiredEnergyLevel: '> 90%'
    },
    effects: [
      {
        type: 'multiplier',
        target: 'all',
        value: 3.0,
        duration: 1
      },
      {
        type: 'unlock',
        target: 'legendary_achievement',
        value: 1
      }
    ],
    tags: ['legendary', 'breakthrough', 'life-changing'],
    createdAt: new Date(),
    aiGenerated: false,
    usageCount: 0,
    isOnCooldown: false
  }
];

// Sample Quests
export const sampleQuests: Quest[] = [
  {
    id: 'quest-career-advancement',
    name: '🚀 Data Science Career Quest',
    description: 'Master the skills and build the network needed to land a data science position',
    type: 'career',
    difficulty: 'hard',
    estimatedDuration: 90,
    progress: 15,
    status: 'active',
    milestones: [
      {
        id: 'milestone-1',
        name: 'Foundation Building',
        requiredProgress: 25,
        rewards: [
          { type: 'experience', value: 100 },
          { type: 'card_unlock', value: 1 }
        ],
        completed: false
      },
      {
        id: 'milestone-2',
        name: 'Portfolio Development',
        requiredProgress: 50,
        rewards: [
          { type: 'experience', value: 200 },
          { type: 'rare_card', value: 1 }
        ],
        completed: false
      },
      {
        id: 'milestone-3',
        name: 'Job Application Mastery',
        requiredProgress: 75,
        rewards: [
          { type: 'experience', value: 300 },
          { type: 'epic_card', value: 1 }
        ],
        completed: false
      }
    ],
    rewards: {
      experience: 1000,
      cards: ['card-interview-mastery', 'card-network-champion'],
      unlocks: ['advanced_career_tools']
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
  },
  {
    id: 'quest-health-transformation',
    name: '💪 Epic Health Transformation',
    description: 'Build sustainable habits for physical and mental wellness',
    type: 'health',
    difficulty: 'medium',
    estimatedDuration: 60,
    progress: 35,
    status: 'active',
    milestones: [
      {
        id: 'milestone-health-1',
        name: 'Habit Foundation',
        requiredProgress: 30,
        rewards: [
          { type: 'experience', value: 150 },
          { type: 'energy_boost', value: 10 }
        ],
        completed: true
      },
      {
        id: 'milestone-health-2',
        name: 'Consistency Champion',
        requiredProgress: 60,
        rewards: [
          { type: 'experience', value: 250 },
          { type: 'rare_card', value: 1 }
        ],
        completed: false
      }
    ],
    rewards: {
      experience: 800,
      cards: ['card-vitality-boost', 'card-wellness-warrior'],
      unlocks: ['advanced_health_tracking']
    },
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // 14 days ago
  },
  {
    id: 'quest-creative-mastery',
    name: '🎨 Creative Mastery Journey',
    description: 'Develop and showcase your creative talents through consistent practice',
    type: 'creative',
    difficulty: 'easy',
    estimatedDuration: 30,
    progress: 70,
    status: 'active',
    milestones: [
      {
        id: 'milestone-creative-1',
        name: 'Daily Practice',
        requiredProgress: 40,
        rewards: [
          { type: 'experience', value: 100 }
        ],
        completed: true
      },
      {
        id: 'milestone-creative-2',
        name: 'First Showcase',
        requiredProgress: 80,
        rewards: [
          { type: 'experience', value: 200 },
          { type: 'epic_card', value: 1 }
        ],
        completed: false
      }
    ],
    rewards: {
      experience: 500,
      cards: ['card-artistic-flow', 'card-creative-burst'],
      unlocks: ['portfolio_system']
    },
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000) // 21 days ago
  }
];

// Sample completed quest for reference
export const sampleCompletedQuests: Quest[] = [
  {
    id: 'quest-productivity-system',
    name: '⚡ Productivity System Mastery',
    description: 'Build and optimize a personal productivity system that works for you',
    type: 'skills',
    difficulty: 'medium',
    estimatedDuration: 21,
    progress: 100,
    status: 'completed',
    milestones: [
      {
        id: 'milestone-prod-1',
        name: 'System Design',
        requiredProgress: 33,
        rewards: [{ type: 'experience', value: 100 }],
        completed: true
      },
      {
        id: 'milestone-prod-2',
        name: 'Implementation',
        requiredProgress: 66,
        rewards: [{ type: 'experience', value: 150 }],
        completed: true
      },
      {
        id: 'milestone-prod-3',
        name: 'Optimization',
        requiredProgress: 100,
        rewards: [{ type: 'experience', value: 200 }],
        completed: true
      }
    ],
    rewards: {
      experience: 600,
      cards: ['card-productivity-armor', 'card-focus-enhancement'],
      unlocks: ['advanced_productivity_tools']
    },
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000) // 45 days ago
  }
];

// Daily card recommendations based on different scenarios
export const getDailyRecommendations = (energyLevel: number, timeOfDay: 'morning' | 'afternoon' | 'evening'): Card[] => {
  const availableCards = sampleCards.filter(card => 
    card.energyCost <= energyLevel && 
    (!card.conditions?.timeRequired || card.conditions.timeRequired === timeOfDay)
  );

  // Return top 3-4 cards based on current context
  return availableCards
    .sort((a, b) => {
      // Prioritize by impact/energy ratio and rarity
      const scoreA = (a.impact / a.energyCost) + getRarityScore(a.rarity);
      const scoreB = (b.impact / b.energyCost) + getRarityScore(b.rarity);
      return scoreB - scoreA;
    })
    .slice(0, 4);
};

const getRarityScore = (rarity: Card['rarity']): number => {
  switch (rarity) {
    case 'common': return 1;
    case 'uncommon': return 2;
    case 'rare': return 3;
    case 'epic': return 4;
    case 'legendary': return 5;
    default: return 0;
  }
};

// Quest templates for quick quest creation
export const questTemplates = {
  career: [
    'Land a job in [field]',
    'Get promoted to [position]',
    'Build expertise in [skill]',
    'Start a side business in [area]',
    'Complete professional certification in [subject]'
  ],
  health: [
    'Lose [amount] pounds in [timeframe]',
    'Build a consistent exercise routine',
    'Improve mental health and stress management',
    'Develop healthy eating habits',
    'Train for [event/marathon/challenge]'
  ],
  skills: [
    'Master [programming language/tool]',
    'Learn [language] to conversational level',
    'Develop public speaking skills',
    'Build expertise in [field]',
    'Complete online course in [subject]'
  ],
  creative: [
    'Write and publish [type of content]',
    'Create and showcase art portfolio',
    'Learn [musical instrument]',
    'Develop photography skills',
    'Start creative side project'
  ],
  relationships: [
    'Strengthen family relationships',
    'Build professional network',
    'Improve communication skills',
    'Find romantic partner',
    'Develop lasting friendships'
  ]
};

export default {
  sampleCards,
  sampleQuests,
  sampleCompletedQuests,
  getDailyRecommendations,
  questTemplates
};