import { Quest, Card } from '../types';

interface UserContext {
  energy: number;
  availableTime: number; // hours
  currentMood: string;
  recentActivity: string[];
  activeQuests: Quest[];
  preferences: string[];
}

export class AIService {
  private static readonly API_ENDPOINT = import.meta.env.VITE_CLAUDE_API_ENDPOINT;
  private static readonly API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;

  /**
   * Generate a structured quest plan based on user objective
   */
  static async generateQuest(
    objective: string, 
    timeline: number, 
    availability: number,
    userPreferences: string[] = []
  ): Promise<Quest> {
    const prompt = this.buildQuestPrompt(objective, timeline, availability, userPreferences);
    
    try {
      const response = await this.callClaude(prompt);
      return this.parseQuestResponse(response, objective);
    } catch (error) {
      console.error('Failed to generate quest with AI:', error);
      return this.generateFallbackQuest(objective, timeline);
    }
  }

  /**
   * Generate daily cards based on user context
   */
  static async generateDailyCards(userContext: UserContext): Promise<Card[]> {
    const prompt = this.buildDailyCardsPrompt(userContext);
    
    try {
      const response = await this.callClaude(prompt);
      return this.parseCardsResponse(response);
    } catch (error) {
      console.error('Failed to generate cards with AI:', error);
      return this.generateFallbackCards(userContext);
    }
  }

  /**
   * Generate contextual card suggestions
   */
  static async generateContextualCards(
    situation: string,
    goals: string[],
    constraints: string[]
  ): Promise<Card[]> {
    const prompt = this.buildContextualCardsPrompt(situation, goals, constraints);
    
    try {
      const response = await this.callClaude(prompt);
      return this.parseCardsResponse(response);
    } catch (error) {
      console.error('Failed to generate contextual cards:', error);
      return this.generateBasicCards();
    }
  }

  /**
   * Build quest generation prompt
   */
  private static buildQuestPrompt(
    objective: string, 
    timeline: number, 
    availability: number,
    preferences: string[]
  ): string {
    return `
Create a detailed quest plan for this objective: "${objective}"

Timeline: ${timeline} days
Daily availability: ${availability} hours
User preferences: ${preferences.join(', ')}

Generate a JSON response with this structure:
{
  "name": "Quest title",
  "description": "Detailed description",
  "type": "career|health|relationships|skills|creative",
  "difficulty": "easy|medium|hard|epic|legendary",
  "estimatedDuration": ${timeline},
  "milestones": [
    {
      "name": "Milestone name",
      "requiredProgress": 25,
      "rewards": [{"type": "experience", "value": 100}]
    }
  ],
  "rewards": {
    "experience": 500,
    "cards": ["card-id-1", "card-id-2"],
    "unlocks": ["feature-1"]
  },
  "suggestedCards": [
    {
      "name": "Card name",
      "description": "What this card does",
      "type": "action|power|recovery|event|equipment",
      "rarity": "common|uncommon|rare|epic|legendary",
      "energyCost": 20,
      "duration": 1,
      "impact": 15,
      "tags": ["relevant", "tags"]
    }
  ]
}

Make it engaging, realistic, and achievable within the given timeline.
    `;
  }

  /**
   * Build daily cards generation prompt
   */
  private static buildDailyCardsPrompt(userContext: UserContext): string {
    return `
Generate 3-5 personalized activity cards for today based on this context:

Current energy: ${userContext.energy}%
Available time: ${userContext.availableTime} hours
Current mood: ${userContext.currentMood}
Recent activities: ${userContext.recentActivity.join(', ')}
Active quests: ${userContext.activeQuests.map(q => q.name).join(', ')}
Preferences: ${userContext.preferences.join(', ')}

Generate a JSON array of cards:
[
  {
    "name": "Card name",
    "description": "Specific actionable description",
    "type": "action|power|recovery|event|equipment",
    "rarity": "common|uncommon|rare|epic|legendary",
    "energyCost": 15,
    "duration": 1,
    "impact": 20,
    "cooldown": 0,
    "conditions": {
      "requiredEnergyLevel": "> 50%",
      "timeRequired": "morning|afternoon|evening"
    },
    "effects": [
      {
        "type": "energy|multiplier|unlock|bonus",
        "target": "energy",
        "value": 10
      }
    ],
    "tags": ["productivity", "morning", "energy"]
  }
]

Make cards relevant to their current situation and energy level.
    `;
  }

  /**
   * Build contextual cards prompt
   */
  private static buildContextualCardsPrompt(
    situation: string,
    goals: string[],
    constraints: string[]
  ): string {
    return `
Generate 3-4 activity cards for this specific situation:

Situation: ${situation}
Goals: ${goals.join(', ')}
Constraints: ${constraints.join(', ')}

Return JSON array of cards optimized for this context, following the same structure as daily cards.
Focus on practical, immediately actionable activities.
    `;
  }

