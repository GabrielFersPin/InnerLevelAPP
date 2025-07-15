import { Card, CharacterClass } from '../types/index';

export const baseCards: Card[] = [
  // STRATEGIST CARDS
  {
    id: 'strat_data_analysis',
    name: 'Data Analysis Sprint',
    description: 'Deep dive into metrics and data for 2 hours to extract actionable insights.',
    type: 'action',
    rarity: 'common',
    classTypes: ['strategist'],
    energyCost: 30,
    duration: 2,
    impact: 50,
    cooldown: 12,
    skillBonus: [
      { skillName: 'Intelligence', xpBonus: 25 },
      { skillName: 'Analytics', xpBonus: 30 }
    ],
    requirements: { level: 1 },
    conditions: {
      energyLevel: "> 25%",
      timeRequired: "2+ hours available"
    },
    tags: ['analysis', 'data', 'research'],
    createdAt: new Date(),
    aiGenerated: false,
    usageCount: 0,
    isOnCooldown: false
  },
  {
    id: 'strat_research_dive',
    name: 'Research Deep Dive',
    description: 'Intensive 4-hour research session on a specific topic with comprehensive note-taking.',
    type: 'action',
    rarity: 'rare',
    classTypes: ['strategist'],
    energyCost: 60,
    duration: 4,
    impact: 120,
    cooldown: 48,
    skillBonus: [
      { skillName: 'Intelligence', xpBonus: 60 },
      { skillName: 'Focus', xpBonus: 40 }
    ],
    requirements: { level: 5 },
    conditions: {
      energyLevel: "> 50%",
      timeRequired: "4+ hours available"
    },
    tags: ['research', 'intensive', 'learning'],
    createdAt: new Date(),
    aiGenerated: false,
    usageCount: 0,
    isOnCooldown: false
  },
  {
    id: 'strat_strategic_planning',
    name: 'Strategic Mastery Synthesis',
    description: 'Create a comprehensive strategic plan combining multiple data sources and analytical frameworks.',
    type: 'power',
    rarity: 'legendary',
    classTypes: ['strategist'],
    energyCost: 100,
    duration: 8,
    impact: 300,
    cooldown: 168, // 1 week
    skillBonus: [
      { skillName: 'Intelligence', xpBonus: 100 },
      { skillName: 'Strategy', xpBonus: 120 },
      { skillName: 'Analytics', xpBonus: 80 }
    ],
    requirements: { level: 20, skills: { Intelligence: 15, Strategy: 10 } },
    conditions: {
      energyLevel: "> 80%",
      timeRequired: "Full day available"
    },
    tags: ['strategic', 'mastery', 'synthesis'],
    createdAt: new Date(),
    aiGenerated: false,
    usageCount: 0,
    isOnCooldown: false
  },

  // WARRIOR CARDS
  {
    id: 'war_discipline_strike',
    name: 'Daily Discipline Strike',
    description: 'Complete your entire morning routine perfectly with unwavering focus.',
    type: 'action',
    rarity: 'common',
    classTypes: ['warrior'],
    energyCost: 25,
    duration: 1,
    impact: 40,
    skillBonus: [
      { skillName: 'Discipline', xpBonus: 30 },
      { skillName: 'Consistency', xpBonus: 20 }
    ],
    requirements: { level: 1 },
    conditions: {
      energyLevel: "> 20%",
      timeRequired: "Morning routine time"
    },
    tags: ['morning', 'routine', 'discipline'],
    createdAt: new Date(),
    aiGenerated: false,
    usageCount: 0,
    isOnCooldown: false
  },
  {
    id: 'war_endurance_training',
    name: 'Endurance Training',
    description: 'Push through 2 hours of challenging physical or mental training.',
    type: 'action',
    rarity: 'uncommon',
    classTypes: ['warrior'],
    energyCost: 40,
    duration: 2,
    impact: 80,
    cooldown: 24,
    skillBonus: [
      { skillName: 'Stamina', xpBonus: 40 },
      { skillName: 'Resilience', xpBonus: 30 }
    ],
    requirements: { level: 3 },
    conditions: {
      energyLevel: "> 30%",
      timeRequired: "2+ hours available"
    },
    tags: ['training', 'endurance', 'challenge'],
    createdAt: new Date(),
    aiGenerated: false,
    usageCount: 0,
    isOnCooldown: false
  },
  {
    id: 'war_unbreakable_fortress',
    name: 'Unbreakable Fortress',
    description: 'Maintain perfect discipline throughout an entire day, completing all planned tasks.',
    type: 'power',
    rarity: 'epic',
    classTypes: ['warrior'],
    energyCost: 80,
    duration: 12,
    impact: 200,
    cooldown: 72,
    skillBonus: [
      { skillName: 'Discipline', xpBonus: 80 },
      { skillName: 'Resilience', xpBonus: 60 },
      { skillName: 'Consistency', xpBonus: 70 }
    ],
    requirements: { level: 15, skills: { Discipline: 10 } },
    conditions: {
      energyLevel: "> 70%",
      timeRequired: "Full day commitment"
    },
    tags: ['fortress', 'discipline', 'mastery'],
    createdAt: new Date(),
    aiGenerated: false,
    usageCount: 0,
    isOnCooldown: false
  },

  // CREATOR CARDS
  {
    id: 'create_flow_session',
    name: 'Creative Flow Session',
    description: 'Enter a 3-hour state of pure creative flow on your chosen project.',
    type: 'action',
    rarity: 'common',
    classTypes: ['creator'],
    energyCost: 35,
    duration: 3,
    impact: 70,
    skillBonus: [
      { skillName: 'Creativity', xpBonus: 40 },
      { skillName: 'Execution', xpBonus: 25 }
    ],
    requirements: { level: 1 },
    conditions: {
      energyLevel: "> 30%",
      timeRequired: "3+ uninterrupted hours"
    },
    tags: ['flow', 'creative', 'project'],
    createdAt: new Date(),
    aiGenerated: false,
    usageCount: 0,
    isOnCooldown: false
  },
  {
    id: 'create_innovation_sprint',
    name: 'Innovation Sprint',
    description: 'Rapidly prototype and test 3 completely new ideas in one intensive session.',
    type: 'action',
    rarity: 'rare',
    classTypes: ['creator'],
    energyCost: 50,
    duration: 4,
    impact: 100,
    cooldown: 48,
    skillBonus: [
      { skillName: 'Innovation', xpBonus: 50 },
      { skillName: 'Creativity', xpBonus: 40 },
      { skillName: 'Execution', xpBonus: 30 }
    ],
    requirements: { level: 7 },
    conditions: {
      energyLevel: "> 40%",
      timeRequired: "4+ focused hours"
    },
    tags: ['innovation', 'prototype', 'sprint'],
    createdAt: new Date(),
    aiGenerated: false,
    usageCount: 0,
    isOnCooldown: false
  },
  {
    id: 'create_masterpiece',
    name: 'Visionary Masterpiece',
    description: 'Create something truly groundbreaking that combines all your creative skills.',
    type: 'power',
    rarity: 'legendary',
    classTypes: ['creator'],
    energyCost: 90,
    duration: 10,
    impact: 350,
    cooldown: 168,
    skillBonus: [
      { skillName: 'Creativity', xpBonus: 120 },
      { skillName: 'Vision', xpBonus: 100 },
      { skillName: 'Innovation', xpBonus: 90 },
      { skillName: 'Execution', xpBonus: 80 }
    ],
    requirements: { level: 25, skills: { Creativity: 15, Vision: 12 } },
    conditions: {
      energyLevel: "> 80%",
      timeRequired: "Multi-day project time"
    },
    tags: ['masterpiece', 'vision', 'groundbreaking'],
    createdAt: new Date(),
    aiGenerated: false,
    usageCount: 0,
    isOnCooldown: false
  },

  // CONNECTOR CARDS
  {
    id: 'connect_meaningful_conversation',
    name: 'Meaningful Conversation',
    description: 'Have a deep, purposeful conversation that strengthens a relationship.',
    type: 'action',
    rarity: 'common',
    classTypes: ['connector'],
    energyCost: 20,
    duration: 1,
    impact: 45,
    skillBonus: [
      { skillName: 'Charisma', xpBonus: 25 },
      { skillName: 'Empathy', xpBonus: 30 }
    ],
    requirements: { level: 1 },
    conditions: {
      energyLevel: "> 20%",
      timeRequired: "1+ hour for conversation"
    },
    tags: ['conversation', 'relationship', 'connection'],
    createdAt: new Date(),
    aiGenerated: false,
    usageCount: 0,
    isOnCooldown: false
  },
  {
    id: 'connect_network_expansion',
    name: 'Network Expansion',
    description: 'Actively reach out and make 5 new meaningful professional connections.',
    type: 'action',
    rarity: 'uncommon',
    classTypes: ['connector'],
    energyCost: 45,
    duration: 3,
    impact: 85,
    cooldown: 24,
    skillBonus: [
      { skillName: 'Network', xpBonus: 45 },
      { skillName: 'Charisma', xpBonus: 30 }
    ],
    requirements: { level: 4 },
    conditions: {
      energyLevel: "> 35%",
      timeRequired: "3+ hours for networking"
    },
    tags: ['networking', 'expansion', 'professional'],
    createdAt: new Date(),
    aiGenerated: false,
    usageCount: 0,
    isOnCooldown: false
  },
  {
    id: 'connect_leadership_mastery',
    name: 'Leadership Mastery Circle',
    description: 'Organize and lead a group initiative that creates lasting positive impact.',
    type: 'power',
    rarity: 'epic',
    classTypes: ['connector'],
    energyCost: 75,
    duration: 6,
    impact: 180,
    cooldown: 72,
    skillBonus: [
      { skillName: 'Leadership', xpBonus: 70 },
      { skillName: 'Charisma', xpBonus: 50 },
      { skillName: 'Network', xpBonus: 60 }
    ],
    requirements: { level: 18, skills: { Leadership: 12, Charisma: 10 } },
    conditions: {
      energyLevel: "> 60%",
      timeRequired: "Group coordination time"
    },
    tags: ['leadership', 'group', 'impact'],
    createdAt: new Date(),
    aiGenerated: false,
    usageCount: 0,
    isOnCooldown: false
  },

  // SAGE CARDS
  {
    id: 'sage_mindfulness_practice',
    name: 'Mindfulness Meditation',
    description: 'Practice deep mindfulness meditation for 1 hour to cultivate inner peace.',
    type: 'recovery',
    rarity: 'common',
    classTypes: ['sage'],
    energyCost: 15,
    duration: 1,
    impact: 35,
    skillBonus: [
      { skillName: 'Mindfulness', xpBonus: 35 },
      { skillName: 'Balance', xpBonus: 20 }
    ],
    requirements: { level: 1 },
    conditions: {
      energyLevel: "> 15%",
      timeRequired: "1 hour of quiet time"
    },
    tags: ['meditation', 'mindfulness', 'peace'],
    createdAt: new Date(),
    aiGenerated: false,
    usageCount: 0,
    isOnCooldown: false
  },
  {
    id: 'sage_wisdom_reading',
    name: 'Wisdom Reading Reflection',
    description: 'Study philosophical or spiritual texts for 2 hours with deep reflection.',
    type: 'action',
    rarity: 'uncommon',
    classTypes: ['sage'],
    energyCost: 30,
    duration: 2,
    impact: 60,
    cooldown: 24,
    skillBonus: [
      { skillName: 'Wisdom', xpBonus: 40 },
      { skillName: 'Intuition', xpBonus: 25 }
    ],
    requirements: { level: 5 },
    conditions: {
      energyLevel: "> 25%",
      timeRequired: "2+ hours of study time"
    },
    tags: ['wisdom', 'reading', 'reflection'],
    createdAt: new Date(),
    aiGenerated: false,
    usageCount: 0,
    isOnCooldown: false
  },
  {
    id: 'sage_enlightenment_retreat',
    name: 'Enlightenment Retreat',
    description: 'Spend a full day in complete mindful retreat, integrating all wisdom practices.',
    type: 'power',
    rarity: 'legendary',
    classTypes: ['sage'],
    energyCost: 70,
    duration: 8,
    impact: 250,
    cooldown: 168,
    skillBonus: [
      { skillName: 'Mindfulness', xpBonus: 100 },
      { skillName: 'Wisdom', xpBonus: 90 },
      { skillName: 'Balance', xpBonus: 110 },
      { skillName: 'Intuition', xpBonus: 70 }
    ],
    requirements: { level: 22, skills: { Mindfulness: 15, Wisdom: 12 } },
    conditions: {
      energyLevel: "> 70%",
      timeRequired: "Full day retreat"
    },
    tags: ['enlightenment', 'retreat', 'integration'],
    createdAt: new Date(),
    aiGenerated: false,
    usageCount: 0,
    isOnCooldown: false
  },

  // UNIVERSAL CARDS (all classes can use)
  {
    id: 'universal_energy_boost',
    name: 'Energy Restoration',
    description: 'Take a 30-minute power nap or meditation to restore energy.',
    type: 'recovery',
    rarity: 'common',
    classTypes: ['strategist', 'warrior', 'creator', 'connector', 'sage'],
    energyCost: -20, // Restores energy
    duration: 0.5,
    impact: 20,
    skillBonus: [],
    requirements: { level: 1 },
    conditions: {
      energyLevel: "< 50%",
      timeRequired: "30 minutes of rest"
    },
    tags: ['recovery', 'rest', 'universal'],
    createdAt: new Date(),
    aiGenerated: false,
    usageCount: 0,
    isOnCooldown: false
  },
  {
    id: 'universal_goal_review',
    name: 'Goal Alignment Session',
    description: 'Review and realign your goals with your current priorities and values.',
    type: 'event',
    rarity: 'uncommon',
    classTypes: ['strategist', 'warrior', 'creator', 'connector', 'sage'],
    energyCost: 25,
    duration: 1,
    impact: 50,
    cooldown: 168, // Weekly
    skillBonus: [
      { skillName: 'Focus', xpBonus: 20 },
      { skillName: 'Strategy', xpBonus: 15 }
    ],
    requirements: { level: 3 },
    conditions: {
      energyLevel: "> 25%",
      timeRequired: "1 hour of reflection"
    },
    tags: ['goals', 'alignment', 'planning'],
    createdAt: new Date(),
    aiGenerated: false,
    usageCount: 0,
    isOnCooldown: false
  }
];

export const rarityColors = {
  common: 'border-slate-400 shadow-slate-400/30',
  uncommon: 'border-green-500 shadow-green-500/40',
  rare: 'border-blue-500 shadow-blue-500/50',
  epic: 'border-purple-500 shadow-purple-500/60',
  legendary: 'border-amber-500 shadow-amber-500/80 animate-pulse'
};

export const typeIcons = {
  action: '⚔️',
  power: '✨',
  recovery: '💚',
  event: '📅',
  equipment: '🛡️'
};

export function getCardsForClass(characterClass: CharacterClass): Card[] {
  return baseCards.filter(card => 
    card.classTypes.includes(characterClass) || 
    card.classTypes.length === 5 // Universal cards
  );
}

export function getCardsByRarity(rarity: string): Card[] {
  return baseCards.filter(card => card.rarity === rarity);
}

export function getAvailableCards(characterClass: CharacterClass, level: number): Card[] {
  return baseCards.filter(card => {
    // Check class compatibility
    const classMatch = card.classTypes.includes(characterClass) || card.classTypes.length === 5;
    
    // Check level requirement
    const levelMatch = !card.requirements.level || level >= card.requirements.level;
    
    return classMatch && levelMatch;
  });
}