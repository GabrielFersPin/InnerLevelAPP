import { Quest, Card, Character, CharacterClass } from '../types';
import { classDescriptions } from '../data/personalityTest';
import { getAvailableCards } from '../data/baseCards';

interface UserContext {
  character: Character;
  energy: number;
  availableTime: number; // hours
  currentMood: string;
  recentActivity: string[];
  activeQuests: Quest[];
  preferences: string[];
}

interface AICardRecommendation {
  cards: Card[];
  reasoning: string;
  energyForecast: {
    totalCost: number;
    remainingAfter: number;
    regenerationTime: number;
  };
}

export class ArcaneEngine {
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
   * Generate daily cards based on character class and context
   */
  static async generateDailyCards(userContext: UserContext): Promise<AICardRecommendation> {
    const prompt = this.buildDailyCardsPrompt(userContext);
    
    try {
      const response = await this.callClaude(prompt);
      const cards = this.parseCardsResponse(response);
      return this.buildRecommendation(cards, userContext);
    } catch (error) {
      console.error('Failed to generate cards with AI:', error);
      return this.generateFallbackRecommendation(userContext);
    }
  }

  /**
   * Generate class-specific card recommendations
   */
  static async generateClassSpecificCards(
    character: Character,
    situation: string = 'general'
  ): Promise<AICardRecommendation> {
    const prompt = this.buildClassSpecificPrompt(character, situation);
    
    try {
      const response = await this.callClaude(prompt);
      const cards = this.parseCardsResponse(response);
      return this.buildRecommendation(cards, { character, energy: character.energy.current, availableTime: 4, currentMood: 'neutral', recentActivity: [], activeQuests: [], preferences: [] });
    } catch (error) {
      console.error('Failed to generate class-specific cards:', error);
      return this.generateClassFallbackRecommendation(character, situation);
    }
  }

