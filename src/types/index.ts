export interface Task {
  id: number;
  date: string;
  category: string;
  task: string;
  points: number;
  comment?: string;
  emotionBefore?: string;
  emotionAfter?: string;
  energyLevel?: number;
}

export interface Habit {
  id: number;
  name: string;
  category: string;
  points: number;
}

export interface Todo {
  id: number;
  task: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Completed';
  points: number;
}

export interface Reward {
  id: number;
  name: string;
  description: string;
  points: number;
  category: string;
  redeemed: boolean;
}

export interface RedeemedReward {
  id: number;
  name: string;
  points: number;
  redeemedOn: string;
}

export interface EmotionalLog {
  id: number;
  date: string;
  morningEmotion: string;
  morningEnergy: number;
  morningNotes: string;
  eveningEmotion: string;
  eveningEnergy: number;
  eveningNotes: string;
  gratitude: string;
}

export interface AppData {
  tasks: Task[];
  habits: Habit[];
  todos: Todo[];
  rewards: Reward[];
  redeemedRewards: RedeemedReward[];
  emotionalLogs: EmotionalLog[];
  goals: Goal[];
  // LifeQuest RPG Character System
  character: Character;
  // LifeQuest Cards data
  cards: {
    inventory: Card[];
    activeCards: string[];
    cooldowns: Record<string, Date>;
  };
  quests: {
    active: Quest[];
    completed: Quest[];
  };
  energy: EnergyState;
  recommendations: {
    daily: Card[];
    lastGenerated: Date;
  };
}

// Enhanced Goal interface with character development integration
export interface Goal {
  id: number;
  title: string;
  description: string;
  
  // Goal categorization
  domain: GoalDomain;
  category: GoalCategory;
  
  // Character development
  relatedSkills: string[]; // Which character skills this goal develops
  classAlignment: CharacterClass[]; // Which classes benefit most from this goal
  
  // Planning and tracking
  timeframe: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Active' | 'Completed' | 'Paused';
  createdAt: string;
  completedAt?: string;
  progress: number;
  
  // Milestones and subtasks
  milestones: GoalMilestone[];
  
  // AI-generated plan (optional)
  aiPlan?: {
    habits: Array<{
      name: string;
      category: string;
      points: number;
      description: string;
    }>;
    rewards: Array<{
      name: string;
      description: string;
      points: number;
      category: string;
    }>;
    milestones: Array<{
      title: string;
      description: string;
      points: number;
    }>;
  };
  
  // Tracking
  weeklyProgress: number; // Progress made this week
  estimatedCompletion?: string; // AI-estimated completion date
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Epic';
}

export type GoalDomain = 
  | 'career'
  | 'health'
  | 'relationships'
  | 'personal-growth'
  | 'creativity'
  | 'financial'
  | 'education'
  | 'spiritual';

export type GoalCategory = 
  // Career
  | 'job-search'
  | 'skill-development'
  | 'networking'
  | 'leadership'
  | 'project-completion'
  // Health
  | 'fitness'
  | 'nutrition'
  | 'mental-health'
  | 'sleep'
  | 'habits'
  // Relationships
  | 'family'
  | 'friends'
  | 'romantic'
  | 'community'
  | 'communication'
  // Personal Growth
  | 'self-improvement'
  | 'mindfulness'
  | 'confidence'
  | 'productivity'
  | 'life-balance'
  // Creativity
  | 'artistic'
  | 'writing'
  | 'music'
  | 'crafts'
  | 'innovation'
  // Financial
  | 'saving'
  | 'investing'
  | 'debt-reduction'
  | 'income'
  | 'budgeting'
  // Education
  | 'formal-education'
  | 'self-study'
  | 'certifications'
  | 'languages'
  | 'reading'
  // Spiritual
  | 'meditation'
  | 'faith'
  | 'purpose'
  | 'gratitude'
  | 'service';

export interface GoalMilestone {
  id: string;
  title: string;
  description: string;
  targetProgress: number; // What % progress this represents
  completed: boolean;
  completedAt?: string;
  reward?: {
    experience: number;
    skillPoints?: Record<string, number>;
    achievement?: string;
  };
}

