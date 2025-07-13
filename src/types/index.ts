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
  energyCost: number;
  duration: number; // horas
  impact: number; // puntos hacia quest
  cooldown?: number; // horas
  conditions?: {
    requiredEnergyLevel?: string; // "> 75%"
    timeRequired?: string;
    mentalState?: string[];
    prerequisiteCards?: string[];
  };
  effects?: {
    type: 'energy' | 'multiplier' | 'unlock' | 'bonus';
    target: string;
    value: number;
    duration?: number;
  }[];
  tags: string[];
  createdAt: Date;
  aiGenerated: boolean;
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

export type PageType = 'dashboard' | 'log-activity' | 'habits' | 'todo' | 'goals' | 'rewards' | 'wellbeing' | 'analytics' | 'profile' | 'card-inventory' | 'quest-designer' | 'card-generator';