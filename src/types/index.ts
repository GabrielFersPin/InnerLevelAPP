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

export type PageType = 'dashboard' | 'log-activity' | 'habits' | 'todo' | 'rewards' | 'wellbeing' | 'analytics';