// Goal templates by character class
export const goalTemplatesByClass: Record<CharacterClass, GoalTemplate[]> = {
  strategist: [
    {
      title: "Master Project Management",
      domain: "career",
      category: "skill-development",
      relatedSkills: ["planning", "analysis", "leadership"],
      description: "Complete a professional certification in project management",
      difficulty: "Hard",
      suggestedTimeframe: "3 months"
    },
    {
      title: "Optimize Daily Routines",
      domain: "personal-growth",
      category: "productivity",
      relatedSkills: ["planning", "resourcefulness"],
      description: "Design and implement an efficient daily routine system",
      difficulty: "Medium",
      suggestedTimeframe: "1 month"
    }
  ],
  warrior: [
    {
      title: "Complete Fitness Challenge",
      domain: "health",
      category: "fitness",
      relatedSkills: ["resilience", "discipline", "competition"],
      description: "Train for and complete a physical challenge (marathon, triathlon, etc.)",
      difficulty: "Epic",
      suggestedTimeframe: "6 months"
    },
    {
      title: "Leadership Initiative",
      domain: "career",
      category: "leadership",
      relatedSkills: ["leadership", "courage", "competition"],
      description: "Take charge of a major project or team at work",
      difficulty: "Hard",
      suggestedTimeframe: "3 months"
    }
  ],
  creator: [
    {
      title: "Complete Creative Project",
      domain: "creativity",
      category: "artistic",
      relatedSkills: ["creativity", "innovation", "expression"],
      description: "Finish a major creative work (album, novel, art series)",
      difficulty: "Hard",
      suggestedTimeframe: "6 months"
    },
    {
      title: "Build Online Presence",
      domain: "career",
      category: "networking",
      relatedSkills: ["expression", "adaptability", "creativity"],
      description: "Establish a strong creative portfolio and social media presence",
      difficulty: "Medium",
      suggestedTimeframe: "2 months"
    }
  ],
  connector: [
    {
      title: "Expand Professional Network",
      domain: "career",
      category: "networking",
      relatedSkills: ["charisma", "communication", "teamwork"],
      description: "Attend events and make 50 meaningful professional connections",
      difficulty: "Medium",
      suggestedTimeframe: "3 months"
    },
    {
      title: "Strengthen Relationships",
      domain: "relationships",
      category: "family",
      relatedSkills: ["empathy", "communication", "support"],
      description: "Dedicate quality time to important relationships weekly",
      difficulty: "Easy",
      suggestedTimeframe: "Ongoing"
    }
  ],
  sage: [
    {
      title: "Complete Advanced Learning",
      domain: "education",
      category: "self-study",
      relatedSkills: ["wisdom", "learning", "focus"],
      description: "Master a new field of study or complete an advanced course",
      difficulty: "Hard",
      suggestedTimeframe: "4 months"
    },
    {
      title: "Develop Mindfulness Practice",
      domain: "spiritual",
      category: "meditation",
      relatedSkills: ["patience", "wisdom", "intuition"],
      description: "Establish a daily meditation practice for mental clarity",
      difficulty: "Medium",
      suggestedTimeframe: "2 months"
    }
  ]
};

export interface GoalTemplate {
  title: string;
  domain: GoalDomain;
  category: GoalCategory;
  relatedSkills: string[];
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Epic';
  suggestedTimeframe: string;
}

// Helper functions for goal management
export const getGoalDomainIcon = (domain: GoalDomain): string => {
  const icons: Record<GoalDomain, string> = {
    'career': '💼',
    'health': '❤️',
    'relationships': '👥',
    'personal-growth': '🌱',
    'creativity': '🎨',
    'financial': '💰',
    'education': '📚',
    'spiritual': '🧘'
  };
  return icons[domain] || '🎯';
};

export const getGoalDomainColor = (domain: GoalDomain): string => {
  const colors: Record<GoalDomain, string> = {
    'career': 'text-blue-400',
    'health': 'text-green-400',
    'relationships': 'text-pink-400',
    'personal-growth': 'text-purple-400',
    'creativity': 'text-orange-400',
    'financial': 'text-yellow-400',
    'education': 'text-indigo-400',
    'spiritual': 'text-cyan-400'
  };
  return colors[domain] || 'text-slate-400';
};

