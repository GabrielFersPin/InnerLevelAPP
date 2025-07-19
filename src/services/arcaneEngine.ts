import { Quest, Card, Character, CharacterClass } from '../types';
import { classDescriptions } from '../data/personalityTest';

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

// Replace Anthropic/Claude logic with OpenAI logic

/**
 * Call OpenAI API via backend proxy
 */
async function callOpenAI(prompt: string, options: any = {}): Promise<string> {
  const response = await fetch('/api/openai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: options.model || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: options.systemPrompt || 'You are a helpful AI assistant for a gamified productivity RPG.' },
        { role: 'user', content: prompt }
      ],
      temperature: options.temperature || 0.7,
      max_tokens: options.max_tokens || 1500
    })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'OpenAI API error');
  return data.choices[0].message.content;
}

export class ArcaneEngine {
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
      const response = await callOpenAI(prompt);
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
      const response = await callOpenAI(prompt);
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
      const response = await callOpenAI(prompt);
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
      const response = await callOpenAI(prompt);
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
      const response = await callOpenAI(prompt);
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

Generate 3-4 cards specifically optimized for this ${character.class} character. Ensure the cards:
- Have a variety of types (action, power, recovery, event, equipment)
- Vary in rarity (common, uncommon, rare, epic, legendary)
- Have different energy costs and XP rewards appropriate to their effect and rarity
- Are each relevant to the user's current context and offer different strategies or approaches

JSON Response Format:
{
  "recommendations": [
    {
      "name": "Class-appropriate card name",
      "description": "Detailed, actionable description that aligns with ${character.class} strengths",
      "type": "action|power|recovery|event|equipment",
      "rarity": "common|uncommon|rare|epic|legendary",
      "classTypes": ["${character.class}"],
      "energyCost": 10-50,
      "duration": 0.5-3,
      "impact": 10-100,
      "skillBonus": [
        {
          "skillName": "${classInfo.primarySkills[0]}",
          "xpBonus": 10-50
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
5. Are diverse in type, rarity, and effect
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
5. Are varied in type (action, power, recovery, event, equipment), rarity, energy cost, and XP

JSON Format (same as daily cards but with higher impact and skill focus):
{
  "recommendations": [...],
  "reasoning": "Strategic explanation for ${character.class} advancement"
}

Emphasize cards that transform them into a true ${classInfo.name} master, and ensure each card is unique in type, rarity, and effect.
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
- Early momentum cards (common/uncommon, lower energy/XP)
- Skill-building cards (rare, moderate energy/XP)
- Breakthrough cards (epic, higher energy/XP)
- Goal completion card (legendary, highest energy/XP)
- Vary card types (action, power, recovery, event, equipment) and effects

Same JSON format as before, but focus on goal achievement through ${character.class} methodology and ensure each card is unique in type, rarity, and effect.
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
      let jsonString = response.trim();
      if (jsonString.startsWith('```')) {
        const lines = jsonString.split('\n');
        if (lines[0].startsWith('```')) lines.shift();
        const endIdx = lines.findIndex(line => line.startsWith('```'));
        if (endIdx !== -1) lines.length = endIdx;
        jsonString = lines.join('\n').trim();
      }
      // Extract only the first JSON object
      const firstCurly = jsonString.indexOf('{');
      const lastCurly = jsonString.lastIndexOf('}');
      if (firstCurly !== -1 && lastCurly !== -1 && lastCurly > firstCurly) {
        jsonString = jsonString.substring(firstCurly, lastCurly + 1);
      }
      const parsed = JSON.parse(jsonString);
      let cardsArray = parsed.recommendations || parsed.cards || parsed.card_sequence || parsed;
      if (cardsArray && typeof cardsArray === 'object' && !Array.isArray(cardsArray)) {
        cardsArray = Object.values(cardsArray);
      }
      if (!Array.isArray(cardsArray)) {
        console.error('Expected an array in the AI response, but received:', cardsArray);
        return this.generateBasicCards();
      }
      return cardsArray.map((cardData: any) => ({
        id: `ai-card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: cardData.name,
        description: cardData.description || cardData.desc || cardData.details || 'No description provided.',
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
    // Fallback: return empty array or minimal cards
    return this.buildRecommendation([], userContext);
  }

  /**
   * Generate class-specific fallback
   */
  private static generateClassFallbackRecommendation(
    character: Character,
    situation: string
  ): AICardRecommendation {
    // Fallback: return empty array or minimal cards
    const classCards: Card[] = [];
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
        totalCost: 0,
        remainingAfter: character.energy.current,
        regenerationTime: 0
      }
    };
  }

  /**
   * Generate goal-oriented fallback cards
   */
  private static generateGoalFallbackCards(character: Character, goalDescription: string): Card[] {
    // Fallback: return empty array or minimal cards
    return [];
  }

  /**
   * Generate enhanced basic cards with LifeQuest structure
   */
  private static generateBasicCards(): Card[] {
    // Fallback: return empty array or minimal cards
    return [];
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

  static async testConnection(): Promise<void> {
    try {
      console.log('Testing Claude API connection...');
      const result = await callOpenAI('Hello, respond with just "API working"');
      console.log('✅ Claude API test successful:', result);
    } catch (error) {
      console.error('❌ Claude API test failed:', error);
    }
  }
}