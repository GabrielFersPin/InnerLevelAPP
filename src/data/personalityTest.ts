import { PersonalityQuestion, CharacterClass } from '../types/index';

export const personalityQuestions: PersonalityQuestion[] = [
  {
    id: 1,
    question: "When facing a major challenge, your first instinct is to:",
    options: [
      { text: "Analyze all variables and create a detailed plan", class: "strategist", weight: 2 },
      { text: "Break it into small tasks and start immediately", class: "warrior", weight: 2 },
      { text: "Look for a creative and innovative solution", class: "creator", weight: 2 },
      { text: "Talk to others to get different perspectives", class: "connector", weight: 2 },
      { text: "Reflect on why this challenge appeared in your life", class: "sage", weight: 2 }
    ]
  },
  {
    id: 2,
    question: "Your ideal work environment would be:",
    options: [
      { text: "A data-rich space with multiple monitors and analytics", class: "strategist", weight: 2 },
      { text: "An organized workspace where you can focus intensely", class: "warrior", weight: 2 },
      { text: "A creative studio with inspiring materials around", class: "creator", weight: 2 },
      { text: "An open office where you can collaborate easily", class: "connector", weight: 2 },
      { text: "A peaceful space that promotes mindful thinking", class: "sage", weight: 2 }
    ]
  },
  {
    id: 3,
    question: "When learning something new, you prefer to:",
    options: [
      { text: "Research thoroughly and understand all the theory first", class: "strategist", weight: 2 },
      { text: "Jump in and learn through consistent practice", class: "warrior", weight: 2 },
      { text: "Experiment and find your own unique approach", class: "creator", weight: 2 },
      { text: "Learn from others and discuss ideas together", class: "connector", weight: 2 },
      { text: "Understand the deeper meaning and philosophy behind it", class: "sage", weight: 2 }
    ]
  },
  {
    id: 4,
    question: "Your greatest strength in achieving goals is:",
    options: [
      { text: "Strategic thinking and optimization", class: "strategist", weight: 2 },
      { text: "Unwavering discipline and consistency", class: "warrior", weight: 2 },
      { text: "Innovation and thinking outside the box", class: "creator", weight: 2 },
      { text: "Building relationships and inspiring others", class: "connector", weight: 2 },
      { text: "Maintaining balance and long-term perspective", class: "sage", weight: 2 }
    ]
  },
  {
    id: 5,
    question: "When you're feeling stuck or overwhelmed, you:",
    options: [
      { text: "Analyze the situation to find the optimal next step", class: "strategist", weight: 2 },
      { text: "Push through with determination and willpower", class: "warrior", weight: 2 },
      { text: "Take a break and let inspiration come naturally", class: "creator", weight: 2 },
      { text: "Reach out to friends or mentors for support", class: "connector", weight: 2 },
      { text: "Practice mindfulness and reconnect with your purpose", class: "sage", weight: 2 }
    ]
  },
  {
    id: 6,
    question: "Your ideal way to measure progress would be:",
    options: [
      { text: "Detailed metrics and data-driven insights", class: "strategist", weight: 2 },
      { text: "Clear streaks and completion rates", class: "warrior", weight: 2 },
      { text: "Creative milestones and breakthrough moments", class: "creator", weight: 2 },
      { text: "Feedback from others and relationship growth", class: "connector", weight: 2 },
      { text: "Inner peace and wisdom gained", class: "sage", weight: 2 }
    ]
  },
  {
    id: 7,
    question: "When working on a team project, you naturally:",
    options: [
      { text: "Become the planner who optimizes the workflow", class: "strategist", weight: 2 },
      { text: "Keep everyone accountable and on track", class: "warrior", weight: 2 },
      { text: "Generate ideas and propose innovative solutions", class: "creator", weight: 2 },
      { text: "Facilitate communication and resolve conflicts", class: "connector", weight: 2 },
      { text: "Provide wisdom and help maintain team balance", class: "sage", weight: 2 }
    ]
  },
  {
    id: 8,
    question: "Your relationship with time and schedules is:",
    options: [
      { text: "Highly structured - every minute should be optimized", class: "strategist", weight: 2 },
      { text: "Disciplined routine with non-negotiable time blocks", class: "warrior", weight: 2 },
      { text: "Flexible flow that allows for creative bursts", class: "creator", weight: 2 },
      { text: "Social calendar filled with meaningful connections", class: "connector", weight: 2 },
      { text: "Mindful presence - quality over quantity", class: "sage", weight: 2 }
    ]
  },
  {
    id: 9,
    question: "What motivates you most in personal development?",
    options: [
      { text: "Mastering systems and achieving measurable results", class: "strategist", weight: 2 },
      { text: "Building unbreakable habits and mental toughness", class: "warrior", weight: 2 },
      { text: "Expressing your unique potential and creating impact", class: "creator", weight: 2 },
      { text: "Growing relationships and helping others succeed", class: "connector", weight: 2 },
      { text: "Finding deeper meaning and inner transformation", class: "sage", weight: 2 }
    ]
  },
  {
    id: 10,
    question: "Your ideal end-of-day reflection would focus on:",
    options: [
      { text: "What you learned and how to optimize tomorrow", class: "strategist", weight: 2 },
      { text: "What you accomplished and maintained consistency", class: "warrior", weight: 2 },
      { text: "What you created and what inspired you", class: "creator", weight: 2 },
      { text: "Who you connected with and how you helped others", class: "connector", weight: 2 },
      { text: "How you grew as a person and what you're grateful for", class: "sage", weight: 2 }
    ]
  }
];

