import { CharacterClass, Character } from '../types/index';

export const classSkillsets: Record<CharacterClass, string[]> = {
  strategist: ["Intelligence", "Focus", "Analytics", "Strategy"],
  warrior: ["Discipline", "Stamina", "Resilience", "Consistency"],  
  creator: ["Creativity", "Innovation", "Execution", "Vision"],
  connector: ["Charisma", "Network", "Empathy", "Leadership"],
  sage: ["Mindfulness", "Wisdom", "Balance", "Intuition"]
};

export const classEnergyConfig: Record<CharacterClass, {
  maxEnergy: number;
  regenRate: number;
  energyType: string;
}> = {
  strategist: { maxEnergy: 120, regenRate: 8, energyType: "Mana" },
  warrior: { maxEnergy: 150, regenRate: 10, energyType: "Stamina" },
  creator: { maxEnergy: 100, regenRate: 12, energyType: "Inspiration" },
  connector: { maxEnergy: 110, regenRate: 12, energyType: "Social Energy" },
  sage: { maxEnergy: 130, regenRate: 15, energyType: "Inner Peace" }
};

export function createNewCharacter(
  name: string, 
  characterClass: CharacterClass,
  personalityTestResult?: any
): Character {
  const config = classEnergyConfig[characterClass];
  const skills = classSkillsets[characterClass];
  
  // Initialize skills with starting values
  const characterSkills: Record<string, { level: number; experience: number; totalXP: number }> = {};
  skills.forEach(skill => {
    characterSkills[skill] = {
      level: 1,
      experience: 0,
      totalXP: 0
    };
  });

  return {
    id: `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    class: characterClass,
    level: 1,
    experience: 0,
    skillPoints: 0,
    avatar: `${characterClass}_1`, // Will be used to determine avatar image
    
    energy: {
      current: config.maxEnergy,
      maximum: config.maxEnergy,
      regenerationRate: config.regenRate,
      lastUpdate: new Date()
    },
    
    skills: characterSkills,
    
    deck: [],
    activeDeck: [],
    completedCards: [],
    achievements: [],
    
    currentGoals: [],
    dailyProgress: {
      date: new Date().toISOString().split('T')[0],
      cardsCompleted: 0,
      energyUsed: 0,
      xpGained: 0,
      goalsAdvanced: [],
      mood: 'neutral',
      notes: ''
    },
    streak: 0,
    prestigeLevel: 0,
    
    isOnboarded: false,
    personalityTestResults: personalityTestResult
  };
}

export function getClassTheme(characterClass: CharacterClass): {
  background: string;
  panel: string;
  text: string;
  accent: string;
  border: string;
} {
  const themes = {
    strategist: {
      background: "from-slate-900 via-blue-900 to-indigo-900",
      panel: "bg-blue-900/90 border-blue-400/30",
      text: "text-blue-100",
      accent: "text-blue-300",
      border: "border-blue-400/50"
    },
    warrior: {
      background: "from-slate-900 via-red-900 to-orange-900", 
      panel: "bg-red-900/90 border-amber-500/30",
      text: "text-red-100",
      accent: "text-amber-300",
      border: "border-amber-500/50"
    },
    creator: {
      background: "from-slate-900 via-purple-900 to-pink-900",
      panel: "bg-purple-900/90 border-purple-400/30", 
      text: "text-purple-100",
      accent: "text-purple-300",
      border: "border-purple-400/50"
    },
    connector: {
      background: "from-slate-900 via-green-900 to-emerald-900",
      panel: "bg-green-900/90 border-emerald-400/30",
      text: "text-green-100", 
      accent: "text-emerald-300",
      border: "border-emerald-400/50"
    },
    sage: {
      background: "from-slate-900 via-amber-900 to-orange-900",
      panel: "bg-amber-900/90 border-amber-300/30",
      text: "text-amber-100",
      accent: "text-amber-200", 
      border: "border-amber-300/50"
    }
  };
  
  return themes[characterClass];
}

export function calculateLevelFromXP(experience: number): number {
  // Exponential leveling: Level = floor(sqrt(XP / 100)) + 1
  // Level 1: 0 XP, Level 2: 100 XP, Level 3: 400 XP, Level 4: 900 XP, etc.
  return Math.min(50, Math.floor(Math.sqrt(experience / 100)) + 1);
}

export function getXPRequiredForLevel(level: number): number {
  // XP required for level N = (N-1)^2 * 100
  return Math.pow(level - 1, 2) * 100;
}

export function getXPRequiredForNextLevel(currentLevel: number): number {
  return getXPRequiredForLevel(currentLevel + 1);
}