  /**
   * Call Claude API (mock implementation - replace with actual API call)
   */
  private static async callClaude(prompt: string): Promise<string> {
    // Mock implementation - replace with actual Claude API integration
    if (!this.API_KEY) {
      throw new Error('Claude API key not configured');
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock response for development
    throw new Error('Claude API not implemented - using fallback');
  }

  /**
   * Parse quest response from Claude
   */
  private static parseQuestResponse(response: string, objective: string): Quest {
    try {
      const parsed = JSON.parse(response);
      return {
        id: `quest-${Date.now()}`,
        name: parsed.name || objective,
        description: parsed.description || `Quest to achieve: ${objective}`,
        type: parsed.type || 'skills',
        difficulty: parsed.difficulty || 'medium',
        estimatedDuration: parsed.estimatedDuration || 30,
        progress: 0,
        status: 'active',
        milestones: parsed.milestones || [],
        rewards: parsed.rewards || { experience: 100, cards: [], unlocks: [] },
        createdAt: new Date()
      };
    } catch (error) {
      return this.generateFallbackQuest(objective, 30);
    }
  }

  /**
   * Parse cards response from Claude
   */
  private static parseCardsResponse(response: string): Card[] {
    try {
      const parsed = JSON.parse(response);
      return parsed.map((cardData: any) => ({
        id: `card-${Date.now()}-${Math.random()}`,
        name: cardData.name,
        description: cardData.description,
        type: cardData.type || 'action',
        rarity: cardData.rarity || 'common',
        energyCost: cardData.energyCost || 20,
        duration: cardData.duration || 1,
        impact: cardData.impact || 10,
        cooldown: cardData.cooldown || undefined,
        conditions: cardData.conditions,
        effects: cardData.effects,
        tags: cardData.tags || [],
        createdAt: new Date(),
        aiGenerated: true,
        usageCount: 0,
        isOnCooldown: false
      }));
    } catch (error) {
      return this.generateBasicCards();
    }
  }

  /**
   * Generate fallback quest when AI is unavailable
   */
  private static generateFallbackQuest(objective: string, timeline: number): Quest {
    return {
      id: `quest-${Date.now()}`,
      name: `Quest: ${objective}`,
      description: `Complete this important objective: ${objective}`,
      type: 'skills',
      difficulty: 'medium',
      estimatedDuration: timeline,
      progress: 0,
      status: 'active',
      milestones: [
        {
          id: 'milestone-1',
          name: 'First Step',
          requiredProgress: 25,
          rewards: [{ type: 'experience', value: 50 }],
          completed: false
        },
        {
          id: 'milestone-2',
          name: 'Halfway Point',
          requiredProgress: 50,
          rewards: [{ type: 'experience', value: 100 }],
          completed: false
        },
        {
          id: 'milestone-3',
          name: 'Almost There',
          requiredProgress: 75,
          rewards: [{ type: 'experience', value: 150 }],
          completed: false
        }
      ],
      rewards: {
        experience: 500,
        cards: [],
        unlocks: []
      },
      createdAt: new Date()
    };
  }

  /**
   * Generate fallback cards when AI is unavailable
   */
  private static generateFallbackCards(userContext: UserContext): Card[] {
    const baseCards = this.generateBasicCards();
    
    // Filter based on energy level
    return baseCards.filter(card => card.energyCost <= userContext.energy);
  }

  /**
   * Generate basic starter cards
   */
  private static generateBasicCards(): Card[] {
    return [
      {
        id: 'card-focus-session',
        name: 'Deep Focus Session',
        description: 'Engage in 25 minutes of focused work on your most important task',
        type: 'action',
        rarity: 'common',
        energyCost: 25,
        duration: 1,
        impact: 20,
        tags: ['productivity', 'focus'],
        createdAt: new Date(),
        aiGenerated: false,
        usageCount: 0,
        isOnCooldown: false
      },
      {
        id: 'card-energy-boost',
        name: 'Energy Restoration',
        description: 'Take a 10-minute mindful break to recharge your energy',
        type: 'recovery',
        rarity: 'uncommon',
        energyCost: 5,
        duration: 0.5,
        impact: 10,
        effects: [
          {
            type: 'energy',
            target: 'current',
            value: 15
          }
        ],
        tags: ['recovery', 'mindfulness'],
        createdAt: new Date(),
        aiGenerated: false,
        usageCount: 0,
        isOnCooldown: false
      },
      {
        id: 'card-skill-practice',
        name: 'Skill Practice',
        description: 'Dedicate 30 minutes to practicing a specific skill',
        type: 'action',
        rarity: 'common',
        energyCost: 30,
        duration: 1,
        impact: 25,
        tags: ['learning', 'skills'],
        createdAt: new Date(),
        aiGenerated: false,
        usageCount: 0,
        isOnCooldown: false
      }
    ];
  }
}