export const classDescriptions: Record<CharacterClass, {
  name: string;
  tagline: string;
  description: string;
  traits: string[];
  idealFor: string[];
  energyType: string;
  maxEnergy: number;
  regenRate: number;
  primarySkills: string[];
  themeColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}> = {
  strategist: {
    name: "The Strategist",
    tagline: "Plan every move, optimize every outcome",
    description: "You are a master of analysis and optimization. You see patterns others miss and create systems that maximize efficiency. Your power lies in turning data into decisive action.",
    traits: ["Analytical", "Methodical", "Data-driven", "Systematic", "Optimizer"],
    idealFor: ["Tech careers", "Analytics", "Process optimization", "Strategic planning"],
    energyType: "Mana",
    maxEnergy: 120,
    regenRate: 8,
    primarySkills: ["Intelligence", "Focus", "Analytics", "Strategy"],
    themeColors: {
      primary: "#3B82F6",
      secondary: "#1E40AF", 
      accent: "#60A5FA"
    }
  },
  warrior: {
    name: "The Warrior",
    tagline: "Iron discipline, relentless action",
    description: "You are the embodiment of discipline and perseverance. Where others see obstacles, you see training. Your strength grows with every challenge you overcome.",
    traits: ["Disciplined", "Persistent", "Action-oriented", "Resilient", "Committed"],
    idealFor: ["Fitness goals", "Habit building", "Personal discipline", "Endurance challenges"],
    energyType: "Stamina",
    maxEnergy: 150,
    regenRate: 10,
    primarySkills: ["Discipline", "Stamina", "Resilience", "Consistency"],
    themeColors: {
      primary: "#DC2626",
      secondary: "#991B1B",
      accent: "#F59E0B"
    }
  },
  creator: {
    name: "The Creator",
    tagline: "Innovation and expression are your force",
    description: "You see the world as a canvas of infinite possibilities. Your creative energy transforms ideas into reality and inspires others to think beyond conventional limits.",
    traits: ["Creative", "Innovative", "Experimental", "Visionary", "Expressive"],
    idealFor: ["Artistic projects", "Entrepreneurship", "Innovation", "Creative problem-solving"],
    energyType: "Inspiration",
    maxEnergy: 100,
    regenRate: 12, // Variable: 15/hour when creative, 3/hour in routine
    primarySkills: ["Creativity", "Innovation", "Execution", "Vision"],
    themeColors: {
      primary: "#7C3AED",
      secondary: "#5B21B6",
      accent: "#A78BFA"
    }
  },
  connector: {
    name: "The Connector",
    tagline: "Your strength lies in the bonds you build",
    description: "You understand that success is rarely a solo journey. You have the rare gift of bringing out the best in others while building networks that create lasting impact.",
    traits: ["Social", "Empathetic", "Collaborative", "Inspiring", "Supportive"],
    idealFor: ["Leadership roles", "Networking", "Team building", "Community building"],
    energyType: "Social Energy",
    maxEnergy: 110,
    regenRate: 12, // Higher during social interactions
    primarySkills: ["Charisma", "Network", "Empathy", "Leadership"],
    themeColors: {
      primary: "#059669",
      secondary: "#047857",
      accent: "#34D399"
    }
  },
  sage: {
    name: "The Sage",
    tagline: "Inner growth guides outer success",
    description: "You understand that true achievement comes from inner transformation. Your wisdom helps you navigate life's complexities with grace and maintain balance in an chaotic world.",
    traits: ["Reflective", "Wise", "Balanced", "Mindful", "Philosophical"],
    idealFor: ["Mindfulness practice", "Life balance", "Spiritual growth", "Wisdom cultivation"],
    energyType: "Inner Peace",
    maxEnergy: 130,
    regenRate: 15, // Higher during rest and meditation
    primarySkills: ["Mindfulness", "Wisdom", "Balance", "Intuition"],
    themeColors: {
      primary: "#7C2D12",
      secondary: "#451A03",
      accent: "#FED7AA"
    }
  }
};

export function calculatePersonalityResult(answers: Record<number, CharacterClass>): {
  scores: Record<CharacterClass, number>;
  dominantClass: CharacterClass;
  secondaryClass: CharacterClass;
} {
  const scores: Record<CharacterClass, number> = {
    strategist: 0,
    warrior: 0,
    creator: 0,
    connector: 0,
    sage: 0
  };

  // Calculate scores based on answers
  Object.values(answers).forEach(selectedClass => {
    scores[selectedClass] += 2; // Each answer gives 2 points to the selected class
  });

  // Sort classes by score
  const sortedClasses = Object.entries(scores)
    .sort(([,a], [,b]) => b - a)
    .map(([className]) => className as CharacterClass);

  return {
    scores,
    dominantClass: sortedClasses[0],
    secondaryClass: sortedClasses[1]
  };
}