  /**
   * Generate goal-oriented card sequence
   */
  static async generateGoalCards(
    character: Character,
    goalDescription: string,
    timeframe: number
  ): Promise<Card[]> {
    const prompt = this.buildGoalCardsPrompt(character, goalDescription, timeframe);
    
    try {
      const response = await this.callClaude(prompt);
      return this.parseCardsResponse(response);
    } catch (error) {
      console.error('Failed to generate goal cards:', error);
      return this.generateGoalFallbackCards(character, goalDescription);
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
   * Build daily cards generation prompt with character class context
   */
  private static buildDailyCardsPrompt(userContext: UserContext): string {
    const { character } = userContext;
    const classInfo = classDescriptions[character.class];
    
    return `
You are generating personalized activity cards for a ${classInfo.name} in the LifeQuest RPG system.

CHARACTER PROFILE:
- Class: ${classInfo.name} - "${classInfo.tagline}"
- Level: ${character.level}
- Primary Skills: ${classInfo.primarySkills.join(', ')}
- Energy Type: ${classInfo.energyType}
- Current Energy: ${character.energy.current}/${character.energy.maximum}
- Available Time: ${userContext.availableTime} hours
- Current Mood: ${userContext.currentMood}

CLASS CHARACTERISTICS:
- Traits: ${classInfo.traits.join(', ')}
- Ideal For: ${classInfo.idealFor.join(', ')}
- Description: ${classInfo.description}

CONTEXT:
- Recent Activities: ${userContext.recentActivity.join(', ')}
- Active Quests: ${userContext.activeQuests.map(q => q.name).join(', ')}
- Daily Progress: ${character.dailyProgress.cardsCompleted} cards completed today

Generate 3-4 cards specifically optimized for this ${character.class} character:

JSON Response Format:
{
  "recommendations": [
    {
      "name": "Class-appropriate card name",
      "description": "Detailed, actionable description that aligns with ${character.class} strengths",
      "type": "action|power|recovery|event|equipment",
      "rarity": "common|uncommon|rare|epic|legendary",
      "classTypes": ["${character.class}"],
      "energyCost": 25,
      "duration": 1.5,
      "impact": 30,
      "skillBonus": [
        {
          "skillName": "${classInfo.primarySkills[0]}",
          "xpBonus": 20
        }
      ],
      "requirements": {
        "level": ${character.level}
      },
      "conditions": {
        "energyLevel": "> 30%",
        "timeRequired": "2+ hours available"
      },
      "tags": ["${character.class}", "skill-building"]
    }
  ],
  "reasoning": "Why these cards are perfect for this ${character.class} today"
}

Focus on cards that:
1. Leverage ${character.class} natural strengths
2. Build their primary skills: ${classInfo.primarySkills.join(', ')}
3. Match their current energy level and available time
4. Create meaningful progression for their character
    `;
  }

  /**
   * Build class-specific card generation prompt
   */
  private static buildClassSpecificPrompt(character: Character, situation: string): string {
    const classInfo = classDescriptions[character.class];
    
    return `
Generate 4-5 advanced cards for a Level ${character.level} ${classInfo.name} in situation: "${situation}"

CHARACTER MASTERY FOCUS:
- Core Identity: ${classInfo.description}
- Master Skills: ${classInfo.primarySkills.join(', ')}
- Energy System: ${classInfo.energyType} (${character.energy.current}/${character.energy.maximum})

CREATE CARDS THAT:
1. Push the boundaries of ${character.class} abilities
2. Offer meaningful skill advancement
3. Include some challenge appropriate for Level ${character.level}
4. Provide clear progression toward mastery

JSON Format (same as daily cards but with higher impact and skill focus):
{
  "recommendations": [...],
  "reasoning": "Strategic explanation for ${character.class} advancement"
}

Emphasize cards that transform them into a true ${classInfo.name} master.
    `;
  }

  /**
   * Build goal-oriented cards prompt
   */
  private static buildGoalCardsPrompt(
    character: Character,
    goalDescription: string,
    timeframe: number
  ): string {
    const classInfo = classDescriptions[character.class];
    
    return `
Create a strategic card sequence for a ${classInfo.name} to achieve: "${goalDescription}"

Timeframe: ${timeframe} days
Character Level: ${character.level}
Class Strengths: ${classInfo.traits.join(', ')}
Primary Skills: ${classInfo.primarySkills.join(', ')}

Generate 5-7 cards that form a logical progression toward the goal, leveraging ${character.class} natural abilities.

Include:
- Early momentum cards (common/uncommon)
- Skill-building cards (rare)
- Breakthrough cards (epic)
- Goal completion card (legendary)

Same JSON format as before, but focus on goal achievement through ${character.class} methodology.
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
   * Call Claude API with proper error handling
   */
  private static async callClaude(prompt: string): Promise<string> {
    if (!this.API_KEY || !this.API_ENDPOINT) {
      throw new Error('Claude API not configured - using fallback recommendations');
    }

    try {
      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1500,
          temperature: 0.7,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Claude API responded with status: ${response.status}`);
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('Claude API call failed:', error);
      throw error;
    }
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
   * Parse cards response from Claude (enhanced for LifeQuest)
   */
  private static parseCardsResponse(response: string): Card[] {
    try {
      const parsed = JSON.parse(response);
      const cardsArray = parsed.recommendations || parsed;
      
      return cardsArray.map((cardData: any) => ({
        id: `ai-card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: cardData.name,
        description: cardData.description,
        type: cardData.type || 'action',
        rarity: cardData.rarity || 'common',
        classTypes: cardData.classTypes || ['strategist', 'warrior', 'creator', 'connector', 'sage'],
        energyCost: cardData.energyCost || 20,
        duration: cardData.duration || 1,
        impact: cardData.impact || 10,
        cooldown: cardData.cooldown || undefined,
        skillBonus: cardData.skillBonus || [],
        requirements: cardData.requirements || {},
        conditions: cardData.conditions || {},
        tags: cardData.tags || [],
        createdAt: new Date(),
        forged: true,
        usageCount: 0,
        isOnCooldown: false
      }));
    } catch (error) {
      console.error('Failed to parse AI response:', error);
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
   * Build recommendation with energy forecast
   */
  private static buildRecommendation(cards: Card[], userContext: UserContext): AICardRecommendation {
    const totalCost = cards.reduce((sum, card) => sum + card.energyCost, 0);
    const remainingAfter = userContext.character.energy.current - totalCost;
    const regenerationTime = Math.max(0, -remainingAfter / userContext.character.energy.regenerationRate);
    
    return {
      cards,
      reasoning: `Optimized for ${userContext.character.class} with ${userContext.availableTime}h available`,
      energyForecast: {
        totalCost,
        remainingAfter,
        regenerationTime
      }
    };
  }

  /**
   * Generate intelligent fallback recommendation
   */
  private static generateFallbackRecommendation(userContext: UserContext): AICardRecommendation {
    const { character } = userContext;
    const availableCards = getAvailableCards(character.class, character.level);
    
    // Smart filtering based on character state
    const energyBudget = character.energy.current;
    const filteredCards = availableCards.filter(card => {
      // Energy check
      if (card.energyCost > energyBudget) return false;
      
      // Time check
      if (card.duration > userContext.availableTime) return false;
      
      // Class preference (prioritize class-specific cards)
      if (card.classTypes.includes(character.class)) return true;
      
      // Universal cards are secondary choice
      return card.classTypes.length === 5;
    });
    
    // Sort by relevance and take top 3-4
    const sortedCards = filteredCards
      .sort((a, b) => {
        // Prioritize class-specific cards
        const aClassSpecific = a.classTypes.includes(character.class) ? 1 : 0;
        const bClassSpecific = b.classTypes.includes(character.class) ? 1 : 0;
        if (aClassSpecific !== bClassSpecific) return bClassSpecific - aClassSpecific;
        
        // Then by impact per energy ratio
        const aEfficiency = a.impact / a.energyCost;
        const bEfficiency = b.impact / b.energyCost;
        return bEfficiency - aEfficiency;
      })
      .slice(0, 4);
    
    return this.buildRecommendation(sortedCards, userContext);
  }

  /**
   * Generate class-specific fallback
   */
  private static generateClassFallbackRecommendation(
    character: Character,
    situation: string
  ): AICardRecommendation {
    const classCards = getAvailableCards(character.class, character.level)
      .filter(card => card.classTypes.includes(character.class))
      .slice(0, 3);
    
    const userContext = {
      character,
      energy: character.energy.current,
      availableTime: 4,
      currentMood: 'neutral',
      recentActivity: [],
      activeQuests: [],
      preferences: []
    };
    
    return {
      cards: classCards,
      reasoning: `Fallback ${character.class} cards for ${situation}`,
      energyForecast: {
        totalCost: classCards.reduce((sum, card) => sum + card.energyCost, 0),
        remainingAfter: character.energy.current - classCards.reduce((sum, card) => sum + card.energyCost, 0),
        regenerationTime: 0
      }
    };
  }

  /**
   * Generate goal-oriented fallback cards
   */
  private static generateGoalFallbackCards(character: Character, goalDescription: string): Card[] {
    const classCards = getAvailableCards(character.class, character.level)
      .filter(card => card.classTypes.includes(character.class))
      .slice(0, 5);
    
    return classCards;
  }

  /**
   * Generate enhanced basic cards with LifeQuest structure
   */
  private static generateBasicCards(): Card[] {
    return [
      {
        id: 'ai-card-focus-session',
        name: 'Deep Focus Session',
        description: 'Enter a state of complete concentration for 25 minutes on your most critical task',
        type: 'action',
        rarity: 'common',
        classTypes: ['strategist', 'warrior', 'creator', 'connector', 'sage'],
        energyCost: 25,
        duration: 0.5,
        impact: 30,
        skillBonus: [
          { skillName: 'Focus', xpBonus: 15 }
        ],
        requirements: { level: 1 },
        conditions: {
          energyLevel: '> 25%',
          timeRequired: '30+ minutes available'
        },
        tags: ['productivity', 'focus', 'universal'],
        createdAt: new Date(),
        forged: true,
        usageCount: 0,
        isOnCooldown: false
      },
      {
        id: 'ai-card-energy-restoration',
        name: 'Mindful Energy Reset',
        description: 'Practice deep breathing and mindfulness to restore mental clarity and energy',
        type: 'recovery',
        rarity: 'uncommon',
        classTypes: ['sage', 'creator'],
        energyCost: -15, // Restores energy
        duration: 0.25,
        impact: 20,
        skillBonus: [
          { skillName: 'Mindfulness', xpBonus: 10 },
          { skillName: 'Balance', xpBonus: 8 }
        ],
        requirements: { level: 1 },
        conditions: {
          energyLevel: '< 60%',
          timeRequired: '15+ minutes of quiet'
        },
        tags: ['recovery', 'mindfulness', 'energy'],
        createdAt: new Date(),
        forged: true,
        usageCount: 0,
        isOnCooldown: false
      },
      {
        id: 'ai-card-adaptive-learning',
        name: 'Adaptive Skill Building',
        description: 'Identify and practice the skill most relevant to your current goals',
        type: 'action',
        rarity: 'rare',
        classTypes: ['strategist', 'creator'],
        energyCost: 35,
        duration: 1,
        impact: 40,
        skillBonus: [
          { skillName: 'Intelligence', xpBonus: 20 },
          { skillName: 'Innovation', xpBonus: 15 }
        ],
        requirements: { level: 3 },
        conditions: {
          energyLevel: '> 40%',
          timeRequired: '1+ hour focused time'
        },
        tags: ['learning', 'skills', 'adaptive'],
        createdAt: new Date(),
        forged: true,
        usageCount: 0,
        isOnCooldown: false
      }
    ];
  }

  /**
   * Get smart recommendations based on character and context
   */
  static async getSmartRecommendations(character: Character): Promise<AICardRecommendation> {
    const timeOfDay = new Date().getHours();
    const energyPercentage = (character.energy.current / character.energy.maximum) * 100;
    
    // Build context
    const userContext: UserContext = {
      character,
      energy: character.energy.current,
      availableTime: this.estimateAvailableTime(timeOfDay),
      currentMood: this.estimateMood(energyPercentage, character.dailyProgress),
      recentActivity: [], // Could be populated from recent card usage
      activeQuests: character.currentGoals,
      preferences: this.inferPreferences(character)
    };

    return this.generateDailyCards(userContext);
  }

  /**
   * Estimate available time based on time of day
   */
  private static estimateAvailableTime(hour: number): number {
    if (hour >= 6 && hour < 9) return 2; // Morning
    if (hour >= 9 && hour < 12) return 3; // Late morning
    if (hour >= 12 && hour < 14) return 1; // Lunch
    if (hour >= 14 && hour < 18) return 4; // Afternoon
    if (hour >= 18 && hour < 21) return 3; // Evening
    return 1; // Night/early morning
  }

  /**
   * Estimate mood based on energy and progress
   */
  private static estimateMood(energyPercentage: number, dailyProgress: any): string {
    if (energyPercentage > 75 && dailyProgress.cardsCompleted > 2) return 'excellent';
    if (energyPercentage > 50 && dailyProgress.cardsCompleted > 0) return 'good';
    if (energyPercentage > 25) return 'neutral';
    return 'low-energy';
  }

  /**
   * Infer preferences from character class
   */
  private static inferPreferences(character: Character): string[] {
    const classPrefs = {
      strategist: ['data-driven', 'analytical', 'optimization'],
      warrior: ['discipline', 'consistency', 'challenges'],
      creator: ['creative', 'innovative', 'experimental'],
      connector: ['social', 'collaborative', 'networking'],
      sage: ['mindful', 'balanced', 'reflective']
    };
    
    return classPrefs[character.class] || [];
  }
}