export interface Card {
  id: string;
  name: string;
  description: string;
  type: 'action' | 'power' | 'recovery' | 'event' | 'equipment';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  classTypes: CharacterClass[]; // Which classes can use this card
  energyCost: number;
  duration: number; // hours
  impact: number; // XP gained
  cooldown?: number; // hours
  skillBonus: {
    skillName: string;
    xpBonus: number;
    temporaryBoost?: number;
  }[];
  requirements: {
    level?: number;
    skills?: Record<string, number>;
    prerequisiteCards?: string[];
  };
  conditions: {
    energyLevel?: string; // "> 75%"
    timeRequired?: string;
    mentalState?: string[];
  };
  tags: string[];
  createdAt: Date;
  forged: boolean;
  usageCount: number;
  lastUsed?: Date;
  isOnCooldown: boolean;
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  type: 'career' | 'health' | 'relationships' | 'skills' | 'creative';
  difficulty: 'easy' | 'medium' | 'hard' | 'epic' | 'legendary';
  estimatedDuration: number; // días
  deadline?: Date;
  progress: number; // 0-100
  status: 'active' | 'completed' | 'paused' | 'failed';
  milestones: {
    id: string;
    name: string;
    requiredProgress: number;
    rewards: { type: string; value: number }[];
    completed: boolean;
  }[];
  rewards: {
    experience: number;
    cards: string[];
    unlocks: string[];
  };
  createdAt: Date;
}

export interface EnergyState {
  current: number;
  maximum: number;
  regenerationRate: number; // por hora
  lastUpdate: Date;
  dailyUsage: {
    date: string;
    usage: { time: string; amount: number; activity: string }[];
  }[];
}

export interface UserInventory {
  cards: Card[];
  activeCards: string[]; // IDs de cartas actualmente en uso
  favoriteCards: string[];
}

export interface CardResult {
  success: boolean;
  energyConsumed: number;
  progressGained: number;
  effects: string[];
  message: string;
}

export interface EnergyForecast {
  estimatedConsumption: number;
  remainingEnergy: number;
  regenerationTime: number;
  recommendations: string[];
}

// Character Classes for LifeQuest RPG
export type CharacterClass = 'strategist' | 'warrior' | 'creator' | 'connector' | 'sage';

export interface Character {
  id: string;
  name: string;
  class: CharacterClass;
  level: number; // 1-50
  experience: number;
  skillPoints: number;
  avatar: string;
  
  // Energy specific by class
  energy: {
    current: number;
    maximum: number;
    regenerationRate: number;
    lastUpdate: Date;
  };
  
  // Skills specific by class
  skills: Record<string, {
    level: number;
    experience: number;
    totalXP: number;
  }>;
  
  // Inventory and progress
  deck: Card[];
  activeDeck: string[]; // IDs of equipped cards
  completedCards: CardCompletion[];
  achievements: Achievement[];
  
  // Game state
  currentGoals: Goal[];
  dailyProgress: DailyProgress;
  streak: number;
  prestigeLevel: number;
  
  // Character creation
  isOnboarded: boolean;
  personalityTestResults?: PersonalityTestResult;
}

export interface PersonalityTestResult {
  scores: Record<CharacterClass, number>;
  dominantClass: CharacterClass;
  secondaryClass: CharacterClass;
  testDate: Date;
}

export interface PersonalityQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    class: CharacterClass;
    weight: number;
  }[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
  requirements: {
    type: 'level' | 'cards_completed' | 'streak' | 'skill_level' | 'quest_completed';
    value: number;
    skillName?: string;
  }[];
  rewards: {
    experience?: number;
    cards?: string[];
    title?: string;
  };
}

export interface CardCompletion {
  cardId: string;
  completedAt: Date;
  feedback: string;
  satisfaction: number; // 1-5
  energyUsed: number;
  xpGained: number;
}

export interface DailyProgress {
  date: string;
  cardsCompleted: number;
  energyUsed: number;
  xpGained: number;
  goalsAdvanced: string[];
  mood: 'excellent' | 'good' | 'neutral' | 'poor' | 'terrible';
  notes: string;
}

export type PageType = 'character-hub' | 'card-deck' | 'training-ground' | 'character-sheet' | 'guild-settings' | 'personality-test' | 'class-reveal';