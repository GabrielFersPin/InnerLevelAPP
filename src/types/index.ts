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
  // Guild System data
  guild: GuildData;
}

export interface Goal {
  id: number;
  title: string;
  description: string;
  timeframe: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Active' | 'Completed' | 'Paused';
  createdAt: string;
  progress: number;
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
}

// LifeQuest Cards - New RPG System Types
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

// Guild System Types
export interface Guild {
  id: string;
  name: string;
  level: number;
  members: number;
  rank: string;
  joinedDate: string;
}

export interface Friend {
  id: number;
  name: string;
  class: CharacterClass;
  level: number;
  status: 'online' | 'offline';
  streak: number;
}

export interface FriendRequest {
  id: number;
  from: {
    id: number;
    name: string;
    class: CharacterClass;
    level: number;
  };
  message?: string;
  sentAt: string;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showStreak: boolean;
  showLevel: boolean;
  showGoals: 'public' | 'friends' | 'private';
  showAchievements: boolean;
  allowFriendRequests: boolean;
  allowGuildInvites: boolean;
}

export interface NotificationSettings {
  friendRequests: boolean;
  guildInvites: boolean;
  goalReminders: boolean;
  achievementUnlocks: boolean;
  weeklyReport: boolean;
  friendActivity: boolean;
}

export interface GuildData {
  currentGuild: Guild | null;
  friends: Friend[];
  friendRequests: FriendRequest[];
  privacy: PrivacySettings;
  notifications: NotificationSettings;
}

export type PageType = 'character-hub' | 'card-deck' | 'training-ground' | 'character-sheet' | 'guild-settings' | 'personality-test' | 'class-reveal';